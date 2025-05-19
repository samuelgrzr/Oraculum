from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from models import Usuario
from deps import db_dependency, bcrypt_context

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["Autentificación"]
)

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

class UserCreateRequest(BaseModel):
    nombre: str
    correo: str
    contrasena: str
    rol: str = "user"
    puntuacion: int = 0

class Token(BaseModel):
    access_token: str
    token_type: str

# Tengo que llamarlo username y password porque así lo pide el OAuth2PasswordRequestForm, pero usa el correo
def authenticate_user(username: str, password: str, db):
    usuario = db.query(Usuario).filter(Usuario.correo == username).first()
    if not usuario:
        return False
    if not bcrypt_context.verify(password, usuario.contrasena):
        return False
    return usuario

def create_access_token(nombre: str, id: str, rol: str, expires_delta: timedelta):
    encode = {"nombre": nombre, "id": id, "rol": rol}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    existing_user = db.query(Usuario).filter(Usuario.correo == create_user_request.correo).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya existe"
        )
    
    create_user_model = Usuario(
        nombre = create_user_request.nombre,
        correo = create_user_request.correo,
        contrasena = bcrypt_context.hash(create_user_request.contrasena),
        rol = create_user_request.rol,
        puntuacion = create_user_request.puntuacion
    )
    db.add(create_user_model)
    db.commit()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    usuario = authenticate_user(form_data.username, form_data.password, db)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")
    token = create_access_token(usuario.nombre, usuario.id, usuario.rol, timedelta(hours=1))

    return {"access_token": token, "token_type": "bearer"}