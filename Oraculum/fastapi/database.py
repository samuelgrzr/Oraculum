from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

SQL_ALCHEMY_DATABASE_URL = "postgresql://usuario:contraseña@localhost:5432/Oraculum"

engine = create_engine(SQL_ALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuario"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(255), nullable=False)
    rol = Column(String(50), default='user')

class Categoria(Base):
    __tablename__ = "categoria"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    preguntas = relationship("Pregunta", back_populates="categoria")

class Pregunta(Base):
    __tablename__ = "pregunta"
    id = Column(Integer, primary_key=True, index=True)
    enunciado = Column(Text, nullable=False)
    dificultad = Column(String(50), nullable=False)
    pista = Column(Text)
    explicacion = Column(Text)
    categoria_id = Column(Integer, ForeignKey("categoria.id"))
    categoria = relationship("Categoria", back_populates="preguntas")
    respuestas = relationship("Respuesta", back_populates="pregunta")

class Respuesta(Base):
    __tablename__ = "respuesta"
    id = Column(Integer, primary_key=True, index=True)
    texto = Column(Text, nullable=False)
    es_correcta = Column(Boolean, default=False)
    pregunta_id = Column(Integer, ForeignKey("pregunta.id"))
    pregunta = relationship("Pregunta", back_populates="respuestas")