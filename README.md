# Clausem

**Consensus-backed material parity for immutable multilingual policy documents.**

Clausem is a GenLayer application and reusable Intelligent Contract primitive for answering a narrow but difficult question: when the same policy, terms, or agreement is published in two language/version documents, do the two texts preserve the same **material meaning**?

It does not ask one centralized model to give a free-form translation score. The contract binds two immutable public sources, has GenLayer validators independently fetch the exact bytes, requires consensus on both source hashes **and** a constrained semantic comparison vector, and then derives the final state deterministically.

Possible final states:

- `PARITY` — every selected category is materially equivalent or not applicable.
- `MATERIAL_DRIFT` — at least one selected category is narrower, broader, conflicting, or missing on one side.
- `AMBIGUOUS` — at least one category cannot be classified safely.

The repository includes the production contract, adversarial tests, a direct-to-GenLayer React frontend, reviewer documentation, deployment gates, and Codex handoff instructions.