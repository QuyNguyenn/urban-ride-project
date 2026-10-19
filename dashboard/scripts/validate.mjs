import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const root = new URL('../../', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validators = Object.fromEntries(['project', 'tasks', 'milestones'].map(name => [name, ajv.compile(read(`schemas/${name}.schema.json`))]));

export function readData() {
  return Object.fromEntries(Object.keys(validators).map(name => [name, read(`tracking/${name}.json`)]));
}

export function validateData(data) {
  const errors = [];
  for (const [name, validate] of Object.entries(validators)) {
    if (!validate(data[name])) errors.push(`${name}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
  }
  if (errors.length) return errors;
  const tasks = data.tasks.tasks;
  const milestones = data.milestones.milestones;
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  const milestoneMap = new Map(milestones.map(milestone => [milestone.id, milestone]));
  for (const [name, entities] of [['tasks', tasks], ['milestones', milestones]]) {
    const seen = new Set();
    for (const entity of entities) {
      if (seen.has(entity.id)) errors.push(`${name}: duplicate ID ${entity.id}`);
      seen.add(entity.id);
      const prefix = entity.scope === 'product' ? 'UR-' : 'HUB-';
      if (!entity.id.startsWith(prefix)) errors.push(`${entity.id}: ID does not match scope`);
    }
  }
  for (const task of tasks) {
    if (task.milestone !== null) {
      const milestone = milestoneMap.get(task.milestone);
      if (!milestone) errors.push(`${task.id}: unknown milestone ${task.milestone}`);
      else if (milestone.scope !== task.scope) errors.push(`${task.id}: milestone scope mismatch`);
    }
    for (const dependency of task.dependencies) {
      if (dependency === task.id) errors.push(`${task.id}: self dependency`);
      else if (!taskMap.has(dependency)) errors.push(`${task.id}: unknown dependency ${dependency}`);
    }
    if (task.status === 'blocked' && !task.blocker) errors.push(`${task.id}: blocked task requires a blocker`);
    if (task.status !== 'blocked' && task.blocker) errors.push(`${task.id}: clear blocker when not blocked`);
    if (task.status === 'done' && (!['passed', 'not_applicable'].includes(task.verification.status) || !task.verification.evidence.length)) {
      errors.push(`${task.id}: done requires verification and evidence`);
    }
  }
  const visited = new Set();
  const active = new Set();
  function visit(id) {
    if (active.has(id)) { errors.push(`${id}: dependency cycle`); return; }
    if (visited.has(id) || !taskMap.has(id)) return;
    active.add(id);
    for (const dependency of taskMap.get(id).dependencies) visit(dependency);
    active.delete(id);
    visited.add(id);
  }
  for (const task of tasks) visit(task.id);
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const errors = validateData(readData());
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log('Management data valid (schema version 1).');
  } catch (error) { console.error(`Validation failed: ${error.message}`); process.exitCode = 1; }
}
