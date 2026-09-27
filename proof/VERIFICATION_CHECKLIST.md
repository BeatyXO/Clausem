# Clausem Verification Checklist

## Contract and consensus

- [x] Immutable source forms only; no branch URL or mutable website bypass
- [x] Exact source hashes, byte sizes and constrained category vector bound by consensus
- [x] Malformed semantic output fails closed to `AMBIGUOUS`
- [x] Deterministic result and single-shot evaluation
- [x] Parent/successor lineage preserves historical consumer bindings
- [x] `is_parity` checks both expected hashes
- [x] Real `PARITY` lifecycle finalized
- [x] Real `MATERIAL_DRIFT` lifecycle finalized
- [x] Re-evaluation failure proven live
- [x] Successor lineage proven live
- [x] Ambiguous and undetermined attempts retained transparently

## Canonical deployment

- [x] Contract deployed: `0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`
- [x] Deployment transaction finalized successfully
- [x] Five validator agreements recorded
- [x] Deployed source commit recorded
- [x] Deployed source SHA-256 recorded
- [x] Deployed contract source remains unchanged in the current repository

## Code verification

- [x] GitHub Actions run `36337680057` completed successfully on `f5134df0ea63ec46a9db09fe69847708ada890d6`
- [x] Python compilation
- [x] Repository preflight — **16/16**
- [x] GenVM lint / validation
- [x] GenLayer Direct Mode — **17/17**
- [x] Frontend dependency install
- [x] Frontend TypeScript typecheck
- [x] Frontend production build

## Production frontend

- [x] Production build wired to canonical address
- [x] Production frontend deployed: https://clausem.vercel.app/
- [x] Connected-wallet menu / copy / explorer / disconnect logic implemented
- [x] Wallet reload hydration and local disconnect persistence implemented
- [x] Account/network/provider event reconciliation implemented
- [x] Source-size limit is surfaced in the registration UI

Browser-only wallet interaction is an operator smoke test and is not mechanically attested by GitHub CI.

## Known limits documented

- [x] 240 KB source-byte limit
- [x] 18,000 decoded-character semantic limit
- [x] Oversized sources reject rather than truncate
- [x] Global `MAX_PAIRS = 1024` registry bound
- [x] Permissionless registry-exhaustion availability risk documented

Evidence: [STUDIONET_EVIDENCE.md](STUDIONET_EVIDENCE.md) and [STUDIONET_EVIDENCE.json](STUDIONET_EVIDENCE.json).
