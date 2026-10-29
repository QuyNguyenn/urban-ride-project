# Management data contract

All tracking JSON documents require `schemaVersion: 1`. JSON Schemas use draft-07, reject unknown fields, and are validated with Ajv and ajv-formats. Unsupported versions fail validation. Change schemas, validator, dashboard types, and tests together when evolving the contract; explicitly migrate data for a new version.

- `project.schema.json`: identity, current objective, confirmation states, source repository metadata, and update time.
- `tasks.schema.json`: stable ID, title, scope, implementation status, priority, nullable milestone, acceptance criteria, dependencies, nullable blocker, update time, verification, and references.
- `milestones.schema.json`: stable ID, title, scope, implementation status, completion criteria, and update time.

Empty task and milestone arrays are valid. There is no fabricated product roadmap. Use `UR-`/`UR-M` IDs for product and `HUB-`/`HUB-M` for project-hub; retain at least three digits and never reuse IDs. Task/milestone IDs must be unique. Milestone references must exist and match task scope. Dependencies must exist, cannot reference the task itself, and cannot form cycles. Cross-scope task dependencies are allowed when real.

Statuses are `todo`, `in_progress`, `blocked`, `done`, or `cancelled`; priorities are `low`, `medium`, or `high`. A blocked task requires `blocker.reason` and `blocker.nextAction`; clear the blocker when unblocked. `verification.status` is `pending`, `passed`, `failed`, or `not_applicable`. Done tasks require passed or not-applicable verification with nonempty evidence explaining the result. Automated validation cannot determine whether acceptance criteria were substantively met; the contributor must review them.

Use full ISO 8601 date-time strings with seconds and explicit `Z` or numeric timezone offset. Invalid calendar dates fail. Prefer UTC. Optional information is represented by null or empty arrays using the required fields, so absence is explicit. References and evidence are nonempty strings when provided; they may describe commands/results, artifact paths, PR URLs, or existing commits. No self-referential commit evidence is required.

Run `npm --prefix dashboard run validate`; errors name the document or entity. The regression suite checks invalid data without modifying repository tracking files.
