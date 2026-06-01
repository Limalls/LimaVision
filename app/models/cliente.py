from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(150), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    telefone = Column(String(20), nullable=True)
    data_nascimento = Column(Date, nullable=True)
    criado_em = Column(DateTime, nullable=False, default=datetime.utcnow)

    ordens_servico = relationship("OrdemDeServico", back_populates="cliente", lazy="select")
    vendas = relationship("Venda", back_populates="cliente", lazy="select")
