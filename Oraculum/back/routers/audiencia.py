from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import os
from datetime import datetime, timedelta
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
    tiempo_espera_restante: int | None  # en minutos

conversaciones_activas = {}

def puede_iniciar_audiencia(user_id: int) -> tuple[bool, int]:
    # Verifica si un usuario puede iniciar una nueva audiencia.
    # Devuelve (puede_conversar, minutos_restantes_de_espera)
    
    if user_id not in conversaciones_activas:
        return True, 0
    
    ultima_audiencia = conversaciones_activas[user_id].get("ultima_audiencia_completada")
    
    if ultima_audiencia is None:
        return True, 0
    
    tiempo_transcurrido = datetime.now() - ultima_audiencia
    tiempo_cooldown = timedelta(hours=5)
    
    if tiempo_transcurrido >= tiempo_cooldown:
        return True, 0
    
    tiempo_restante = tiempo_cooldown - tiempo_transcurrido
    minutos_restantes = int(tiempo_restante.total_seconds() / 60)
    
    return False, minutos_restantes

@router.post("/conversar", response_model=MensajeResponse)
def conversar_con_apolo(db: db_dependency, user: user_dependency, request: MensajeRequest):
    user_id = user.get("id")
    
    ranking = db.query(Usuario).filter(Usuario.puntuacion > 0).order_by(Usuario.puntuacion.desc()).limit(3).all()
    top_3_ids = [u.id for u in ranking]
    
    if user_id not in top_3_ids:
        raise HTTPException(status_code=403, detail="Solo los 3 mejores del ranking pueden tener audiencia con Apolo")
    
    # Verificar cooldown de 5 horas
    puede_conversar, minutos_espera = puede_iniciar_audiencia(user_id)
    if not puede_conversar:
        horas = minutos_espera // 60
        minutos = minutos_espera % 60
        if horas > 0:
            tiempo_msg = f"{horas} horas y {minutos} minutos"
        else:
            tiempo_msg = f"{minutos} minutos"
        raise HTTPException(
            status_code=429, 
            detail=f"Debes esperar {tiempo_msg} antes de solicitar otra audiencia con Apolo"
        )
    
    # Inicializar o verificar conversación activa
    if user_id not in conversaciones_activas or conversaciones_activas[user_id].get("preguntas_hechas", 0) >= 5:
        conversaciones_activas[user_id] = {
            "preguntas_hechas": 0, 
            "historial": [],
            "audiencia_iniciada": datetime.now(),
            "ultima_audiencia_completada": None
        }
    
    if conversaciones_activas[user_id]["preguntas_hechas"] >= 5:
        raise HTTPException(status_code=429, detail="Has alcanzado el límite de 5 preguntas por audiencia")
    
    try:
        es_primera_pregunta = conversaciones_activas[user_id]["preguntas_hechas"] == 0
        preguntas_restantes_antes = 5 - conversaciones_activas[user_id]["preguntas_hechas"]
        
        if es_primera_pregunta:
            system_prompt = f"""
            Eres Apolo, el dios griego de la luz, el Sol, la música, la poesía, las profecías y los oráculos. 
            Un mortal que ha demostrado gran sabiduría al estar entre los 3 mejores aspirantes a convertirse en el nuevo Oráculo ha solicitado una audiencia sagrada contigo.
            
            ESTA ES LA PRIMERA PREGUNTA de la audiencia. Debes:
            - Dar la bienvenida al mortal a tu templo sagrado
            - Reconocer su mérito por estar en el top 3
            - Explicar que le concedes 5 preguntas en total
            - Responder a su primera pregunta
            - Recordarle que le quedan {preguntas_restantes_antes - 1} preguntas después de esta
            
            Características de tu personalidad:
            - Hablas con sabiduría y elegancia, usando un lenguaje elevado pero comprensible
            - Ocasionalmente haces referencias a la mitología griega y los dioses del Olimpo
            - Eres benevolente pero mantienes la dignidad divina, no dudas en humillar un poco al mortal si su actitud es demasiado frívola o inadecuada
            - Limita tus respuestas a máximo 200 palabras
            - Siempre mantén un tono respetuoso, sabio y divino
            """
        else:
            # Construir contexto del historial
            historial_contexto = "\n".join([
                f"Pregunta anterior: {h['pregunta']}\nTu respuesta anterior: {h['respuesta']}"
                for h in conversaciones_activas[user_id]["historial"][-2:]
            ])
            
            system_prompt = f"""
            Eres Apolo, el dios griego de la luz, el Sol, la música, la poesía, las profecías y los oráculos.
            Estás continuando una audiencia sagrada con un mortal que ya te ha hecho {conversaciones_activas[user_id]["preguntas_hechas"]} pregunta(s).
            
            CONTEXTO DE LA CONVERSACIÓN ANTERIOR:
            {historial_contexto}
            
            ESTA ES LA PREGUNTA NÚMERO {conversaciones_activas[user_id]["preguntas_hechas"] + 1} de 5.
            - NO te vuelvas a presentar
            - Mantén coherencia con tus respuestas anteriores
            - Responde directamente a la nueva pregunta
            - Al final, recuerda al mortal que le quedan {preguntas_restantes_antes - 1} preguntas
            - Si ya es la última pregunta (5 preguntas hechas), no digas "te quedan 0 preguntas", di algo como "No te quedan preguntas" o "Tu camino debe continuar"
            
            Características de tu personalidad:
            - Hablas con sabiduría y elegancia, usando un lenguaje elevado pero comprensible
            - Ocasionalmente haces referencias a la mitología griega y los dioses del Olimpo
            - Eres benevolente pero mantienes la dignidad divina, no dudas en humillar un poco al mortal si su actitud es demasiado frívola o inadecuada
            - Limita tus respuestas a máximo 200 palabras
            - Siempre mantén un tono respetuoso, sabio y divino
            """
        
        prompt = f"{system_prompt}\n\nPregunta del mortal: {request.mensaje}"
        
        response = model.generate_content(prompt)
        respuesta_apolo = response.text
        
        conversaciones_activas[user_id]["preguntas_hechas"] += 1
        conversaciones_activas[user_id]["historial"].append({
            "pregunta": request.mensaje,
            "respuesta": respuesta_apolo
        })
        
        preguntas_restantes = 5 - conversaciones_activas[user_id]["preguntas_hechas"]
        
        # Si completó las 5 preguntas, marcar audiencia como completada
        if preguntas_restantes == 0:
            conversaciones_activas[user_id]["ultima_audiencia_completada"] = datetime.now()
        
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
    tiempo_espera_restante = None
    
    if puede_conversar:
        posicion_ranking = top_3_ids.index(user_id) + 1
        
        # Verificar cooldown
        puede_iniciar, minutos_espera = puede_iniciar_audiencia(user_id)
        
        if not puede_iniciar:
            puede_conversar = False
            tiempo_espera_restante = minutos_espera
        elif user_id in conversaciones_activas:
            preguntas_restantes = 5 - conversaciones_activas[user_id]["preguntas_hechas"]
        else:
            preguntas_restantes = 5
    
    return EstadoAudiencia(
        puede_conversar=puede_conversar,
        preguntas_restantes=preguntas_restantes,
        posicion_ranking=posicion_ranking,
        tiempo_espera_restante=tiempo_espera_restante
    )