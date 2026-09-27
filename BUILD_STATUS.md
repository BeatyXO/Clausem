# Clausem Build and Deployment Status

## Historical CI baseline

Canonical repository: https://github.com/BeatyXO/Clausem

GitHub Actions run `36279487572` passed on the wallet-polished source:

- Python compilation: **PASS**
- Repository preflight: **16/16 PASS**
- GenVM lint / validation: **PASS**
- GenLayer Direct Mode: **17/17 PASS**
- Frontend dependency install: **PASS**
- TypeScript typecheck: **PASS**
- Vite production build: **PASS**

Direct Mode stays pinned to `genlayer-test==0.29.2` and GenVM bundle `v0.2.16`, matching the contract's pinned runtime.

## Current local verification

- Python compilation: **PASS**
- Repository preflight: **16/16 PASS**
- Direct Mode: **17/17 PASS**
- Frontend `npm ci`: **PASS**
- Frontend TypeScript typecheck: **PASS**
- Frontend production build: **PASS** (Vite reports the existing large-chunk advisory)
- Production build embeds canonical contract address from `frontend/.env.production`; the preview configuration is not used by the build.
- GenVM lint checks: **3/3 PASS**
- GenVM SDK validation: **BLOCKED by local cache** — this Windows environment could not load the pinned SDK archive `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`. Historical CI validation remains green.

## StudioNet deployment and live lifecycle evidence

The exact deployed `contracts/clausem.py` matches canonical source commit `ed5820b2eed764eabf5c56a57db0d582e3e8582d`.

- Contract: [0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888](https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888)
- Deployment transaction: [0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746](https://explorer-studio.genlayer.com/tx/0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746) — finalized, execution success, five validator agreements.
- Deployed source SHA-256: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`.
- Pair 1 finalized as `PARITY`; evaluation hash `d245ef6d782bae2eee1f52c67731b7afd5373975140b2b8f43b2aeeef1cf8139`. Correct `is_parity` hashes return true; either wrong expected hash returns false.
- Pair 4 finalized as `MATERIAL_DRIFT`; `TERMINATION = NARROWER_IN_B`; evaluation hash `6b7070531c0d524f51d9c0d6b5d7399bce503c7f25395536f4303d76a1f7c111`.
- Re-evaluation of pair 1 finalized with leader execution `ERROR`; the pair and evaluation stayed unchanged.
- Successor pair 5 references pair 1, has a new pair hash, and leaves the parent's finalized hashes and consumer binding unchanged.
- Two other attempts are recorded transparently: pair 2 resolved to `AMBIGUOUS`; pair 3 evaluation resolved `UNDETERMINED` and remained registered.

Complete transaction IDs, source hashes, statuses and category vectors are in [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md) and [proof/STUDIONET_EVIDENCE.json](proof/STUDIONET_EVIDENCE.json).

## Frontend handoff

The repository's `frontend/.env.production` already wires the canonical contract into the build. Set the same values in Vercel's Production environment as deployment configuration:

```text
VITE_CONTRACT_ADDRESS=0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

Vercel production deployment and manual injected-wallet/browser verification are still pending. The production URL is not recorded until the user deploys the frontend.
