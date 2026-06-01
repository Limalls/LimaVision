from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.produto import TipoProdutoEnum


class ProdutoBase(BaseModel):
    nome: str = Field(..., max_length=200)
    tipo: TipoProdutoEnum
    custo: float = Field(..., ge=0)
    preco_venda: float = Field(..., ge=0)
    quantidade: int = Field(..., ge=0)


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = Field(None, max_length=200)
    tipo: Optional[TipoProdutoEnum] = None
    custo: Optional[float] = Field(None, ge=0)
    preco_venda: Optional[float] = Field(None, ge=0)
    quantidade: Optional[int] = Field(None, ge=0)


class ProdutoOut(ProdutoBase):
    id: int
    criado_em: datetime

    model_config = {"from_attributes": True}
