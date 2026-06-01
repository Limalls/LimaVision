import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class StatusOSEnum(str, enum.Enum):
    EM_PRODUCAO = "EM_PRODUCAO"
    NO_LABORATORIO = "NO_LABORATORIO"
    PRONTO = "PRONTO"
    ENTREGUE = "ENTREGUE"


class OrdemDeServico(Base):
    __tablename__ = "ordens_servico"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    numero_os = Column(String(20), unique=True, nullable=False, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    armacao_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)

    tipo_lente = Column(String(100), nullable=True)
    od_esferico = Column(Float, nullable=True)
    od_cilindrico = Column(Float, nullable=True)
    od_eixo = Column(Integer, nullable=True)
    od_adicao = Column(Float, nullable=True)
    oe_esferico = Column(Float, nullable=True)
    oe_cilindrico = Column(Float, nullable=True)
    oe_eixo = Column(Integer, nullable=True)
    oe_adicao = Column(Float, nullable=True)
    dp = Column(Float, nullable=True)
    dnp = Column(Float, nullable=True)
    observacoes = Column(Text, nullable=True)

    valor = Column(Float, nullable=False)
    status = Column(Enum(StatusOSEnum), nullable=False, default=StatusOSEnum.EM_PRODUCAO)

    criado_em = Column(DateTime, nullable=False, default=datetime.utcnow)
    atualizado_em = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="ordens_servico")
    armacao = relationship("Produto", back_populates="ordens_servico")
    venda = relationship("Venda", back_populates="ordem_servico", uselist=False)
