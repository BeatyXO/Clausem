import json
from pathlib import Path

CONTRACT_SOURCE = (Path(__file__).parents[1] / "contracts" / "clausem.py").read_text(encoding="utf-8")

PARITY = 1
DRIFT = 2
AMBIGUOUS = 3

EQUIVALENT = "EQUIVALENT"
CONFLICT = "CONFLICT"
MISSING_IN_B = "MISSING_IN_B"

COMMIT_A = "a" * 40
COMMIT_B = "b" * 40
URL_A = f"https://raw.githubusercontent.com/example/policies/{COMMIT_A}/terms-en.txt"
URL_B = f"https://raw.githubusercontent.com/example/policies/{COMMIT_B}/terms-fr.txt"


def deploy(direct_vm, direct_deploy):
    direct_vm.check_pickling = True
    return direct_deploy("contracts/clausem.py", sdk_version="v0.2.16")


def llm_vector(*statuses):
    return {
        "comparisons": [
            {"category": index + 1, "status": status}
            for index, status in enumerate(statuses)
        ]
    }


def register(c, parent=0):
    return c.register_pair(
        parent,
        "Terms parity",
        "Service Terms",
        "en",
        "fr",
        URL_A,
        URL_B,
        json.dumps([1, 2, 3]),
    )


def mock_sources(direct_vm, a=b"Users must pay $10 monthly. Users may cancel anytime.", b=b"Les utilisateurs paient 10 USD par mois. Ils peuvent annuler a tout moment."):
    direct_vm.mock_web(r"raw\.githubusercontent\.com/example/policies/a+", {"status": 200, "body": a})
    direct_vm.mock_web(r"raw\.githubusercontent\.com/example/policies/b+", {"status": 200, "body": b})


def test_contract_shape_is_distinct_consensus_registry():
    assert "class Clausem(gl.Contract)" in CONTRACT_SOURCE
    assert "run_nondet_unsafe" in CONTRACT_SOURCE
    assert "source_hash_a" in CONTRACT_SOURCE
    assert "deterministic_overall" in CONTRACT_SOURCE
    assert "reward" not in CONTRACT_SOURCE.lower()
    assert "milestone" not in CONTRACT_SOURCE.lower()
    assert "escrow" not in CONTRACT_SOURCE.lower()


def test_rejects_mutable_github_branch_url(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    with direct_vm.expect_revert("pinned to a 40-hex commit"):
        c.register_pair(
            0,
            "Bad source",
            "Service Terms",
            "en",
            "fr",
            "https://raw.githubusercontent.com/example/policies/main/terms-en.txt",
            URL_B,
            json.dumps([1]),
        )


def test_pair_definition_is_hashed_and_immutable(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    item = c.get_pair(pair)
    assert item["status_name"] == "REGISTERED"
    assert len(item["pair_hash"]) == 64
    assert item["categories"] == [1, 2, 3]


def test_parity_evaluation_binds_exact_source_hashes(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    assert int(c.evaluate_pair(pair)) == PARITY
    p = c.get_pair(pair)
    e = c.get_evaluation(p["evaluation_id"])
    assert e["overall_name"] == "PARITY"
    assert len(e["source_hash_a"]) == 64
    assert len(e["source_hash_b"]) == 64
    assert len(e["evaluation_hash"]) == 64
    assert c.is_parity(pair, p["pair_hash"], e["evaluation_hash"]) is True


def test_material_difference_is_drift_not_a_money_decision(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, CONFLICT, EQUIVALENT))
    assert int(c.evaluate_pair(pair)) == DRIFT
    e = c.get_evaluation(c.get_pair(pair)["evaluation_id"])
    assert e["overall_name"] == "MATERIAL_DRIFT"


def test_missing_material_clause_is_drift(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, MISSING_IN_B))
    assert int(c.evaluate_pair(pair)) == DRIFT


def test_malformed_llm_output_fails_closed_to_ambiguous(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", {"wrong": "shape"})
    assert int(c.evaluate_pair(pair)) == AMBIGUOUS
    e = c.get_evaluation(c.get_pair(pair)["evaluation_id"])
    assert e["status_names"] == ["AMBIGUOUS", "AMBIGUOUS", "AMBIGUOUS"]


def test_validator_rejects_semantic_forgery(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    direct_vm.clear_mocks()
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, CONFLICT, EQUIVALENT))
    assert direct_vm.run_validator() is False


def test_validator_rejects_changed_source_bytes_even_if_semantics_match(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    direct_vm.clear_mocks()
    mock_sources(direct_vm, a=b"Changed bytes after leader fetch", b=b"Same translated meaning")
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    assert direct_vm.run_validator() is False


def test_validator_accepts_same_evidence_and_material_vector(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    direct_vm.clear_mocks()
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    assert direct_vm.run_validator() is True


def test_evaluation_is_single_shot(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    with direct_vm.expect_revert("pair already evaluated"):
        c.evaluate_pair(pair)


def test_successor_is_new_definition_and_parent_stays_final(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    old_hash = c.get_pair(pair)["pair_hash"]
    successor = c.register_pair(
        pair,
        "Terms parity v2",
        "Service Terms",
        "en",
        "fr",
        URL_A,
        f"https://raw.githubusercontent.com/example/policies/{'c'*40}/terms-fr-v2.txt",
        json.dumps([1, 2, 3]),
    )
    assert c.get_pair(successor)["parent_pair_id"] == pair
    assert c.get_pair(successor)["pair_hash"] != old_hash
    assert c.get_pair(pair)["status_name"] == "EVALUATED"


def test_consumer_binding_rejects_wrong_hashes(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    p = c.get_pair(pair)
    e = c.get_evaluation(p["evaluation_id"])
    assert c.is_parity(pair, "0" * 64, e["evaluation_hash"]) is False
    assert c.is_parity(pair, p["pair_hash"], "0" * 64) is False


def test_duplicate_categories_are_rejected(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    with direct_vm.expect_revert("duplicate category"):
        c.register_pair(0, "Dup", "Service Terms", "en", "fr", URL_A, URL_B, json.dumps([1, 1]))


def test_registry_counts_track_pairs_and_evaluations(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    assert c.get_counts() == {"pair_count": 0, "evaluation_count": 0}
    pair = register(c)
    assert c.get_counts() == {"pair_count": 1, "evaluation_count": 0}
    mock_sources(direct_vm)
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    c.evaluate_pair(pair)
    assert c.get_counts() == {"pair_count": 1, "evaluation_count": 1}


def test_identical_source_urls_are_rejected(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    with direct_vm.expect_revert("source A and source B must differ"):
        c.register_pair(0, "Same", "Service Terms", "en", "fr", URL_A, URL_A, json.dumps([1]))


def test_source_over_semantic_limit_fails_instead_of_silent_truncation(direct_vm, direct_deploy):
    c = deploy(direct_vm, direct_deploy)
    pair = register(c)
    direct_vm.mock_web(r"raw\.githubusercontent\.com/example/policies/a+", {"status": 200, "body": b"A" * 18001})
    direct_vm.mock_web(r"raw\.githubusercontent\.com/example/policies/b+", {"status": 200, "body": b"B"})
    direct_vm.mock_llm(r"CLAUSEM / MATERIAL PARITY CLASSIFICATION", llm_vector(EQUIVALENT, EQUIVALENT, EQUIVALENT))
    with direct_vm.expect_revert("semantic text limit"):
        c.evaluate_pair(pair)
