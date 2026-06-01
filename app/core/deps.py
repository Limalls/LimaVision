from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.funcionario import Funcionario, PerfilEnum

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_funcionario(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Funcionario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    funcionario_id: int = payload.get("sub")
    if funcionario_id is None:
        raise credentials_exception

    funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if funcionario is None or not funcionario.ativo:
        raise credentials_exception
    return funcionario


def require_gerente(
    current: Funcionario = Depends(get_current_funcionario),
) -> Funcionario:
    if current.perfil != PerfilEnum.GERENTE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a gerentes.",
        )
    return current
