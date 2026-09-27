# Clausem Build and Deployment Status

Clausem is deployed, live and submission-ready.

- Repository: https://github.com/BeatyXO/Clausem
- Production frontend: https://clausem.vercel.app/
- Canonical StudioNet contract: [0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888](https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888)
- Deployment transaction: [0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746](https://explorer-studio.genlayer.com/tx/0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746)

## Verified code baseline

GitHub Actions run [36337680057](https://github.com/BeatyXO/Clausem/actions/runs/36337680057) passed against commit `f5134df0ea63ec46a9db09fe69847708ada890d6` after the final frontend source-limit notice was added.

- Python compilation: **PASS**
- Repository preflight: **16/16 PASS**
- GenVM lint / validation: **PASS**
- GenLayer Direct Mode: **17/17 PASS**
- Frontend dependency install: **PASS**
- TypeScript typecheck: **PASS**
- Vite production build: **PASS**

Direct Mode remains intentionally pinned to `genlayer-test==0.29.2` with GenVM bundle `v0.2.16`, matching the contract's pinned runtime.

## Canonical deployed source

The deployed contract remains the exact `contracts/clausem.py` from source commit `ed5820b2eed764eabf5c56a57db0d582e3e8582d`.

- Source SHA-256: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`
- Deployment status: `FINALIZED`
- Leader execution: `SUCCESS`
- Validator agreement: five of five

Later repository commits only added proof fixtures, deployment evidence, frontend production wiring, source-limit UX, and documentation. The deployed contract source was not changed.

## Live lifecycle evidence

- Pair 1 finalized as `PARITY`; correct pair/evaluation hashes return `true`, while wrong expected hashes return `false`.
- Pair 4 finalized as `MATERIAL_DRIFT` with `TERMINATION = NARROWER_IN_B`.
- Re-evaluation of finalized pair 1 finalized with execution `ERROR`; its state and evaluation hash stayed unchanged.
- Successor pair 5 references pair 1, has a new pair hash, and does not invalidate the parent consumer binding.
- Pair 2 is retained as a real `AMBIGUOUS` result.
- Pair 3 is retained as a real `UNDETERMINED` evaluation attempt rather than being misrepresented as successful proof.

Full evidence is in [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md) and [proof/STUDIONET_EVIDENCE.json](proof/STUDIONET_EVIDENCE.json).

## Production frontend

The production frontend is deployed at:

https://clausem.vercel.app/

The repository production config points to the canonical StudioNet contract and explorer. Injected-wallet recovery, wallet menu, copy-address, explorer, disconnect persistence, explicit reconnect, account/network reconciliation and StudioNet switching are implemented in source and covered by the green production build.

Browser-only injected-wallet interaction is an operator smoke test and is not something GitHub CI can mechanically attest.

## Known bounded-instance limits

The current deployed instance deliberately remains unchanged so its contract address and live proof stay canonical.

- Each fetched source must be at most **240,000 bytes**.
- Each decoded source must be at most **18,000 characters**.
- Oversized sources are rejected rather than silently truncated.
- The global registry has `MAX_PAIRS = 1024`.
- Registration is permissionless, so a determined actor could consume remaining registry slots and block new registrations on this deployment.

Registry exhaustion is an availability limitation, not a way to rewrite or forge existing finalized records. A future production-scale deployment should remove/raise the global cap or add an anti-spam/quota/economic admission mechanism.
