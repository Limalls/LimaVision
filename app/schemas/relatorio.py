from typing import List

from pydantic import BaseModel

from app.schemas.venda import VendaOut
from app.schemas.ordem_servico import OrdemDeServicoOut


class RelatorioVendasOut(BaseModel):
    total_vendas: int
    faturamento_total: float
    vendas: List[VendaOut]


class RelatorioOrdensOut(BaseModel):
    total_ordens: int
    valor_total: float
    ordens: List[OrdemDeServicoOut]


class RelatorioGeralOut(BaseModel):
    total_vendas: int
    faturamento_vendas: float
    total_ordens: int
    valor_ordens: float
    faturamento_geral: float
