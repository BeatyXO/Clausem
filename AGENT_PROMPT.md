You are taking over a substantially implemented GenLayer project named Clausem.

Do not return only a plan, checklist, commentary, mockup, or code snippets. Inspect the entire repository first, then finish the existing project to a review-ready, submission-ready state in place and push all completed work to:

https://github.com/BeatyXO/Clausem.git

The repository already contains the intended product architecture. Preserve it unless an actual GenLayer runtime/test failure proves a change is necessary.

# PRODUCT BOUNDARY

Clausem is a consensus-backed material-parity registry for immutable multilingual policy/terms documents.

A creator registers two immutable source documents (A = reference language/version, B = compared language/version), selects material categories, and receives a fixed pair hash. A pair is evaluated exactly once. GenLayer validators independently fetch both exact sources, hash the complete returned bytes, independently classify only the requested material categories, and must agree on BOTH the exact evidence identity and the exact semantic category vector. Deterministic contract logic then derives one final result:

- PARITY
- MATERIAL_DRIFT
- AMBIGUOUS

Per-category statuses are constrained to:

- EQUIVALENT
- NARROWER_IN_B
- BROADER_IN_B
- CONFLICT
- MISSING_IN_A
- MISSING_IN_B
- NOT_APPLICABLE
- AMBIGUOUS

A finalized pair must never be re-adjudicated. Revised source documents must be represented by a successor pair with a new pair hash and a parent pointer. Historical downstream bindings must remain stable.

Clausem is NOT:

- a grant system
- milestone escrow
- a token/reward protocol
- a challenge-bond system
- generic "AI judges a document" infrastructure
- a legal-advice product
- a translation quality score

Do not introduce grants, milestones, tranches, payouts, funder/grantee roles, challenge bonds, bounty math or token custody.

# NON-NEGOTIABLE CONTRACT INVARIANTS

1. Sources must remain immutable forms only: commit-pinned raw GitHub, IPFS CID, or Arweave transaction URLs.
2. Do not weaken source immutability to accept branch URLs or normal mutable websites.
3. Leader/validator equivalence must compare exact source hashes AND exact source sizes AND exact category status vector.
4. No un-compared leader-only field may influence the persisted final result.
5. Malformed semantic output must fail closed to AMBIGUOUS, never PARITY.
6. `deterministic_overall` must stay pure/deterministic with no web/LLM access.
7. Pair evaluation is single-shot.
8. Successor registration must not mutate or invalidate the parent.
9. `is_parity` must require expected pair hash AND expected evaluation hash.
10. Keep the typed consumer example working.
11. Do not fabricate deployment evidence, transaction hashes, contract addresses, test counts or live URLs.

# FRONTEND BOUNDARY

The frontend is already implemented under `frontend/` and should remain direct-to-GenLayer rather than introducing an authoritative backend.

Visual direction is intentional and must be preserved:

- dark purple base
- multiple distinct purple shades
- purple glass/panel styling
- Comic Sans / Comic Sans MS typography
- responsive desktop/mobile layout

The frontend should support:

- injected wallet connection (Rabby/MetaMask compatible EIP-1193)
- StudioNet add/switch (chain 61999 / 0xf22f)
- live registry counts
- recent pairs
- register new pair
- register successor pair
- select material categories
- pair explorer
- one-shot evaluation trigger
- source/evaluation hashes
- category matrix
- explorer links
- clear preview mode when no canonical address is configured

Do not make preview/demo values appear to be live onchain facts.

# REQUIRED FINISH WORK

Work through the following gates. Continue as far as the environment genuinely permits instead of stopping at the first blocker.

## Gate 1 — inspect and static audit

- Read every contract, test, frontend, script and documentation file.
- Confirm all naming is Clausem (not ClauseMirror) except where historical comparison is explicitly discussed.
- Confirm the pinned GenLayer runner is valid/current for the target environment.
- Run Python compilation and repository preflight.
- Audit source URL validation and content-size handling for GenVM compatibility.
- Inspect every storage type and public interface for GenLayer constraints.

## Gate 2 — GenLayer runtime / Direct Mode

Use the available GenLayer SDK/CLI/test tooling. Run the complete Direct Mode suite.

