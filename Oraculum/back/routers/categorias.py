from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException

from models import Categoria
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"]
)

class CategoriaBase(BaseModel):
    nombre: str

class CrearCategoria(CategoriaBase):
    pass

@router.get("/")
def get_categoria(db: db_dependency, id_categoria: int):
    categoria = db.query(Categoria).filter(Categoria.id == id_categoria).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

@router.get("/categorias")
def get_all_categorias(db: db_dependency):
    return db.query(Categoria).all()

@router.post("/", status_code=201)
def create_categoria(db: db_dependency, categoria: CrearCategoria, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden crear categorías"
        )
    
    # Verificar si ya existe una categoría con ese nombre
    existing_categoria = db.query(Categoria).filter(
        Categoria.nombre == categoria.nombre
    ).first()
    
    if existing_categoria:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe una categoría con el nombre '{categoria.nombre}'"
        )
    
    try:
        db_categoria = Categoria(**categoria.model_dump())
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear la categoría: {str(e)}"
        )

@router.put("/{id_categoria}", status_code=200)
def edit_categoria(db: db_dependency, id_categoria: int, categoria: CrearCategoria, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden editar categorías"
        )
    
    try:
        # Verificar si ya existe otra categoría con ese nombre
        existing_categoria = db.query(Categoria).filter(
            Categoria.nombre == categoria.nombre,
            Categoria.id != id_categoria
        ).first()
        
        if existing_categoria:
            raise HTTPException(
                status_code=400,
                detail=f"Ya existe una categoría con el nombre '{categoria.nombre}'"
            )
        
        db_categoria = db.query(Categoria).filter(Categoria.id == id_categoria).first()
        if not db_categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        for key, value in categoria.model_dump().items():
            setattr(db_categoria, key, value)
            
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar la categoría: {str(e)}"
        )

@router.delete("/{id_categoria}")
def delete_categoria(db: db_dependency, id_categoria: int, user: user_dependency):
    if user.get("rol") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo los administradores pueden eliminar categorías"
        )
    db_categoria = db.query(Categoria).filter(Categoria.id == id_categoria).first()
    if db_categoria:
        db.delete(db_categoria)
        db.commit()
        return db_categoria
    else:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")