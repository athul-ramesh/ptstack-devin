#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const planningPlaybook = readFileSync(new URL('../playbooks/multi-phase-plan.md', import.meta.url), 'utf8');
const planSkeleton = planningPlaybook.split('````markdown\n')[1].split('````')[0];
const templatePlaceholders = new Set([...planSkeleton.matchAll(/<([^>\n]+)>/g)].map((match) => match[1]));

/** Validate the completed local multi-phase skeleton, not execution evidence. */
export function validatePlan(source) {
  const lines = source.split(/\r?\n/);
  const errors = [];
  const fail = (line, message) => errors.push({ line: line + 1, message });
  let fenced = false;
  const prose = lines.map(line => {
    if (/^\s*(`{3,}|~{3,})/.test(line)) { fenced = !fenced; return ''; }
    return fenced ? '' : line;
  });
  const headings = prose.flatMap((line, index) => /^## /.test(line) ? [{ title: line.slice(3).trim(), index }] : []);
  const titles = prose.flatMap((line, index) => /^# /.test(line) ? [{ line, index }] : []);
  if (titles.length !== 1 || !/^# .+ plan\s*$/i.test(titles[0]?.line ?? '')) fail(titles[0]?.index ?? 0, 'Expected one title: # <Program name> plan.');
  const fixed = ['How to read this', 'Program checklist', 'Close the program', 'Appendix A. Prototype evidence', 'Appendix B. Alternatives rejected', 'Appendix C. Risks'];
  for (const title of fixed) if (headings.filter(h => h.title === title).length !== 1) fail(0, `Expected exactly one section: ${title}.`);
  const positions = fixed.map(title => headings.findIndex(h => h.title === title));
  if (positions.some(p => p < 0)) return errors;
  if (positions.some((p, i) => i && p <= positions[i - 1]) || positions[0] !== 0 || positions[1] !== 1 || positions[5] !== headings.length - 1 || positions[3] !== positions[2] + 1 || positions[4] !== positions[3] + 1 || positions[5] !== positions[4] + 1) fail(0, 'Sections must follow the skeleton order.');
  const prs = headings.slice(positions[1] + 1, positions[2]);
  if (!prs.length) fail(headings[positions[1]].index, 'Expected at least one PR section before Close the program.');
  const ids = new Set();
  for (const pr of prs) {
    const id = pr.title.match(/\(([^()]+)\)$/)?.[1];
    if (!id || ids.has(id)) fail(pr.index, 'PR headings must end with a unique (PR id).');
    if (id) ids.add(id);
  }
  const sectionLines = heading => {
    const start = heading.index + 1;
    const next = headings.find(h => h.index > heading.index)?.index ?? lines.length;
    return { start, end: next, text: prose.slice(start, next).join('\n') };
  };
  const read = sectionLines(headings[positions[0]]);
  if (!/operator (?:decides|controls|approves) merges/i.test(read.text) || !/stop at merge-ready/i.test(read.text)) fail(read.start, 'Declare operator merge authority and the merge-ready stopping point.');
  const controlPath = prose.slice(read.start, read.end).findIndex(line => /^\s*Control path\s*:/i.test(line));
  if (controlPath < 0 || !prose[read.start + controlPath].replace(/^\s*Control path\s*:/i, '').trim()) fail(controlPath < 0 ? read.start : read.start + controlPath, 'Declare Control path: with the available adapter or an explicit unavailable verdict.');
  const program = sectionLines(headings[positions[1]]);
  const stages = ['Arm the program', 'Spawn owners', 'PR mechanics, for every PR', 'Verdict, for every PR'];
  const stageRows = prose.slice(program.start, program.end).flatMap((line, offset) => /^### /.test(line) ? [{ title: line.slice(4).trim(), index: program.start + offset }] : []);
  if (stageRows.map(h => h.title).join('|') !== stages.join('|')) fail(program.start, 'Program checklist stages must match the skeleton order.');
  for (const stage of stageRows) {
    const end = stageRows.find(h => h.index > stage.index)?.index ?? program.end;
    if (!prose.slice(stage.index + 1, end).some(line => /^\s*- \[[ xX]\]/.test(line))) fail(stage.index, 'Program checklist stage needs evidence-bearing checkboxes.');
  }
  const blocks = ['Depends on', 'Files', 'Build', 'You see', 'Verify, unit', 'Verify, live', 'Verify, perf', 'Review gate'];
  for (const pr of prs) {
    const { start, end } = sectionLines(pr);
    const found = prose.slice(start, end).flatMap((line, offset) => {
      const match = line.match(/^\*\*([^*]+)\.\*\*/);
      return match ? [{ name: match[1], index: start + offset }] : [];
    });
    if (found.map(b => b.name).join('|') !== blocks.join('|')) fail(pr.index, `PR blocks must appear once in order: ${blocks.join(', ')}.`);
    for (const block of found) {
      const next = found.find(b => b.index > block.index)?.index ?? end;
      if (block.name === 'Depends on') {
        const dependency = prose[block.index].replace(/^\*\*Depends on\.\*\*\s*/, '').replace(/\.$/, '').trim();
        if (!dependency || (dependency !== 'None' && dependency.split(/\s*,\s*/).some(id => !ids.has(id) || pr.title.endsWith(`(${id})`)))) fail(block.index, 'Dependencies must be None or other declared PR ids.');
      } else {
        if (!prose.slice(block.index + 1, next).some(line => /^\s*- \[[ xX]\]/.test(line))) fail(block.index, `${block.name} needs an evidence-bearing checkbox.`);
        if (block.name.startsWith('Verify, ') && !prose[block.index].includes('Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.')) fail(block.index, 'Verification block must open with the verification rule.');
        if (block.name === 'Review gate' && !/operator reviews before merge/i.test(prose[block.index])) fail(block.index, 'Review gate must retain operator review before merge.');
      }
    }
  }
  for (const heading of headings.filter(h => h.title.startsWith('Appendix '))) {
    if (!sectionLines(heading).text.trim()) fail(heading.index, 'Appendix must state findings or explicitly state None.');
  }
  let boxes = 0;
  for (let i = 0; i < lines.length; i++) {
    const unresolvedAngle = [...lines[i].matchAll(/<([^>\n]+)>/g)].some(match => templatePlaceholders.has(match[1]) || /^(?:placeholder|insert\b|fill\b)/i.test(match[1]));
    if (unresolvedAngle || /\b(?:TODO|TBD|FIXME|PLACEHOLDER)\b|\{\{[^}]+\}\}/.test(lines[i])) fail(i, 'Resolve the placeholder before handing back the plan.');
    if (/^\s*- \[[ xX]\]/.test(prose[i])) {
      boxes++;
      if (!/\bEvidence:\s*\S/i.test(prose[i])) fail(i, 'Every checkbox must name its receipt with Evidence: on the same line.');
    }
  }
  if (!boxes) fail(0, 'Expected an evidence-bearing program checklist.');
  const close = sectionLines(headings[positions[2]]);
  if (!/^\s*- \[[ xX]\]/m.test(close.text)) fail(close.start, 'Close the program needs an evidence-bearing checkbox.');
  return errors;
}

export function main(args = process.argv.slice(2)) {
  if (args.length !== 1) { console.error('Usage: node check-plan.mjs <plan.md>'); return 2; }
  try {
    const errors = validatePlan(readFileSync(args[0], 'utf8'));
    for (const error of errors) console.error(`${args[0]}:${error.line}: ${error.message}`);
    if (!errors.length) console.log(`${args[0]}: plan structure valid`);
    return errors.length ? 1 : 0;
  } catch (error) { console.error(`${args[0]}:1: ${error.message}`); return 2; }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
