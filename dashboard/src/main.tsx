import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { project, tasks, milestones, handoff, latestUpdate, type Scope } from './data';
import './style.css';

const label = (value: string) => value.replaceAll('_', ' ');
function WorkScope({ scope, title }: { scope: Scope; title: string }) {
  const scopeTasks = tasks.filter(task => task.scope === scope);
  const scopeMilestones = milestones.filter(milestone => milestone.scope === scope);
  return <section className="panel" aria-label={title}>
    <h2>{title}</h2>
    <h3>Milestones</h3>
    {scopeMilestones.length === 0 ? <p className="empty">No {scope === 'product' ? 'product' : 'project hub'} milestones defined.</p> : scopeMilestones.map(milestone => <article key={milestone.id}>
      <h4>{milestone.id} · {milestone.title}</h4>
      <p>Status: {label(milestone.status)}</p>
      <p>Completion criteria</p><ul>{milestone.completionCriteria.map(item => <li key={item}>{item}</li>)}</ul>
    </article>)}
    <h3>Tasks</h3>
    {scopeTasks.length === 0 ? <p className="empty">No {scope === 'product' ? 'product' : 'project hub'} tasks defined.{scope === 'product' && ' Product scope is awaiting confirmation.'}</p> : scopeTasks.map(task => <article key={task.id}>
      <h4>{task.id} · {task.title}</h4>
      <div className="tags"><span>Implementation: {label(task.status)}</span><span>Priority: {task.priority}</span><span>Verification: {label(task.verification.status)}</span></div>
      <p>Milestone: {task.milestone ?? 'Not assigned'} · Dependencies: {task.dependencies.join(', ') || 'None'}</p>
      <details><summary>Acceptance criteria and evidence</summary>
        <ul>{task.acceptanceCriteria.map(item => <li key={item}>{item}</li>)}</ul>
        <h5>Verification evidence</h5>
        {task.verification.evidence.length ? <ul>{task.verification.evidence.map(item => <li key={item}>{item}</li>)}</ul> : <p>No verification evidence recorded.</p>}
        {task.references.length > 0 && <><h5>References</h5><ul>{task.references.map(item => <li key={item}>{item}</li>)}</ul></>}
      </details>
      <p className="meta">Updated: <time dateTime={task.updatedAt}>{task.updatedAt}</time></p>
    </article>)}
  </section>;
}
function App() {
  const blocked = tasks.filter(task => task.status === 'blocked');
  return <main>
    <header><p className="eyebrow">PROJECT HUB · READ-ONLY SNAPSHOT</p><h1>{project.name}</h1><p>{project.description}</p></header>
    <section className="panel objective"><h2>Current objective</h2><p className="lead">{project.currentObjective}</p>
      <dl><div><dt>Project phase</dt><dd>{label(project.phase)}</dd></div><div><dt>Product scope</dt><dd>{project.productScopeStatus}</dd></div><div><dt>Product architecture</dt><dd>{project.productArchitectureStatus}</dd></div><div><dt>Source repository</dt><dd>{project.sourceRepository.proposedName} (proposed; {project.sourceRepository.location ?? 'location unknown'})</dd></div></dl>
      <p className="meta">Latest data update: <time dateTime={latestUpdate}>{latestUpdate}</time></p>
    </section>
    <div className="columns"><WorkScope scope="product" title="Product" /><WorkScope scope="project-hub" title="Project hub" /></div>
    <section className="panel"><h2>Blockers</h2>{blocked.length === 0 ? <p className="empty">No blocked tasks recorded. Unconfirmed product decisions are listed in the handoff.</p> : blocked.map(task => <article key={task.id}><h3>{task.id} · {task.title}</h3><p>{task.blocker?.reason}</p><p>Next action: {task.blocker?.nextAction}</p></article>)}</section>
    <section className="panel"><h2>Session handoff</h2>{handoff.trim() ? <pre>{handoff}</pre> : <p className="empty">No handoff recorded.</p>}</section>
    <footer>Source: repository tracking files · Rebuild to refresh this snapshot. Git delivery does not imply functional verification.</footer>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
