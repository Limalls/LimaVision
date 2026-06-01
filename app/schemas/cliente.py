from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class ClienteBase(BaseModel):
    nome: str = Field(..., max_length=150)
    cpf: str = Field(..., max_length=14)
    telefone: Optional[str] = Field(None, max_length=20)
    data_nascimento: Optional[date] = None



class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nome: Optional[str] = Field(None, max_length=150)
    cpf: Optional[str] = Field(None, max_length=14)
    telefone: Optional[str] = Field(None, max_length=20)
    data_nascimento: Optional[date] = None


class ClienteOut(ClienteBase):
    id: int
    criado_em: datetime

    model_config = {"from_attributes": True}
