# LimaVision — OticaSupport API

API REST para gestão de ótica, desenvolvida com **Python + FastAPI**.  
Projeto acadêmico — PDS | Equipe Eclipse | Integrante: Teodoro Lima.

---

## Estrutura do Projeto

```
limavision/
├── app/
│   ├── main.py                  # Ponto de entrada FastAPI
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py      # Agrega todos os routers
│   │       └── endpoints/
│   │           ├── auth.py
│   │           ├── clientes.py
│   │           ├── produtos.py
│   │           ├── ordens.py
│   │           ├── vendas.py
│   │           ├── funcionarios.py
│   │           └── relatorios.py
│   ├── core/
│   │   ├── config.py            # Configurações via .env
│   │   ├── security.py          # JWT + hash de senha
│   │   └── deps.py              # Injeção de dependências (auth)
│   ├── db/
│   │   ├── __init__.py          # init_db()
│   │   └── session.py           # Engine, SessionLocal, get_db
│   ├── models/                  # Modelos SQLAlchemy
│   │   ├── cliente.py
│   │   ├── produto.py
│   │   ├── ordem_servico.py
│   │   ├── venda.py
│   │   └── funcionario.py
│   ├── schemas/                 # Schemas Pydantic (entrada/saída)
│   │   ├── cliente.py
│   │   ├── produto.py
│   │   ├── ordem_servico.py
│   │   ├── venda.py
│   │   ├── funcionario.py
│   │   └── relatorio.py
│   └── services/                # Lógica de negócio
│       ├── cliente_service.py
│       ├── produto_service.py
│       ├── ordem_servico_service.py
│       ├── venda_service.py
│       ├── funcionario_service.py
│       └── relatorio_service.py
├── seed.py                      # Cria o gerente inicial
├── requirements.txt
└── .env
```

---

## Instalação e Execução

```bash
# 1. Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Configurar variáveis de ambiente (edite o .env se necessário)
# O banco SQLite é criado automaticamente

# 4. Criar o gerente inicial
python seed.py

# 5. Rodar o servidor
uvicorn app.main:app --reload
```

A API estará disponível em: `http://localhost:8000`  
Documentação interativa: `http://localhost:8000/docs`

---

## Autenticação

Todos os endpoints (exceto `POST /auth/login`) requerem autenticação via **Bearer Token**.

```
POST /auth/login
Body: { "email": "gerente@limavision.com", "senha": "limavision123" }
```

Use o token retornado no header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Clientes `/clientes`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /clientes | Lista todos |
| GET | /clientes/{id} | Busca por ID |
| POST | /clientes | Cria novo |
| PUT | /clientes/{id} | Atualiza |
| DELETE | /clientes/{id} | Remove |
| GET | /clientes/{id}/ordens | OS do cliente |
| GET | /clientes/{id}/vendas | Vendas do cliente |

### Produtos `/produtos`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /produtos | Lista todos (filtro: `?tipo=ARMACAO`) |
| GET | /produtos/{id} | Busca por ID |
| POST | /produtos | Cria novo |
| PUT | /produtos/{id} | Atualiza |
| DELETE | /produtos/{id} | Remove |

### Ordens de Serviço `/ordens`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /ordens | Lista todas (filtros: `?cliente_id=`, `?status=`) |
| GET | /ordens/{id} | Busca por ID |
| POST | /ordens | Cria nova |
| PUT | /ordens/{id} | Atualiza |
| PATCH | /ordens/{id}/status | Atualiza só o status |
| DELETE | /ordens/{id} | Remove |

### Vendas `/vendas`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /vendas | Lista todas (filtros: `?cliente_id=`, `?data_inicio=`, `?data_fim=`) |
| GET | /vendas/{id} | Busca por ID |
| POST | /vendas | Cria nova (com itens) |
| PUT | /vendas/{id} | Atualiza |
| DELETE | /vendas/{id} | Remove |
| GET | /vendas/{id}/itens | Lista itens |
| POST | /vendas/{id}/itens | Adiciona item |
| DELETE | /vendas/{id}/itens/{item_id} | Remove item |

### Funcionários `/funcionarios` *(requer GERENTE)*
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /funcionarios | Lista todos |
| GET | /funcionarios/{id} | Busca por ID |
| POST | /funcionarios | Cria novo |
| PUT | /funcionarios/{id} | Atualiza |
| DELETE | /funcionarios/{id} | Desativa |

### Relatórios `/relatorios` *(requer GERENTE)*
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /relatorios/vendas | Relatório de vendas (filtro por período) |
| GET | /relatorios/ordens | Relatório de OS (filtro por período) |
| GET | /relatorios/geral | Relatório geral consolidado |

---

## Banco de Dados

Por padrão usa **SQLite** (`limavision.db`). Para usar PostgreSQL, altere o `.env`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/limavision
```
