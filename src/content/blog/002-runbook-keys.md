---
title: "Runbooks: All Workflow Keys & Examples"
description: "A reference for every key supported in BlueGreen runbooks, with practical examples and validation guidance."
date: 2025-12-21
tags: ["runbook","reference","bluegreen","docs"]
draft: false
---
> Complete reference for `runbook.yml`: keys, types, examples, and validation guidance.

## Overview

This document is a concise reference for the BlueGreen runbook schema. A runbook declares a directed graph of steps that BlueGreen executes in containers. The schema is intentionally small and predictable to encourage clarity and testability.

## Runtime environment

Steps execute in an Ubuntu-based container image with commonly used tooling. The runtime includes, but is not limited to:

- `bash` and standard Unix utilities (`curl`, `wget`, `tar`, `git`, `sqlite3`, etc.)
- Node.js 24.11.1
- Python 3.14.1
- Go 1.25.4
- Ruby 3.4.7
- Docker and Docker Compose

If your step requires additional system packages, install them at runtime via `apt-get`.

## Key reference

Top-level keys

| Key     | Type | Description |
|---------|------|-------------|
| `name`  | string | Human-friendly workflow name (recommended but optional) |
| `global`| map    | Global settings applied to all steps (for example, `global.env`) |
| `steps` | list   | Collection of step objects; the execution graph is defined by `depends_on` entries |

Step object

| Key             | Type               | Description |
|-----------------|--------------------|-------------|
| `name`          | string (required)  | Unique identifier for the step within the runbook |
| `command`       | string (required)  | Shell commands executed inside the step's container |
| `depends_on`    | list[string]       | Names of steps that must complete before this one runs (optional) |
| `env`           | map[string]string  | Step-scoped environment variables; overrides `global.env` (optional) |

Global object

| Key          | Type | Description |
|--------------|------|-------------|
| `global.env` | map[string]string | Environment variables applied to all steps unless overridden at the step level |

## Examples

Linear example

```yaml
name: "CI Pipeline"

steps:
	- name: build
		command: make build

	- name: test
		depends_on: [build]
		command: make test

	- name: publish
		depends_on: [test]
		command: make publish
```

Parallel example

```yaml
name: "Parallel Checks"

steps:
	- name: lint
		command: golangci-lint run

	- name: unit-tests
		command: go test ./... -v

	- name: typecheck
		command: go vet ./...
```

Fan-in example (converging on a quality gate)

```yaml
name: "Quality Gate"

steps:
	- name: build
		command: make build

	- name: lint
		command: golangci-lint run

	- name: test
		depends_on: [build]
		command: make test

	- name: quality-gate
		depends_on: [lint, test]
		command: echo "All checks passed"
```

## Validation rules and best practices

- Step names must be unique within a runbook.
- `depends_on` entries must reference existing step names; invalid references cause validation errors.
- Keep steps small and focused: shorter steps are easier to debug and cache.
- Avoid monolithic, long-running commands; prefer small scripts or task-level commands.
- Use `env` for non-sensitive configuration; do not hardcode secrets in the runbook—use the platform Secrets feature instead.
