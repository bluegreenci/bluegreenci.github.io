---
title: "Runbook Flow: From Commit to Completion"
description: ""
date: 2025-12-24
tags: []
draft: false
---

> The life of a run: how a pushed runbook becomes scheduled steps and how steps share data.
> Detailed lifecycle from commit to step execution, including scheduler, executor, artifacts, and security considerations.

## Flow overview

1. A `runbook.yml` is pushed to a branch in the repository.
2. The Git provider sends a webhook to BlueGreen. Webhooks are authenticated and de-duplicated
3. BlueGreen validates the payload and the runbook schema. If valid, BlueGreen parses the runbook and constructs an in-memory directed graph from `steps` and `depends_on` links.
5. A scheduler enqueues ready steps (those with no unmet dependencies).
6. Executors pick up queued steps and provision an isolated container for each step to run the provided `command`.

## Webhook handling & validation

- Webhook requests are authenticated using provider-secured secrets (e.g., HMAC). Duplicate deliveries are ignored using idempotency keys.
- The runbook is validated against the platform schema before execution. Errors surface as run failures.

## Graph construction and scheduling

- BlueGreen constructs a directed acyclic graph (DAG). The platform performs cycle detection and rejects runbooks with circular dependencies.
- Steps transition through states: Pending → Ready → Skipped | Running → Succeeded | Failed | Cancelled.
- The scheduler enforces per-project concurrency, global worker pool limits, and optional priority rules. Ready steps are placed in a fair queue and claimed by executors.

## Executor & container lifecycle

Each step runs in an ephemeral container. Executors perform the following on claim:

1. Provision container with resource limits and network isolation.
2. Inject environment: `global.env`, step `env`, and platform-injected secrets (scoped by `ENV`).
3. Clone the repository into the step workspace (default: `~`).
4. Execute the step `command` in the workspace. Exit code 0 ⇒ Succeeded; non-zero ⇒ Failed.
5. Persist logs and upload specified artifacts via `cacher` or the artifact API.

## Repository cloning

Repositories are cloned into the step workdir (the `~` path). This means step commands can access code and files directly. The workspace is ephemeral; when the step finishes execution, the workspace is discarded.

## Artifacts and caching

Use the `cacher` helper to exchange artifacts between steps. Typical workflow:

```bash
cacher put <key> <srcfile>       # upload <srcfile> as artifact with <key>
cacher get <key> <destfile>      # download artifact with <key> to <destfile>
cacher delete <key>              # delete artifact with <key>
```

Notes:
- `cacher put` uploads artifacts to durable storage and associates them with the run and key.
- Artifacts may be compressed and have size/retention limits; large files should be split or stored in an external artifact store.
- Prefer small, focused artifacts (build outputs, test reports) rather than large monolithic archives.

## Logs and observability

- Executors stream live logs to the UI and persist logs for later inspection.
- Sensitive values are redacted from logs when possible; avoid printing secrets in commands.
- Each step log includes timestamps, container id, and exit codes to aid debugging.

## Retries, timeouts, and error handling

- Workflows can be retried manually
- Steps have timeouts; after running for 1 hour by default, they are terminated and marked as Failed.

## Security considerations

- Steps run in isolated containers with network restrictions where applicable.
- Secrets are injected into the container environment at runtime and are not persisted in the runbook or logs. Do not echo secrets.

## Troubleshooting & best practices

- To reproduce failures locally, run the failing `command` in a container matching the platform runtime and inject environment variables/secrets as needed.
- Keep steps small and deterministic; prefer multiple short steps over a single monolithic script.
- Use `cacher` for artifacts and avoid relying on long-lived containers for data sharing.
- When diagnosing flaky behavior, check: repository clone strategy, workspace contents (`~`), environment variables, and resource limits.

## Quick reference — `cacher`

```bash
cacher put <key> <source_path>
cacher get <key> <destination_path>
cacher delete <key>
```

For more advanced artifact management (external stores, large files, retention policies), consider integrating an external artifact registry and storing only references in the runbook.
