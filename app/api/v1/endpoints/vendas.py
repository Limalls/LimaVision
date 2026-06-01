from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_funcionario
from app.db.session import get_db
from app.schemas.venda import ItemVendaCreate, ItemVendaOut, VendaCreate, VendaOut, VendaUpdate
from app.services import venda_service

router = APIRouter(prefix="/vendas", tags=["Vendas"])


@router.get("", response_model=List[VendaOut])
def listar_vendas(
    cliente_id: Optional[int] = Query(None),
    data_inicio: Optional[datetime] = Query(None),
    data_fim: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return venda_service.get_all(db, cliente_id=cliente_id, data_inicio=data_inicio, data_fim=data_fim)


@router.get("/{id}", response_model=VendaOut)
def obter_venda(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return venda_service.get_by_id(db, id)


@router.post("", response_model=VendaOut, status_code=201)
def criar_venda(
    data: VendaCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return venda_service.create(db, data)


@router.put("/{id}", response_model=VendaOut)
def atualizar_venda(
    id: int,
    data: VendaUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return venda_service.update(db, id, data)


@router.delete("/{id}", status_code=204)
def remover_venda(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    venda_service.delete(db, id)


@router.get("/{id}/itens", response_model=List[ItemVendaOut])
def listar_itens_venda(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return venda_service.get_itens(db, id)


@router.post("/{id}/itens", response_model=ItemVendaOut, status_code=201)
def adicionar_item_venda(
    id: int,
    data: ItemVendaCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return venda_service.add_item(db, id, data)


@router.delete("/{id}/itens/{item_id}", status_code=204)
def remover_item_venda(
    id: int,
    item_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    venda_service.remove_item(db, id, item_id)
