from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api.v1 import api_router
from app.db import init_db

app = FastAPI(
    title="LimaVision — OticaSupport API",
    description="Sistema de gestão para ótica: clientes, produtos, ordens de serviço e vendas.",
    version="0.4.0",
    contact={"name": "Teodoro Lima", "email": "contato@limavision.com"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(api_router)


# ── Parte do front end

STATIC_DIR = Path(__file__).parent.parent / "static"

if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/", include_in_schema=False)
    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend(full_path: str = ""):
        index = STATIC_DIR / "index.html"
        if index.exists():
            return FileResponse(index)
        return {"status": "ok", "sistema": "LimaVision OticaSupport", "versao": "0.4.0"}
else:
    @app.get("/", tags=["Health"])
    def health_check():
        return {"status": "ok", "sistema": "LimaVision OticaSupport", "versao": "0.4.0",
                "aviso": "Frontend não buildado. Rode: cd frontend && npm install && npm run build"}
