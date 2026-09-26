# Clausem Verification Checklist

## Repository
- [x] Distinct non-escrow product boundary
- [x] Pinned GenLayer runner header
- [x] Production contract + typed consumer
- [x] Purple Comic Sans frontend
- [x] Static preflight
- [x] Direct Mode adversarial tests present
- [x] Architecture / invariants / threat model / reviewer demo
- [x] CI workflow source

## Local execution
- [ ] GenLayer Direct Mode suite passes in authenticated/full runtime
- [ ] `genvm-lint` / current GenLayer contract validator clean
- [ ] frontend `npm install --no-audit --no-fund` clean
- [ ] frontend typecheck clean
- [ ] frontend production build clean

## StudioNet
- [ ] canonical contract deployed
- [ ] contract address recorded
- [ ] deployment tx recorded
- [ ] deployed source commit recorded
- [ ] PARITY lifecycle finalized
- [ ] MATERIAL_DRIFT lifecycle finalized
- [ ] re-evaluation revert proven
- [ ] successor lineage proven
- [ ] consumer hash pinning proven

## Frontend
- [ ] canonical contract env configured
- [ ] deployed to Vercel
- [ ] wallet connection verified
- [ ] live counts verified
- [ ] register/evaluate/read flow verified
