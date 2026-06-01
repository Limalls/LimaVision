from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import require_gerente
from app.db.session import get_db
from app.schemas.relatorio import RelatorioGeralOut, RelatorioOrdensOut, RelatorioVendasOut
from app.services import relatorio_service

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])


@router.get("/vendas", response_model=RelatorioVendasOut)
def relatorio_vendas(
    inicio: Optional[datetime] = Query(None),
    fim: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    return relatorio_service.relatorio_vendas(db, inicio=inicio, fim=fim)


@router.get("/ordens", response_model=RelatorioOrdensOut)
def relatorio_ordens(
    inicio: Optional[datetime] = Query(None),
    fim: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    return relatorio_service.relatorio_ordens(db, inicio=inicio, fim=fim)


@router.get("/geral", response_model=RelatorioGeralOut)
def relatorio_geral(
    inicio: Optional[datetime] = Query(None),
    fim: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    return relatorio_service.relatorio_geral(db, inicio=inicio, fim=fim)
