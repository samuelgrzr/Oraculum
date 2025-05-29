DROP DATABASE IF EXISTS oraculum;
CREATE DATABASE oraculum;
USE oraculum;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'user',
    puntuacion INT DEFAULT 0
);

CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE pregunta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enunciado VARCHAR(300) NOT NULL UNIQUE,
    dificultad VARCHAR(50) NOT NULL,
    pista TEXT,
    explicacion TEXT,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)
);

CREATE TABLE respuesta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT false,
    id_pregunta INT,
    FOREIGN KEY (id_pregunta) REFERENCES pregunta(id) ON DELETE CASCADE
);

CREATE TABLE partida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntuacion INT,
    modo_juego VARCHAR(50) NOT NULL,  -- 'aventura', 'prueba', 'contrarreloj', 'infinito'
    id_categoria INT,
    dificultad VARCHAR(50) NOT NULL,  -- 'heroica', 'divina'
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)
);

CREATE TABLE datos_partida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT,
    id_pregunta INT,
    id_respuesta_elegida INT,
    id_respuesta_correcta INT,
    tiempo_respuesta INT,
    uso_pista BOOLEAN DEFAULT FALSE,
    puntuacion_pregunta INT,
    FOREIGN KEY (id_partida) REFERENCES partida(id),
    FOREIGN KEY (id_pregunta) REFERENCES pregunta(id),
    FOREIGN KEY (id_respuesta_elegida) REFERENCES respuesta(id),
    FOREIGN KEY (id_respuesta_correcta) REFERENCES respuesta(id)
);

-- No se insertan usuarios de prueba debido al hasheo de las contraseñas

-- Insertar categorías
INSERT INTO categoria (nombre) VALUES
('Mitología griega'),
('Superhéroes');

-- Insertar preguntas y respuestas

-- 🔵 Mitología griega

-- Preguntas nivel medio
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién castigó a Sísifo a empujar una roca eternamente?', 'heroica', 'Es el dios del inframundo.', 'Hades impuso este castigo eterno.', 1),
('¿Qué héroe mató al Minotauro?', 'heroica', 'Usó un hilo para escapar.', 'Teseo mató al Minotauro en el laberinto.', 1),
('¿Cómo se llama el lugar donde vivían los dioses griegos?', 'heroica', 'Está en una montaña.', 'El monte Olimpo era el hogar de los dioses.', 1),
('¿Qué titán sostiene el cielo sobre sus hombros?', 'heroica', 'Nombre de una cadena montañosa.', 'Atlas fue condenado a sostener el cielo.', 1),
('¿Quién abrió la caja que liberó todos los males al mundo?', 'heroica', 'Nombre femenino.', 'Pandora abrió la caja por curiosidad.', 1);

-- Respuestas nivel medio
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Hades', TRUE, 6), ('Zeus', FALSE, 6), ('Ares', FALSE, 6), ('Hermes', FALSE, 6),
('Teseo', TRUE, 7), ('Heracles', FALSE, 7), ('Perseo', FALSE, 7), ('Odiseo', FALSE, 7),
('Monte Olimpo', TRUE, 8), ('Monte Etna', FALSE, 8), ('Atenas', FALSE, 8), ('Olimpia', FALSE, 8),
('Atlas', TRUE, 9), ('Helios', FALSE, 9), ('Cronos', FALSE, 9), ('Epimeteo', FALSE, 9),
('Pandora', TRUE, 10), ('Afrodita', FALSE, 10), ('Hera', FALSE, 10), ('Artemisa', FALSE, 10);

-- Preguntas nivel difícil
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién robó el fuego a los dioses para dárselo a los humanos?', 'divina', 'Fue encadenado a una roca.', 'Prometeo es el titán que robó el fuego.', 1),
('¿Qué diosa nació de la espuma del mar?', 'divina', 'Es la diosa del amor.', 'Afrodita surgió del mar según Hesíodo.', 1),
('¿Quién completó los doce trabajos?', 'divina', 'Su fuerza era legendaria.', 'Heracles (Hércules en Roma) hizo los 12 trabajos.', 1),
('¿Quién era el dios griego de la guerra?', 'divina', 'Su equivalente romano es Marte.', 'Ares es el dios griego de la guerra.', 1),
('¿Qué monstruo tenía múltiples cabezas y regeneraba las que perdía?', 'divina', 'Vivía en el pantano de Lerna.', 'La Hidra de Lerna era derrotada por Heracles.', 1);

