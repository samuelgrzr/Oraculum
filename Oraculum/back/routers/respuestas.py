from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException

from models import Respuesta, Pregunta
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/respuestas",
    tags=["Respuestas"]
)

class RespuestaBase(BaseModel):
    texto: str
    es_correcta: bool
    id_pregunta: int

class CrearRespuesta(RespuestaBase):
    pass

@router.get("/")
def get_respuesta(db: db_dependency, id_respuesta: int):
    respuesta = db.query(Respuesta).filter(Respuesta.id == id_respuesta).first()
    if not respuesta:
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")
    return respuesta

@router.get("/respuestas")
def get_all_respuestas(db: db_dependency):
    return db.query(Respuesta).all()

@router.post("/", status_code=201)
def create_respuesta(db: db_dependency, respuesta: CrearRespuesta, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden crear respuestas"
        )
    pregunta = db.query(Pregunta).filter(Pregunta.id == respuesta.id_pregunta).first()
    if not pregunta:
        raise HTTPException(
            status_code=404,
            detail=f"Pregunta con id {respuesta.id_pregunta} no encontrada"
        )
    
    try:
        db_respuesta = Respuesta(**respuesta.model_dump())
        db.add(db_respuesta)
        db.commit()
        db.refresh(db_respuesta)
        return db_respuesta
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear la respuesta: {str(e)}"
        )

@router.put("/{id_respuesta}", status_code=200)
def edit_respuesta(db: db_dependency, id_respuesta: int, respuesta: CrearRespuesta, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden editar respuestas"
        )
    try:
        db_respuesta = db.query(Respuesta).filter(Respuesta.id == id_respuesta).first()
        if not db_respuesta:
            raise HTTPException(status_code=404, detail="Respuesta no encontrada")
        
        if respuesta.id_pregunta != db_respuesta.id_pregunta:
            pregunta = db.query(Pregunta).filter(Pregunta.id == respuesta.id_pregunta).first()
            if not pregunta:
                raise HTTPException(
                    status_code=404,
                    detail=f"Pregunta con id {respuesta.id_pregunta} no encontrada"
                )
        
        for key, value in respuesta.model_dump().items():
            setattr(db_respuesta, key, value)
            
        db.commit()
        db.refresh(db_respuesta)
        return db_respuesta
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar la respuesta: {str(e)}"
        )

@router.delete("/{id_respuesta}")
def delete_respuesta(db: db_dependency, id_respuesta: int, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden eliminar respuestas"
        )
    db_respuesta = db.query(Respuesta).filter(Respuesta.id == id_respuesta).first()
    if db_respuesta:
        db.delete(db_respuesta)
        db.commit()
        return db_respuesta
    else:
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")