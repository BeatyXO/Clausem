# Reviewer Demo

A strong live demo should show three independent properties rather than only one happy path.

## Demo A — parity

1. Register two immutable language sources with 3–5 categories.
2. Show returned pair ID and pair hash.
3. Evaluate once under real StudioNet validator consensus.
4. Show `PARITY`, both fetched source hashes, semantic hash, and evaluation hash.
5. Call `is_parity` with the correct pair/evaluation hashes -> `true`.
6. Repeat `is_parity` with a wrong hash -> `false`.

## Demo B — material drift

Register a second pair where B changes one material fact, for example a 30-day termination notice becomes 60 days.

Expected proof:

- that category resolves to `NARROWER_IN_B`, `BROADER_IN_B`, or `CONFLICT` as appropriate;
- deterministic overall becomes `MATERIAL_DRIFT`;
- other equivalent categories remain separately visible.

## Demo C — source/vector disagreement

Direct Mode should prove:

- same semantic vector but changed source bytes -> validator rejects;
- same bytes but forged semantic vector -> validator rejects;
- same bytes + same vector -> validator accepts.

## Demo D — finality/versioning

1. Attempt to evaluate the first finalized pair again -> revert.
2. Register a successor pair with new immutable B source.
3. Show parent remains finalized with unchanged hashes.
4. Show successor has a new pair hash and parent pointer.
