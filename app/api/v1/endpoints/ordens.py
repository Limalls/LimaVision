from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_funcionario
from app.db.session import get_db
from app.models.ordem_servico import StatusOSEnum
from app.schemas.ordem_servico import (
    OrdemDeServicoCreate,
    OrdemDeServicoOut,
    OrdemDeServicoUpdate,
    OrdemStatusUpdate,
)
from app.services import ordem_servico_service

router = APIRouter(prefix="/ordens", tags=["Ordens de Serviço"])


@router.get("", response_model=List[OrdemDeServicoOut])
def listar_ordens(
    cliente_id: Optional[int] = Query(None),
    status: Optional[StatusOSEnum] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return ordem_servico_service.get_all(db, cliente_id=cliente_id, status_os=status)


@router.get("/{id}", response_model=OrdemDeServicoOut)
def obter_ordem(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return ordem_servico_service.get_by_id(db, id)


@router.post("", response_model=OrdemDeServicoOut, status_code=201)
def criar_ordem(
    data: OrdemDeServicoCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return ordem_servico_service.create(db, data)


@router.put("/{id}", response_model=OrdemDeServicoOut)
def atualizar_ordem(
    id: int,
    data: OrdemDeServicoUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return ordem_servico_service.update(db, id, data)


@router.patch("/{id}/status", response_model=OrdemDeServicoOut)
def atualizar_status_ordem(
    id: int,
    data: OrdemStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return ordem_servico_service.update_status(db, id, data)


@router.delete("/{id}", status_code=204)
def remover_ordem(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    ordem_servico_service.delete(db, id)
