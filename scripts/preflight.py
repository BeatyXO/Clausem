from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
contract = (ROOT / "contracts" / "clausem.py").read_text(encoding="utf-8")
consumer = (ROOT / "contracts" / "clausem_consumer.py").read_text(encoding="utf-8")
readme = (ROOT / "README.md").read_text(encoding="utf-8")
frontend = (ROOT / "frontend" / "src" / "App.tsx").read_text(encoding="utf-8")
styles = (ROOT / "frontend" / "src" / "styles.css").read_text(encoding="utf-8")

checks = {
    "runner pinned": '"Depends": "py-genlayer:' in contract,
    "Clausem contract": "class Clausem(gl.Contract)" in contract,
    "real nondeterminism": "run_nondet_unsafe" in contract and "gl.nondet.exec_prompt" in contract,
    "web evidence": "gl.nondet.web.get" in contract,
    "exact source hashes": "source_hash_a" in contract and "source_hash_b" in contract,
    "source sizes compared": 'proposed.get("source_size_a"' in contract and 'proposed.get("source_size_b"' in contract,
    "single shot": "pair already evaluated" in contract,
    "successor lineage": "parent_pair_id" in contract and "only parent creator may register a successor" in contract,
    "consumer interface": "is_parity" in contract and "IClausem" in consumer,
    "registry counts": "def get_counts" in contract,
    "no escrow clone": all(word not in contract.lower() for word in ("milestone", "grantee", "funder", "escrow", "reward_wei")),
    "frontend present": "Register immutable pair" in frontend and "Evaluate pair" in frontend,
    "purple frontend": "--purple-3" in styles and "#6d23bd" in styles,
    "comic sans frontend": '"Comic Sans MS"' in styles,
    "docs explain limits": "residual semantic-oracle risk" in (ROOT / "docs" / "THREAT_MODEL.md").read_text(encoding="utf-8").lower(),
    "readme distinctness": "deliberately different from milestone/grant/escrow" in readme,
}

failed = [name for name, ok in checks.items() if not ok]
for name, ok in checks.items():
    print(f"[{'PASS' if ok else 'FAIL'}] {name}")
if failed:
    raise SystemExit("Preflight failed: " + ", ".join(failed))
print(f"Preflight passed: {len(checks)}/{len(checks)}")
