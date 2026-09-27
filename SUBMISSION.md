# Clausem — Submission

## Title

Clausem — Consensus-Backed Material Parity for Immutable Multilingual Policies

## Description

Clausem is a GenLayer application and reusable Intelligent Contract primitive for verifying whether two immutable language/version documents preserve the same material meaning. A creator binds two commit-pinned GitHub, IPFS, or Arweave sources and selects policy categories such as obligations, rights, fees, deadlines, termination, liability, privacy, eligibility, disputes and exceptions. GenLayer validators independently fetch the exact bytes, agree on both complete source hashes and a constrained per-category semantic vector, then deterministic contract logic records `PARITY`, `MATERIAL_DRIFT`, or `AMBIGUOUS`. Finalized pairs cannot be re-adjudicated; revised documents become successor pairs with new definition hashes, preserving downstream consumer bindings. A direct-to-GenLayer frontend supports registration, evaluation, proof inspection and version lineage without an authoritative backend.

## Links

- Repository: https://github.com/BeatyXO/Clausem
- Production frontend: https://clausem.vercel.app/
- StudioNet contract: https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888

## Canonical StudioNet deployment

- Network: GenLayer StudioNet, chain ID `61999`.
- Contract: `0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`.
- Deployment transaction: `0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746`, finalized with successful execution and five validator agreements.
- Deployed source commit: `ed5820b2eed764eabf5c56a57db0d582e3e8582d`.
- Deployed contract source SHA-256: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`.

## Live proof

- Pair 1 finalized as `PARITY`; all three selected categories were `EQUIVALENT`. Correct `is_parity` hashes returned `true`; incorrect pair and evaluation hashes each returned `false`.
- Pair 4 finalized as `MATERIAL_DRIFT`; `TERMINATION` was `NARROWER_IN_B` because the compared text requires 90 days' notice where the reference requires 30 days.
- Re-evaluation of finalized pair 1 finalized with execution `ERROR`.
- Successor pair 5 preserved the parent pair hash, evaluation hash and consumer binding.
- Pair 2's real `AMBIGUOUS` result and pair 3's `UNDETERMINED` attempt are retained transparently rather than being hidden.

See [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md) and [proof/STUDIONET_EVIDENCE.json](proof/STUDIONET_EVIDENCE.json).

## Build verification

GitHub Actions run [36337680057](https://github.com/BeatyXO/Clausem/actions/runs/36337680057) passed against commit `f5134df0ea63ec46a9db09fe69847708ada890d6`:

- Python compilation;
- preflight **16/16**;
- GenVM lint/validation;
- Direct Mode **17/17**;
- frontend dependency install;
- TypeScript typecheck;
- production build.

## Bounded-instance limits

The canonical deployment rejects source documents above 240 KB or 18,000 decoded characters rather than silently truncating them. The deployed registry also has a global `MAX_PAIRS = 1024` bound. Because registration is permissionless, registry-slot exhaustion is a known availability limitation of this bounded StudioNet instance; it does not permit mutation or forgery of existing finalized records.
