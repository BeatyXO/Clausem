# Clausem Verification Checklist

## Repository and historical CI

- [x] Immutable source forms only; no branch URL or mutable website bypass
- [x] Exact source hashes, byte sizes and constrained category vector bound by consensus
- [x] Malformed semantic output fails closed to `AMBIGUOUS`
- [x] Deterministic result, one successful evaluation per pair, immutable parent/successor lineage
- [x] `is_parity` checks both expected hashes
- [x] Direct-to-GenLayer purple Comic Sans frontend with injected-wallet recovery and disconnect implementation
- [x] CI run `36279487572`: compilation, preflight **16/16**, GenVM validation, Direct Mode **17/17**, frontend typecheck/build

## Current local verification

- [x] Python compilation
- [x] Repository preflight — **16/16**
- [x] GenLayer Direct Mode — **17/17**
- [x] Frontend `npm ci`
- [x] Frontend TypeScript typecheck
- [x] Frontend production build
- [ ] Local GenVM SDK validation — linter checks pass, but pinned SDK archive could not be loaded from the Windows cache; historical CI validation passed

## StudioNet (chain 61999)

- [x] Canonical contract deployed: `0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`
- [x] Deployment transaction finalized with execution success and five validator agreements
- [x] Deployment source commit and SHA-256 recorded
- [x] Real `PARITY` lifecycle finalized; pair/evaluation hashes recorded
- [x] Correct `is_parity` result true; wrong expected pair/evaluation hashes false
- [x] Real `MATERIAL_DRIFT` lifecycle finalized with `TERMINATION = NARROWER_IN_B`
- [x] Re-evaluation attempt failed at execution after finality; parent state unchanged
- [x] Successor points to parent, has new pair hash; parent evaluation and consumer binding remain valid
- [x] Ambiguous and undetermined real attempts recorded transparently

Evidence: [STUDIONET_EVIDENCE.md](STUDIONET_EVIDENCE.md) and [STUDIONET_EVIDENCE.json](STUDIONET_EVIDENCE.json).

## Vercel production and browser verification

- [ ] Set Production `VITE_CONTRACT_ADDRESS=0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`
- [ ] Set Production `VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com`
- [ ] Deploy frontend to Vercel and record its production URL
- [ ] Manually verify injected wallet reload hydration, wallet menu, copy, explorer, disconnect persistence, explicit reconnect, account/network changes and StudioNet switching
- [ ] Verify live counts, registration, evaluation, finalized state and explorer links in the deployed app

The user will deploy the frontend through their Vercel account. No production URL or manual wallet result is asserted until those checks occur.
