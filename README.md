# Northstar Inventory Warehouse — GraphQL Prototype

## The Meridian Pivot

A 1-week industry working simulation for Northstar Retail Co.

The client requires a live inventory synchronization service so that the support tool can provide accurate answers to:

> "Is this item in stock?"

This repository documents the development of the inventory synchronization service, beginning with the Day 1–2 solo reconnaissance phase.

---

## Sprint Context

The original specification is:

1. Poll a warehouse API every 5 minutes.
2. Cache inventory information.
3. Expose a query endpoint for the support system.

On Day 4, the client introduces a non-negotiable change:

> The polling method is being killed in 48 hours.

The system must therefore be refactored to use a webhook push model instead.

### Original architecture

```text
Warehouse API
     |
     | Poll every 5 minutes
     v
Inventory Sync Service
     |
     v
Inventory Cache
     |
     v
GraphQL Query Endpoint
     |
     v
Support Tool

#Post Pivot Architecture

Warehouse
     |
     | Webhook
     v
Webhook Endpoint
     |
     v
Inventory Cache
     |
     v
GraphQL Query Endpoint
     |
     v
Support Tool

The GraphQL query layer is intended to remain stable while the inventory ingestion mechanism changes.

Day 1–2 — Solo Reconnaissance
Unfamiliar Tool

GraphQL

The objective of the solo phase is to independently learn enough GraphQL to build a functional mini-prototype.

Current Prototype

The current prototype uses:

Node.js
Apollo Server
GraphQL
JavaScript

Current versions:

Node.js      24.19.0
Apollo Server 5.5.1
GraphQL      16.14.2
Current GraphQL Capabilities

The prototype currently exposes two queries:

List products
query {
  products {
    sku
    name
    quantity
    inStock
  }
}
Find a product by SKU
query {
  product(sku: "SKU-001") {
    sku
    name
    quantity
    inStock
  }
}

The prototype uses temporary in-memory inventory data.

This data will eventually be replaced by the inventory cache populated by the warehouse synchronization mechanism.

Development Blockers

The development environment encountered several genuine Windows-related blockers.

Python

The original Python installer was blocked by Windows Code Integrity / Smart App Control.

Python was subsequently installed successfully using the Python installation manager.

Node.js

The Node.js MSI installer failed because Windows Code Integrity blocked an installer DLL.

The official Node.js Windows binary distribution was used instead.

Smart App Control remains enabled.

npm

PowerShell blocked npm.ps1 because script execution is restricted.

The project therefore uses:

npm.cmd

without changing the PowerShell execution policy.

TypeScript / tsx

The TypeScript tooling installation encountered an esbuild.exe execution failure.

The Day 1–2 prototype therefore uses JavaScript rather than introducing an unrelated native tooling blocker.

Detailed troubleshooting is documented in:

docs/BLOCKER-JOURNAL.md
Repository Development Plan
Day 1–2
Solo Recon
Learn GraphQL independently.
Build a functional GraphQL prototype.
Document blockers and troubleshooting.
Record time-boxed learning progress.
Day 3
Original Build
Connect to a warehouse API.
Poll every 5 minutes.
Update the inventory cache.
Expose stock information through GraphQL.
Day 4
The Pivot

Polling is discontinued.

The architecture must change to:

Warehouse
    |
    v
Webhook
    |
    v
Inventory Cache
    |
    v
GraphQL
Day 5
Refactor & Review
Remove obsolete polling code.
Implement webhook ingestion.
Verify GraphQL queries still return accurate inventory.
Perform regression checks.
Document the scope delta.
Record architectural trade-offs.
Assignment Evidence

The repository is intended to preserve the development history rather than only the final working state.

Evidence includes:

Git commits
GraphQL prototype
Blocker Journal
README
Day 3 implementation
Day 4 pivot
Day 5 refactor
Scope Delta Analysis
Learning Principle

The purpose of this project is not simply to produce working software.

The sprint evaluates:

Functional correctness
Troubleshooting autonomy
Documentation
Time-to-completion
Adaptation to changing requirements
Architectural integrity
Trade-off documentation
Adaptability under pressure

The repository therefore intentionally records problems encountered during development rather than hiding them.