-- Respuestas nivel difícil
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Prometeo', TRUE, 11), ('Epimeteo', FALSE, 11), ('Atlas', FALSE, 11), ('Cronos', FALSE, 11),
('Afrodita', TRUE, 12), ('Atenea', FALSE, 12), ('Hera', FALSE, 12), ('Deméter', FALSE, 12),
('Heracles', TRUE, 13), ('Aquiles', FALSE, 13), ('Teseo', FALSE, 13), ('Perseo', FALSE, 13),
('Ares', TRUE, 14), ('Zeus', FALSE, 14), ('Hades', FALSE, 14), ('Apolo', FALSE, 14),
('Hidra', TRUE, 15), ('Quimera', FALSE, 15), ('Cerbero', FALSE, 15), ('Esfinge', FALSE, 15);

-- 🟣 Superhéroes

-- Preguntas nivel medio
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién fue el primer vengador en el universo cinematográfico?', 'heroica', 'Su historia comienza en la Segunda Guerra Mundial.', 'Capitán América fue el primer Vengador cronológicamente.', 2),
('¿Qué superhéroe obtiene sus poderes tras exponerse a rayos gamma?', 'heroica', 'Su alter ego es Bruce Banner.', 'Hulk adquirió sus poderes tras un experimento fallido con rayos gamma.', 2),
('¿Cuál es la debilidad de Superman?', 'heroica', 'Es un mineral de su planeta natal.', 'La kryptonita debilita a Superman.', 2),
('¿Qué superhéroe de Marvel usa un martillo mágico?', 'heroica', 'Es el dios del trueno.', 'Thor utiliza el martillo Mjolnir como su arma principal.', 2),
('¿Qué personaje es conocido por su agilidad, sentidos arácnidos y lanzar telarañas?', 'heroica', 'Vive en Nueva York.', 'Spider-Man es conocido por sus habilidades arácnidas.', 2);

-- Respuestas nivel medio
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Capitán América', TRUE, 21), ('Iron Man', FALSE, 21), ('Nick Fury', FALSE, 21), ('Thor', FALSE, 21),
('Hulk', TRUE, 22), ('Spider-Man', FALSE, 22), ('Capitán Marvel', FALSE, 22), ('Doctor Strange', FALSE, 22),
('Kryptonita', TRUE, 23), ('Plomo', FALSE, 23), ('Rayos gamma', FALSE, 23), ('Fuego', FALSE, 23),
('Thor', TRUE, 24), ('Loki', FALSE, 24), ('Odin', FALSE, 24), ('Hércules', FALSE, 24),
('Spider-Man', TRUE, 25), ('Batman', FALSE, 25), ('Wolverine', FALSE, 25), ('Flash', FALSE, 25);

-- Preguntas nivel difícil
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Qué personaje de DC es conocido como el mejor detective del mundo?', 'divina', 'Opera en Gotham City.', 'Batman es reconocido como un brillante detective y estratega.', 2),
('¿Cuál es el verdadero nombre de Wolverine?', 'divina', 'Su nombre es de origen canadiense.', 'Logan es el nombre real más usado por Wolverine, aunque su nombre verdadero es James Howlett.', 2),
('¿Qué superhéroe de Marvel posee un escudo hecho de vibranium?', 'divina', 'Es un símbolo de la justicia americana.', 'El escudo del Capitán América está hecho de vibranium.', 2),
('¿Quién es el archienemigo de Flash conocido por su velocidad?', 'divina', 'Viste de amarillo.', 'Reverse Flash es uno de los enemigos más peligrosos de Flash.', 2),
('¿Qué grupo lidera el personaje conocido como Star-Lord?', 'divina', 'Protegen la galaxia.', 'Los Guardianes de la Galaxia son un grupo de antihéroes cósmicos.', 2);

-- Respuestas nivel difícil
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Batman', TRUE, 26), ('Superman', FALSE, 26), ('Flash', FALSE, 26), ('Green Lantern', FALSE, 26),
('Logan', TRUE, 27), ('Peter Parker', FALSE, 27), ('Tony Stark', FALSE, 27), ('Clark Kent', FALSE, 27),
('Capitán América', TRUE, 28), ('Pantera Negra', FALSE, 28), ('Iron Man', FALSE, 28), ('Hulk', FALSE, 28),
('Reverse Flash', TRUE, 29), ('Zoom', FALSE, 29), ('Capitán Frío', FALSE, 29), ('Lex Luthor', FALSE, 29),
('Guardianes de la Galaxia', TRUE, 30), ('Los Vengadores', FALSE, 30), ('X-Men', FALSE, 30), ('Liga de la Justicia', FALSE, 30);