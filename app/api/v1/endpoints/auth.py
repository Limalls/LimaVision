from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.funcionario import LoginInput, TokenOut
from app.services import funcionario_service

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=TokenOut)
def login(data: LoginInput, db: Session = Depends(get_db)):
    return funcionario_service.login(db, data)
