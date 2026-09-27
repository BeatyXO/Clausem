# Clausem Deployment Handoff — Completed

The original deployment/live-proof handoff represented by this file is complete. It is retained only as provenance for the repository.

## Canonical status

- Repository: https://github.com/BeatyXO/Clausem
- Production frontend: https://clausem.vercel.app/
- StudioNet contract: `0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`
- Deployment tx: `0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746`
- Deployed contract source commit: `ed5820b2eed764eabf5c56a57db0d582e3e8582d`
- Contract source SHA-256: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`
- Live PARITY, MATERIAL_DRIFT, finality and successor evidence: [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md)
- Machine-readable evidence: [proof/STUDIONET_EVIDENCE.json](proof/STUDIONET_EVIDENCE.json)
- Verified code run: [36337680057](https://github.com/BeatyXO/Clausem/actions/runs/36337680057) on `f5134df0ea63ec46a9db09fe69847708ada890d6`

No active deployment-agent task remains.

## Preserve these invariants

Any future change must continue to preserve:

1. immutable source admissibility;
2. exact source-hash and source-size validator binding;
3. constrained semantic vectors;
4. fail-closed `AMBIGUOUS` handling;
5. deterministic overall result;
6. single-shot evaluation;
7. immutable parent/successor lineage;
8. pair-hash + evaluation-hash consumer binding;
9. no fabricated deployment evidence.

## Known limits of the canonical instance

- 240,000-byte source limit;
- 18,000 decoded-character source limit;
- global `MAX_PAIRS = 1024`;
- permissionless registration creates a registry-exhaustion availability risk.

Do not modify and redeploy the canonical contract merely to make documentation cleaner. A future production-scale successor can address the registry bound with a new deployment and new evidence.
