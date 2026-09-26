# Clausem

**Consensus-backed material parity for immutable multilingual policy documents.**

Clausem is a GenLayer application and reusable Intelligent Contract primitive for answering a narrow but difficult question: when the same policy, terms, or agreement is published in two language/version documents, do the two texts preserve the same **material meaning**?

It does not ask one centralized model to give a free-form translation score. The contract binds two immutable public sources, has GenLayer validators independently fetch the exact bytes, requires consensus on both source hashes **and** a constrained semantic comparison vector, and then derives the final state deterministically.

Possible final states:

- `PARITY` — every selected category is materially equivalent or not applicable.
- `MATERIAL_DRIFT` — at least one selected category is narrower, broader, conflicting, or missing on one side.
- `AMBIGUOUS` — at least one category cannot be classified safely.

## Product shape

Clausem is deliberately different from milestone/grant/escrow projects. There are no grants, funder/grantee roles, tranches, challenge bonds, payout math, milestone claims, or token custody.

The core lifecycle is:

```text
REGISTER IMMUTABLE PAIR
        ↓
PAIR HASH FIXED
        ↓
ONE-SHOT GENLAYER EVALUATION
        ↓
VALIDATORS FETCH SOURCE A + SOURCE B INDEPENDENTLY
        ↓
EXACT BYTE HASH / SIZE AGREEMENT
        ↓
EXACT MATERIAL CATEGORY VECTOR AGREEMENT
        ↓
DETERMINISTIC OVERALL RESULT
        ↓
PAIR + EVALUATION HASHES REMAIN FINAL

Document changes later?
        ↓
REGISTER A SUCCESSOR PAIR — never mutate/re-adjudicate the old one
```

## Material categories

1. Obligations
2. Rights
3. Fees
4. Deadlines
5. Termination
6. Liability
7. Privacy / Data
8. Eligibility
9. Dispute
10. Exceptions

Per-category statuses are constrained to:

`EQUIVALENT`, `NARROWER_IN_B`, `BROADER_IN_B`, `CONFLICT`, `MISSING_IN_A`, `MISSING_IN_B`, `NOT_APPLICABLE`, `AMBIGUOUS`.

Malformed semantic output fails closed to `AMBIGUOUS` rather than manufacturing a decisive result.

## Immutable source policy

Clausem accepts only:

- `raw.githubusercontent.com/<owner>/<repo>/<40-hex-commit>/...`
- `ipfs.io/ipfs/<CID>`
- `gateway.pinata.cloud/ipfs/<CID>`
- `arweave.net/<transaction-id>`

Ordinary mutable websites and GitHub branch URLs are rejected at registration. During evaluation, leader and validators independently fetch both sources and must agree on the complete byte hashes and sizes. The stored `source_hash_a` / `source_hash_b` therefore represent bytes validators actually evaluated, not just a URL label.

## Why GenLayer

Plain contracts can compare hashes, but they cannot determine whether two differently worded documents preserve the same termination right or impose the same payment obligation. A single model API can make such a judgment, but then the API operator becomes a trusted semantic oracle.

Clausem narrows GenLayer consensus to one bounded job:

1. independently fetch the two immutable sources;
2. independently hash the exact fetched bytes;
3. independently classify only the selected material categories;
4. reject the leader when source identity or the category vector differs;
5. deterministically derive the final `PARITY / MATERIAL_DRIFT / AMBIGUOUS` result.

## Frontend

The Vite/React frontend is intentionally direct-to-GenLayer. There is no authoritative backend or server-held writer key.

- injected wallet connection (MetaMask, Rabby, compatible EIP-1193 wallet);
- automatic GenLayer StudioNet chain add/switch;
- live `get_counts()` registry discovery;
- recent pair dashboard;
- pair/successor registration form;
- selectable material categories;
- one-shot evaluation trigger;
- pair + evaluation proof explorer;
- exact source hashes, semantic hash, and evaluation hash display;
- StudioNet transaction/explorer links;
- preview mode when no canonical deployment address is configured;
- purple multi-shade UI with Comic Sans typography.

Preview mode is explicitly labeled and does **not** pretend the sample record exists onchain.

## Repository layout

```text
contracts/clausem.py             production Intelligent Contract
contracts/clausem_consumer.py    minimal typed downstream consumer
frontend/                        Vite + React application
frontend/src/lib/genlayer.ts     StudioNet wallet/read/write helpers
tests/                           Direct Mode adversarial tests
docs/ARCHITECTURE.md             system architecture + trust boundaries
docs/INVARIANTS.md               reviewer-facing protocol invariants
docs/THREAT_MODEL.md             adversary/failure analysis
docs/REVIEWER_DEMO.md            recommended live demonstration
DEPLOYMENT.md                     deployment and post-deploy gates
proof/VERIFICATION_CHECKLIST.md   evidence checklist
scripts/preflight.py              local static quality gate
AGENT_PROMPT.md                   Codex finish/deploy instructions
```

## Local checks

Static contract checks:

```bash
python -m py_compile contracts/clausem.py contracts/clausem_consumer.py
python scripts/preflight.py
```

GenLayer Direct Mode (requires the GenLayer test tooling/runtime):

```bash
pip install -r requirements-test.txt
pytest -q
```

Frontend:

```bash
cd frontend
npm install --no-audit --no-fund
npm run typecheck
npm run build
npm run dev
```

## Frontend configuration

Create `frontend/.env.local`:

```text
VITE_CONTRACT_ADDRESS=0x...
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

The app stays in clearly labeled preview mode when `VITE_CONTRACT_ADDRESS` is absent. Live contract writes are disabled until a real deployed address is configured.

## Downstream composability

A downstream contract can pin a finalized result via:

```text
is_parity(pair_id, expected_pair_hash, expected_evaluation_hash)
```

Both hashes must match the immutable registered/evaluated records. This prevents a consumer from silently following a successor version it did not explicitly approve.

## Scope and limitations

Clausem is not legal advice and does not declare which language should legally control. It does not guarantee general translation quality or factual truth. Its claim is deliberately narrower: for selected material categories, a GenLayer validator set reached consensus over **these exact immutable bytes**, producing **this exact hash-bound semantic result**.

See `docs/THREAT_MODEL.md` for residual semantic-oracle risk and the explicit non-goals.
