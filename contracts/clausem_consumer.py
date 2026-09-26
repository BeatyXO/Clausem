# v0.1.0
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *


@gl.contract_interface
class IClausem:
    class View:
        def is_parity(self, pair_id: u256, expected_pair_hash: str, expected_evaluation_hash: str) -> bool: ...

    class Write:
        pass


class ClausemGate(gl.Contract):
    """Minimal example consumer proving Clausem is composable infrastructure."""

    registry: Address

    def __init__(self, registry: str):
        self.registry = Address(registry)

    @gl.public.view
    def accepts(
        self,
        pair_id: u256,
        expected_pair_hash: str,
        expected_evaluation_hash: str,
    ) -> bool:
        return IClausem(self.registry).view().is_parity(
            pair_id,
            expected_pair_hash,
            expected_evaluation_hash,
        )
