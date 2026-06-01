#── Criando as tabelas

from app.db.session import Base, engine


def init_db():
    """Cria todas as tabelas no banco de dados."""
    from app.models import cliente, produto, ordem_servico, venda, funcionario  # noqa: F401
    Base.metadata.create_all(bind=engine)
