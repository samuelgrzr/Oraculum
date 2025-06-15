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
```
Oraculum/
├── back/                    # Backend (FastAPI)
│   ├── routers/            # Endpoints de la API
│   │   ├── auth.py         # Autenticación
│   │   ├── usuarios.py     # Gestión de usuarios
│   │   ├── categorias.py   # Gestión de categorías
│   │   ├── preguntas.py    # Gestión de preguntas
│   │   ├── respuestas.py   # Gestión de respuestas
│   │   ├── partidas.py     # Gestión de partidas
│   │   └── audiencia.py    # IA Gemini
│   ├── models.py           # Modelos de base de datos
│   ├── database.py         # Configuración de BD
│   ├── deps.py             # Dependencias
│   ├── main.py             # Aplicación principal
│   └── requirements.txt    # Dependencias Python
├── front/                  # Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes de la UI
│   │   │   │   ├── auth/   # Autenticación
│   │   │   │   ├── juego/  # Motor de juego
│   │   │   │   ├── gestion/# Panel admin
│   │   │   │   ├── perfil/ # Perfil usuario
│   │   │   │   └── ranking/# Clasificación
│   │   │   ├── services/   # Servicios Angular
│   │   │   ├── models/     # Interfaces TypeScript
│   │   │   ├── guards/     # Protección de rutas
│   │   │   └── interceptors/# Interceptores HTTP
│   │   └── assets/         # Recursos estáticos
│   ├── package.json        # Dependencias Node.js
│   └── angular.json        # Configuración Angular
├── BD_Oraculum.sql         # Script de base de datos
├── ER_Oraculum.jpg         # Diagrama ER
└── README.md               # Este archivo
```

## 🤖 Audiencia con Apolo
Funcionalidad especial disponible para los 3 mejores jugadores del ranking:
- Chat con IA Gemini durante las partidas
- Asistencia contextual para resolver preguntas
- Acceso exclusivo basado en rendimiento

## 🎯 Características Técnicas

### Sistema de Puntuación
- **Bonificación por velocidad**: Respuestas rápidas otorgan más puntos
- **Penalización por pistas**: Uso de ayudas reduce la puntuación
- **Multiplicador por dificultad**: Preguntas difíciles valen más
- **Modo Infinito**: Puntuación acumulativa hasta el primer fallo

### Gestión de Datos
- **Historial completo**: Registro detallado de cada partida
- **Estadísticas avanzadas**: Tiempo de respuesta, uso de pistas, precisión
- **Ranking dinámico**: Actualización en tiempo real
- **Categorías temáticas**: Organización por materias

### Seguridad Avanzada
- **Protección de respuestas**: Las respuestas correctas no se exponen al frontend
- **Validación backend**: Verificación de respuestas en el servidor
- **Control de acceso**: Diferentes niveles de permisos
- **Sesiones seguras**: Tokens JWT con expiración

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.12.3 o superior
- Node.js 18+ y npm
- MySQL 8.0+
- Git

### Configuración de Base de Datos
1. Crear base de datos MySQL:
```sql
CREATE DATABASE oraculum;
```

2. Importar el esquema:
```bash
mysql -u usuario -p oraculum < BD_Oraculum.sql
```

3. Configurar variables de entorno:
```bash
# Crear archivo .env en la raíz del proyecto, junto a las carpetas front/ y back/
DATABASE_URL=mysql://usuario:password@localhost/oraculum
SECRET_KEY=tu_clave_secreta_jwt
GEMINI_API_KEY=tu_api_key_gemini
```

### Despliegue en Producción
- **Backend**: Railway
- **Frontend**: Vercel
- **Base de datos**: Railway

## 📊 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

### Usuarios
- `GET /usuarios/ranking` - Obtener ranking
- `GET /usuarios/perfil` - Perfil del usuario

### Juego
- `GET /preguntas/aleatorias` - Obtener preguntas
- `POST /respuestas/validar` - Validar respuesta
- `POST /partidas/crear` - Crear nueva partida

### Administración
- `GET /categorias` - Listar categorías
- `POST /preguntas` - Crear pregunta
- `PUT /preguntas/{id}` - Actualizar pregunta

## 👨‍💻 Autor

**Samuel García Zorrilla**
- 🎓 Trabajo de Fin de Grado Superior en Desarrollo de Aplicaciones Web
- 🏫 IES Belén