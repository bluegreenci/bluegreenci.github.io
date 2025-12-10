---
title: "Introducing BlueGreen: Open Beta Release"
description: "Announcing the Open Beta of BlueGreen: a graph-based CI and workflow orchestrator engine."
date: 2025-01-25
tags: ["release-notes", "bluegreen", "ci", "devtools", "automation", "workflows"]
draft: false
---

On this Christmas Eve, I’m opening the doors to the first Open Beta release of BlueGreen: a CI and Workflow Automation platform built for developers who want clarity, speed, and full control over their automation.

BlueGreen began as a small personal experiment: a deterministic workflow engine born out of frustration with the opacity and rigidity of mainstream CI tools. Over months of iteration, it grew into something more ambitious: a platform built from first principles, using clear workflows, event-driven execution, and predictable orchestration.

Today, I’m incredibly proud (and a bit nervous) to share it with you.

---

## 🚀 What Does BlueGreen Do?

BlueGreen helps you automate anything you do repeatedly in your engineering workflow:

- 🏗️ Build code
- 🧪 Run tests
- 🚀 Deploy applications
- 🔀 Execute multi-step processes
- ⚙️ Orchestrate custom automation
- 📬 Trigger workflows from Git events
- ⏰ Run scheduled tasks (coming soon)


At its core, BlueGreen is a graph-based workflow engine.

You define your workflow once, and BlueGreen executes it as a directed graph of steps:

- 📦 Each step runs in an isolated container
- 🔗 Dependencies control execution order
- 🧠 The orchestrator is fully event-driven
- 📜 Logs are streamed live and stored securely
- 🔍 Runs are deterministic and easy to debug

If you’ve ever wished CI/CD felt more predictable, more transparent, or more yours, BlueGreen was built with you in mind.

---

## 🧭 Your First 5 Minutes With BlueGreen

If you're completely new, here’s what getting started looks like:

1. Log in with GitHub/GitLab at https://bluegreen.ci
2. Import a repository (any repo you want to automate)
3. Create a file named `runbook.yml` in your repo
4. Commit and push, this triggers a run
5. Watch steps execute live from BlueGreen dashboard and inspect logs

Everything runs on BlueGreen’s Kubernetes infrastructure.

---

## 🔄 What Is a Workflow?

A workflow is a file named runbook.yaml that lives in your repository.

It describes:

- the steps your automation will perform
- the relationships between those steps
- the commands each step runs
- the environment variables that shape behavior
- optional global settings

BlueGreen parses this file and turns it into a directed graph:

- 🔷 Each **step** is a node
- 🔗 Each `depends_on` is an edge
- 🧠 Execution becomes fully deterministic


![](/images/blog/hello-world/bluegreen-graph.png)

BlueGreen workflows are true graphs, not linear pipelines; parallelism emerges naturally. They behave predictably, with no hidden conditions. The orchestrator is event-driven and reacts instantly. Each step is a container with a command, making workflows easier to understand.

A workflow, simply put: a declarative graph of containerized steps that run exactly in the order you define.

---

## 💻 “Give Me the Code!”

Let’s start with a simple workflow definition:

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

Commit this to your repo in a `runbook.yml` file and push it.

You’ve just started the execution of your first workflow on BlueGreen.


### What’s going on?

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


---

## 🔧 Step Properties

Each step in runbook.yaml supports:

- `name` — a unique ID for the step
- `command` — shell commands executed inside its container
- `depends_on` — steps that must complete before this one
- `env` (optional) — environment variables for that step

### Global Environment Variables

Plain text example:
```yaml
global:
  env:
    GREETING: "Hello from BlueGreen!"
```

Steps can override global variables with their own env block.

---

## 🧪 How to Beta Test BlueGreen

If you’re part of the first wave of users, thank you for helping shape the platform.

Here’s what to do:

1. Log in with GitHub or GitLab at https://bluegreen.ci
2. Import a project from your GitHub/GitLab account
3. Add `runbook.yml` and push it. This triggers a workflow run
4. Check logs, graph view, and execution timeline on the dashboard
5. Report any errors, surprises, or ideas

This is a true Open Beta; your feedback directly influences what gets built next.

---

## ❤️ Thank You

BlueGreen is the most ambitious project I’ve ever taken on. A blend of engineering, product design, orchestration, UX, and many late-night commits.

Thank you for trying it. <br />
Thank you for pushing its limits. <br />
Thank you for helping shape what it becomes. <br />

Merry Christmas & Happy New Year.
