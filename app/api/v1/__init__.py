#Rotas da api 
from fastapi import APIRouter

from app.api.v1.endpoints import auth, clientes, funcionarios, ordens, produtos, relatorios, vendas

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(clientes.router)
api_router.include_router(produtos.router)
api_router.include_router(ordens.router)
api_router.include_router(vendas.router)
api_router.include_router(funcionarios.router)
api_router.include_router(relatorios.router)
