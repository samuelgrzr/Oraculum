from zoneinfo import ZoneInfo
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(255), nullable=False)  # Longitud de 255 para hashearla
    rol = Column(String(50), default='user')
    puntuacion = Column(Integer, default=0)
    
    historial = relationship("Partida", back_populates="usuario")

class Categoria(Base):
    __tablename__ = "categoria"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    
    preguntas = relationship("Pregunta", back_populates="categoria")

class Pregunta(Base):
    __tablename__ = "pregunta"

    id = Column(Integer, primary_key=True, index=True)
    enunciado = Column(Text, nullable=False)
    pista = Column(Text)
    explicacion = Column(Text)
    dificultad = Column(String(50), nullable=False)
    id_categoria = Column(Integer, ForeignKey("categoria.id"))
    
    categoria = relationship("Categoria", back_populates="preguntas")
    respuestas = relationship("Respuesta", back_populates="pregunta")

class Respuesta(Base):
    __tablename__ = "respuesta"

    id = Column(Integer, primary_key=True, index=True)
    texto = Column(Text, nullable=False)
    es_correcta = Column(Boolean, default=False)
    id_pregunta = Column(Integer, ForeignKey("pregunta.id"))
    
    pregunta = relationship("Pregunta", back_populates="respuestas")

class Partida(Base):
    __tablename__ = "partida"

    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id"))
    fecha = Column(DateTime, default=datetime.datetime.now)
    puntuacion = Column(Integer)
    modo_juego = Column(String(50), nullable=False)  # 'aventura', 'prueba', 'contrarreloj', 'infinito'
    id_categoria = Column(Integer, ForeignKey("categoria.id"))
    dificultad = Column(String(50), nullable=False)  # 'heroica', 'divina'
    
    usuario = relationship("Usuario", back_populates="historial")
    datos_partida = relationship("DatosPartida", back_populates="partida")
    categoria = relationship("Categoria")

class DatosPartida(Base):
    __tablename__ = "datos_partida"

    id = Column(Integer, primary_key=True, index=True)
    id_partida = Column(Integer, ForeignKey("partida.id"))
    id_pregunta = Column(Integer, ForeignKey("pregunta.id"))
    id_respuesta_elegida = Column(Integer, ForeignKey("respuesta.id"))
    id_respuesta_correcta = Column(Integer, ForeignKey("respuesta.id"))
    tiempo_respuesta = Column(Integer)
    uso_pista = Column(Boolean, default=False)
    puntuacion_pregunta = Column(Integer)
    
    partida = relationship("Partida", back_populates="datos_partida")
    pregunta = relationship("Pregunta")
    respuesta_elegida = relationship("Respuesta", foreign_keys=[id_respuesta_elegida])
    respuesta_correcta = relationship("Respuesta", foreign_keys=[id_respuesta_correcta])