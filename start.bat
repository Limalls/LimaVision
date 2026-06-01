@echo off

cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════╗
echo ║        LimaVision - Setup            ║
echo ╚══════════════════════════════════════╝
echo.

REM mesma coisa soq pra windowns


if not exist "venv" (
    echo Criando ambiente virtual Python...
    python -m venv venv
)

echo Ativando ambiente virtual...
call venv\Scripts\activate

echo Instalando dependencias Python...
pip install -r requirements.txt -q

echo Verificando banco de dados...
python seed.py

echo.
echo Configurando frontend...
cd frontend

if not exist "node_modules" (
    echo Instalando dependencias Node...
    npm install
)

echo Buildando frontend...
npm run build

cd ..

echo.
echo ╔══════════════════════════════════════╗
echo ║          Tudo pronto!                ║
echo ║                                      ║
echo ║  http://localhost:8000               ║
echo ║  http://localhost:8000/docs          ║
echo ║                                      ║
echo ║  Login: gerente@limavision.com       ║
echo ║  Senha: limavision123                ║
echo ╚══════════════════════════════════════╝
echo.

uvicorn app.main:app --reload
