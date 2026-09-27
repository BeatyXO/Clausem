# Clausem Threat Model

## Protected against

### Mutable-source substitution

Registration accepts only immutable source forms. A normal webpage or GitHub branch URL cannot later change under the same Clausem definition.

### Leader-only evidence claims

Validators compare exact full-source hashes and byte sizes. A leader cannot silently substitute different evidence while preserving only the semantic labels.

### Forged semantic vector

Validators independently run the constrained material classification. A leader-proposed vector that differs from a validator's own result fails equivalence.

### Malformed model response becoming approval

Missing/invalid semantic output canonicalizes to `AMBIGUOUS` per requested category. Bad structure cannot produce `PARITY`.

### Arbitrary re-resolution invalidating consumers

A finalized pair cannot be evaluated again. A changed document becomes a new successor pair, preserving historical `pair_hash + evaluation_hash` bindings.

### Prompt injection inside policy text

The prompt treats both source documents as untrusted quoted data and instructs the model not to follow commands embedded in them. Validator consensus remains the primary protection.

## Residual semantic-oracle risk

Clausem still asks language models to make semantic judgments. Multiple validators reduce dependence on one output, but consensus does not prove objective legal truth or eliminate systematic model bias.

For that reason Clausem:

- exposes `AMBIGUOUS` as a first-class result;
- uses narrow material categories;
- records exact evidence hashes;
- does not claim legal superiority of either language;
- does not move money or impose legal remedies.

## Availability risk

An immutable source may be temporarily unavailable to validators. Evaluation then fails rather than inventing content or silently approving.

## Registry-exhaustion / griefing risk

The canonical deployment has a global `MAX_PAIRS = 1024` bound while `register_pair` is permissionless. A determined actor could register enough valid pairs to consume the remaining slots and prevent new registrations.

This does **not** let the attacker:

- rewrite an existing pair;
- re-evaluate a finalized pair;
- alter a stored evaluation;
- forge `is_parity`;
- invalidate an existing consumer binding.

It is an availability limitation of this bounded deployment. A production-scale successor should remove or substantially raise the cap, or introduce an anti-spam/quota/economic admission mechanism.

The canonical contract is not changed solely to address this after deployment because doing so would require a new contract address and new live proof.

## Content-size boundary

The deployed contract enforces:

- `MAX_SOURCE_BYTES = 240000`;
- `MAX_SOURCE_CHARS = 18000`.

Oversized sources are rejected before semantic classification. Clausem does not hash the complete source and then silently classify only a truncated prefix.

These limits are surfaced in the frontend registration UI.

## Non-goals

Clausem does not:

- provide legal advice;
- decide which language legally controls;
- certify general translation quality;
- prove source authorship;
- prove that a policy itself is lawful or fair;
- custody assets or automate payouts.
