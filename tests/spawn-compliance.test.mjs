import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const PRECEDENCE =
  /Invoking a pstack skill, directly or through the pstack route, is the user's explicit request for the subagents that skill prescribes/;

const BLOCKED =
  /report the blocked pass|report(?:s)? the blocked|blocked pass/;

const SPAWN_SKILLS = [
  'skills/poteto-mode/SKILL.md',
  'skills/how/SKILL.md',
  'skills/arena/SKILL.md',
  'skills/swarm/SKILL.md',
  'skills/interrogate/SKILL.md',
  'skills/recall/SKILL.md',
];

test('spawn skills state precedence, unconditional run_subagent, and blocked failure path', () => {
  for (const path of SPAWN_SKILLS) {
    const text = read(path);
    assert.match(text, PRECEDENCE, `${path} missing precedence line`);
    assert.match(text, /run_subagent/, `${path} missing run_subagent`);
    assert.match(text, BLOCKED, `${path} missing blocked failure path`);
  }
});

test('how requires run_subagent as the first action and forbids silent inline explore', () => {
  const how = read('skills/how/SKILL.md');
  assert.match(how, /first action|Start one read-only `run_subagent`/);
  assert.match(how, /Do not (?:silently )?explore inline|does not silently explore inline|do not explore inline/i);
  assert.match(how, PRECEDENCE);
  assert.match(how, BLOCKED);
});

test('session-start context states subagent precedence', () => {
  assert.match(read('hooks/session-start-context.md'), PRECEDENCE);
});

test('setup-pstack writes a how role row', () => {
  const writer = read('skills/setup-pstack/write-models.mjs');
  assert.match(writer, /\["how",\s*"swe"\]/);
  assert.match(writer, /SINGLE_ROLES[\s\S]*?\["how",\s*"swe"\][\s\S]*?\];/);
  assert.match(writer, /RETIRED_ROLES[\s\S]*?"how explorer"[\s\S]*?\];/);
  assert.doesNotMatch(
    writer.match(/export const SINGLE_ROLES = Object\.freeze\(\[[\s\S]*?\]\);/)[0],
    /how explorer/,
  );
});
