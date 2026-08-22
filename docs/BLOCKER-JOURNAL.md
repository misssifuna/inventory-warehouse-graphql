# Blocker Journal

## Project

**Inventory Warehouse GraphQL — Meridian Pivot Simulation**

This journal records the technical blockers encountered during the development sprint, the decisions made in response to those blockers, and how the project architecture evolved as a result.

The objective is not only to record what went wrong, but also to document why particular engineering decisions were made.

---

# 1. Initial Environment Blocker — Windows Smart App Control

## Problem

The development environment initially encountered Windows security restrictions that interfered with the local development toolchain.

Windows **Smart App Control** was enabled on the machine.

The restriction became significant because development tools and their supporting executables needed to run locally in order to compile and execute the project.

The problem was not simply a missing package or incorrect command. The operating-system security layer was interfering with the execution of development tooling.

## Investigation

Before changing the security configuration, the available Windows Security settings were checked.

The environment showed:

* Smart App Control: **On**
* Tamper Protection: **Off**
* Automatic Sample Submission: **Off**
* Cloud-delivered Protection: **Off**
* Potentially unwanted app blocking: **Off**
* A Windows Defender quick scan was pending

The combination indicated that the machine was operating with several security controls disabled or modified while Smart App Control remained enabled.

## Decision

Smart App Control was eventually disabled because it had become a direct blocker to the local development workflow.

This was a deliberate development-environment decision rather than the first troubleshooting step.

The reason for the change was practical:

> The assignment required local compilation and execution of development tooling, and Smart App Control was preventing the required toolchain from operating reliably.

The change allowed development to continue.

---

# 2. esbuild / Native Tooling Blocker

## Problem

After addressing the operating-system restriction, the project encountered another blocker involving the JavaScript/TypeScript build toolchain and `esbuild`.

The issue was related to native tooling required by the development environment.

This created a situation where the intended TypeScript workflow could not be relied upon consistently enough to continue the sprint at the required pace.

The blocker was particularly important because the project had a time-bound simulation and the objective was to produce a working implementation rather than spend the entire sprint troubleshooting the local build environment.

## Decision

Rather than allowing the environment blocker to stop development completely, we evaluated a fallback.

The immediate priority became:

1. Keep the application running.
2. Continue implementing the warehouse service.
3. Preserve the architecture as much as possible.
4. Return to TypeScript when the environment permitted it.

---

# 3. Temporary JavaScript Fallback

## Decision

The project was temporarily moved from TypeScript to JavaScript.

This was a tactical workaround rather than a change in the intended architecture.

The purpose was to remove the TypeScript/build-tooling dependency from the critical development path while continuing to implement the required functionality.

The initial warehouse GraphQL service was therefore implemented and tested using JavaScript.

The application successfully exposed the GraphQL API and supported the initial inventory queries.

The project was then organized into separate areas for:

```text
src/
├── data/
├── resolvers/
└── schema/
```

This separation was deliberately preserved even during the JavaScript fallback.

---

# 4. Warehouse Service Architecture

Once the immediate blocker was bypassed, development continued around the warehouse inventory use case.

The architecture evolved to include:

```text
GraphQL API
    ↓
Resolvers
    ↓
Warehouse service
    ↓
Inventory cache
    ↓
Inventory polling
```

This provided a foundation for working with changing external data rather than treating the original hard-coded inventory array as the final architecture.

The work was committed incrementally to Git.

Important commits included:

```text
829d969 feat: add inventory cache
9fbe157 feat: add inventory polling
5492dd3 feat: expose inventory cache status
```

The repository therefore retained a visible progression of the work.

---

# 5. Returning to TypeScript

## Reason for returning

Once the environment was sufficiently stable, we reconsidered the temporary JavaScript fallback.

JavaScript had served its purpose as a workaround, but it was not the preferred final architecture.

The project had originally been intended to use TypeScript, and continuing with JavaScript would have meant allowing a temporary blocker workaround to permanently determine the project's architecture.

We therefore restored TypeScript.

The migration included:

* Installing TypeScript.
* Installing Node.js type definitions.
* Creating `tsconfig.json`.
* Converting the application entry point to `server.ts`.
* Converting the inventory data to TypeScript.
* Converting the GraphQL schema to TypeScript.
* Converting the resolver to TypeScript.
* Removing obsolete JavaScript source files.

The compiler was then run successfully with:

```powershell
npx.cmd tsc
```

The resulting compiled application successfully executed.

This was recorded in Git as:

```text
6543af1 refactor: restore TypeScript architecture
```

The important lesson from this stage was that the temporary JavaScript solution was treated as a **reversible tactical decision**, not an architectural commitment.

---

# 6. Meridian Pivot

## Client Change

The original simulation involved a warehouse/inventory GraphQL service.

The client then introduced the Meridian Pivot:

**Solstice Events Co.** required an event check-in kiosk service.

The original workflow was synchronous:

```text
QR scan
  ↓
Call badge printer
  ↓
Wait for response
  ↓
Print succeeds
  ↓
Show CHECKED_IN
```

The printer vendor was deprecating the synchronous API.

The new requirement was asynchronous:

