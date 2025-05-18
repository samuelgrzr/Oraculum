from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException, status

from models import Usuario
from deps import db_dependency, user_dependency, bcrypt_context

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

class UsuarioBase(BaseModel):
    nombre: str
    correo: str
    rol: str = "user"
    puntuacion: int = 0

class ActualizarUsuario(UsuarioBase):
    contrasena: Optional[str] = None

@router.get("/")
def get_usuario(db: db_dependency, id_usuario: int):
    usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.get("/{correo}")
def get_usuario_por_correo(db: db_dependency, correo: str):
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.get("/usuarios")
def get_all_usuarios(db: db_dependency):
    return db.query(Usuario).all()

@router.get("/ranking")
def get_ranking(db: db_dependency):
    return db.query(Usuario).order_by(Usuario.puntuacion.desc()).limit(12).all()

@router.put("/{id_usuario}", status_code=200)
def edit_usuario(db: db_dependency, id_usuario: int, usuario: ActualizarUsuario, user: user_dependency):
    try:
        db_usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
        if not db_usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        if user.get("id") != id_usuario and user.get("rol") != "admin":
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para editar este usuario"
            )
        
        update_data = usuario.model_dump(exclude_unset=True)
        
        if "contrasena" in update_data and update_data["contrasena"]:
            update_data["contrasena"] = bcrypt_context.hash(update_data["contrasena"])
        
        for key, value in update_data.items():
            setattr(db_usuario, key, value)
            
        db.commit()
        db.refresh(db_usuario)
        return db_usuario
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar el usuario: {str(e)}"
        )

@router.delete("/{id_usuario}")
def delete_usuario(db: db_dependency, id_usuario: int, user: user_dependency):
    if user.get("id") != id_usuario and user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo puedes eliminar tu propia cuenta o ser administrador"
        )
    
    db_usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if db_usuario:
        db.delete(db_usuario)
        db.commit()
        
        if user.get("id") == id_usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Cuenta eliminada correctamente. Cerrando sesión..."
            )
        return db_usuario
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")