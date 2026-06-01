from app.schemas.cliente import ClienteCreate, ClienteUpdate, ClienteOut
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoOut
from app.schemas.ordem_servico import (
    OrdemDeServicoCreate,
    OrdemDeServicoUpdate,
    OrdemStatusUpdate,
    OrdemDeServicoOut,
)
from app.schemas.venda import VendaCreate, VendaUpdate, VendaOut, ItemVendaCreate, ItemVendaOut
from app.schemas.funcionario import FuncionarioCreate, FuncionarioUpdate, FuncionarioOut, LoginInput, TokenOut
from app.schemas.relatorio import RelatorioVendasOut, RelatorioOrdensOut, RelatorioGeralOut
