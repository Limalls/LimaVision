from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.funcionario import PerfilEnum


class FuncionarioBase(BaseModel):
    nome: str = Field(..., max_length=150)
    email: str = Field(..., max_length=200)
    perfil: PerfilEnum


class FuncionarioCreate(FuncionarioBase):
    senha: str = Field(..., min_length=6)


class FuncionarioUpdate(BaseModel):
    nome: Optional[str] = Field(None, max_length=150)
    email: Optional[str] = Field(None, max_length=200)
    perfil: Optional[PerfilEnum] = None
    ativo: Optional[bool] = None
    senha: Optional[str] = Field(None, min_length=6)


class FuncionarioOut(FuncionarioBase):
    id: int
    ativo: bool
    criado_em: datetime

    model_config = {"from_attributes": True}


# Auth
class LoginInput(BaseModel):
    email: str
    senha: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    funcionario: FuncionarioOut
