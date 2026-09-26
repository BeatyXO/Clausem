# Clausem Verification Checklist

## Repository
- [x] Distinct non-escrow product boundary
- [x] Pinned GenLayer runner header
- [x] Production contract + typed consumer
- [x] Purple Comic Sans frontend
- [x] Static preflight
- [x] Direct Mode adversarial suite
- [x] Architecture / invariants / threat model / reviewer demo
- [x] Permanent CI workflow
- [x] Wallet reload hydration + connected-wallet menu implementation

## Verified CI — run 36279487572
- [x] Python compilation
- [x] Repository preflight — 16/16
- [x] GenVM lint / validation
- [x] Direct Mode — 17/17
- [x] frontend dependency install
- [x] frontend TypeScript typecheck
- [x] frontend production build

## StudioNet — deployment agent required
- [ ] canonical contract deployed
- [ ] contract address recorded
- [ ] deployment tx recorded
- [ ] deployed source commit recorded
- [ ] deployed source SHA-256 recorded
- [ ] PARITY lifecycle finalized under real multi-validator consensus
- [ ] MATERIAL_DRIFT lifecycle finalized under real multi-validator consensus
- [ ] re-evaluation revert proven live
- [ ] successor lineage proven live
- [ ] consumer hash pinning proven live

## Production frontend — deployment agent required
- [ ] canonical contract env configured
- [ ] deployed to Vercel
- [ ] injected wallet behavior manually verified in browser
- [ ] live counts verified
- [ ] register/evaluate/read flow verified
- [ ] explorer links verified against canonical deployment
