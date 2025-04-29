# Oraculum

## Configurar las dependencias del proyecto:

### En Windows:
python -m venv wenv
.\wenv\Scripts\activate
cd fastapi
pip install -r requirements.txt
uvicorn main:app

### En Linux:
python3 -m venv lenv
source lenv/bin/activate
cd fastapi
pip install -r requirements.txt
uvicorn main:app
