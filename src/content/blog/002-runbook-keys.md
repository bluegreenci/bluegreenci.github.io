---
title: "Runbooks: All Workflow Keys & Examples"
description: "A reference for every key supported in BlueGreen runbooks, with practical examples and validation guidance."
date: 2025-12-21
tags: ["runbook","reference","bluegreen","docs"]
draft: false
---

> This is the complete reference for `runbook.yml`: keys, types, rules, and examples to write reliable, testable workflows.

## Overview

Runbooks declare a directed graph of steps that BlueGreen executes in containers. Runbooks are YAML files with a small, consistent schema that favors clarity and determinism.

## Runtime Environment

Steps run in an Ubuntu-based Linux container with common tooling preinstalled:

- A `bash` shell, obviousy, with your typical utils like `curl`, `wget`, `tar`, `git`, SQLite3, etc.
- Node.js `24.11.1`
- Python `3.14.1`
- Go `1.25.4`
- Ruby `3.4.7`
- Docker and Docker Compose


## Key Reference Table

| `steps[].name` | step | string (required) | Unique identifier for the step within the runbook |
| `steps[].command` | step | string (required) | Shell commands executed inside the step's container |
| `steps[].depends_on` | step | list[string] (optional) | Names of steps that must finish before this one runs; forms graph edges |
| `steps[].env` | step | map[string]string (optional) | Step-scoped environment variables; overrides `global.env` |

#### Top-level keys

| Key | Type | Meaning |
|-----|-------|---------|
| `name` | string | Human-friendly workflow name; recommended but optional |
| `global` | map | Settings that apply to all steps |
| `steps` | list | Ordered collection of step objects (the execution graph is formed by `depends_on` links) |

#### Step object

Each step is a map with the following keys:

| Key | Type | Meaning |
|-----|-------|---------|
| `steps[].name` | string (required) | Unique identifier for the step within the runbook |
| `steps[].command` | string (required) | Shell commands executed inside the step's container |
| `steps[].depends_on` | list of strings (optional) | Names of steps that must finish before this one runs; forms graph edges |
| `steps[].env` | key-value pairs (optional) | Step-scoped environment variables; overrides `global.env` |

#### Global object

| Key | Type | Meaning |
|-----|-------|---------|
| `global.env` | key-value pairs (optional) | Environment variables applied to all steps unless overridden |

## Examples

Linear example:

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

Parallel example (no dependencies between them):

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

Fan-in example (converging to a quality gate):

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

## Validation rules & best practices

- Step names must be unique within a runbook
- `depends_on` must reference existing step names
- Keep steps small and focused: shorter, simpler steps are easier to debug and cache
- Avoid long-running monolithic commands; prefer small scripts or tasks
- Use `env` for configuration and avoid hardcoding secrets (use Secrets)
