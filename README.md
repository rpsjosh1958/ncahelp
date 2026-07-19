# Engineering Department Knowledge & AI Help Desk System

**Status:** Concept / pre-build — scope and proof of concept stage
**Scope area:** NCA Engineering Department only (BMC, Mobile, Broadcasting, Satellite)

This README consolidates everything covered while scoping this system — the idea, the architecture, the data model, the AI design, the build plan, and the open questions still worth deciding before writing production code.

---

## 1. Overview

New staff and interns joining Engineering currently learn procedures, letter formats, and approval chains through word of mouth and scattered documents. BMC additionally runs a 24/7 monitoring shift coordinated through a manual Excel timetable.

This system centralizes that knowledge, structures it by sub-division, and makes it accessible two ways: a browsable interface (walkthroughs, letter templates, org chart) and a conversational AI assistant that answers from the department's own documented content — with a hard line between what's actually documented and general knowledge the AI might otherwise supply.

## 2. Problem Statement

- New staff take significant time to become productive because process knowledge lives in people's heads, not in a system.
- Letter drafting, formatting, and sign-off routing varies by who trains the new hire, not by a documented standard.
- BMC's 24/7 shift coverage is tracked in Excel, with no swap history, visibility, or handover record.
- There's no single place to confirm who approves what, or what a specific letter type should look like.

## 3. Objectives

- Cut the time it takes a new hire to run a shift or draft a compliant letter unsupervised.
- Make the approval chain (who signs what) a queryable fact, not tribal knowledge.
- Replace the BMC shift Excel sheet with a real roster tool.
- Give staff a conversational way to ask "what do I do when…" instead of searching folders.

## 4. Scope

### In scope
- The Engineering department only, across its four sub-divisions.
- Walkthroughs, letter templates, approval chain/org chart, reference facts (e.g. frequency bands per service type), a BMC shift roster, and an AI assistant over all of it.
- Admin-managed user accounts and access control (Section 9) — this is a public institution, so there is no public self-signup; every account is provisioned by a System Admin, individually or in a batch.

### Out of scope (for now)
- Rollout to other NCA departments or other institutions (FDA, GRA, banks, etc.) — a possible future direction, not part of this scope.
- Automated legal or compliance decision-making.
- Direct system integration with FDA or MOC — liaison stays a documented manual process, as it is today.
- Public or external access — internal staff only.

## 5. Department Structure

Engineering has four sub-divisions, each with its own way of working:

| Sub-division | Notes |
|---|---|
| **BMC** (Broadcast Monitoring Center) | Runs 24/7 monitoring shifts off a manual timetable today. Liaises with FDA (advert compliance) and MOC (content approval) during shifts — these are external bodies coordinated with, not internal knowledge silos. |
| **Mobile** | Own SOPs and templates. |
| **Broadcasting** | Own SOPs and templates. |
| **Satellite** | Own SOPs and templates. |

## 6. Core Features

1. **Walkthroughs** — ordered, checkable step-by-step guides (e.g. "start of shift at BMC," "add a new station or ISP"), with a progress indicator.
2. **Letter template library** — sample letter types (station registration confirmation, advert compliance notice, QoS violation notice, shift handover incident report), each tagged with who approves it and a format preview.
3. **Approval chain / org chart** — a structured record of who approves what, by division and role — not prose.
4. **Reference facts** — structured lookups such as frequency bands per service type.
5. **BMC shift roster** — replaces the Excel timetable: who's on duty, swap requests, handover log.
6. **AI help-desk assistant** — a chat that answers from the above content, routes staff to the full walkthrough/template when useful, and only falls back to general knowledge under strict rules (see Section 11).
7. **Admin & user access management** — admin-only account provisioning (one at a time or as a batch), role/division assignment, and deactivation on departure. No public self-signup — appropriate for a government regulator (see Section 9).

## 7. System Architecture

Four shared layers, used by all four sub-divisions:

- **Admin panel** — where division heads enter and update walkthroughs, letter templates, approval-chain/org-chart data, and reference facts; and where System Admins provision and deactivate user accounts (Section 9).
- **Content store & search index** — a versioned backend database. Nothing lives only in the AI or only in the chat interface.
- **Workflow & template engine** — draft → review → approve, with an audit trail, shared by every sub-division.
- **AI assistant** — retrieves relevant internal content per question and answers from it, governed by the rules in Section 11.

