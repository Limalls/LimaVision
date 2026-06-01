from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.ordem_servico import StatusOSEnum


class OrdemDeServicoBase(BaseModel):
    cliente_id: int
    armacao_id: Optional[int] = None
    tipo_lente: Optional[str] = Field(None, max_length=100)
    od_esferico: Optional[float] = None
    od_cilindrico: Optional[float] = None
    od_eixo: Optional[int] = Field(None, ge=0, le=180)
    od_adicao: Optional[float] = None
    oe_esferico: Optional[float] = None
    oe_cilindrico: Optional[float] = None
    oe_eixo: Optional[int] = Field(None, ge=0, le=180)
    oe_adicao: Optional[float] = None
    dp: Optional[float] = None
    dnp: Optional[float] = None
    observacoes: Optional[str] = None
    valor: float = Field(..., gt=0)
    status: StatusOSEnum = StatusOSEnum.EM_PRODUCAO


class OrdemDeServicoCreate(OrdemDeServicoBase):
    pass


class OrdemDeServicoUpdate(BaseModel):
    armacao_id: Optional[int] = None
    tipo_lente: Optional[str] = Field(None, max_length=100)
    od_esferico: Optional[float] = None
    od_cilindrico: Optional[float] = None
    od_eixo: Optional[int] = Field(None, ge=0, le=180)
    od_adicao: Optional[float] = None
    oe_esferico: Optional[float] = None
    oe_cilindrico: Optional[float] = None
    oe_eixo: Optional[int] = Field(None, ge=0, le=180)
    oe_adicao: Optional[float] = None
    dp: Optional[float] = None
    dnp: Optional[float] = None
    observacoes: Optional[str] = None
    valor: Optional[float] = Field(None, gt=0)
    status: Optional[StatusOSEnum] = None


class OrdemStatusUpdate(BaseModel):
    status: StatusOSEnum


class OrdemDeServicoOut(OrdemDeServicoBase):
    id: int
    numero_os: str
    criado_em: datetime
    atualizado_em: datetime

    model_config = {"from_attributes": True}
