# ADR 0001: Build the dashboard from repository data

Status: accepted
Scope: project-hub

## Context

The owner requested a static React + TypeScript + Vite dashboard and repository-owned work tracking with automated validation. Product scope and architecture remain unconfirmed.

## Options considered

1. Direct JSON and raw Markdown imports at build time.
2. Generate a copied data bundle before building.
3. Fetch data from a backend or external task tracker.

## Decision

Use direct imports from `tracking/`, JSON Schema draft-07 with explicit schema version 1, Ajv and format validation, and separate reference checks. Use npm and Node.js 24. This is a routine hub implementation decision within the authorized setup scope, not a product architecture decision.

## Trade-offs/consequences

Direct imports avoid synchronization scripts and duplicate authority. Static output requires a rebuild for updated data. Raw Markdown keeps dependencies small but is displayed as plain text. Schemas validate data at build time; TypeScript checks the dashboard's consumed shape separately. Schema changes must update the consumer types and regression tests together. Public hosting, if later approved, would expose the bundled tracking and handoff content; no hosting is configured now.