```text
QR scan
  ↓
Accept check-in request
  ↓
PENDING
  ↓
Publish print request
  ↓
Vendor processes print job
  ↓
Webhook callback
  ↓
Confirm print
  ↓
CHECKED_IN
```

The application therefore needed to be redesigned around asynchronous state transitions.

---

# 7. Preserving the Existing Architecture

Rather than creating an unrelated application or throwing away the warehouse work, the existing project structure was retained.

The resolver was renamed:

```text
src/resolvers/inventory.ts
        ↓
src/resolvers/checkIn.ts
```

The rename reflected the resolver's new responsibility while maintaining the existing separation between:

* schema
* data
* resolvers
* services

This was recorded as:

```text
c3a3544 refactor: rename inventory resolver to check-in resolver
```

The decision demonstrated that the previous work could serve as a foundation for the pivot rather than becoming disposable code.

---

# 8. Asynchronous Badge Printing Implementation

The pivot introduced several services:

```text
src/
├── data/
│   └── attendees.ts
│
├── resolvers/
│   └── checkIn.ts
│
├── schema/
│   └── typeDefs.ts
│
└── services/
    ├── checkInService.ts
    ├── printQueue.ts
    ├── webhookServer.ts
    └── webhookService.ts
```

The GraphQL `checkIn` mutation no longer treats the initial request as proof of successful printing.

Instead, it returns:

```text
PENDING
```

The print queue represents the asynchronous handoff to the badge printer.

The webhook endpoint receives the eventual completion event.

A successful print confirmation transitions the attendee to:

```text
CHECKED_IN
```

A failed print does not incorrectly mark the attendee as checked in.

---

# 9. Duplicate and Out-of-Order Event Protection

The pivot introduced an additional state-management problem.

Webhook events may arrive later than the original scan and may not necessarily arrive in the order expected by the kiosk.

The implementation therefore checks the attendee's current state before applying a webhook.

Examples tested included:

### Already checked in

A duplicate scan returned:

```text
Attendee is already checked in.
```

No second print request was created.

### Already pending

A second scan while a print was pending returned:

```text
Badge printing is already pending.
```

### Late webhook

A webhook arriving after an attendee had already been checked in returned:

```text
Attendee is already checked in. Webhook ignored.
```

This prevented a late asynchronous event from corrupting the attendee's state.

---

# 10. Test Evidence

The final workflow was tested using multiple attendees.

## Attendee 1 — Alice Kamau

Initial check-in:

```text
PENDING
```

Failed print webhook:

```text
FAILED
```

The attendee was not incorrectly marked as checked in.

Successful print webhook:

```text
PRINTED
```

Final state:

```text
CHECKED_IN
```

## Attendee 2 — Brian Otieno

Initial check-in returned:

```text
Check-in accepted. Badge printing is pending.
```

Final state initially remained:

```text
PENDING
```

This demonstrated that the GraphQL mutation does not falsely report immediate success.

## Attendee 3 — Carol Wanjiku

Initial check-in:

```text
PENDING
```

Successful webhook:

```text
PRINTED
```

Final state:

```text
CHECKED_IN
```

Duplicate scan:

```text
Attendee is already checked in.
```

Late webhook:

```text
Attendee is already checked in. Webhook ignored.
```

These tests demonstrated the core requirements of the pivot.

---

# 11. Final Git History

The feature branch contains a visible progression:

```text
6543af1 refactor: restore TypeScript architecture
c3a3544 refactor: rename inventory resolver to check-in resolver
c886a96 feat: implement asynchronous badge printing workflow
```

The earlier warehouse development remains visible on the preceding branch:

```text
829d969 feat: add inventory cache
9fbe157 feat: add inventory polling
5492dd3 feat: expose inventory cache status
```

This history documents the evolution from the original warehouse service through the environmental blockers and finally into the Meridian Pivot.

---

# 12. Key Engineering Lessons

### 1. A blocker does not have to stop the entire project

When the intended TypeScript toolchain became unreliable, JavaScript provided a temporary route forward.

### 2. A workaround should remain reversible

The JavaScript implementation was deliberately treated as temporary.

Once the environment stabilized, the project returned to TypeScript.

### 3. Preserve useful architecture during a pivot

The existing separation between data, schema, resolvers and services made it possible to adapt the project rather than rebuild it from scratch.

### 4. Asynchronous systems require explicit state management

The distinction between:

```text
PENDING
CHECKED_IN
```

became essential once the printer no longer returned an immediate result.

### 5. Duplicate protection must happen at the state-management layer

A UI-level duplicate check is not sufficient.

The service must reject duplicate requests based on the attendee's current state.

### 6. Webhooks must be treated as asynchronous events

A webhook can arrive late or after the state has already changed.

The application therefore validates the current state before applying the event.

---

# Final Status

The major environment blockers were overcome.

The project was temporarily adapted to JavaScript to maintain development progress, then successfully restored to TypeScript.

The original warehouse architecture was preserved and extended into the Meridian Pivot.

The final implementation successfully demonstrates:

* asynchronous check-in
* print queueing
* webhook confirmation
* pending state
* successful completion state
* failed print handling
* duplicate-scan protection
* late webhook protection

The implementation was compiled successfully, tested locally, committed to Git, and pushed to the `feature/meridian-pivot` branch.


