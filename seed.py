"""
Pai, altere o gerente para o seus dados
o seed vai gerar o primeiro gerente
"""
from app.db import init_db
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.funcionario import Funcionario, PerfilEnum


def seed():
    init_db()
    db = SessionLocal()
    try:
        existing = db.query(Funcionario).filter(Funcionario.email == "gerente@limavision.com").first()
        if existing:
            print("Gerente padrão já existe.")
            return
        gerente = Funcionario(
            nome="Gerente LimaVision",
            email="gerente@limavision.com",
            senha_hash=get_password_hash("limavision123"),
            perfil=PerfilEnum.GERENTE,
            ativo=True,
        )
        db.add(gerente)
        db.commit()
        print("✅ Gerente padrão criado!")
        print("   Email: gerente@limavision.com")
        print("   Senha: limavision123")
        print("   ⚠️  Altere a senha após o primeiro login!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
