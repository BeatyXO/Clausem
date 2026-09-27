# StudioNet Evidence

All values below were read from GenLayer StudioNet (chain 61999).

## Canonical deployment

- Contract: [0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888](https://explorer-studio.genlayer.com/address/0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888)
- Deployment transaction: [0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746](https://explorer-studio.genlayer.com/tx/0x241ccae5a7e4c064e0bacc49a6ad02f20b4c8e11a954f890c3f9bacf5eea7746)
- Status: `FINALIZED`; leader execution `SUCCESS`; five of five validators agreed.
- Deployed source commit: `ed5820b2eed764eabf5c56a57db0d582e3e8582d`.
- `contracts/clausem.py` SHA-256: `72e0a5fae85bccc2215b0ceccd4f6267d15d65f6fca065f3e6d67f9416eb4487`.

## PARITY lifecycle

- Pair 1 hash: `c399a7321005d9bd886b370ab2b94bbfc8ffe47c6fa5698fe2ceb515b900a632`.
- Register: [0x7f502a5138e2cb248d84cc87801f2a0b3a8a13588887868bced60134b88d8502](https://explorer-studio.genlayer.com/tx/0x7f502a5138e2cb248d84cc87801f2a0b3a8a13588887868bced60134b88d8502), finalized.
- Evaluate: [0xaf43f34949b6b7ccbfc804c795b1df752a89bae747fbc92a3289c6562af97110](https://explorer-studio.genlayer.com/tx/0xaf43f34949b6b7ccbfc804c795b1df752a89bae747fbc92a3289c6562af97110), finalized.
- Evaluation 1 hash: `d245ef6d782bae2eee1f52c67731b7afd5373975140b2b8f43b2aeeef1cf8139`.
- Result: `PARITY`; `FEES`, `TERMINATION`, `PRIVACY_DATA` all `EQUIVALENT`.
- `is_parity(1, correct_pair_hash, correct_evaluation_hash)` returned `true`; wrong pair hash and wrong evaluation hash each returned `false`.

## MATERIAL_DRIFT lifecycle

- Pair 4 hash: `d3eb1a5c8c5e9d14291c1c691c9284457ecdfaa49a80180d003167535220f7a6`.
- Register: [0xca044381d74e7105b1e666a52cef42ae43e7d1bb53e75d7e08ff01faa1a32f94](https://explorer-studio.genlayer.com/tx/0xca044381d74e7105b1e666a52cef42ae43e7d1bb53e75d7e08ff01faa1a32f94), finalized.
- Evaluate: [0x71b2491749a67dd5537692dfd1db1e4a4acf55f5295b8b8943c9cddd5d11c021](https://explorer-studio.genlayer.com/tx/0x71b2491749a67dd5537692dfd1db1e4a4acf55f5295b8b8943c9cddd5d11c021), finalized.
- Evaluation 3 hash: `6b7070531c0d524f51d9c0d6b5d7399bce503c7f25395536f4303d76a1f7c111`.
- Result: `MATERIAL_DRIFT`; `TERMINATION = NARROWER_IN_B` (A permits cancellation with 30 days' notice; B requires 90 days).

## Finality and successor

- Re-evaluation of finalized pair 1: [0xb996c33cbfd9e696374bc517077f7d9259f4342646221c6a23790dc3698a2384](https://explorer-studio.genlayer.com/tx/0xb996c33cbfd9e696374bc517077f7d9259f4342646221c6a23790dc3698a2384) finalized with leader execution `ERROR` and unanimous validator agreement. Pair 1 remained `EVALUATED` and its evaluation hash stayed unchanged.
- Successor pair 5: [0x72b2f30159b3793ac1e13e6ea98dea72e4554af9fa878066471814f486452e67](https://explorer-studio.genlayer.com/tx/0x72b2f30159b3793ac1e13e6ea98dea72e4554af9fa878066471814f486452e67), finalized.
- Successor parent pointer: pair 1.
- Successor pair hash: `b73296ec246702b3d35dcb74534f1bd9e1500c069e60ae31d1c5b22b3fc2c307`.
- Parent pair hash and evaluation hash remained unchanged; `is_parity` for pair 1 still returned `true`.

## Other observed attempts

- Pair 2 finalized as `AMBIGUOUS`; all three category statuses were `AMBIGUOUS`.
- Pair 3 evaluation finalized `UNDETERMINED`; pair 3 remained `REGISTERED` with no evaluation hash.

These are retained as observed results, not misrepresented as successful drift/parity proof.

## Production frontend

- URL: https://clausem.vercel.app/
- Production contract: `0xAE3eE6c94916Fc7E47d0C2e94059f18273AF2888`
- Explorer base: `https://explorer-studio.genlayer.com`
- Production config file: `frontend/.env.production`

The injected-wallet flow is implemented and the production build is green. Browser-only wallet interaction is an operator check rather than CI evidence.

## Code verification

GitHub Actions run [36337680057](https://github.com/BeatyXO/Clausem/actions/runs/36337680057) on `f5134df0ea63ec46a9db09fe69847708ada890d6` passed compilation, preflight **16/16**, GenVM lint/validation, Direct Mode **17/17**, frontend install, typecheck and build.

## Known limits

- max source bytes: 240,000;
- max decoded source characters: 18,000;
- max global pairs: 1,024;
- registration is permissionless.

The 1,024-pair cap creates a bounded-instance registry exhaustion risk. It does not affect immutability or validity of already-finalized records.
