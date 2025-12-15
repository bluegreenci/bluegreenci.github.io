---
title: "Teams & Projects"
description: "How BlueGreen handles teams, project ownership, invites, and roles."
date: 2025-12-23
tags: ["teams","projects","permissions","bluegreen"]
draft: false
---

> Create teams, invite members, assign roles, and attach projects for shared ownership and collaborative workflows.

BlueGreen is a multitenant platform. When you create an account, a tenant is created and you become the **tenant owner**. Tenant owners can invite users to the tenant, manage tenant-level settings, and audit activity across the tenant.

To invite users to your tenant, click your avatar in the top-right corner of the dashboard, select **Settings**, then go to the **Team** tab and click on the _**Invite Team Member**_ button.

![](/images/blog/004-teams/invitation.png)

Now, I haven't implemented any email integration yet; you will have to click that button on the user's card, copy the link, and send it to them manually.

First time they open the link, they will be prompted for a password to complete their account setup and join your tenant.

By default, tenant members do not have access to projects. Tenant owners or tenant admins must invite members to specific projects and assign them a role before they can view or modify project resources. Go to your projects settings page, and on the _**Access Control**_ then _**Add Users**_:

![](/images/blog/004-teams/project-access.png)

These are the permission levels you can assign:

- **User**: Minimal access; can view runs and logs. No access to Project Secrets
- **Manager**: Everything from User, can view Project Secrets
- **Admin**: Full access to project and its settings

Only tenant owner can import projects from GitHub/GitLab accounts.
