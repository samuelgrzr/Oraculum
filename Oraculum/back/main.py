from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from routers import auth, usuarios, categorias, preguntas, respuestas, partidas, audiencia

from database import engine, Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

# Para confiar en proxies (Railway)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "https://oraculum-rosy.vercel.app"],
    allow_origin_regex=r"https://oraculum-rosy\.vercel\.app.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(categorias.router)
app.include_router(preguntas.router)
app.include_router(respuestas.router)
app.include_router(partidas.router)
app.include_router(audiencia.router)
