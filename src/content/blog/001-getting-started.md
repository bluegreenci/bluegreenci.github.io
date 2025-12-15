---
title: "Getting Started: Your First Workflow"
description: "A short, practical guide to writing and running your first BlueGreen runbook."
date: 2025-12-20
tags: ["getting-started","bluegreen","runbook","tutorial"]
draft: false
---

> Create a `runbook.yml`, push it, and observe BlueGreen execute the workflow with live logs and a graph view.

## Overview

This guide shows how to create, commit, and run a minimal BlueGreen Workflow, to which we'll refer to as a "runbook". Follow the steps to trigger a workflow and inspect its execution in the BlueGreen dashboard.

Prerequisites

- A repository on GitHub or GitLab
- A BlueGreen account (https://bluegreen.ci)
- A BlueGreen project connected to your repository

## Minimal example

Create a `runbook.yml` at the repository root:

```yaml
name: "Getting Started with BlueGreen"

steps:
- name: "Hello World"
  command: |
    echo "Hello, World from BlueGreen!"
```

Commit and push the file:

```bash
git add runbook.yml
git commit -m "Add initial BlueGreen runbook"
git push
```

Pushing the file will trigger a BlueGreen run for the repository.

## Inspecting the run in the dashboard

Open the Projects dashboard and select your project’s Workflows view to see recent runs. Selecting a run opens the Run Details page and displays status (Queued / Running / Succeeded / Failed):

![](/images/blog/001-getting-started/project-workflows.png)

The Run Details view shows the execution graph and step dependencies:

![](/images/blog/001-getting-started/workflow-details.png)

Selecting an individual step reveals live-streamed logs and persisted logs for post-mortem analysis:

![](/images/blog/001-getting-started/step-details.png)

## Extending the example

Add a dependent step and an environment variable:

```yaml
name: "Getting Started with BlueGreen"

steps:
- name: "Hello World"
  command: |
    echo "Hello, World from BlueGreen!"

- name: "Greet"
  depends_on: ["Hello World"]
  env:
    GREETING: "Hi from BlueGreen"
  command: |
    echo $GREETING
```

## What is a workflow?

A workflow is a declarative directed graph of steps defined in `runbook.yml`. Each step is a node and `depends_on` entries form edges. This model expresses ordering and parallelism explicitly.

A runbook describes:

- Steps to execute
- Inter-step dependencies
- Commands run for each step
- Environment variables that affect execution
- Optional global configuration

![](/images/blog/hello-world/bluegreen-graph.png)

## Example: expanded

Here is a slightly larger example demonstrating dependencies and environment variables:

```yaml
name: "Getting Started with BlueGreen"

steps:
- name: "Hello World"
  command: |
    echo "Hello, World!"

- name: "Later Gator"
  depends_on:
    - "Hello World"
  env:
    GREETING: "See you later, alligator!"
  command: |
    echo $GREETING
```

Behavior summary

- `Hello World` executes first.
- `Later Gator` waits for the `Hello World` step (`depends_on`).
- `GREETING` is injected as an environment variable for the dependent step.
- Steps run in isolated containers and stream logs to the UI.

<details>
<summary>Real-world CI pipeline (example)</summary>

```yaml
name: "CI Pipeline"

global:
  env:
    GO111MODULE: "on"

steps:
- name: build
  command: go build ./...

- name: lint
  command: golangci-lint run

- name: test
  depends_on: [build]
  command: go test ./... -v

- name: quality-gate
  depends_on: [lint, test]
  command: echo "All checks passed!"
```

</details>

## Step properties

Each step supports the following properties:

| Property     | Type            | Description                                      |
|--------------|-----------------|--------------------------------------------------|
| `name`       | string          | Unique identifier for the step                   |
| `command`    | string          | Shell commands executed inside the step’s container |
| `depends_on` | list[string]    | Names of steps that must complete before this one |
| `env`        | map[string]string | Environment variables for the step (optional)   |

## Global environment variables

```yaml
global:
  env:
    GREETING: "Hello from BlueGreen!"
```

Step-level `env` entries override global variables.
