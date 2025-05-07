from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException

from models import Pregunta, Categoria
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/preguntas",
    tags=["Preguntas"]
)

class PreguntaBase(BaseModel):
    enunciado: str
    pista: Optional[str] = None
    explicacion: Optional[str] = None
    dificultad: str
    id_categoria: int

class CrearPregunta(PreguntaBase):
    pass

@router.get("/")
def get_pregunta(db: db_dependency, id_pregunta: int):
    pregunta = db.query(Pregunta).filter(Pregunta.id == id_pregunta).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    return pregunta

@router.get("/preguntas")
def get_all_preguntas(db: db_dependency):
    return db.query(Pregunta).all()

@router.post("/", status_code=201)
def create_pregunta(db: db_dependency, pregunta: CrearPregunta, user: user_dependency):
    categoria = db.query(Categoria).filter(Categoria.id == pregunta.id_categoria).first()
    if not categoria:
        raise HTTPException(
            status_code=404,
            detail=f"Categoría con id {pregunta.id_categoria} no encontrada"
        )
    
    try:
        db_pregunta = Pregunta(**pregunta.model_dump())
        db.add(db_pregunta)
        db.commit()
        db.refresh(db_pregunta)
        return db_pregunta
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear la pregunta: {str(e)}"
        )

@router.delete("/")
def delete_pregunta(db: db_dependency, id_pregunta: int, user: user_dependency):
    db_pregunta = db.query(Pregunta).filter(Pregunta.id == id_pregunta).first()
    if db_pregunta:
        db.delete(db_pregunta)
        db.commit()
        return db_pregunta
    else:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")