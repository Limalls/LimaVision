from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.venda import Venda, ItemVenda
from app.schemas.venda import VendaCreate, VendaUpdate, ItemVendaCreate


def get_all(
    db: Session,
    cliente_id: Optional[int] = None,
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
) -> List[Venda]:
    query = db.query(Venda)
    if cliente_id:
        query = query.filter(Venda.cliente_id == cliente_id)
    if data_inicio:
        query = query.filter(Venda.criado_em >= data_inicio)
    if data_fim:
        query = query.filter(Venda.criado_em <= data_fim)
    return query.order_by(Venda.criado_em.desc()).all()


def get_by_id(db: Session, venda_id: int) -> Venda:
    venda = db.query(Venda).filter(Venda.id == venda_id).first()
    if not venda:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Venda não encontrada.")
    return venda


def create(db: Session, data: VendaCreate) -> Venda:
    itens_data = data.itens
    venda_data = data.model_dump(exclude={"itens"})
    venda = Venda(**venda_data)
    db.add(venda)
    db.flush()  # get venda.id before committing

    for item_data in itens_data:
        item = ItemVenda(**item_data.model_dump(), venda_id=venda.id)
        db.add(item)

    db.commit()
    db.refresh(venda)
    return venda


def update(db: Session, venda_id: int, data: VendaUpdate) -> Venda:
    venda = get_by_id(db, venda_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(venda, field, value)
    db.commit()
    db.refresh(venda)
    return venda


def delete(db: Session, venda_id: int) -> None:
    venda = get_by_id(db, venda_id)
    db.delete(venda)
    db.commit()


def get_itens(db: Session, venda_id: int) -> List[ItemVenda]:
    get_by_id(db, venda_id)
    return db.query(ItemVenda).filter(ItemVenda.venda_id == venda_id).all()


def add_item(db: Session, venda_id: int, data: ItemVendaCreate) -> ItemVenda:
    get_by_id(db, venda_id)
    item = ItemVenda(**data.model_dump(), venda_id=venda_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_item(db: Session, venda_id: int, item_id: int) -> None:
    get_by_id(db, venda_id)
    item = db.query(ItemVenda).filter(
        ItemVenda.id == item_id, ItemVenda.venda_id == venda_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado nesta venda.")
    db.delete(item)
    db.commit()
