import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Float, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class TipoProdutoEnum(str, enum.Enum):
    ARMACAO = "ARMACAO"
    LENTE = "LENTE"


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    tipo = Column(Enum(TipoProdutoEnum), nullable=False)
    custo = Column(Float, nullable=False)
    preco_venda = Column(Float, nullable=False)
    quantidade = Column(Integer, nullable=False, default=0)
    criado_em = Column(DateTime, nullable=False, default=datetime.utcnow)

    itens_venda = relationship("ItemVenda", back_populates="produto", lazy="select")
    ordens_servico = relationship("OrdemDeServico", back_populates="armacao", lazy="select")
