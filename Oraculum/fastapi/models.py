from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

pregunta_respuesta = Table('pregunta_respuesta', Base.metadata,
    Column('pregunta_id', Integer, ForeignKey('pregunta.id')),
    Column('respuesta_id', Integer, ForeignKey('respuesta.id'))
)

class Pregunta(Base):
    __tablename__ = "pregunta"
    id = Column(Integer, primary_key=True, index=True)
    texto = Column(String)
    respuestas = relationship("Respuesta", secondary=pregunta_respuesta, back_populates="preguntas")

class Respuesta(Base):
    __tablename__ = "respuesta"
    id = Column(Integer, primary_key=True, index=True)
    texto = Column(String)
    correcta = Column(Integer)
    preguntas = relationship("Pregunta", secondary=pregunta_respuesta, back_populates="respuestas")