# Oraculum 🎮
> Un juego de preguntas y respuestas dinámico y educativo

## 📋 Descripción
Oraculum es una aplicación web de preguntas y respuestas que combina el entretenimiento con el aprendizaje. Desarrollada con FastAPI y Angular, ofrece diferentes modos de juego y un sistema de puntuación competitivo.

## 🚀 Características

### 🎮 Modos de Juego

#### Modo Aventura
- 10 preguntas
- Pistas con penalización de puntuación
- Explicación tras cada respuesta

#### Modo Prueba
- 10 preguntas tipo test
- Sin pistas
- Revisión final de respuestas
- Puntuación basada en aciertos

#### Modo Contrarreloj
- 10 preguntas
- Tiempo limitado por pregunta
- Pistas con penalización de tiempo
- Explicaciones tras cada respuesta

#### Modo Infinito
- Preguntas ilimitadas hasta fallar
- Tiempo limitado por pregunta
- Sin pistas disponibles
- Puntuación basada en:
  - Dificultad de pregunta
  - Tiempo de respuesta
- Actualización del ranking global

### 🛠️ Funcionalidades
- Sistema de puntuación global
- Ranking de jugadores
- Historial de partidas
- Sistema de pistas y explicaciones
- Diferentes niveles de dificultad
- Temáticas variadas

## 🔒 Seguridad
- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Sistema de roles (admin/user)
- Protección CORS

## 🛠️ Tecnologías

### Backend
- FastAPI
- SQLAlchemy
- JWT para autentificación
- MySQL
- Python 3.12.3

### Frontend
- Angular
- TypeScript
- Angular Material

## ⚙️ Modo desarrollador

### Dentro de la carpeta `back`
Crear el entorno virtual dentro del proyecto
```bash
python -m venv .venv
```

Activar el entorno virtual
```bash
.\.venv\Scripts\activate
```

Instalar las dependencias necesarias
```bash
pip install -r requirements.txt
```

Ejecutar el proyecto
```bash
uvicorn main:app
```

### Dentro de la carpeta `front`
Instalar las dependencias necesarias
```bash
npm install
```

Ejecutar el proyecto
```bash
npm start || ng serve
```

## 📁 Estructura del Proyecto