import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const header = 'ts\tphase\tdecision\twhy\tevidence\tresult\n';
function disposable(action) {
  const dir = mkdtempSync(join(tmpdir(), 'pstack-port-contract-'));
  try { action(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}
function append(file, cells = ['phase', 'decision', 'why', 'evidence', 'result']) {
  const result = spawnSync('bash', [join(root, 'skills/show-me-your-work/scripts/log.sh'), file, ...cells], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return readFileSync(file, 'utf8');
}

test('log helper creates missing and empty logs with exactly one header', () => disposable((dir) => {
  for (const state of ['missing', 'empty']) {
    const file = join(dir, state, 'decisions.tsv');
    if (state === 'empty') {
      const empty = join(dir, 'empty.tsv');
      writeFileSync(empty, '');
      assert.ok(append(empty).startsWith(header));
      assert.equal(append(empty).split(header).length - 1, 1);
    } else {
      assert.ok(append(file).startsWith(header));
      assert.equal(append(file).split(header).length - 1, 1);
    }
  }
}));

test('log appends preserve historical bytes, including an existing headerless log', () => disposable((dir) => {
  for (const prior of [header + 'old\trow\tkept\twhy\tproof\tPASS\n', 'historical bytes without a header\n']) {
    const file = join(dir, 'existing.tsv');
    writeFileSync(file, prior);
    const after = append(file);
    assert.ok(after.startsWith(prior));
    assert.equal(after.slice(prior.length).trimEnd().split('\t').length, 6);
    assert.equal(after.split('\n').length, prior.split('\n').length + 1);
  }
}));

test('log subprocess sanitizes all cells and protects formula prefixes', () => disposable((dir) => {
  const result = append(join(dir, 'log.tsv'), ['=SUM(A1)', '+command', '-2', '@evil\tline\nnext\rend', 'plain\tvalue']);
  const lines = result.trimEnd().split('\n');
  assert.equal(lines.length, 2);
  const cells = lines[1].split('\t');
  assert.equal(cells.length, 6);
  assert.match(cells[0], /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/);
  assert.deepEqual(cells.slice(1), ["'=SUM(A1)", "'+command", "'-2", "'@evil line next end", 'plain value']);
}));

test('interleaved run documentation assigns boundaries and supersedes history', () => {
  const text = read('skills/show-me-your-work/SKILL.md');
  for (const pattern of [/one conversation, including later turns and compaction/, /pickup, replacement agent, or new chat starts a new run/, /start` row naming the run and the prior row range it did not write/, /returning after another run's segment/, /Audit only this run's stretches/, /never edit or delete history/i, /superseding/]) assert.match(text, pattern);
});

test('portable skills retain user activation and numeric principle model activation', () => {
  for (const name of ['correct', 'benchmark-checklist', 'ketchup', 'in-your-own-words', 'sharpen']) {
    const text = read(`skills/${name}/SKILL.md`);
    assert.match(text, new RegExp(`^name: ${name}$`, 'm'));
    assert.match(text, /triggers:\n  - user/);
  }
  assert.match(read('skills/principle-explain-the-number/SKILL.md'), /triggers:\n  - model/);
  assert.match(read('skills/poteto-mode/references/principles.md'), /principle-explain-the-number/);
});

test('benchmark contract covers all seven checks and rejects misleading comparisons', () => {
  const text = read('skills/benchmark-checklist/SKILL.md');
  assert.deepEqual([...text.matchAll(/^(\d)\. \*\*/gm)].map((match) => Number(match[1])), [1, 2, 3, 4, 5, 6, 7]);
  for (const pattern of [/limiter/, /production/, /limits/, /outputs are correct/, /at least 5 times/, /alternate the sides/, /median and the range/, /gap smaller than the run-to-run variation as no measurable difference/, /end-to-end/, /work ran inside the timed region/, /no-op/, /do not pick a winner/, /inconclusive/, /ballpark the user asked for, one run/, /Still check questions 4 and 7/, /uname -s/, /command -v/, /macOS/, /evidence limitation/]) assert.match(text, pattern);
});

test('correct contract requires real repeated evidence and historical rejection proof', () => disposable((dir) => {
  const text = read('skills/correct/SKILL.md');
  for (const pattern of [/happened twice/, /architecture/, /types/, /lint or CI/, /Test the behavior/, /docs or agent rules last/, /fails on a real past mistake/, /pairs each rule with what enforces it/, /Human approval/, /evidence gaps/]) assert.match(text, pattern);
  const git = (...args) => {
    const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' } });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git('init', '-q');
  git('config', 'user.name', 'Port contract fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  const historical = [];
  for (const occurrence of [1, 2]) {
    writeFileSync(join(dir, 'consumer.js'), `import state from './internal/state.js';\n// occurrence ${occurrence}\n`);
    git('add', 'consumer.js'); git('commit', '-qm', `repeat unsupported import ${occurrence}`);
    historical.push(git('rev-parse', 'HEAD'));
  }
  writeFileSync(join(dir, 'check-imports.mjs'), `import {readFileSync} from 'node:fs';\nconst source=readFileSync(process.argv[2],'utf8');\nif (/from ['"]\\.\\/internal\\//.test(source)) { console.error('Use the public state API'); process.exit(1); }\n`);
  for (const sha of historical) {
    writeFileSync(join(dir, 'historical.js'), git('show', `${sha}:consumer.js`));
    const bad = spawnSync(process.execPath, [join(dir, 'check-imports.mjs'), join(dir, 'historical.js')], { encoding: 'utf8' });
    assert.equal(bad.status, 1); assert.match(bad.stderr, /public state API/);
  }
  writeFileSync(join(dir, 'consumer.js'), "import state from './state.js';\n");
  assert.equal(spawnSync(process.execPath, [join(dir, 'check-imports.mjs'), join(dir, 'consumer.js')]).status, 0);
}));

test('fresh-worker and swarm evidence contracts preserve bounded recovery and ownership', () => {
  const delegation = read('skills/poteto-mode/references/delegation.md');
  for (const pattern of [/subsequent queue units, substantive follow-ups, and retries use a fresh worker identity/, /original intent, later directives, prior findings, current workspace state, and verification requirements/, /Same-worker foreground resume.*permission repair or justified costly-state recovery/, /Never replace a writer while it may still own the workspace/, /read_subagent/, /root-owned dispatch/, /same-pin counterpart mapping/, /runtime model metadata/]) assert.match(delegation, pattern);
  const swarm = read('skills/swarm/SKILL.md');
  for (const pattern of [/exact SHAs/, /sample count, sample definition, and execution order/, /Results repeat those identifiers and methodology/, /ISSUES.*every demonstrated issue/, /Reject a result missing required evidence/, /at most one fresh-worker retry/, /second miss stays an evidence gap/, /Never replace an in-flight writer/]) assert.match(swarm, pattern);
});

test('all implementation and panel pins remain matched and unchanged', () => {
  for (const [alias, pin] of Object.entries({ codex: 'gpt-6-1-sol-medium', opus: 'gpt-6-1-sol-medium', sonnet: 'glm-5-3-flash-high', swe: 'swe' })) {
    for (const prefix of ['panel', 'poteto-agent']) assert.match(read(`agents/${prefix}-${alias}/AGENT.md`), new RegExp(`^model: ${pin}$`, 'm'));
  }
  assert.match(read('agents/poteto-agent/AGENT.md'), /^model: gpt-6-1-sol-medium$/m);
});
