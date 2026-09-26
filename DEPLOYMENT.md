# Clausem Deployment

Target network: **GenLayer StudioNet (chain 61999)**.

## Gate 1 — local/static

```bash
python -m py_compile contracts/clausem.py contracts/clausem_consumer.py
python scripts/preflight.py
```

## Gate 2 — GenLayer Direct Mode

Use the repository's pinned GenLayer runner/tooling and run:

```bash
pip install -r requirements-test.txt
pytest -q
```

Do not proceed to canonical deployment if Direct Mode exposes a real runtime incompatibility.

## Gate 3 — deploy contract

Deploy `contracts/clausem.py` to StudioNet using the authenticated GenLayer Studio/CLI environment.

Record:

- contract address;
- deployment tx hash;
- final source commit SHA;
- source file SHA-256;
- finalized/success execution status.

Do not invent these values in documentation before they exist.

## Gate 4 — real-consensus lifecycle

Run at minimum:

1. registration of an immutable pair;
2. one `PARITY` evaluation;
3. one `MATERIAL_DRIFT` evaluation;
4. wrong-hash `is_parity` rejection;
5. re-evaluation revert;
6. successor registration.

Persist transaction hashes, pair IDs, pair/evaluation hashes and result payloads under `proof/` or `docs/`.

## Gate 5 — frontend wiring

Set Vercel or local environment variables:

```text
VITE_CONTRACT_ADDRESS=<canonical StudioNet address>
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

Then:

```bash
cd frontend
npm install --no-audit --no-fund
npm run typecheck
npm run build
```

For Vercel, the root `vercel.json` uses the frontend package and outputs `frontend/dist`.

Verify production manually:

- wallet connects;
- StudioNet is added/switched correctly;
- dashboard reads live counts;
- pair registration signs from the user's wallet;
- pair explorer reads live pair/evaluation data;
- evaluation write submits to canonical address;
- explorer links point at canonical address/transactions;
- no “preview mode” banner appears once address is configured.
