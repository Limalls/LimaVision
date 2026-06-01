from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_funcionario
from app.db.session import get_db
from app.schemas.cliente import ClienteCreate, ClienteOut, ClienteUpdate
from app.schemas.ordem_servico import OrdemDeServicoOut
from app.schemas.venda import VendaOut
from app.services import cliente_service
from app.models.ordem_servico import OrdemDeServico
from app.models.venda import Venda

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("", response_model=List[ClienteOut])
def listar_clientes(
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return cliente_service.get_all(db)


@router.get("/{id}", response_model=ClienteOut)
def obter_cliente(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return cliente_service.get_by_id(db, id)


@router.post("", response_model=ClienteOut, status_code=201)
def criar_cliente(
    data: ClienteCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return cliente_service.create(db, data)


@router.put("/{id}", response_model=ClienteOut)
def atualizar_cliente(
    id: int,
    data: ClienteUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return cliente_service.update(db, id, data)

#arrumar o delete, ta dando erro
@router.delete("/{id}", status_code=204)
def remover_cliente(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    cliente_service.delete(db, id)


@router.get("/{id}/ordens", response_model=List[OrdemDeServicoOut])
def listar_ordens_do_cliente(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    cliente = cliente_service.get_by_id(db, id)
    return db.query(OrdemDeServico).filter(OrdemDeServico.cliente_id == cliente.id).all()


@router.get("/{id}/vendas", response_model=List[VendaOut])
def listar_vendas_do_cliente(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    cliente = cliente_service.get_by_id(db, id)
    return db.query(Venda).filter(Venda.cliente_id == cliente.id).all()
