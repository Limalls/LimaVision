#!/bin/bash
# ──────────────────────────────────────────────────────────────
#  Uso: bash start.sh | Use antes pai, para dar start no sistema
# ──────────────────────────────────────────────────────────────

set -e
cd "$(dirname "$0")"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║        👁️  LimaVision — Setup         ║"
echo "╚══════════════════════════════════════╝"
echo ""

#dps deixar mais bunito
if [ ! -d "venv" ]; then
  echo "Criando ambiente virtual Python"
  python3 -m venv venv
fi

echo "Ativando ambiente virtual"
source venv/bin/activate

echo "Instalando dependências Python"
pip install -r requirements.txt -q

echo "Verificando banco de dados"
python seed.py

echo ""
echo "Configurando frontend"
cd frontend

if [ ! -d "node_modules" ]; then
  echo "Instalando dependências Node"
  npm install
fi

echo "Buildando frontend"
npm run build

cd ..

echo ""
echo "╔══════════════════════════════════════╗"
echo "║            Tudo pronto!              ║"
echo "║                                      ║"
echo "║     http://localhost:8000            ║"
echo "║     http://localhost:8000/docs       ║"
echo "║                                      ║"
echo "║  Login: gerente@limavision.com       ║"
echo "║  Senha: limavision123                ║"
echo "╚══════════════════════════════════════╝"
echo ""

uvicorn app.main:app --reload
