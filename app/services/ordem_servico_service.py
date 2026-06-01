from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.ordem_servico import OrdemDeServico, StatusOSEnum
from app.schemas.ordem_servico import OrdemDeServicoCreate, OrdemDeServicoUpdate, OrdemStatusUpdate


def _gerar_numero_os(db: Session) -> str:
    count = db.query(OrdemDeServico).count()
    return f"OS-{datetime.utcnow().year}-{count + 1:05d}"


def get_all(
    db: Session,
    cliente_id: Optional[int] = None,
    status_os: Optional[StatusOSEnum] = None,
) -> List[OrdemDeServico]:
    query = db.query(OrdemDeServico)
    if cliente_id:
        query = query.filter(OrdemDeServico.cliente_id == cliente_id)
    if status_os:
        query = query.filter(OrdemDeServico.status == status_os)
    return query.order_by(OrdemDeServico.criado_em.desc()).all()


def get_by_id(db: Session, os_id: int) -> OrdemDeServico:
    os = db.query(OrdemDeServico).filter(OrdemDeServico.id == os_id).first()
    if not os:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ordem de Serviço não encontrada.")
    return os


def create(db: Session, data: OrdemDeServicoCreate) -> OrdemDeServico:
    numero_os = _gerar_numero_os(db)
    os = OrdemDeServico(**data.model_dump(), numero_os=numero_os)
    db.add(os)
    db.commit()
    db.refresh(os)
    return os


def update(db: Session, os_id: int, data: OrdemDeServicoUpdate) -> OrdemDeServico:
    os = get_by_id(db, os_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(os, field, value)
    os.atualizado_em = datetime.utcnow()
    db.commit()
    db.refresh(os)
    return os


def update_status(db: Session, os_id: int, data: OrdemStatusUpdate) -> OrdemDeServico:
    os = get_by_id(db, os_id)
    os.status = data.status
    os.atualizado_em = datetime.utcnow()
    db.commit()
    db.refresh(os)
    return os


def delete(db: Session, os_id: int) -> None:
    os = get_by_id(db, os_id)
    db.delete(os)
    db.commit()
