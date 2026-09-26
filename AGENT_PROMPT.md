# Clausem — Deployment / Live-Proof Handoff

You are taking over an already-built and CI-verified GenLayer project named **Clausem**.

Repository:
https://github.com/BeatyXO/Clausem.git

Do not redesign the product, replace the frontend, introduce a backend, or return only a plan/checklist. Inspect the current `main` branch, preserve the existing architecture, then complete the remaining **environment-dependent deployment and live-proof work** in place and push the final evidence/docs to `main`.

## Already completed — do not redo as speculative rewrites

The canonical repository already has:

- production contract `contracts/clausem.py`;
- typed consumer example;
- immutable commit-pinned GitHub/IPFS/Arweave source validation;
- exact source hash + source-size validator binding;
- constrained category semantic vector;
- deterministic `PARITY / MATERIAL_DRIFT / AMBIGUOUS`;
- single-shot evaluation and successor lineage;
- React/Vite direct-to-GenLayer frontend;
- purple multi-shade styling + Comic Sans;
- injected wallet StudioNet add/switch;
- silent wallet hydration after reload;
- account/network/disconnect reconciliation;
- connected-wallet dropdown with Copy address, explorer and Disconnect;
- local disconnect persistence;
- permanent GitHub quality workflow.

Verified GitHub Actions run: `36279487572`

That run passed:
- Python compilation;
- preflight 16/16;
- GenVM lint;
- Direct Mode 17/17;
- frontend install;
- frontend TypeScript;
- frontend production build.

Direct Mode is pinned to `genlayer-test==0.29.2` with `sdk_version="v0.2.16"`, matching the contract's pinned runtime. Do not casually upgrade the runner just because a newer one exists.

## Product boundary

Clausem verifies whether two immutable language/version policy documents preserve the same material meaning. It is not a grant, escrow, milestone, reward, bounty, challenge-bond or token protocol.

Do not add grants, funder/grantee roles, payouts, tranches, token custody, challenge bonds or generic AI-judge features.

## Invariants that must remain intact

1. Accepted sources stay immutable forms only.
2. Leader/validator consensus stays bound to exact source hashes, source sizes and category-status vector.
3. No leader-only field may influence persisted outcome.
4. Malformed semantic output fails closed to AMBIGUOUS.
5. Overall result remains deterministic.
6. Evaluation remains single-shot.
7. Successor creation never mutates/invalidate the parent.
8. `is_parity` requires both expected pair hash and expected evaluation hash.
9. Never fabricate deployment evidence.

## Your remaining work

### 1. Confirm exact source before deployment

Pull current `main`.

Run a quick confirmation:
```bash
python -m py_compile contracts/clausem.py contracts/clausem_consumer.py tests/test_clausem.py tests/conftest.py
python scripts/preflight.py
pip install -r requirements-test.txt
genvm-lint check contracts/clausem.py
pytest -q
cd frontend
npm ci --no-audit --no-fund
npm run typecheck
npm run build
```

If these differ from the already-green CI, diagnose the environment before changing architecture.

### 2. Canonical StudioNet deployment

Deploy the exact current `contracts/clausem.py` to GenLayer StudioNet (chain 61999) using the authenticated wallet/CLI available to you.

Record real evidence:
- contract address;
- deployment tx;
- finalized/execution status;
- exact deployed source commit SHA;
- SHA-256 of deployed `contracts/clausem.py`.

Do not proceed with invented placeholders.

### 3. Real multi-validator reviewer proof

Use immutable public source documents accessible to StudioNet validators.

Create and finalize at least:

**A. PARITY pair**
- register pair;
- evaluate;
- read pair/evaluation;
- record pair ID, pair hash, evaluation hash and tx hashes;
- show `is_parity(correct hashes) == true`;
- show a wrong expected pair/evaluation hash returns false.

**B. MATERIAL_DRIFT pair**
- use a second immutable pair with one obvious material difference;
- evaluate;
- record the relevant category state and overall `MATERIAL_DRIFT`;
- retain transaction evidence.

**C. Finality/version lineage**
- prove re-evaluating the finalized pair reverts;
- register a successor;
- prove the parent remains unchanged/final;
- prove the successor has a new pair hash and correct parent pointer.

Persist concise machine-readable evidence under `proof/` or `docs/`.

### 4. Production frontend

Set:
```text
VITE_CONTRACT_ADDRESS=<canonical StudioNet contract>
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

Build fresh and deploy to Vercel using the authenticated project/account available to you.

Manually verify in browser:
- existing authorized injected wallet hydrates after reload without a fresh connect prompt;
- clicking the connected wallet opens Copy address / View on explorer / Disconnect;
- Disconnect clears Clausem session and stays disconnected after reload until Connect is explicitly clicked;
- account/network changes reconcile cleanly;
- StudioNet switching works;
- live counts load;
- register/evaluate/read works against canonical address;
- transaction pending vs finalized state is accurate;
- explorer links point to real address/transactions;
- preview-mode warning is absent in production.

### 5. Final evidence/docs

Update `BUILD_STATUS.md`, `DEPLOYMENT.md`, `SUBMISSION.md` and `proof/VERIFICATION_CHECKLIST.md` with real values only.

Push all completed work to `main`.

## Final response

Report:
1. final Git commit SHA;
2. contract address + explorer link;
3. deployment tx;
4. source SHA-256;
5. real PARITY and MATERIAL_DRIFT pair IDs/hashes/txs;
6. finality/successor proof;
7. Vercel URL;
8. final CI/test results;
9. any genuinely unresolved blocker.

Do not claim a live result unless you actually observed it.
