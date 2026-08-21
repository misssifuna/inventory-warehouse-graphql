# Blocker Journal — GraphQL Solo Recon

**Project:** Northstar Retail Co. — Inventory Sync Service  
**Sprint:** The Meridian Pivot  
**Assignment:** Assignment 1 — Solo Recon  
**Tool:** GraphQL  
**Learner:** Ebenezer Sifuna  
**Date:** 21 August 2026

---

## Purpose

This journal records the actual learning process during the Day 1–2 solo reconnaissance phase.

The purpose is not to present a clean development history. It records errors, dead ends, troubleshooting decisions, and what was learned from them.

The sprint requires the unfamiliar tool to be genuinely new and requires the learner to work independently during the solo phase.

---

# Blocker 1 — Windows blocked Python installation

### Time

20 August 2026

### Task

Install Python for the development environment.

### Initial symptom

The Python installation failed with:

```text
PythonBA.dll is either not designed to run on Windows or it contains an error.

Error status 0xc0e90002

Installer failed with exit code: 2147946951

### Investigation

The Windows Installer log initially showed:

Error 0x800711c7: Failed to load UX DLL.
Error 0x800711c7: Failed to load UX.
Error 0x800711c7: Failed while running
Error 0x800711c7: Failed to run per-user mode.

The TEMP directory permissions were then checked.
Windows Code Integrity logs showed Smart App Control blocking temporary installer DLLs.

### Further investigation

Windows Code Integrity logs showed Smart App Control blocking temporary installer DLLs.

Relevant events included:
Smart App Control Block Details
Code Integrity determined that a process attempted to load
PythonBA.dll that did not meet the Enterprise signing level requirements
or violated code integrity policy.

### Resolution

Instead of disabling Windows security permanently or bypassing the installer, the Python installation was changed to use the Python installation manager.

Python was successfully installed.

pip is available through:

python -m pip --version

# Blocker 2 — Node.js MSI installation failed

### Time

21 August 2026

### Task

Install Node.js for the GraphQL prototype.

### Initial symptom

The Node.js LTS installation through winget failed:

Installer failed with exit code: 1603

The Windows Installer log showed:

Error 1723. There is a problem with this Windows Installer package.
A DLL required for this install to complete could not be run.

The failing action was:
SetInstallScope

### Investigation

The Windows Code Integrity log showed:
Smart App Control Block Details
Code Integrity determined that a process
(msiexec.exe) attempted to load
C:\Windows\Installer\MSIBF81.tmp
that did not meet the Enterprise signing level requirements
or violated code integrity policy.

### Decision

The Node.js MSI installer was not bypassed.

Instead, the official Node.js Windows binary ZIP distribution was used.

### Resolution
The Node.js ZIP package was downloaded:
Node.js was therefore successfully installed without disabling Smart App Control.

### Learning

The MSI installer and the Node.js runtime are separate concerns.

Windows was blocking the installer custom action, not the Node.js executable itself.

Using the official binary distribution allowed the development environment to be established while keeping Smart App Control enabled.

### Time

21 August 2026

### Task

Verify npm after installing Node.js.

### Initial symptom
PowerShell was attempting to execute npm.ps1, which was blocked by the current PowerShell execution policy.

### Resolution

The PowerShell execution policy was not changed.

Instead, the Windows command version was executed explicitly:

### Learning

A command can exist on the system while still being blocked by a shell-specific execution policy.

Using npm.cmd allows npm to be used without weakening the PowerShell execution policy.

# Blocker 4 — TypeScript / tsx installation failed
### Time

21 August 2026

### Task

Install TypeScript development tooling:

typescript
tsx
@types/node
Initial command
npm.cmd install -D typescript tsx @types/node
Error

The installation failed while installing esbuild.

### Relevant error:

The failing command involved:

node install.js

and the esbuild binary:

@esbuild\win32-x64\esbuild.exe
Investigation

Node.js itself was working correctly:

Node.js v24.19.0

Apollo Server and GraphQL had already installed successfully.

The failure occurred specifically when the native esbuild.exe executable was being launched.

### Decision

The project was not modified to bypass Windows security controls.

Because the purpose of the Day 1–2 assignment is to learn GraphQL, TypeScript and tsx were not considered essential to the initial GraphQL prototype.

### Resolution

The prototype was simplified to plain JavaScript using Node.js, Apollo Server and GraphQL.

This allowed the unfamiliar GraphQL tool to be explored without spending the entire reconnaissance period troubleshooting an unrelated native build tool.

### Learning

Modern npm packages may contain native platform-specific executables.

A dependency installation can therefore fail even when Node.js and npm themselves are working correctly.

The blocker also demonstrated the importance of distinguishing:

the tool being assessed,
development tooling,
operating-system security,
and native package dependencies.

# GraphQL Prototype Milestone
### Date

21 August 2026

### Objective

Build a minimal GraphQL prototype capable of exposing warehouse inventory information through a query endpoint.

Technology
Node.js 24.19.0
Apollo Server 5.5.1
GraphQL 16.14.2
JavaScript
Prototype capabilities

The prototype exposes:

products

and:

product(sku: ID!)
Example query
query {
  products {
    sku
    name
    quantity
    inStock
  }
}
Individual product query
query {
  product(sku: "SKU-001") {
    sku
    name
    quantity
    inStock
  }
}
Result

The GraphQL queries successfully executed through Apollo Server.

This established the core GraphQL query layer required by the inventory synchronization scenario.

Current Status
Python installation       COMPLETE
Node.js installation      COMPLETE
npm installation          COMPLETE
GraphQL dependencies      COMPLETE
Apollo Server              COMPLETE
GraphQL prototype          WORKING
TypeScript tooling         BLOCKED
Smart App Control          REMAINS ENABLED
Reflection

The most important learning from the reconnaissance phase was that technical troubleshooting is often a process of narrowing down the actual cause rather than repeatedly applying generic fixes.

Several initial hypotheses were tested and rejected.

The final approach avoided disabling Windows security features unnecessarily and allowed the GraphQL prototype to be completed using the tools that were actually required for the learning objective.

The prototype now provides a foundation for the Day 3 warehouse polling architecture and the later Day 4 webhook pivot.