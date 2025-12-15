---
title: "Introducing BlueGreen: Open Beta Release"
description: "Announcing the Open Beta of BlueGreen: a graph-based CI and workflow orchestrator engine."
date: 2025-12-25
tags: ["release-notes", "bluegreen", "ci", "devtools", "automation", "workflows"]
draft: false
---

Today I'm announcing the Open Beta release of BlueGreen, a Graph-Based Code and Workflow Automation platform.

## Summary

BlueGreen executes declarative workflows defined in `runbook.yml` as directed graphs of steps. Each step runs in an isolated Ubuntu 24.04 container; logs stream live to the dashboard and are persisted for later inspection. The execution order is determined by step dependencies in the runbook.

Included runtime tooling

- `bash` and standard Unix utilities (`curl`, `wget`, `tar`, `git`, `sqlite3`, etc.)
- Node.js 24.11.1
- Python 3.14.1
- Go 1.25.4
- Ruby 3.4.7
- Docker and Docker Compose

Workflows are triggered by GitHub/GitLab webhooks or manually from the dashboard. Use BlueGreen for builds, tests, deployments, and general multi-step automation.

## Getting started (first 5 minutes)

1. Sign in with GitHub or GitLab at https://bluegreen.ci
2. Import a project from your account to provision repository webhooks.
3. Add a `runbook.yml` at the repository root (see the Getting Started guide) or rely on an existing one.
4. Commit and push to trigger a run — runs are grouped by branch and triggered on new branches, pushes, or merge requests.
5. Monitor execution and logs in the BlueGreen dashboard.

## Open Beta infrastructure notes

This Beta runs on a single VM (6 vCPU, 12 GB RAM). Known limitations:

- Concurrent steps: up to 3 steps run concurrently; additional ready steps are queued as pending.
- Scheduled runs may remain pending during capacity constraints and will start when resources free up.
- Step maximum runtime: 1 hour (platform-enforced).

These limits are temporary for the Beta and will be relaxed as the platform scales.

## Feedback and contribution

Your feedback is valuable. Report issues, request features, or share suggestions via the project’s issue tracker or support channel.

Thank you for trying BlueGreen. Your testing helps shape the platform.