## 8. Data Model & Partitioning

**Partitioning is logical, not physical.** One shared database, with every content row tagged by a `division_id` field (`bmc`, `mobile`, `broadcasting`, `satellite`). No separate database per division — that would multiply backups and migrations for no benefit at this scale. If this ever expanded to a completely separate institution, a higher-level `tenant_id` would be the point to introduce, not before.

Core data types:
- `users` — staff, with role, division, position/title
- `content_items` — walkthroughs, letter templates, reference facts (type, division_id, status: draft/review/published, author, approver, version)
- `approval_chain` — person, position, division, sign-off order
- `roster/shifts` — BMC-specific: shift assignments, swap history, handover notes
- `embeddings` — vector representation of each published content chunk, used for AI retrieval
- `chat_logs` — question, what was retrieved, the answer, whether it fell back to general knowledge — the content-gap signal (see Section 11)

**Storage size is genuinely small.** This is a text-heavy system, not a media one. Even a generous estimate — 1,000 documents across all four divisions, ~5,000 words each, 10 versions of history — is roughly 300MB of raw text; embeddings add another 30–60MB at that scale. File attachments (scanned signed letters, etc.) should go in object storage (S3-compatible, or Firebase Storage), not the database itself.

## 9. User Roles & Permissions

| Role | Can do |
|---|---|
| **Staff** (default) | Browse walkthroughs/letters, use the AI assistant, track their own walkthrough progress. Read-only on org chart/approval data. |
| **Division head / content owner** | Create and edit content for their own division only. Submits changes for approval. |
| **Approver** (e.g. Director of Engineering) | Reviews and publishes content changes — the same sign-off habit already used for letters, applied to the knowledge base itself. |
| **BMC shift lead** | Manages the roster: assigns shifts, approves swaps. Scoped to BMC's roster module only. |
| **System admin** | The only role spanning all divisions — manages users/roles, adds divisions, sees fallback/gap logs. |

Every permission check is really one rule: *does this user's role + division_id match what they're trying to touch.*

### Account provisioning & lifecycle (admin-managed access)

This is a public institution, not a company intranet with an open sign-up page — an account existing at all is a deliberate admin decision, not something anyone can request for themselves.

