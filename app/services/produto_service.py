from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.produto import Produto, TipoProdutoEnum
from app.schemas.produto import ProdutoCreate, ProdutoUpdate


def get_all(db: Session, tipo: Optional[TipoProdutoEnum] = None) -> List[Produto]:
    query = db.query(Produto)
    if tipo:
        query = query.filter(Produto.tipo == tipo)
    return query.order_by(Produto.nome).all()


def get_by_id(db: Session, produto_id: int) -> Produto:
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")
    return produto


def create(db: Session, data: ProdutoCreate) -> Produto:
    produto = Produto(**data.model_dump())
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto


def update(db: Session, produto_id: int, data: ProdutoUpdate) -> Produto:
    produto = get_by_id(db, produto_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(produto, field, value)
    db.commit()
    db.refresh(produto)
    return produto


def delete(db: Session, produto_id: int) -> None:
    produto = get_by_id(db, produto_id)
    db.delete(produto)
    db.commit()
