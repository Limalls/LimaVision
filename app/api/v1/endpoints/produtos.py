from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_funcionario
from app.db.session import get_db
from app.models.produto import TipoProdutoEnum
from app.schemas.produto import ProdutoCreate, ProdutoOut, ProdutoUpdate
from app.services import produto_service

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("", response_model=List[ProdutoOut])
def listar_produtos(
    tipo: Optional[TipoProdutoEnum] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return produto_service.get_all(db, tipo=tipo)


@router.get("/{id}", response_model=ProdutoOut)
def obter_produto(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return produto_service.get_by_id(db, id)


@router.post("", response_model=ProdutoOut, status_code=201)
def criar_produto(
    data: ProdutoCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return produto_service.create(db, data)


@router.put("/{id}", response_model=ProdutoOut)
def atualizar_produto(
    id: int,
    data: ProdutoUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return produto_service.update(db, id, data)


@router.delete("/{id}", status_code=204)
def remover_produto(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    produto_service.delete(db, id)
