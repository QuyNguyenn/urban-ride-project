import test from 'node:test';
import assert from 'node:assert/strict';
import { readData, validateData } from './validate.mjs';

const fixture = () => structuredClone(readData());
test('repository data and empty collections are valid', () => {
  assert.deepEqual(validateData(fixture()), []);
  const data = fixture();
  data.tasks.tasks = [];
  data.milestones.milestones = [];
  assert.deepEqual(validateData(data), []);
});
const cases = [
  ['unsupported version', d => { d.project.schemaVersion = 2; }, /project:/],
  ['missing required field', d => { delete d.tasks.tasks[0].title; }, /tasks:/],
  ['unknown field', d => { d.project.unexpected = true; }, /project:/],
  ['duplicate task ID', d => { d.tasks.tasks.push(structuredClone(d.tasks.tasks[0])); }, /duplicate ID/],
  ['unknown dependency', d => { d.tasks.tasks[0].dependencies = ['UR-999']; }, /unknown dependency/],
  ['self dependency', d => { d.tasks.tasks[0].dependencies = ['HUB-001']; }, /self dependency/],
  ['unknown milestone', d => { d.tasks.tasks[0].milestone = 'HUB-M999'; }, /unknown milestone/],
  ['blocked without explanation', d => { d.tasks.tasks[0].status = 'blocked'; d.tasks.tasks[0].blocker = null; }, /requires a blocker/],
  ['blank blocker', d => { d.tasks.tasks[0].status = 'blocked'; d.tasks.tasks[0].blocker = { reason: ' ', nextAction: ' ' }; }, /tasks:/],
  ['timestamp without timezone', d => { d.project.updatedAt = '2026-10-19T12:00:00'; }, /project:/],
  ['invalid calendar date', d => { d.tasks.tasks[0].updatedAt = '2026-02-30T12:00:00Z'; }, /tasks:/],
  ['scope mismatch', d => { d.tasks.tasks[0].scope = 'product'; }, /ID does not match scope/],
  ['done without evidence', d => { d.tasks.tasks[0].status = 'done'; d.tasks.tasks[0].verification = { status: 'pending', evidence: [] }; }, /done requires/],
  ['cycle', d => { const other = structuredClone(d.tasks.tasks[0]); other.id = 'HUB-002'; other.dependencies = ['HUB-001']; d.tasks.tasks[0].dependencies = ['HUB-002']; d.tasks.tasks.push(other); }, /dependency cycle/],
];
for (const [name, mutate, expected] of cases) test(`rejects ${name}`, () => {
  const data = fixture(); mutate(data);
  assert.match(validateData(data).join('\n'), expected);
});
function milestone(id = 'HUB-M001', scope = 'project-hub') {
  return { id, scope, title: 'Test milestone', status: 'todo', completionCriteria: ['Verify the fixture'], updatedAt: '2026-10-19T14:00:00+07:00' };
}
test('valid milestone reference and explicit timezone offset', () => {
  const data = fixture(); data.milestones.milestones.push(milestone()); data.tasks.tasks[0].milestone = 'HUB-M001';
  assert.deepEqual(validateData(data), []);
});
test('rejects duplicate milestone IDs and cross-scope milestones', () => {
  const data = fixture(); data.milestones.milestones = [milestone(), milestone()];
  assert.match(validateData(data).join('\n'), /duplicate ID/);
  data.milestones.milestones = [milestone('UR-M001', 'product')]; data.tasks.tasks[0].milestone = 'UR-M001';
  assert.match(validateData(data).join('\n'), /milestone scope mismatch/);
});
