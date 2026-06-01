from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.venda import FormaPagamentoEnum


class ItemVendaBase(BaseModel):
    produto_id: int
    quantidade: int = Field(..., ge=1)
    preco_unitario: float = Field(..., ge=0)


class ItemVendaCreate(ItemVendaBase):
    pass


class ItemVendaOut(ItemVendaBase):
    id: int
    venda_id: int

    model_config = {"from_attributes": True}


class VendaBase(BaseModel):
    cliente_id: int
    os_id: Optional[int] = None
    forma_pagamento: FormaPagamentoEnum
    valor_total: float = Field(..., gt=0)


class VendaCreate(VendaBase):
    itens: List[ItemVendaCreate] = []


class VendaUpdate(BaseModel):
    forma_pagamento: Optional[FormaPagamentoEnum] = None
    valor_total: Optional[float] = Field(None, gt=0)
    os_id: Optional[int] = None


class VendaOut(VendaBase):
    id: int
    criado_em: datetime
    itens: List[ItemVendaOut] = []

    model_config = {"from_attributes": True}
