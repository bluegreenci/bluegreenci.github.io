---
title: "Getting Started: Your First Workflow"
description: "A short, practical guide to writing and running your first BlueGreen runbook."
date: 2025-12-20
tags: ["getting-started","bluegreen","runbook","tutorial"]
draft: false
---

> Create a `runbook.yml`, push it, and watch BlueGreen execute your steps with live logs and a graph view.

## Overview

This guide gets you from zero to a successful run in minutes. You'll create a tiny runbook, push it to your repo, and inspect the run in the BlueGreen dashboard.

Prerequisites

- A repo on GitHub/GitLab
- A BlueGreen account (sign in at https://bluegreen.ci)
- A BlueGreen project linked to your repo (import it from the dashboard)

## Minimal Example

Create `runbook.yml` in the repository root:

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

Once pushed, BlueGreen will trigger a run.

## What to expect in the UI

In the Projects dashboard, click the Workflows button of your project to see the list of runs. Click on the latest run to open the Run Details page, where you'll see your Queued / Running / Succeeded / Failed workflows:

![](/images/blog/001-getting-started/project-workflows.png)

When selecting your run, you can see your workflow execution details: edges, dependencies:

![](/images/blog/001-getting-started/workflow-details.png)


When selecting a step, you can see live logs streamed for the step, and stored logs for later inspection:

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

## What Is a Workflow?

A workflow is a declarative graph of steps that run exactly in the order you define. In BlueGreen, you define a workflow in a file named `runbook.yml` that lives in the root of your repository.

It describes:

- the steps your workflow will perform
- the relationships between those steps
- the commands each step runs
- the environment variables that shape behavior
- optional global settings

BlueGreen parses this file and turns it into a directed graph: each step is a graph node, and each `depends_on` creates a directed graph edge. Since BlueGreen workflows are true graphs, parallelism emerges naturally:

![](/images/blog/hello-world/bluegreen-graph.png)

## Example: A little more detail

Here’s a slightly expanded example showing a dependent step and an environment variable:

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

_**What’s going on?**_

- “Hello World” runs first.
- “Later Gator” waits for it to finish (`depends_on`).
- `GREETING` is injected as an environment variable.
- Steps run in isolated containers.
- Logs stream live in the UI.

<details>
<summary>Expand: Real World Scenario</summary>

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

## Step Properties

Each step in `runbook.yml` supports the following properties:

| Property    | Type         | Description                                      |
|-------------|--------------|--------------------------------------------------|
| `name`      | string       | A unique identifier for the step                  |
| `command`   | string       | Shell commands to execute inside the container    |
| `depends_on`| list of strings | Names of steps that must complete before this one |
| `env`       | key-value pairs | Environment variables for that step (optional) |

## Global Environment Variables

```yaml
global:
  env:
    GREETING: "Hello from BlueGreen!"
```

Steps can override global variables with their own env block.
