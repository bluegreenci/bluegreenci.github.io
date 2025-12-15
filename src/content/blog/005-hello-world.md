---
title: "Introducing BlueGreen: Open Beta Release"
description: "Announcing the Open Beta of BlueGreen: a graph-based CI and workflow orchestrator engine."
date: 2025-12-25
tags: ["release-notes", "bluegreen", "ci", "devtools", "automation", "workflows"]
draft: false
---

On this Christmas Eve, I’m opening the doors to the first Open Beta release of BlueGreen: a **Code and Workflow Automation Platform**. BlueGreen began as a small personal experiment, and now I feel it's time to experiment with a wider audience.

---

## What Does BlueGreen Do?

At its core, BlueGreen is a graph-based workflow engine. You define your workflows via `runbook.yml` files, and BlueGreen executes them as directed graphs of steps whenever they're triggered. Each runbook step runs in an isolated Ubuntu 24.04 container. Logs are streamed live to the dashboard, and stored securely for later inspection. The execution order is defined by step dependencies.

The commands run as a Bash script and the isolated container includes some tools for you:

- A `bash` shell, obviously, with your typical utils like `curl`, `wget`, `tar`, `git`, SQLite3, etc.
- Node.js `24.11.1`
- Python `3.14.1`
- Go `1.25.4`
- Ruby `3.4.7`
- Docker and Docker Compose

With these tools, you can use BlueGreen to automate a wide variety of tasks, like building code, running tests, deploying applications, or executing multi-step processes. The workflow execution is triggered automatically via GitHub/GitLab webhooks, or manually from the dashboard.

---

## Joining the Open Beta

Here's what your first 5 minutes with BlueGreen should look like:

1. Log in with GitHub or GitLab at https://bluegreen.ci
2. Import a Project from your account. This will set up webhooks for your repository.
3. If you already have a `runbook.yml` file at the root of your repository, your workflow will run immediately. If not, follow the instructions in the [Getting Started](/001-getting-started/) guide to create a runbook
4. Commit and push, this triggers a run. Runs are categorized by branch, and they run when you create a new branch, push to an existing branch, or merge a Pull Request / Merge Request into a branch
5. Watch steps execute live from BlueGreen dashboard and inspect logs.

Now you're officially a Beta Tester. Have fun, go wild. Try not to break it too much.


## Notes on the Open Beta Infrastructure

During this Open Beta, I'm running the platform on a single VM (6 vCPU, 12 GB RAM). I have noticed these limitations:

- Up to 3 workflow steps can run concurrently on the VM before additional steps are queued as `pending` and wait for resources.
- Scheduled runs may appear as `pending` if capacity is not available. They will transition to `running` when resources free up.
- Steps are terminated after 1 hour (platform-enforced maximum).

---

## Thank You

BlueGreen has been an interesting challenge so far: a blend of engineering, product design, UX, and many late-night commits.

Thank you for trying it. <br />
Thank you for pushing its limits. <br />
Thank you for helping shape what it becomes. <br />

🎄 Merry Christmas & Happy New Year 🎄
