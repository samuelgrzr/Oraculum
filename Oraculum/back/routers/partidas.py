from zoneinfo import ZoneInfo
from pydantic import BaseModel
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from datetime import datetime

from models import Partida, Usuario, DatosPartida, Pregunta, Respuesta, Categoria
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/partidas",
    tags=["Partidas"]
)

class DatosPartidaBase(BaseModel):
    id_pregunta: int
    id_respuesta_elegida: int
    id_respuesta_correcta: int
    tiempo_respuesta: int
    uso_pista: bool = False
    puntuacion_pregunta: int

class CrearPartida(BaseModel):
    datos_partida: List[DatosPartidaBase]
    puntuacion: int
    modo_juego: str  # 'aventura', 'prueba', 'contrarreloj', 'infinito'
    id_categoria: int
    dificultad: str  # 'heroica', 'divina'
    id_usuario: Optional[int] = None

@router.get("/")
def get_partida(db: db_dependency, id_partida: int):
    partida = db.query(Partida).filter(Partida.id == id_partida).first()
    if not partida:
        raise HTTPException(status_code=404, detail="Partida no encontrada")
    return partida

@router.get("/historial/{id_usuario}")
def get_historial_usuario(db: db_dependency, id_usuario: int):
    partidas_con_categoria = db.query(Partida, Categoria.nombre).join(
        Categoria, Partida.id_categoria == Categoria.id
    ).filter(Partida.id_usuario == id_usuario).all()
    
    resultado = []
    for partida, nombre_categoria in partidas_con_categoria:
        datos_partida = db.query(DatosPartida).filter(DatosPartida.id_partida == partida.id).all()
        respuestas_correctas = sum(1 for dato in datos_partida if dato.id_respuesta_elegida == dato.id_respuesta_correcta)
        pistas_usadas = sum(1 for dato in datos_partida if dato.uso_pista)
        
        partida_dict = {
            "id": partida.id,
            "id_usuario": partida.id_usuario,
            "fecha": partida.fecha,
            "puntuacion": partida.puntuacion,
            "modo_juego": partida.modo_juego,
            "id_categoria": partida.id_categoria,
            "nombre_categoria": nombre_categoria,
            "dificultad": partida.dificultad,
            "respuestasCorrectas": respuestas_correctas,
            "pistas_usadas": pistas_usadas
        }
        resultado.append(partida_dict)
    
    return resultado

@router.post("/", status_code=201)
def create_partida(db: db_dependency, partida: CrearPartida):
    try:
        db_partida = Partida(
            id_usuario = partida.id_usuario,
            fecha = datetime.now(),
            puntuacion = partida.puntuacion,
            modo_juego = partida.modo_juego,
            id_categoria = partida.id_categoria,
            dificultad = partida.dificultad
        )
        db.add(db_partida)
        db.flush() # Para generar el ID de la partida
        
        for dato in partida.datos_partida:
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
                id_partida = db_partida.id,
                id_pregunta = dato.id_pregunta,
                id_respuesta_elegida = dato.id_respuesta_elegida,
                id_respuesta_correcta = dato.id_respuesta_correcta,
                tiempo_respuesta = dato.tiempo_respuesta,
                uso_pista = dato.uso_pista,
                puntuacion_pregunta = dato.puntuacion_pregunta
            )
            db.add(db_datos_partida)
        
        if partida.modo_juego == "infinito" and partida.id_usuario:
            usuario = db.query(Usuario).filter(Usuario.id == partida.id_usuario).first()
            if usuario:
                usuario.puntuacion = max(usuario.puntuacion, partida.puntuacion)
        
        db.commit()
        db.refresh(db_partida)
        return db_partida

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear la partida: {str(e)}"
        )


@router.delete("/{id_partida}")
def delete_partida(db: db_dependency, id_partida: int, user: user_dependency):
    try:
        db.query(DatosPartida).filter(DatosPartida.id_partida == id_partida).delete()
        
        db_partida = db.query(Partida).filter(Partida.id == id_partida).first()
        if not db_partida:
            raise HTTPException(status_code=404, detail="Partida no encontrada")
        
        if user.get("id") != db_partida.id_usuario and user.get("rol") != "admin":
            raise HTTPException(
                status_code=403,
                detail="Solo puedes eliminar tus propias partidas o ser administrador"
            )
            
        db.delete(db_partida)
        db.commit()
        return db_partida
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al eliminar la partida: {str(e)}"
        )