from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# URL_DATABASE = "mysql+pymysql://root:12345678@localhost:3306/oraculum"
URL_DATABASE = "mysql+pymysql://root:juoQsmsPUdKUuJgWyuCtQvIzKahQHiDm@shortline.proxy.rlwy.net:17383/railway"

engine = create_engine(URL_DATABASE)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()