from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.venda import Venda
from app.models.ordem_servico import OrdemDeServico
from app.schemas.relatorio import RelatorioVendasOut, RelatorioOrdensOut, RelatorioGeralOut


def relatorio_vendas(
    db: Session,
    inicio: Optional[datetime] = None,
    fim: Optional[datetime] = None,
) -> RelatorioVendasOut:
    query = db.query(Venda)
    if inicio:
        query = query.filter(Venda.criado_em >= inicio)
    if fim:
        query = query.filter(Venda.criado_em <= fim)
    vendas = query.all()
    return RelatorioVendasOut(
        total_vendas=len(vendas),
        faturamento_total=sum(v.valor_total for v in vendas),
        vendas=vendas,
    )


def relatorio_ordens(
    db: Session,
    inicio: Optional[datetime] = None,
    fim: Optional[datetime] = None,
) -> RelatorioOrdensOut:
    query = db.query(OrdemDeServico)
    if inicio:
        query = query.filter(OrdemDeServico.criado_em >= inicio)
    if fim:
        query = query.filter(OrdemDeServico.criado_em <= fim)
    ordens = query.all()
    return RelatorioOrdensOut(
        total_ordens=len(ordens),
        valor_total=sum(o.valor for o in ordens),
        ordens=ordens,
    )


def relatorio_geral(
    db: Session,
    inicio: Optional[datetime] = None,
    fim: Optional[datetime] = None,
) -> RelatorioGeralOut:
    rv = relatorio_vendas(db, inicio, fim)
    ro = relatorio_ordens(db, inicio, fim)
    return RelatorioGeralOut(
        total_vendas=rv.total_vendas,
        faturamento_vendas=rv.faturamento_total,
        total_ordens=ro.total_ordens,
        valor_ordens=ro.valor_total,
        faturamento_geral=rv.faturamento_total + ro.valor_total,
    )
