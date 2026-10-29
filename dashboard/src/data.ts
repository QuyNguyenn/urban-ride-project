import projectData from '../../tracking/project.json';
import taskData from '../../tracking/tasks.json';
import milestoneData from '../../tracking/milestones.json';
import handoffText from '../../tracking/handoff.md?raw';

export type Scope = 'product' | 'project-hub';
interface Task {
  id: string;
  title: string;
  scope: string;
  status: string;
  priority: string;
  milestone: string | null;
  acceptanceCriteria: string[];
  dependencies: string[];
  blocker: { reason: string; nextAction: string } | null;
  updatedAt: string;
  verification: { status: string; evidence: string[] };
  references: string[];
}
interface Milestone {
  id: string;
  title: string;
  scope: string;
  status: string;
  completionCriteria: string[];
  updatedAt: string;
}
export const project = projectData;
export const tasks: Task[] = taskData.tasks;
export const milestones: Milestone[] = milestoneData.milestones;
export const handoff = handoffText;
export const latestUpdate = [project.updatedAt, ...tasks.map(t => t.updatedAt), ...milestones.map(m => m.updatedAt)]
  .reduce((latest, value) => Date.parse(value) > Date.parse(latest) ? value : latest);
