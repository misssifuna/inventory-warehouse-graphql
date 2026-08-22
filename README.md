# Inventory Warehouse GraphQL — Meridian Pivot

## Overview

This project began as a warehouse inventory GraphQL service and was subsequently adapted for the **Meridian Pivot simulation**.

The pivot required replacing a synchronous badge-printing workflow with an asynchronous architecture for **Solstice Events Co.**, a multi-day technology conference.

The final implementation uses:

* Node.js
* TypeScript
* Apollo Server
* GraphQL
* An in-memory print queue
* A webhook server
* Asynchronous attendee check-in processing

---

## The Original Problem

The original client workflow was synchronous:

```text
Attendee scans QR code
        ↓
Kiosk calls badge printer REST API
        ↓
Kiosk waits for printer response
        ↓
Badge successfully printed
        ↓
Attendee shown as CHECKED_IN
```

The badge-printer vendor deprecated the synchronous API.

The application therefore had to be redesigned without waiting for an immediate printer response.

---

## The Meridian Pivot

The new architecture is asynchronous:

```text
Attendee scans QR code
        ↓
GraphQL checkIn mutation
        ↓
Validate attendee state
        ↓
Set status to PENDING
        ↓
Publish print request to queue
        ↓
Vendor processes badge
        ↓
Webhook callback
        ↓
Validate current attendee state
        ↓
PRINTED → CHECKED_IN
FAILED  → remain unconfirmed
```

The kiosk therefore no longer treats a successful button press as proof that the attendee is checked in.

`PENDING` means the request has been accepted but the badge has not yet been confirmed as printed.

---

## Duplicate Scan Protection

Duplicate protection is enforced before a print request is queued.

The important states are:

```text
PENDING
CHECKED_IN
```

If an attendee is already `CHECKED_IN`, another scan does not create another print request.

If an attendee is already `PENDING`, another scan does not create another print request.

This protects against duplicate scans while also handling asynchronous webhook delivery.

---

## Webhook Processing

The application exposes:

```text
POST /webhooks/print-completed
```

The webhook receives information including:

```json
{
  "jobId": "JOB-001",
  "attendeeId": "ATT-001",
  "status": "PRINTED"
}
```

A successful print confirmation changes the attendee from:

```text
PENDING
```

to:

```text
CHECKED_IN
```

A failed print does not incorrectly mark the attendee as checked in.

Late webhook events for attendees that have already reached `CHECKED_IN` are ignored.

---

## GraphQL API

### Check in an attendee

```graphql
mutation {
  checkIn(attendeeId: "ATT-001") {
    success
    message
    attendee {
      id
      name
      status
    }
  }
}
```

A newly accepted check-in returns:

```text
PENDING
```

rather than immediately returning:

```text
CHECKED_IN
```

### Retrieve an attendee

```graphql
query {
  attendee(id: "ATT-001") {
    id
    name
    email
    status
  }
}
```

---

## Test Evidence

The implementation was tested using multiple attendees and asynchronous webhook events.

### Test 1 — Normal asynchronous check-in

An attendee was scanned and the GraphQL mutation returned:

```text
success: true
message: Check-in accepted. Badge printing is pending.
status: PENDING
```

A subsequent successful webhook changed the attendee to:

```text
CHECKED_IN
```

### Test 2 — Duplicate scan

After the attendee reached `CHECKED_IN`, another scan returned:

```text
Attendee is already checked in.
```

No second badge was printed.

### Test 3 — Failed print

A webhook with:

```text
status: FAILED
```

returned:

```text
Badge printing failed.
```

The attendee was not incorrectly marked as checked in.

### Test 4 — Successful retry

A later successful webhook changed the attendee from `PENDING` to:

```text
CHECKED_IN
```

### Test 5 — Late webhook

A webhook arriving after an attendee had already been checked in was rejected with:

```text
Attendee is already checked in. Webhook ignored.
```

This demonstrates that asynchronous and out-of-order confirmations do not create duplicate check-ins.

---

## Project Structure

```text
inventory-warehouse/
│
├── server.ts
├── package.json
├── tsconfig.json
│
├── docs/
│   └── BLOCKER-JOURNAL.md
│
└── src/
    ├── data/
    │   ├── attendees.ts
    │   └── inventory.ts
    │
    ├── resolvers/
    │   └── checkIn.ts
    │
    ├── schema/
    │   └── typeDefs.ts
    │
    └── services/
        ├── checkInService.ts
        ├── inventoryCache.ts
        ├── inventoryPoller.ts
        ├── printQueue.ts
        ├── warehouseApi.ts
        ├── webhookServer.ts
        └── webhookService.ts
```

The original warehouse architecture was preserved rather than discarded. The Meridian Pivot was implemented as an extension of the existing service structure.

---

## Running the Project

Install dependencies:

```powershell
npm install
```

Compile TypeScript:

```powershell
npx.cmd tsc
```

Start the compiled server:

```powershell
node dist/server.js
```

The GraphQL server runs on:

```text
http://localhost:4000
```

The webhook server runs on:

```text
http://localhost:4001
```

---

## Git Development History

The implementation was developed incrementally.

### TypeScript architecture restored

```text
6543af1 refactor: restore TypeScript architecture
```

The project was restored from the temporary JavaScript implementation back to TypeScript after the environment blocker was resolved.

### Resolver architecture clarified

```text
c3a3544 refactor: rename inventory resolver to check-in resolver
```

The existing architecture was preserved while the resolver was renamed to reflect its new responsibility.

### Meridian Pivot implemented

```text
c886a96 feat: implement asynchronous badge printing workflow
```

The asynchronous check-in, print queue, webhook server, webhook processing, attendee state management and duplicate protection were implemented.

---

## Result

The final system satisfies the core Meridian Pivot requirements:

* Asynchronous badge printing
* Queue-based print requests
* Webhook-based completion confirmation
* `PENDING` state while printing is in progress
* `CHECKED_IN` only after successful confirmation
* Duplicate-scan protection
* Handling of failed print jobs
* Protection against late/out-of-order webhook events
* At least three attendee scenarios tested

The implementation demonstrates the transition from a synchronous integration to an event-driven asynchronous workflow while preserving the existing application architecture.