- **No public self-signup.** Every account is created by a System Admin. There is no "sign up" flow anywhere in the product.
- **Individual creation.** Admin enters name, email, role, and division; the system sends an invite/activation link to that email rather than the admin relaying a temporary password.
- **Batch import.** For onboarding a cohort at once — the clearest case being **NSS personnel** (Ghana's National Service Scheme posts a new batch of one-year national service staff to the Authority roughly once a year, and the previous batch's term ends around the same time) — the admin either pastes a list of emails or uploads a CSV. A batch import applies one default role + division to the whole cohort, with per-row overrides (e.g. a CSV column for role/division) for anyone who doesn't fit the default.
- **NSS/temporary accounts default to the most restricted role** (Staff — read + AI assistant only) unless an admin explicitly elevates someone. A one-year, non-permanent posting shouldn't hold content-editing rights out of the gate.
- **Deactivation, not deletion, is the default offboarding action.** When someone leaves (NSS term ending, staff transfer, resignation), the admin deactivates the account: login is blocked, but their name stays attached to everything they drafted, approved, or logged — the audit trail on letters and approval records has to survive the person leaving. Hard delete is reserved for accounts created in error (e.g. a duplicate or a typo'd email), not for normal departures.
- **Admin actions are themselves logged** — who created, deactivated, or changed the role of which account, and when. An access-control system nobody can audit isn't much better than not having one.
- **More than one System Admin should exist at all times.** A single admin account is a lockout risk — if that person is unreachable (leave, departure, lost credentials), nobody can provision or deactivate anyone else until it's resolved.

## 10. Content Lifecycle

1. **Content entered** — by a division head, via a form, or via AI-assisted import (paste an old Word doc; Claude drafts the structure for a human to review).
2. **Draft** — saved, not yet visible to the AI assistant or to regular staff.
3. **Review & approval** — mirrors the real sign-off process already in place for letters.
4. **Published** — marked live for that division.
5. **Auto-embedded** — the system generates the AI's search index automatically on publish. No one manages this step manually.
6. **Available to the assistant** — staff can now ask about it.

**Hard rule:** drafts never leak into the AI's answers. The assistant only ever searches published, approved content.

## 11. AI Assistant Design

- **Retrieval-first, not memory-first.** Every question triggers a search over the department's own published content before the model answers.
- **Hard rule — no exceptions:** certain categories (who approves what, sign-off chains, org-specific facts) never use general knowledge. If nothing internal matches, the answer is "not documented — flagged for review," never a guess.
- **Everywhere else, it's a confidence check on retrieval**, not a vibe check by the model: above a similarity threshold, answer from internal content and cite the source page; below it, fall back to general knowledge — clearly labeled as such, never blended in silently.
- **Every fallback and low-confidence query is logged** as a content-gap signal, routed back to the relevant content owner — this is how the knowledge base stays current instead of going stale.
- **Embeddings require a separate model from Claude itself** — Claude answers the question; a smaller, separate embedding model (e.g. Voyage AI, or Google's Vertex AI embeddings if on the Firebase stack) does the "which documents are relevant" matching underneath it.
- Deep-links (e.g. "open full walkthrough") are attached server-side based on which content was actually retrieved — the model doesn't invent these.

## 12. Tech Stack Options Considered

| | Relational (e.g. Postgres + pgvector) | Firebase (Firestore + Auth + Storage + Cloud Functions) |
|---|---|---|
| Partitioning | `division_id` column | `divisionId` field |
| Authentication (Section 9) | Roll your own (e.g. NextAuth/Lucia) — more setup, more control | Firebase Auth built in — supports email invite links out of the box, plus Google Sign-In if staff already use a Google Workspace account, which would remove password management entirely |
| Roles/permissions | App-level checks | Custom claims + Security Rules |
| Vector search for AI | `pgvector` extension | Native `findNearest()` (up to 2048 dimensions; server-side only — Node.js/Python/Go/Java, not directly from a browser client) |
| Approval chains & versioning | Natural fit (joins, relations) | More manual (subcollections, denormalization) |
| Real-time features (shift roster) | Needs extra work | Strength of the platform, built in |
| Ops overhead | You run/manage the database | Managed, less DevOps for a small team |

Both are genuinely viable. Firebase trades some relational convenience for faster setup, less infrastructure to run, and real-time sync for free — a reasonable choice for a 2–3 person team.

## 13. Build Phases

| Phase | Deliverable | Why this order |
|---|---|---|
| 1 | BMC shift roster tool | Small, fast to ship, immediately useful — the first thing to demo, needs no institutional buy-in to start. |
| 2 | SOP & template repository + workflow engine | Piloted with BMC, since it's the best-understood division. |
| 3 | AI help-desk assistant | Built on top of Phase 2's content — nothing to retrieve from until content exists. |
| 4 | Roll out to Mobile, Broadcasting, Satellite | Same engine, each division's own content. |

## 14. Team & Roles (2–3 devs)

| Role | Focus |
|---|---|
| Dev 1 | Staff portal, auth & permissions, workflow/approval engine |
| Dev 2 | Content repository, template engine, AI assistant/retrieval layer |
| Dev 3 (or shared) | Admin panel, approval-chain/org-chart data, ongoing content tooling |

## 15. Proof of Concept & Demo

- A working prototype (`engineering_staff_hub.html`) demonstrates the core experience end to end: Home, interactive Walkthroughs, a Letter library with format previews, and a live AI assistant chat wired directly to Claude's API.
- A separate pitch/demo version is planned using local JSON files (`walkthroughs.json`, `letters.json`, `orgChart.json`, `divisions.json`) as placeholders for a real backend, with the AI assistant UI fully built but answering from simple logic over those files for now — clearly marked handoff points for a real API and a real model call later.

## 16. Success Metrics

- Time for a new hire to run their first unsupervised BMC shift, before vs. after.
- Number of "how do I…" questions escalated to a senior officer per month, before vs. after.
- Average turnaround time to draft and route a compliant letter.
- Share of AI assistant answers that needed a human correction — a direct signal of content quality and gaps.

## 17. Risks & Mitigations

- **Wrong procedural answer from the AI** → the hard rule on approvals/org facts, a confidence threshold, and logging every fallback for review.
- **Content goes stale** → every fallback and low-confidence query routes to content owners as a gap signal.
- **Slower government-style sign-off on the wider idea** → piloting inside Engineering only requires no institution-wide procurement decision to start.
- **Sensitive internal data exposure** → role-based edit permissions mirroring the existing approval hierarchy, internal-only deployment.

## 18. Edge Cases & Open Questions

Not yet decided — worth resolving before or during the build, grouped by area.

**Content & versioning**
- Two people editing the same content at once — last-write-wins, or a lock/warning?
- A walkthrough or letter references a specific person by name (an approver) who then changes role or leaves — does old content silently point to a stale approver? (Reference by *position*, not name, is likely safer.)
- What happens to in-flight drafts when the division restructures (sub-divisions renamed, merged, or a new one added)?

**Approval workflow**
- What happens when the designated approver is on leave or unavailable — is there a delegate/backup approver, or does everything stall?
- Should urgent letters (e.g. a time-sensitive QoS violation notice) have an expedited approval path, separate from routine content edits?

**Account & access management**
- Batch import collisions — an email in the list already has an account. Skip it, error out the whole batch, or update its role/division? Also: malformed emails and duplicate rows within the same batch file.
- Should login be restricted to `@nca.org.gh` addresses, or admin-invite-based regardless of domain? Some NSS personnel or contractors may not have an institutional email yet at the point they need an account.
- Does NCA already run staff email on Google Workspace or Microsoft 365? If so, SSO against that is very likely the right call (Section 12) over a bespoke password system — it also enforces "who's eligible for an account" almost for free.
- Lost or expired invite — how does an admin resend or regenerate an activation link for someone who never completed setup, or lost access to the invite email?
- NSS cohort timing — onboarding and offboarding happen on predictable annual dates. Should a batch deactivation be schedulable in advance (e.g. "deactivate this cohort on 31 July"), rather than relying on an admin to remember and act on the day?
- Sole-admin break-glass — if the only System Admin is unreachable or locked out, what's the recovery path? (See the "more than one admin" rule in Section 9 — this is the failure mode it's meant to prevent.)

**AI assistant**
- A question that legitimately spans two divisions (e.g. a station that's both monitored by BMC and licensed via a process another division handles) — does retrieval search across divisions, or only the asker's own?
- What should the assistant do with a question that's adversarial, off-topic, or a personal question unrelated to work — how far does the "onboarding assistant" persona hold under misuse?
- Rate limiting — what stops one person (accidentally or otherwise) from generating heavy API cost through repeated or scripted questions?
- Retrieval confidence threshold tuning — this needs real usage data to set correctly; starting too permissive risks confident-but-wrong answers, which is the costlier failure mode in a regulator.

**Shift roster & operations**
- What happens on a no-show or an uncovered shift — does the system escalate automatically, or is that still a human call?
- BMC's monitoring center may have unreliable internet at times — does the roster/checklist need an offline-capable or cached fallback for shift-critical moments?

**Security, privacy & compliance**
- Org chart data includes real staff names and positions — who can see this beyond "read-only for all staff," and is that appropriate for a government body?
- Data residency — does anything require data to stay on Ghana-based or government-approved infrastructure, given this is a regulator?
- Retention requirements — do chat logs, approval records, or content version history need to be kept (or purged) on a schedule for compliance reasons?

**Adoption**
- Staff may simply keep using the Excel sheet and word-of-mouth out of habit — what's the actual plan to get people to switch, beyond the tool existing?

## 19. Next Steps

1. Confirm content owners for Mobile, Broadcasting, and Satellite (who supplies their SOPs and templates).
2. Build and pilot Phase 1 (BMC shift roster) informally with BMC shift staff.
3. Use the Phase 1 pilot as the proof point to formally propose Phases 2–3 to Engineering department leadership.
4. Work through the open questions in Section 18 — particularly the approval-delegate and reference-by-position questions — before Phase 2 content modeling is finalized.
5. Decide the authentication and account-provisioning approach (Section 9) before Phase 1 starts — even the shift roster needs real, admin-provisioned logins to know who's actually on duty.
6. Revisit rollout beyond Engineering only after Phases 1–3 are proven internally.