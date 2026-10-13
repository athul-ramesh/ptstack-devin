import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const script = fileURLToPath(new URL('../skills/poteto-mode/scripts/worktree-audit.sh', import.meta.url));
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0' };
function git(cwd, ...args) {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8', env });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
function fixture(branch, run) {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'pstack-audit-')));
  try {
    const remote = join(dir, 'remote.git');
    mkdirSync(remote);
    git(remote, 'init', '--bare', '-q');
    const source = join(dir, 'source');
    mkdirSync(source);
    git(source, 'init', '-q', '-b', branch);
    git(source, 'config', 'user.name', 'Audit fixture');
    git(source, 'config', 'user.email', 'audit@example.invalid');
    writeFileSync(join(source, 'file'), 'base\n');
    git(source, 'add', '.');
    git(source, 'commit', '-qm', 'base');
    git(source, 'remote', 'add', 'origin', remote);
    git(source, 'push', '-q', 'origin', branch);
    git(remote, 'symbolic-ref', 'HEAD', `refs/heads/${branch}`);
    const repo = join(dir, 'checkout with spaces');
    git(dir, 'clone', '-q', '--single-branch', remote, repo);
    git(repo, 'config', 'user.name', 'Audit fixture');
    git(repo, 'config', 'user.email', 'audit@example.invalid');
    const worker = join(dir, 'candidate worktree');
    git(repo, 'worktree', 'add', '-q', '-b', 'candidate', worker);
    const bin = join(dir, 'bin');
    mkdirSync(bin);
    writeFileSync(join(bin, 'gh'), '#!/bin/sh\nprintf "%s\\n" "${AUDIT_PRS:-[]}"\n', { mode: 0o755 });
    const audit = (args = [], prs = '[]') => spawnSync('bash', [script, ...args, repo], {
      encoding: 'utf8', env: { ...env, PATH: `${bin}:${env.PATH}`, AUDIT_PRS: prs },
    });
    const row = result => {
      assert.equal(result.status, 0, result.stderr);
      const lines = result.stdout.trim().split('\n');
      assert.equal(lines.length, 3, result.stdout);
      const cells = lines[2].split('\t');
      assert.equal(cells[7], worker);
      return cells;
    };
    run({ repo, worker, audit, row, bin });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('worktree audit uses the remote default branch and preserves paths with spaces', () => {
  fixture('develop', ({ repo, audit, row }) => {
    assert.throws(() => git(repo, 'rev-parse', '--verify', 'origin/main'));
    const result = audit();
    assert.match(result.stdout, /^# base: origin\/develop\n/);
    assert.equal(row(result)[2], 'YES');
    assert.equal(row(result)[6], 'safe');
  });
});

test('worktree audit falls back to main or master when origin HEAD is missing', () => {
  for (const branch of ['main', 'master']) fixture(branch, ({ repo, audit, row }) => {
    git(repo, 'symbolic-ref', '--delete', 'refs/remotes/origin/HEAD');
    const result = audit();
    assert.match(result.stdout, new RegExp(`^# base: origin/${branch}\\n`));
    assert.equal(row(result)[2], 'YES');
  });
});

test('explicit base fetches an alternate branch in a single-branch clone', () => {
  fixture('develop', ({ repo, worker, audit, row }) => {
    writeFileSync(join(worker, 'file'), 'new feature\n');
    git(worker, 'commit', '-qam', 'feature');
    git(worker, 'push', '-q', 'origin', 'HEAD:refs/heads/integration');
    assert.throws(() => git(repo, 'rev-parse', '--verify', 'origin/integration'));
    assert.equal(row(audit())[2], 'no');
    const result = audit(['--base', 'origin/integration']);
    assert.match(result.stdout, /^# base: origin\/integration\n/);
    assert.equal(row(result)[2], 'YES');
  });
});

test('audit rejects unresolved bases and invalid arguments before reporting candidates', () => {
  fixture('develop', ({ repo, audit }) => {
    git(repo, 'symbolic-ref', '--delete', 'refs/remotes/origin/HEAD');
    assert.equal(audit().status, 1);
    assert.match(audit().stderr, /no default base/);
    const missing = audit(['-b', 'origin/absent']);
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /base ref not found/);
    assert.equal(audit(['--unknown']).status, 2);
    assert.equal(audit(['extra']).status, 2);
    assert.equal(spawnSync('bash', [script, '-b'], { encoding: 'utf8' }).status, 2);
    assert.equal(spawnSync('bash', [script, '-b', '--help'], { encoding: 'utf8' }).status, 2);
    assert.match(audit(['--help']).stdout, /Usage:/);
  });
});

test('PR fallback only accepts merged PRs for the selected base and holds WIP', () => {
  fixture('develop', ({ worker, audit, row }) => {
    writeFileSync(join(worker, 'file'), 'unmerged\n');
    git(worker, 'commit', '-qam', 'unmerged');
    const prs = (state, base = 'develop') => JSON.stringify([{ number: 1, state, headRefName: 'candidate', baseRefName: base }]);
    assert.equal(row(audit())[6], 'review');
    assert.equal(row(audit([], prs('CLOSED')))[6], 'review');
    assert.equal(row(audit([], prs('MERGED', 'other')))[6], 'review');
    assert.equal(row(audit([], prs('MERGED')))[6], 'safe');
    assert.equal(row(audit([], prs('OPEN')))[6], 'hold-open-pr');
    assert.equal(row(audit([], prs('OPEN', 'other')))[6], 'hold-open-pr');
    const historical = JSON.parse(prs('MERGED')).concat(JSON.parse(prs('OPEN', 'other')));
    assert.equal(row(audit([], JSON.stringify(historical)))[6], 'hold-open-pr');
    writeFileSync(join(worker, 'file'), 'dirty\n');
    assert.equal(row(audit([], prs('MERGED')))[6], 'hold-wip');
  });
});

test('unavailable PR lookup does not imply a merged PR', () => {
  fixture('develop', ({ worker, audit, row, bin }) => {
    writeFileSync(join(worker, 'file'), 'unmerged\n');
    git(worker, 'commit', '-qam', 'unmerged');
    writeFileSync(join(bin, 'gh'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    assert.equal(row(audit())[6], 'review');
  });
});
