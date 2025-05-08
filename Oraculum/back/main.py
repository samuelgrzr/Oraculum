from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, usuarios, categorias, preguntas, respuestas

from database import engine, Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(categorias.router)
app.include_router(preguntas.router)
app.include_router(respuestas.router)