from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_funcionario, require_gerente
from app.db.session import get_db
from app.schemas.funcionario import FuncionarioCreate, FuncionarioOut, FuncionarioUpdate
from app.services import funcionario_service

router = APIRouter(prefix="/funcionarios", tags=["Funcionários"])


@router.get("", response_model=List[FuncionarioOut])
def listar_funcionarios(
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    return funcionario_service.get_all(db)


@router.get("/{id}", response_model=FuncionarioOut)
def obter_funcionario(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_funcionario),
):
    return funcionario_service.get_by_id(db, id)


@router.post("", response_model=FuncionarioOut, status_code=201)
def criar_funcionario(
    data: FuncionarioCreate,
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    return funcionario_service.create(db, data)


@router.put("/{id}", response_model=FuncionarioOut)
def atualizar_funcionario(
    id: int,
    data: FuncionarioUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    return funcionario_service.update(db, id, data)


@router.delete("/{id}", status_code=204)
def desativar_funcionario(
    id: int,
    db: Session = Depends(get_db),
    _=Depends(require_gerente),
):
    funcionario_service.delete(db, id)
