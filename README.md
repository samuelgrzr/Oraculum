# Oraculum

## Descripción

## Tecnologías

## Configurar las dependencias del proyecto (desarrollador):

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

Si hay algún problema de compatibilidad en las dependencias, usa <br>
`pip config unset global.index-url`

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