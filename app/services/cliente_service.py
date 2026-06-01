from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteUpdate


def get_all(db: Session) -> List[Cliente]:
    return db.query(Cliente).order_by(Cliente.nome).all()


def get_by_id(db: Session, cliente_id: int) -> Cliente:
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    return cliente


def create(db: Session, data: ClienteCreate) -> Cliente:
    existing = db.query(Cliente).filter(Cliente.cpf == data.cpf).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="CPF já cadastrado.")
    cliente = Cliente(**data.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


def update(db: Session, cliente_id: int, data: ClienteUpdate) -> Cliente:
    cliente = get_by_id(db, cliente_id)
    updates = data.model_dump(exclude_unset=True)
    if "cpf" in updates and updates["cpf"] != cliente.cpf:
        existing = db.query(Cliente).filter(Cliente.cpf == updates["cpf"]).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="CPF já cadastrado.")
    for field, value in updates.items():
        setattr(cliente, field, value)
    db.commit()
    db.refresh(cliente)
    return cliente


def delete(db: Session, cliente_id: int) -> None:
    cliente = get_by_id(db, cliente_id)
    db.delete(cliente)
    db.commit()
