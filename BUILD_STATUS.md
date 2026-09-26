# Clausem Build Status

## Completed in repository

- Product renamed and normalized to **Clausem**.
- Production GenLayer Intelligent Contract: `contracts/clausem.py`.
- Immutable source validation for commit-pinned GitHub raw, IPFS and Arweave.
- Exact source hash + byte-size consensus checks.
- Constrained 10-category semantic vector with fail-closed ambiguity.
- Deterministic `PARITY / MATERIAL_DRIFT / AMBIGUOUS` reduction.
- Single-shot finality and successor version lineage.
- Typed `is_parity` consumer contract example.
- `get_counts()` registry discovery view for direct frontend reads.
- Adversarial Direct Mode test suite.
- Static preflight script.
- Full React/Vite frontend using direct GenLayer wallet interactions.
- Purple multi-shade visual system and Comic Sans typography.
- Preview mode that never impersonates live chain evidence.
- StudioNet wallet switching and explorer helpers.
- Vercel configuration.
- Architecture, invariants, threat model, reviewer demo, deployment guide and proof checklist.
- GitHub Actions quality workflow source.

## Must be verified before submission

These items require an environment/capability not guaranteed by the current ChatGPT GitHub connection:

1. Run the current GenLayer runtime/linter against the contract and fix any runtime-only incompatibility.
2. Run the complete Direct Mode suite with the actual GenLayer test package/runtime.
3. Deploy the canonical contract to StudioNet with an authenticated deployment wallet.
4. Execute real multi-validator `PARITY` and `MATERIAL_DRIFT` lifecycles and retain transaction evidence.
5. Set the real contract address in frontend deployment environment variables.
6. Deploy frontend to Vercel and verify the live wallet/register/evaluate/read lifecycle.
7. Update submission/evidence docs with only the real contract address, transactions and live URL.

No deployment address, transaction hash or live URL is fabricated in this repository.
