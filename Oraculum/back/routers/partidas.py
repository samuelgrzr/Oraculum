from pydantic import BaseModel
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from datetime import datetime

from models import Partida, Usuario, DatosPartida, Pregunta, Respuesta
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/partidas",
    tags=["Partidas"]
)

class DatosPartidaBase(BaseModel):
    id_pregunta: int
    id_respuesta_elegida: int
    id_respuesta_correcta: int

class CrearPartida(BaseModel):
    datos_partida: List[DatosPartidaBase]
    puntuacion: int

@router.get("/")
def get_partida(db: db_dependency, id_partida: int, user: user_dependency):
    partida = db.query(Partida).filter(Partida.id == id_partida).first()
    if not partida:
        raise HTTPException(status_code=404, detail="Partida no encontrada")
    
    # Solo el usuario que jugó la partida puede verla
    if partida.id_usuario != user.get("id"):
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver esta partida"
        )
    return partida

@router.get("/historial")
def get_historial_usuario(db: db_dependency, user: user_dependency):
    # Obtener el historial del usuario autenticado
    return db.query(Partida).filter(Partida.id_usuario == user.get("id")).all()

@router.post("/", status_code=201)
def create_partida(db: db_dependency, partida: CrearPartida, user: user_dependency):
    try:
        # Crear la partida
        db_partida = Partida(
            id_usuario=user.get("id"),
            fecha=datetime.utcnow(),
            puntuacion=partida.puntuacion
        )
        db.add(db_partida)
        db.commit()
        db.refresh(db_partida)
        
        # Crear los datos de la partida
        for dato in partida.datos_partida:
            # Verificar que existen la pregunta y las respuestas
            pregunta = db.query(Pregunta).filter(Pregunta.id == dato.id_pregunta).first()
            if not pregunta:
                raise HTTPException(status_code=404, detail=f"Pregunta con id {dato.id_pregunta} no encontrada")
            
            respuesta_elegida = db.query(Respuesta).filter(Respuesta.id == dato.id_respuesta_elegida).first()
            if not respuesta_elegida:
                raise HTTPException(status_code=404, detail=f"Respuesta elegida con id {dato.id_respuesta_elegida} no encontrada")
            
            respuesta_correcta = db.query(Respuesta).filter(Respuesta.id == dato.id_respuesta_correcta).first()
            if not respuesta_correcta:
                raise HTTPException(status_code=404, detail=f"Respuesta correcta con id {dato.id_respuesta_correcta} no encontrada")
            
            db_datos_partida = DatosPartida(
                id_partida=db_partida.id,
                id_pregunta=dato.id_pregunta,
                id_respuesta_elegida=dato.id_respuesta_elegida,
                id_respuesta_correcta=dato.id_respuesta_correcta
            )
            db.add(db_datos_partida)
        
        # Actualizar la puntuación del usuario
        usuario = db.query(Usuario).filter(Usuario.id == user.get("id")).first()
        usuario.puntuacion += partida.puntuacion
        
        db.commit()
        return db_partida
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear la partida: {str(e)}"
        )