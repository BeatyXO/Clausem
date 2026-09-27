# Clausem — Submission

## Title

Clausem — Consensus-Backed Material Parity for Immutable Multilingual Policies

## Description

Clausem is a GenLayer application and reusable Intelligent Contract primitive for verifying whether two immutable language/version documents preserve the same material meaning. A creator binds two commit-pinned GitHub, IPFS, or Arweave sources and selects policy categories such as obligations, rights, fees, deadlines, termination, liability, privacy, eligibility, disputes and exceptions. GenLayer validators independently fetch the exact bytes, agree on both complete source hashes and a constrained per-category semantic vector, then deterministic contract logic records `PARITY`, `MATERIAL_DRIFT`, or `AMBIGUOUS`. Finalized pairs cannot be re-adjudicated; revised documents become successor pairs with new definition hashes, preserving downstream consumer bindings. A direct-to-GenLayer frontend supports registration, evaluation, proof inspection and version lineage without an authoritative backend.

## Repository

https://github.com/BeatyXO/Clausem

## Canonical StudioNet deployment

- Network: GenLayer StudioNet, chain ID `61999`.
- Contract: [0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888](https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888)
- Deployment transaction: [0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746](https://explorer-studio.genlayer.com/tx/0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746), finalized with successful execution and five validator agreements.
- Deployed source commit: `ed5820b2eed764eabf5c56a57db0d582e3e8582d`.
- Deployed contract source SHA-256: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`.

## Live proof

- Pair 1 finalized as `PARITY`; all three selected categories were `EQUIVALENT`. Correct `is_parity` hashes returned `true`; incorrect pair and evaluation hashes each returned `false`.
- Pair 4 finalized as `MATERIAL_DRIFT`; `TERMINATION` was `NARROWER_IN_B` because the compared text requires 90 days' notice where the reference requires 30 days.
- Re-evaluation of finalized pair 1 finalized with execution `ERROR`. Registering successor pair 5 preserved the parent hashes and the parent's `is_parity` binding.
- Two additional real attempts are recorded without treating them as successful proof: pair 2 finalized `AMBIGUOUS`; pair 3 finalized `UNDETERMINED` and remained registered.

See [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md) and its machine-readable companion [proof/STUDIONET_EVIDENCE.json](proof/STUDIONET_EVIDENCE.json) for IDs, hashes and transactions.

## Build verification

Canonical GitHub Actions run `36279487572` passed Python compilation, preflight **16/16**, GenVM lint/validation, Direct Mode **17/17**, frontend dependency install, TypeScript and production build. Local verification also passed compilation, preflight, Direct Mode, frontend install, typecheck and build. Local GenVM SDK validation could not load its pinned bundle from the Windows cache; historical CI validation passed.

## Frontend handoff

Set these Vercel Production variables before deployment:

```text
VITE_CONTRACT_ADDRESS=0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

The frontend has not yet been deployed to Vercel. Its production URL and manual injected-wallet verification are not claimed.
