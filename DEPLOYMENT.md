# Clausem Deployment

Target network: **GenLayer StudioNet (chain 61999)**.

## Verified build baseline

Before live deployment, canonical CI already passed:

- Python compilation
- preflight **16/16**
- GenVM lint / validation
- Direct Mode **17/17**
- frontend install
- frontend TypeScript
- frontend production build

Verified workflow run: `36279487572`.

Direct Mode compatibility is pinned in the repository to:
- `genlayer-test==0.29.2`
- `sdk_version="v0.2.16"`

These match the contract's pinned GenLayer runtime. Re-run locally before deployment, but do not upgrade the runner casually.

## Gate 1 — canonical StudioNet deployment

Deploy the exact current `contracts/clausem.py` from `main` using the authenticated GenLayer Studio/CLI environment.

Record:

- contract address;
- deployment tx hash;
- exact source commit SHA;
- source file SHA-256;
- finalized/success execution status.

Do not invent these values.

## Gate 2 — real-consensus lifecycle

Run at minimum:

1. one immutable pair that finalizes as `PARITY`;
2. one immutable pair with an obvious material difference that finalizes as `MATERIAL_DRIFT`;
3. correct `is_parity` true proof;
4. wrong-hash `is_parity` false proof;
5. re-evaluation revert;
6. successor registration with parent preserved.

Persist transaction hashes, pair IDs, pair/evaluation hashes and result payloads under `proof/` or `docs/`.

## Gate 3 — frontend wiring

Set:

```text
VITE_CONTRACT_ADDRESS=<canonical StudioNet address>
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

Then:

```bash
cd frontend
npm ci --no-audit --no-fund
npm run typecheck
npm run build
```

Deploy through the authenticated Vercel environment.

Verify in browser:

- an already-authorized injected wallet silently hydrates after reload;
- connected-wallet menu exposes Copy address, explorer and Disconnect;
- local Disconnect persists across reload until explicit Connect;
- wallet account/network changes reconcile correctly;
- StudioNet add/switch works;
- dashboard reads live counts;
- pair registration signs from the user's wallet;
- evaluation writes to the canonical address;
- pair/evaluation reads are live;
- explorer links use real address/transactions;
- no preview banner remains once the canonical address is configured.
