import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { validatePlan } from '../skills/poteto-mode/scripts/check-plan.mjs';

const playbook = readFileSync(new URL('../skills/poteto-mode/playbooks/multi-phase-plan.md', import.meta.url), 'utf8');
function completedTemplate() {
  return playbook.split('````markdown\n')[1].split('````')[0]
    .replace('# <Program> plan', '# Search plan')
    .replace('## <Task as a verb phrase> (<PR id>)', '## Add search (PR1)')
    .replace('**Depends on.** <PR id, or None.>', '**Depends on.** None.')
    .replaceAll('<execution playbook>', 'feature')
    .replaceAll('<surface-appropriate artifact path>', 'search-transcript.txt')
    .replaceAll('<Specific receipt path, command output, SHA, or operator decision.>', '`docs/search-evidence.md`')
    .replace(/<[^>]+>/g, 'Search evidence recorded in docs/search-evidence.md');
}
const valid = completedTemplate();

test('completed target template passes with CLI artifacts and arbitrary trunk', () => {
  assert.deepEqual(validatePlan(valid), []);
  assert.doesNotMatch(valid, /\.png|`main`/);
});

test('rejects malformed section order and unresolved placeholders with line diagnostics', () => {
  const swapped = valid.replace('## How to read this', '## SWAP').replace('## Program checklist', '## How to read this').replace('## SWAP', '## Program checklist');
  assert.ok(validatePlan(swapped).some(error => /order/.test(error.message)));
  const placeholder = `${valid}\nTBD: investigate\n`;
  assert.ok(validatePlan(placeholder).some(error => error.line === placeholder.trimEnd().split('\n').length && /placeholder/.test(error.message)));
});

test('rejects a missing evidence receipt, control path, and operator authority', () => {
  assert.ok(validatePlan(valid.replace(/ Evidence: `docs\/search-evidence.md`/, '')).some(error => /receipt/.test(error.message)));
  assert.ok(validatePlan(valid.replace('Control path:', 'Surface:')).some(error => /Control path/.test(error.message)));
  assert.ok(validatePlan(valid.replace('The operator decides merges.', 'The agent decides merges.')).some(error => /authority/.test(error.message)));
});

test('requires every PR block, valid dependencies, checklist stages, and appendices', () => {
  assert.ok(validatePlan(valid.replace('**Build.**', '**Implementation.**')).some(error => /PR blocks/.test(error.message)));
  assert.ok(validatePlan(valid.replace('**Depends on.** None.', '**Depends on.** PR404.')).some(error => /Dependencies/.test(error.message)));
  assert.ok(validatePlan(valid.replace('### Spawn owners', '### Dispatch')).some(error => /stages/.test(error.message)));
  const emptyRisk = valid.slice(0, valid.indexOf('## Appendix C. Risks')) + '## Appendix C. Risks\n';
  assert.ok(validatePlan(emptyRisk).some(error => /Appendix must/.test(error.message)));
});

test('supports multiple PRs and dependencies while rejecting duplicate ids', () => {
  const pr = valid.slice(valid.indexOf('## Add search'), valid.indexOf('## Close the program'));
  const second = pr.replace('Add search (PR1)', 'Add filtering (PR2)').replace('**Depends on.** None.', '**Depends on.** PR1.');
  const multiple = valid.replace('## Close the program', second + '## Close the program');
  assert.deepEqual(validatePlan(multiple), []);
  assert.ok(validatePlan(multiple.replace('Add filtering (PR2)', 'Add filtering (PR1)')).some(error => /unique/.test(error.message)));
});

test('CLI exits zero for valid plans and reports path:line diagnostics otherwise', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pstack-plan-'));
  const script = fileURLToPath(new URL('../skills/poteto-mode/scripts/check-plan.mjs', import.meta.url));
  const path = join(dir, 'plan.md');
  try {
    writeFileSync(path, valid);
    let result = spawnSync(process.execPath, [script, path], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    writeFileSync(path, valid.replace('Control path:', 'Surface:'));
    result = spawnSync(process.execPath, [script, path], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /plan\.md:\d+: Declare Control path/);
    assert.equal(spawnSync(process.execPath, [script], { encoding: 'utf8' }).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('rejects empty control paths with the declaration line diagnostic', () => {
  const empty = valid.replace(/^Control path:.*$/m, 'Control path:   ');
  const line = empty.split('\n').findIndex(row => row.startsWith('Control path:')) + 1;
  assert.ok(validatePlan(empty).some(error => error.line === line && /Control path/.test(error.message)));
});

test('allows TypeScript generics and Markdown autolinks in prose and fences', () => {
  const completed = `${valid}\nUse \`Promise<Result>\` and <https://example.com/evidence>.\n\n\`\`\`typescript\nconst result: Promise<Result> = execute();\nconst nested: Map<string, Array<Result>> = new Map();\n\`\`\`\n`;
  assert.deepEqual(validatePlan(completed), []);
});

test('rejects every shipped angle placeholder, including placeholders in fences', () => {
  const skeleton = playbook.split('````markdown\n')[1].split('````')[0];
  const placeholders = new Set([...skeleton.matchAll(/<([^>]+)>/g)].map(match => match[0]));
  for (const placeholder of placeholders) {
    assert.ok(validatePlan(`${valid}\n${placeholder}\n`).some(error => /placeholder/.test(error.message)), placeholder);
  }
  assert.ok(validatePlan(`${valid}\n\`\`\`text\n<command>\n\`\`\`\n`).some(error => /placeholder/.test(error.message)));
});