The suite must exercise at least:

- mutable branch URL rejection
- immutable pair hash
- category input validation
- PARITY path
- MATERIAL_DRIFT path
- missing material clause path
- malformed semantic output -> AMBIGUOUS
- leader semantic forgery rejected by validator
- source bytes changed while semantic vector stays same -> validator rejects
- identical evidence + vector -> validator accepts
- pair cannot be evaluated twice
- successor has new pair hash while parent remains final
- wrong pair/evaluation hash rejected by `is_parity`
- counts/view consistency

If a real runtime error appears, fix the implementation and add/strengthen a regression test. Do not change architecture just to silence a test without understanding the failure.

Also run the current recommended GenLayer linter/validator. Record the real output.

## Gate 3 — frontend verification

From `frontend/`:

- `npm install --no-audit --no-fund`
- `npm run typecheck`
- `npm run build`

Fix any TypeScript, SDK or Vite incompatibility using the actually installed `genlayer-js` API rather than assuming newer docs match version 1.1.8.

Verify the frontend never reports a submitted transaction as failed merely because StudioNet has not finalized yet. Preserve pending/finalized distinction.

## Gate 4 — GitHub quality

- Ensure all finished changes are committed and pushed to `main`.
- Ensure repository docs match actual state.
- If GitHub Actions workflow creation/push is permitted, verify the quality workflow runs. If workflow permission is unavailable, do not claim CI passed; document the exact limitation.

## Gate 5 — canonical StudioNet deployment

If deployment credentials and StudioNet access are available, deploy `contracts/clausem.py`.

Record real evidence only:

- contract address
- deployment tx
- source commit SHA
- source SHA-256
- finalized status
- execution success

If deployment access is unavailable, leave the repository correctly marked PENDING and do not invent evidence.

## Gate 6 — real-consensus reviewer proof

Against the canonical deployed address run real StudioNet lifecycles:

A. PARITY
- register immutable A/B sources
- evaluate under real multi-validator consensus
- read pair + evaluation
- prove correct `is_parity(...) == true`
- prove wrong pair/evaluation hash returns false

B. MATERIAL_DRIFT
- register a second immutable pair with one clear material change (for example a deadline/termination right)
- evaluate
- show the relevant per-category drift state and overall MATERIAL_DRIFT

C. Finality/versioning
- prove a finalized pair cannot be evaluated again
- register a successor pair
- prove parent hash/result remain unchanged
- prove successor has new pair hash and correct parent pointer

Persist a concise machine-readable lifecycle evidence file under `proof/` or `docs/`. Do not place secrets/private keys in the repo.

## Gate 7 — production frontend

After a canonical contract address exists:

- set `VITE_CONTRACT_ADDRESS`
- build fresh
- deploy frontend to Vercel if authenticated Vercel access is available
- verify wallet connect, StudioNet switching, live counts, registration, evaluate, pair/evaluation reads and explorer links
- confirm preview-mode warning disappears on production

Record the real production URL only after it exists.

# REVIEWER-QUALITY STANDARD

Before declaring completion, audit the result like a skeptical reviewer:

- Is GenLayer consensus actually necessary and substantive?
- Does equivalence compare semantic material rather than JSON shape alone?
- Are the exact evidence bytes consensus-bound?
- Can one arbitrary caller mutate a finalized result?
- Can a successor invalidate a historical consumer binding?
- Can malformed LLM output become approval?
- Are semantic ambiguity and model limitations honestly represented?
- Does the frontend read/write the real canonical contract rather than a mock API?
- Do docs distinguish proven live evidence from pending work?
- Does the product remain obviously distinct from milestone/grant/escrow submissions?

Do not assign an inflated score just because the repository is large. Fix substantive weaknesses you find.

# FINAL RESPONSE FORMAT

When finished, report:

1. final Git commit SHA;
2. exact local/runtime test results;
3. frontend typecheck/build results;
4. GenLayer linter/runtime result;
5. canonical contract address + deployment tx, ONLY if actually deployed;
6. live lifecycle IDs/tx hashes, ONLY if actually executed;
7. production frontend URL, ONLY if actually deployed;
8. any remaining blocker with a precise reason.
