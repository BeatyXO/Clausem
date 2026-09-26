# Clausem Threat Model

## Protected against

### Mutable-source substitution

An attacker cannot register a normal webpage or `main`/branch GitHub raw URL and later change its contents under the same Clausem definition. Registration accepts only immutable source forms.

### Leader-only evidence claims

The leader cannot claim it saw one document while validators saw another and still pass simply because their semantic labels happen to match. Validators compare exact full-source hashes and byte sizes.

### Forged semantic vector

Validators independently run the constrained material classification. A leader-proposed vector that differs from an honest validator vector fails equivalence.

### Malformed model response becoming approval

Missing/invalid semantic output canonicalizes to `AMBIGUOUS` per requested category. Bad structure cannot produce `PARITY`.

### Arbitrary re-resolution invalidating consumers

A finalized pair cannot be evaluated again. A revised document becomes a new successor pair, so previous `pair_hash + evaluation_hash` bindings remain stable.

### Prompt injection inside policy text

The prompt explicitly treats both source documents as untrusted quoted data and instructs the model never to follow commands embedded in them. This reduces instruction-following risk, while validator consensus remains the primary protection.

## Residual semantic-oracle risk

Clausem still asks language models to make semantic judgments. Multiple validators reduce dependence on a single model/output, but consensus does not prove objective legal truth. Different validators can share systematic model biases or all misinterpret difficult drafting.

For that reason Clausem:

- exposes `AMBIGUOUS` as a first-class final state;
- uses narrow material categories rather than an open-ended legal conclusion;
- records exact evidence hashes;
- does not claim legal superiority of either language;
- does not automatically move money or impose legal remedies based on the result.

## Availability risk

An immutable source may be unavailable to validators even if its identifier is valid. Evaluation then fails rather than inventing content or silently approving. A caller can retry only while the pair remains unevaluated; once a successful evaluation finalizes, it is immutable.

## Content-size boundary

Sources above the contract's maximum byte size are rejected during fetch. Text passed to semantic classification is separately capped to control prompt size. A production reviewer should confirm these limits are suitable for target policy documents.

## Non-goals

Clausem does not:

- provide legal advice;
- decide which language legally controls;
- certify general translation quality;
- prove source authorship;
- prove that a policy itself is lawful or fair;
- custody assets or automate payouts.
