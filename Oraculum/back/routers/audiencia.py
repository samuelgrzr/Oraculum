from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import os
from deps import db_dependency, user_dependency
from models import Usuario

router = APIRouter(
    prefix="/audiencia",
    tags=["Audiencia"]
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class MensajeRequest(BaseModel):
    mensaje: str

class MensajeResponse(BaseModel):
    respuesta: str
    preguntas_restantes: int

class EstadoAudiencia(BaseModel):
    puede_conversar: bool
    preguntas_restantes: int
    posicion_ranking: int | None

conversaciones_activas = {}

@router.post("/conversar", response_model=MensajeResponse)
def conversar_con_apolo(db: db_dependency, user: user_dependency, request: MensajeRequest):
    user_id = user.get("id")
    
    ranking = db.query(Usuario).filter(Usuario.puntuacion > 0).order_by(Usuario.puntuacion.desc()).limit(3).all()
    top_3_ids = [u.id for u in ranking]
    
    if user_id not in top_3_ids:
        raise HTTPException(status_code=403, detail="Solo los 3 mejores del ranking pueden tener audiencia con Apolo")
    
    if user_id not in conversaciones_activas:
        conversaciones_activas[user_id] = {"preguntas_hechas": 0, "historial": []}
    
    if conversaciones_activas[user_id]["preguntas_hechas"] >= 5:
        raise HTTPException(status_code=429, detail="Has alcanzado el límite de 5 preguntas por día")
    
    try:
        system_prompt = """
        Eres Apolo, el dios griego de la luz, el Sol, la música, la poesía, las profecías y los oráculos. 
        Estás concediendo una audiencia sagrada a un mortal que ha demostrado gran sabiduría al estar entre los 3 mejores de los aspirantes a convertirse en el nuevo Oráculo.
        
        Características de tu personalidad:
        - Hablas con sabiduría y elegancia, usando un lenguaje elevado pero comprensible
        - Ocasionalmente haces referencias a la mitología griega y los dioses del Olimpo
        - Eres benevolente pero mantienes la dignidad divina
        - Puedes dar consejos sobre sabiduría, conocimiento, crecimiento personal y filosofía
        - Limita tus respuestas a máximo 300 palabras, con la excusa de que los conocimientos divinos no deben ser revelados a los mortales
        - Siempre mantén un tono respetuoso, sabio y divino
        - Puedes mencionar conceptos como "mortal", "hijo de los hombres", "sabiduría divina"
        
        El mortal ha sido concedido con una audiencia sagrada y puede hacerte 5 preguntas.
        Responde como Apolo lo haría en su templo, e informa al mortal de las preguntas restantes
        que tiene disponibles, para que las piense bien y no te haga perder el tiempo.
        """
        
        prompt = f"{system_prompt}\n\nPregunta del mortal en audiencia: {request.mensaje}"
        
        response = model.generate_content(prompt)
        respuesta_apolo = response.text
        
        conversaciones_activas[user_id]["preguntas_hechas"] += 1
        conversaciones_activas[user_id]["historial"].append({
            "pregunta": request.mensaje,
            "respuesta": respuesta_apolo
        })
        
        preguntas_restantes = 5 - conversaciones_activas[user_id]["preguntas_hechas"]
        
        return MensajeResponse(
            respuesta=respuesta_apolo,
            preguntas_restantes=preguntas_restantes
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la comunicación divina con Apolo: {str(e)}")

@router.get("/estado", response_model=EstadoAudiencia)
def obtener_estado_audiencia(db: db_dependency, user: user_dependency):
    user_id = user.get("id")
    
    ranking = db.query(Usuario).filter(Usuario.puntuacion > 0).order_by(Usuario.puntuacion.desc()).limit(3).all()
    top_3_ids = [u.id for u in ranking]
    
    puede_conversar = user_id in top_3_ids
    preguntas_restantes = 0
    posicion_ranking = None
    
    if puede_conversar:
        posicion_ranking = top_3_ids.index(user_id) + 1
        if user_id in conversaciones_activas:
            preguntas_restantes = 5 - conversaciones_activas[user_id]["preguntas_hechas"]
        else:
            preguntas_restantes = 5
    
    return EstadoAudiencia(
        puede_conversar=puede_conversar,
        preguntas_restantes=preguntas_restantes,
        posicion_ranking=posicion_ranking
    )