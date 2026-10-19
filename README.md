# Urban Ride — Project Hub

Planning, architecture, and progress tracking for Urban Ride, a personal ride-hailing project. This repository keeps project context versioned and accessible to the owner and Codex.

## Purpose and boundaries

This hub contains product goals, scope and requirements, architecture documentation, Architecture Decision Records (ADRs), milestones, tasks, blockers, session handoff, and a project-specific static dashboard.

Application source code, tests, migrations, and deployment configuration belong in a separate repository, tentatively named `urban-ride-code`. Its existence and location are not confirmed. Implementation-specific documentation should stay close to that code. React, TypeScript, and Vite here describe only the project dashboard, not the ride-hailing application architecture.

The dashboard is read-only: no backend, database, authentication, editing, portfolio, or hosting is configured. Repository data is the primary work tracker; GitHub Issues/Projects are not used. Pull requests are used for review.

## Repository structure

```text
AGENTS.md                   Codex instructions and session workflow
CONTRIBUTING.md              Source ownership, checks, and Git conventions
docs/product/               Product intent and scope
docs/architecture/          Separate product and hub architecture context
docs/decisions/              ADR conventions and records
tracking/project.json       Project metadata and current objective
tracking/milestones.json    Milestones and completion criteria
tracking/tasks.json         Tasks, blockers, and verification evidence
tracking/handoff.md          Current session summary
schemas/                    Versioned JSON Schemas and data conventions
dashboard/                  React + TypeScript + Vite read-only dashboard
.github/workflows/          CI checks, with no deployment
```

## Working with Codex

Ask Codex to work on this repository; it should start with `AGENTS.md`, inspect Git and tracking, make scoped changes on a branch, run checks, update the handoff, commit, push, and open a PR when access permits. Repository artifacts are English; conversations with the owner are Vietnamese.

Keep one authoritative source for each kind of information (see `CONTRIBUTING.md`). Distinguish confirmed decisions from proposals, update status as work progresses, and attach verification evidence to completed work. The dashboard reads original tracking JSON and handoff Markdown directly during the Vite build; no manual copy or generated data file is required.

## Commands

Install Node.js 24 and npm, then run these commands from the repository root:

```sh
npm --prefix dashboard ci                   # Install locked dependencies
npm --prefix dashboard run dev              # Start local dashboard
npm --prefix dashboard run validate         # Validate management data
npm --prefix dashboard run test:validation  # Check rejection of invalid data
npm --prefix dashboard run typecheck        # Check TypeScript
npm --prefix dashboard run build            # Build static dashboard
npm --prefix dashboard run check            # Run all required checks
npm --prefix dashboard run preview          # Preview the built dashboard
```

The build is written to ignored `dashboard/dist/`. CI runs the same checks for PRs and pushes to `master`, the verified remote default branch. No deploy workflow is included.

## Current context

Urban Ride is in initial setup. Product scope, application architecture, and the first product milestone are not confirmed. Consult `tracking/project.json` for the current objective, `tracking/tasks.json` for work state, and `tracking/handoff.md` for verification and next steps. Empty product tasks and milestones reflect the available facts.
