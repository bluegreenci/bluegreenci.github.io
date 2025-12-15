---
title: "Secrets & Environments"
description: "How to manage secrets and environments in BlueGreen, and how they are injected into runs."
date: 2025-12-22
tags: ["secrets","env","bluegreen"]
draft: false
---

> Use environments and secrets to protect credentials and control scope for runs.

There are three ways to expose environment variables to a runbook step:

1. **Env per step**: use the `env` key on a step to define variables for that step (see [Runbooks: All Workflow Keys & Examples](/002-runbook-keys/)).

2. **Global Env**: define `global.env` to apply variables to all steps by default (see [Runbooks: All Workflow Keys & Examples](/002-runbook-keys/)).

3. **Injected with matching `$ENV`**: platform-injected secrets and project-level variables are placed into the step's process environment when they match the step's `$ENV` variable.

This article shows you how these injected variables work: how they're scoped, secured, and injected.

To add an environment and secrets from the dashboard, open your project _**Settings**_ and go to the _**Secrets**_ tab. Add an environment (e.g. `development`):

![](/images/blog/003-secrets/new-env.png)

Then, having selected your environment, click on the _**Add Secret**_ button:

![](/images/blog/003-secrets/secret.png)

Now, in order to use the `$DB_PASSWORD` secret in a run, you need to ensure that the run is executed with the `development` environment. You can do this by setting the `ENV` variable in your runbook, either globally or per step:

```yaml
name: "Using Secrets and Environments"

global:
	env:
		ENV: "development" ## Either set globally...

steps:
- name: "Connect to DB"
	env:
		ENV: "development" ## ...or per step
	command: |
		echo "Connecting to DB with password: $DB_PASSWORD"
		# TODO: connect properly
```

Secrets are encrypted before they are stored and are transmitted securely. There is no limit to how many environments or secrets you can create.


## Troubleshooting & tips

- If a secret isn't injected, check its scope (project vs environment) and whether the run's environment has access to it
- Use preview environments for changes that need ephemeral infrastructure
- Audit secret access and rotations from the dashboard
