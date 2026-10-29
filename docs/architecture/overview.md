# Architecture overview

## Urban Ride application

Status: unconfirmed. No application technology stack, service boundaries, storage, infrastructure, or deployment design has been selected. The proposed source repository name is `urban-ride-code`; do not assume it exists locally or remotely.

## Project hub

The hub uses React, TypeScript, and Vite for a static read-only interface. Repository JSON is validated using versioned JSON Schemas plus referential checks before development startup and production builds. The frontend imports tracking JSON and handoff Markdown directly at build time. Markdown is displayed as plain text without interpreting HTML.

There is no backend, database, login, editing API, deployment, or hosting. npm owns the single lockfile under `dashboard/`. Node.js 24 runs local checks and CI. See `docs/decisions/0001-project-hub-data.md` for the data approach and trade-offs.
