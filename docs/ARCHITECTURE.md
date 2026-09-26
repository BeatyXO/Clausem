# Clausem Architecture

## Trust boundary

```text
Browser wallet
   │ signed writes / direct reads
   ▼
GenLayer StudioNet
   │
   ▼
Clausem Intelligent Contract
   ├─ immutable pair registry
   ├─ one-shot evaluation lifecycle
   ├─ independent web fetch by leader/validators
   ├─ independent constrained semantic classification
   ├─ exact source-hash + vector equivalence
   └─ deterministic final result + typed consumer view

No backend is authoritative.
```

The frontend has no privileged signing key and no server-side verdict cache. A backend is intentionally unnecessary for the current scale because `get_counts()` and sequential pair IDs allow direct discovery.

## State model

### PolicyPair

A registered pair fixes:

- creator;
- optional `parent_pair_id` lineage;
- title and policy domain;
- language direction (`A` reference, `B` compared);
- two immutable source URLs;
- ordered material categories;
- `pair_hash`;
- registration/evaluation status;
- final evaluation ID.

The pair object has no mutation method after registration. Evaluation only changes the lifecycle status and binds exactly one evaluation ID.

### Evaluation

An evaluation stores:

- source hashes A/B;
- source byte sizes A/B;
- category status vector;
- deterministic overall result;
- semantic-vector hash;
- final evaluation hash;
- evaluator address.

## Consensus boundary

Nondeterminism is limited to:

1. fetching the two immutable public sources;
2. semantically classifying the selected material categories.

Leader output includes only stable material fields:

```text
source_hash_a
source_hash_b
source_size_a
source_size_b
statuses[]
```

Every validator independently fetches both sources, recomputes the exact hashes/sizes, independently classifies the same category vector, and compares every material field. No un-compared leader-only flag influences the stored result.

## Deterministic boundary

`deterministic_overall(statuses)` never fetches the web and never calls a model.

- any `AMBIGUOUS` -> `AMBIGUOUS`;
- all `EQUIVALENT` / `NOT_APPLICABLE` -> `PARITY`;
- otherwise -> `MATERIAL_DRIFT`.

## Versioning

A finalized pair is not re-evaluated. Document revisions are represented as successor pairs. A successor:

- must be created by the parent creator;
- preserves policy domain and language direction;
- has a new immutable pair hash;
- never changes the parent result.

This protects downstream consumers from revision invalidation.
