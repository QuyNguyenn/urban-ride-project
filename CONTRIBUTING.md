# Contributing

## Workflow and sources
Start with `AGENTS.md`. Work is tracked in repository JSON, not GitHub Issues or Projects. GitHub PRs review changes.

| Information | Authoritative source |
| --- | --- |
| Project identity, current objective, product confirmation state | `tracking/project.json` |
| Product intent and scope details | `docs/product/` |
| Architecture and decisions | `docs/architecture/`, `docs/decisions/` |
| Milestone status and completion criteria | `tracking/milestones.json` |
| Task status, dependencies, blockers, verification evidence | `tracking/tasks.json` |
| Current session summary and next steps | `tracking/handoff.md` |
| Data contract | `schemas/` |

The dashboard imports these sources at build time. Do not maintain dashboard copies. Keep the handoff short and refer to task IDs instead of repeating the task list. Update `project.updatedAt` when the handoff or project metadata changes; update each changed task/milestone timestamp. Use ISO 8601 with explicit timezone, preferably UTC (`2026-10-19T14:00:00Z`).

Use stable, never-reused task IDs: `UR-001` for product, `HUB-001` for project-hub. Milestones use `UR-M001` or `HUB-M001`. Empty product lists are valid. See `schemas/README.md` for validation rules. Keep implementation status separate from `verification.status`; Git delivery belongs in the handoff or PR, not task status. Record commands/results, artifact paths, existing commits, or PR URLs as evidence. A blocked task needs a cause and a next action.

## Local checks
Use Node.js 24 and npm. From the repository root:

```sh
npm --prefix dashboard ci
npm --prefix dashboard run dev
npm --prefix dashboard run validate
npm --prefix dashboard run test:validation
npm --prefix dashboard run typecheck
npm --prefix dashboard run build
npm --prefix dashboard run check
```

`check` runs validation, regression tests for invalid management data, typecheck, and build. `dev` and `build` validate data first. Build output is `dashboard/dist/`; `npm --prefix dashboard run preview` serves it locally. Rebuild after changing tracking data for a refreshed static snapshot. Commit the npm lockfile. Never commit dependencies, build output, credentials, or personal environment files.

## Branches and review
The remote default branch was verified as `master` during bootstrap; check the remote again in future sessions rather than assuming its name. Use `feat/<short-description>`, `fix/<short-description>`, `docs/<short-description>`, or `chore/<short-description>`. No extra environment prefix is currently required.

Use focused Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, or `ci:`. Inspect the diff and stage explicit paths. Push the working branch to the configured remote and create/update a PR against its actual default branch. PR descriptions cover the problem, resulting behavior, verification, and limitations. Never merge automatically. Record delivery outcomes without claiming that Git operations verify functionality.
