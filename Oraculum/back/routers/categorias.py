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
    db_categoria = Categoria(**categoria.model_dump())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.delete("/")
def delete_categoria(db: db_dependency, id_categoria: int, user: user_dependency):
    db_categoria = db.query(Categoria).filter(Categoria.id == id_categoria).first()
    if db_categoria:
        db.delete(db_categoria)
        db.commit()
        return db_categoria
    else:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")