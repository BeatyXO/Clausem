# Clausem — Submission Draft

## Title

Clausem — Consensus-Backed Material Parity for Immutable Multilingual Policies

## Description

Clausem is a GenLayer application and reusable Intelligent Contract primitive for verifying whether two immutable language/version documents preserve the same material meaning. A creator binds two commit-pinned GitHub, IPFS, or Arweave sources and selects policy categories such as obligations, rights, fees, deadlines, termination, liability, privacy, eligibility, disputes and exceptions. GenLayer validators independently fetch the exact bytes, agree on both complete source hashes and a constrained per-category semantic vector, then deterministic contract logic records `PARITY`, `MATERIAL_DRIFT`, or `AMBIGUOUS`. Finalized pairs cannot be re-adjudicated; revised documents become successor pairs with new definition hashes, preserving downstream consumer bindings. A direct-to-GenLayer frontend supports registration, evaluation, proof inspection and version lineage without an authoritative backend.

## Repository

https://github.com/BeatyXO/Clausem

## Canonical deployment

Contract address: **PENDING REAL STUDIONET DEPLOYMENT**

Explorer: **PENDING REAL STUDIONET DEPLOYMENT**

Frontend: **PENDING PRODUCTION DEPLOYMENT**


## Build verification

Canonical GitHub Actions run `36279487572` passed Python compilation, preflight **16/16**, GenVM lint, Direct Mode **17/17**, frontend dependency install, TypeScript and production build.

The remaining PENDING fields below require a real authenticated StudioNet/Vercel deployment and must not be replaced with guessed values.
