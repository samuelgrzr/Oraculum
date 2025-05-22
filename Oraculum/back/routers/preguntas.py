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
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden crear preguntas"
        )
    
    # Verificar si ya existe una pregunta con ese enunciado
    existing_pregunta = db.query(Pregunta).filter(
        Pregunta.enunciado == pregunta.enunciado
    ).first()
    
    if existing_pregunta:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una pregunta con este enunciado"
        )
    
    categoria = db.query(Categoria).filter(Categoria.id == pregunta.id_categoria).first()
    if not categoria:
        raise HTTPException(status_code=404, detail=f"Categoría con id {pregunta.id_categoria} no encontrada")
    
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

@router.put("/{id_pregunta}", status_code=200)
def edit_pregunta(db: db_dependency, id_pregunta: int, pregunta: CrearPregunta, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden editar preguntas"
        )
    try:
        # Verificar si ya existe otra pregunta con ese enunciado
        existing_pregunta = db.query(Pregunta).filter(
            Pregunta.enunciado == pregunta.enunciado,
            Pregunta.id != id_pregunta
        ).first()
        
        if existing_pregunta:
            raise HTTPException(
                status_code=400,
                detail="Ya existe una pregunta con este enunciado"
            )
        
        db_pregunta = db.query(Pregunta).filter(Pregunta.id == id_pregunta).first()
        if not db_pregunta:
            raise HTTPException(status_code=404, detail="Pregunta no encontrada")
        
        if pregunta.id_categoria != db_pregunta.id_categoria:
            categoria = db.query(Categoria).filter(Categoria.id == pregunta.id_categoria).first()
            if not categoria:
                raise HTTPException(status_code=404, detail=f"Categoría con id {pregunta.id_categoria} no encontrada")
        
        for key, value in pregunta.model_dump().items():
            setattr(db_pregunta, key, value)
            
        db.commit()
        db.refresh(db_pregunta)
        return db_pregunta
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar la pregunta: {str(e)}"
        )

@router.delete("/{id_pregunta}")
def delete_pregunta(db: db_dependency, id_pregunta: int, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden eliminar preguntas"
        )
    db_pregunta = db.query(Pregunta).filter(Pregunta.id == id_pregunta).first()
    if db_pregunta:
        db.delete(db_pregunta)
        db.commit()
        return db_pregunta
    else:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")