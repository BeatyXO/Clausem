# Clausem Invariants

1. **Immutable source admissibility** — every registered source is commit-pinned GitHub raw, IPFS CID, or Arweave transaction content.
2. **Language direction is explicit** — `A` is the reference and `B` is classified relative to `A`; the two language codes must differ.
3. **Pair definitions are immutable** — registration creates a fixed `pair_hash`; there is no update method.
4. **Evaluation is single-shot** — a pair can be evaluated exactly once.
5. **Evidence identity is consensus material** — source hashes and sizes are compared by validators, not merely stored from the leader.
6. **Semantic output is constrained** — one allowed status per requested category; malformed output canonicalizes to `AMBIGUOUS`.
7. **No hidden decision fields** — the persisted final result depends only on the compared status vector.
8. **Overall result is deterministic** — no model or web access occurs in `deterministic_overall`.
9. **Historical results do not mutate** — changed documents create successor pairs instead of re-adjudicating old pairs.
10. **Consumers pin both layers** — `is_parity` requires the expected pair hash and evaluation hash.
11. **No asset custody** — Clausem contains no escrow, token transfer, reward, bounty, or payout path.
