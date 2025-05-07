from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, categorias, preguntas

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
app.include_router(categorias.router)
app.include_router(preguntas.router)