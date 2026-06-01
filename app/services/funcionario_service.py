from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.funcionario import Funcionario
from app.schemas.funcionario import FuncionarioCreate, FuncionarioUpdate, LoginInput, TokenOut, FuncionarioOut


def get_all(db: Session) -> List[Funcionario]:
    return db.query(Funcionario).order_by(Funcionario.nome).all()


def get_by_id(db: Session, funcionario_id: int) -> Funcionario:
    f = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not f:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Funcionário não encontrado.")
    return f


def create(db: Session, data: FuncionarioCreate) -> Funcionario:
    if db.query(Funcionario).filter(Funcionario.email == data.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="E-mail já cadastrado.")
    f = Funcionario(
        nome=data.nome,
        email=data.email,
        senha_hash=get_password_hash(data.senha),
        perfil=data.perfil,
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    return f


def update(db: Session, funcionario_id: int, data: FuncionarioUpdate) -> Funcionario:
    f = get_by_id(db, funcionario_id)
    updates = data.model_dump(exclude_unset=True)
    if "senha" in updates:
        f.senha_hash = get_password_hash(updates.pop("senha"))
    if "email" in updates and updates["email"] != f.email:
        if db.query(Funcionario).filter(Funcionario.email == updates["email"]).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="E-mail já cadastrado.")
    for field, value in updates.items():
        setattr(f, field, value)
    db.commit()
    db.refresh(f)
    return f


def delete(db: Session, funcionario_id: int) -> None:
    f = get_by_id(db, funcionario_id)
    f.ativo = False
    db.commit()


def login(db: Session, data: LoginInput) -> TokenOut:
    f = db.query(Funcionario).filter(Funcionario.email == data.email).first()
    if not f or not f.ativo or not verify_password(data.senha, f.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas.",
        )
    token = create_access_token({"sub": str(f.id)})
    return TokenOut(access_token=token, funcionario=FuncionarioOut.model_validate(f))
