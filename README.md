# Clausem

**Consensus-backed material parity for immutable multilingual policy documents.**

Clausem is a GenLayer application and reusable Intelligent Contract primitive for answering a narrow but difficult question: when the same policy, terms, or agreement is published in two language/version documents, do the two texts preserve the same **material meaning**?

## Live deployment

- Frontend: https://clausem.vercel.app/
- StudioNet contract: [0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888](https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888)
- Deployment transaction: [0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746](https://explorer-studio.genlayer.com/tx/0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746)
- Full live proof: [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md)

It does not ask one centralized model to give a free-form translation score. The contract binds two immutable public sources, has GenLayer validators independently fetch the exact bytes, requires consensus on both source hashes **and** a constrained semantic comparison vector, and then derives the final state deterministically.

Possible final states:

- `PARITY` — every selected category is materially equivalent or not applicable.
- `MATERIAL_DRIFT` — at least one selected category is narrower, broader, conflicting, or missing on one side.
- `AMBIGUOUS` — at least one category cannot be classified safely.

## Product shape

Clausem is deliberately different from milestone/grant/escrow projects. There are no grants, funder/grantee roles, tranches, challenge bonds, payout math, milestone claims, or token custody.

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

Per-category statuses:

`EQUIVALENT`, `NARROWER_IN_B`, `BROADER_IN_B`, `CONFLICT`, `MISSING_IN_A`, `MISSING_IN_B`, `NOT_APPLICABLE`, `AMBIGUOUS`.

Malformed semantic output fails closed to `AMBIGUOUS`.

## Immutable source policy

Clausem accepts only:

- `raw.githubusercontent.com/<owner>/<repo>/<40-hex-commit>/...`
- `ipfs.io/ipfs/<CID>`
- `gateway.pinata.cloud/ipfs/<CID>`
- `arweave.net/<transaction-id>`

Mutable websites and GitHub branch URLs are rejected. Leader and validators independently fetch the sources and must agree on full byte hashes and byte sizes.

Current source limits:

- maximum 240,000 bytes per source;
- maximum 18,000 decoded characters per source;
- oversized sources are rejected, never silently truncated.

## Why GenLayer

Plain contracts can compare hashes, but cannot determine whether differently worded documents preserve the same material right or obligation. Clausem narrows GenLayer consensus to one bounded job:

1. independently fetch the two immutable sources;
2. independently hash the exact fetched bytes;
3. independently classify only the selected material categories;
4. reject the leader when evidence identity or the category vector differs;
5. deterministically derive `PARITY / MATERIAL_DRIFT / AMBIGUOUS`.

## Frontend

The React/Vite frontend is direct-to-GenLayer. There is no authoritative backend or server-held writer key.

- injected wallet connection;
- silent authorized-wallet hydration after reload;
- account/network/disconnect reconciliation;
- connected-wallet menu with copy address, explorer and disconnect;
- local disconnect persistence;
- StudioNet add/switch;
- live registry counts;
- pair/successor registration;
- selectable material categories;
- one-shot evaluation;
- proof explorer;
- source/evaluation hashes and explorer links;
- visible source-size limits;
- purple multi-shade UI with Comic Sans typography.

## Downstream composability

A downstream contract can pin a finalized result via:

```text
is_parity(pair_id, expected_pair_hash, expected_evaluation_hash)
```

Both hashes must match. A successor cannot silently replace the exact result a consumer approved.

## Verified build

GitHub Actions run [36337680057](https://github.com/BeatyXO/Clausem/actions/runs/36337680057) passed on `f5134df0ea63ec46a9db09fe69847708ada890d6`:

- preflight **16/16**;
- GenVM lint/validation;
- Direct Mode **17/17**;
- frontend install/typecheck/build.

## Known bounded-instance limitation

The canonical deployment has a global `MAX_PAIRS = 1024` bound and registration is permissionless. A determined actor could consume the remaining slots and prevent new registrations on this deployment. This is an availability/griefing limitation only; it cannot mutate or forge already-finalized records.

A production-scale successor should remove/raise the cap or add anti-spam/quota/economic admission controls.

## Scope

Clausem is not legal advice, does not decide which language legally controls, does not certify general translation quality, does not prove source authorship, and does not custody assets or automate payouts.

See [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) for residual risks and non-goals.
