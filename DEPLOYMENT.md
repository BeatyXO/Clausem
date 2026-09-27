# Clausem Deployment

Network: **GenLayer StudioNet** — chain ID `61999`.

## Canonical contract

- Address: [`0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`](https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888)
- Deployment transaction: [`0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746`](https://explorer-studio.genlayer.com/tx/0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746)
- Status: `FINALIZED`; leader execution `SUCCESS`; five validator votes agreed.
- Deployed source commit: `ed5820b2eed764eabf5c56a57db0d582e3e8582d`.
- SHA-256 of deployed `contracts/clausem.py`: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`.

The deployed contract source has not changed after deployment.

## Live lifecycle evidence

- **PARITY:** pair 1; pair hash `c399a7321005d9bd886b370ab2b94bbfc8ffe47c6fa5698fe2ceb515b900a632`; evaluation hash `d245ef6d782bae2eee1f52c67731b7afd5373975140b2b8f43b2aeeef1cf8139`; register tx `0x7f502a5138e2cb248d84cc87801f2a0b3a8a13588887868bced60134b88d8502`; evaluate tx `0xaf43f34949b6b7ccbfc804c795b1df752a89bae747fbc92a3289c6562af97110`.
- **MATERIAL_DRIFT:** pair 4; pair hash `d3eb1a5c8c5e9d14291c1c691c9284457ecdfaa49a80180d003167535220f7a6`; evaluation hash `6b7070531c0d524f51d9c0d6b5d7399bce503c7f25395536f4303d76a1f7c111`; `TERMINATION = NARROWER_IN_B`; register tx `0xca044381d74e7105b1e666a52cef42ae43e7d1bb53e75d7e08ff01faa1a32f94`; evaluate tx `0x71b2491749a67dd5537692dfd1db1e4a4acf55f5295b8b8943c9cddd5d11c021`.
- Correct pair/evaluation hashes made `is_parity` return `true`; wrong pair hash and wrong evaluation hash each returned `false`.
- Re-evaluating finalized pair 1 finalized with execution `ERROR`; pair 1 and its evaluation hash remained unchanged.
- Successor pair 5 points to pair 1, has a distinct pair hash and did not change the parent or its consumer binding.

See [proof/STUDIONET_EVIDENCE.md](proof/STUDIONET_EVIDENCE.md) for complete transaction evidence.

## Production frontend

Production URL:

https://clausem.vercel.app/

Production build values:

```text
VITE_CONTRACT_ADDRESS=0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888
VITE_EXPLORER_BASE=https://explorer-studio.genlayer.com
```

The same public values are tracked in `frontend/.env.production`.

## Latest verification

GitHub Actions run [36337680057](https://github.com/BeatyXO/Clausem/actions/runs/36337680057) on commit `f5134df0ea63ec46a9db09fe69847708ada890d6` passed:

- compilation;
- preflight **16/16**;
- GenVM lint/validation;
- Direct Mode **17/17**;
- frontend install;
- TypeScript;
- production build.

## Operational limits

Current canonical contract limits:

- `MAX_SOURCE_BYTES = 240000`;
- `MAX_SOURCE_CHARS = 18000`;
- `MAX_PAIRS = 1024`.

Oversized sources fail before semantic evaluation. The global 1,024-pair registry is a known bounded-instance availability limit: permissionless registration means a determined actor could consume the remaining slots. Existing finalized records remain immutable and unaffected.
