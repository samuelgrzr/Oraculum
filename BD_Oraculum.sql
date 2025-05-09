DROP DATABASE IF EXISTS oraculum;
CREATE DATABASE oraculum;
USE oraculum;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'user',
    puntuacion INT DEFAULT 0
);

CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE pregunta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enunciado TEXT NOT NULL,
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
    FOREIGN KEY (id_pregunta) REFERENCES pregunta(id)
);

CREATE TABLE partida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntuacion INT,
    modo_juego VARCHAR(50) NOT NULL,  -- 'estandar', 'examen', 'contrarreloj', 'infinito'
    id_categoria INT,
    dificultad VARCHAR(50) NOT NULL,  -- 'facil', 'medio', 'dificil'
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

-- Preguntas fáciles (ID 1-5)
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién es el dios del trueno en la mitología griega?', 'facil', 'Su arma es un rayo.', 'Zeus es el dios del trueno y el cielo.', 1),
('¿Qué criatura mitológica tenía una mirada que convertía en piedra?', 'facil', 'Tenía serpientes por cabello.', 'Medusa era una gorgona con mirada petrificante.', 1),
('¿Quién es el héroe conocido por su talón vulnerable?', 'facil', 'Su madre lo sumergió en el río Estigia.', 'Aquiles fue invulnerable salvo en su talón.', 1),
('¿Qué dios griego gobernaba el inframundo?', 'facil', 'Posee toda la riqueza del mundo.', 'Hades es el dios del inframundo.', 1),
('¿Qué gran héroe era conocido como Nadie?', 'facil', 'Se presentó así ante un cíclope.', 'Odiseo utilizó este ardid para poder escapar de la guarida de Polifemo.', 1);

-- Respuestas fáciles
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Zeus', TRUE, 1), ('Poseidón', FALSE, 1), ('Hades', FALSE, 1), ('Ares', FALSE, 1),
('Medusa', TRUE, 2), ('Hidra', FALSE, 2), ('Minotauro', FALSE, 2), ('Quimera', FALSE, 2),
('Aquiles', TRUE, 3), ('Hércules', FALSE, 3), ('Odiseo', FALSE, 3), ('Teseo', FALSE, 3),
('Hades', TRUE, 4), ('Zeus', FALSE, 4), ('Hermes', FALSE, 4), ('Apolo', FALSE, 4),
('Odiseo', TRUE, 5), ('Aquiles', FALSE, 5), ('Perseo', FALSE, 5), ('Diomedes', FALSE, 5);

-- Preguntas medias (ID 6-10)
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién castigó a Sísifo a empujar una roca eternamente?', 'medio', 'Es el dios del inframundo.', 'Hades impuso este castigo eterno.', 1),
('¿Qué héroe mató al Minotauro?', 'medio', 'Usó un hilo para escapar.', 'Teseo mató al Minotauro en el laberinto.', 1),
('¿Cómo se llama el lugar donde vivían los dioses griegos?', 'medio', 'Está en una montaña.', 'El monte Olimpo era el hogar de los dioses.', 1),
('¿Qué titán sostiene el cielo sobre sus hombros?', 'medio', 'Nombre de una cadena montañosa.', 'Atlas fue condenado a sostener el cielo.', 1),
('¿Quién abrió la caja que liberó todos los males al mundo?', 'medio', 'Nombre femenino.', 'Pandora abrió la caja por curiosidad.', 1);

-- Respuestas medias
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Hades', TRUE, 6), ('Zeus', FALSE, 6), ('Ares', FALSE, 6), ('Hermes', FALSE, 6),
('Teseo', TRUE, 7), ('Heracles', FALSE, 7), ('Perseo', FALSE, 7), ('Odiseo', FALSE, 7),
('Monte Olimpo', TRUE, 8), ('Monte Etna', FALSE, 8), ('Atenas', FALSE, 8), ('Olimpia', FALSE, 8),
('Atlas', TRUE, 9), ('Helios', FALSE, 9), ('Cronos', FALSE, 9), ('Epimeteo', FALSE, 9),
('Pandora', TRUE, 10), ('Afrodita', FALSE, 10), ('Hera', FALSE, 10), ('Artemisa', FALSE, 10);

-- Preguntas difíciles (ID 11-15)
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién robó el fuego a los dioses para dárselo a los humanos?', 'dificil', 'Fue encadenado a una roca.', 'Prometeo es el titán que robó el fuego.', 1),
('¿Qué diosa nació de la espuma del mar?', 'dificil', 'Es la diosa del amor.', 'Afrodita surgió del mar según Hesíodo.', 1),
('¿Quién completó los doce trabajos?', 'dificil', 'Su fuerza era legendaria.', 'Heracles (Hércules en Roma) hizo los 12 trabajos.', 1),
('¿Quién era el dios griego de la guerra?', 'dificil', 'Su equivalente romano es Marte.', 'Ares es el dios griego de la guerra.', 1),
('¿Qué monstruo tenía múltiples cabezas y regeneraba las que perdía?', 'dificil', 'Vivía en el pantano de Lerna.', 'La Hidra de Lerna era derrotada por Heracles.', 1);

-- Respuestas difíciles
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Prometeo', TRUE, 11), ('Epimeteo', FALSE, 11), ('Atlas', FALSE, 11), ('Cronos', FALSE, 11),
('Afrodita', TRUE, 12), ('Atenea', FALSE, 12), ('Hera', FALSE, 12), ('Deméter', FALSE, 12),
('Heracles', TRUE, 13), ('Aquiles', FALSE, 13), ('Teseo', FALSE, 13), ('Perseo', FALSE, 13),
('Ares', TRUE, 14), ('Zeus', FALSE, 14), ('Hades', FALSE, 14), ('Apolo', FALSE, 14),
('Hidra', TRUE, 15), ('Quimera', FALSE, 15), ('Cerbero', FALSE, 15), ('Esfinge', FALSE, 15);

-- 🟣 Superhéroes

-- Preguntas fáciles (ID 16-20)
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién es el alter ego de Spider-Man?', 'facil', 'Trabaja como fotógrafo.', 'Peter Parker es la identidad secreta de Spider-Man.', 2),
('¿Qué superhéroe es conocido como el Hombre de Acero?', 'facil', 'Viene del planeta Krypton.', 'Superman es apodado el Hombre de Acero.', 2),
('¿Quién lidera los Vengadores en muchas de sus versiones?', 'facil', 'Lleva un escudo con una estrella.', 'Capitán América suele ser el líder de los Vengadores.', 2),
('¿Qué superhéroe tiene una armadura de alta tecnología y es multimillonario?', 'facil', 'Su mayordomo no se llama Alfred.', 'Iron Man es el alter ego de Tony Stark.', 2),
('¿Qué heroína pertenece a las Amazonas y usa un lazo de la verdad?', 'facil', 'Es una princesa guerrera.', 'Wonder Woman es una amazona con poderes divinos.', 2);

-- Respuestas fáciles
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Peter Parker', TRUE, 16), ('Clark Kent', FALSE, 16), ('Bruce Wayne', FALSE, 16), ('Tony Stark', FALSE, 16),
('Superman', TRUE, 17), ('Batman', FALSE, 17), ('Iron Man', FALSE, 17), ('Hulk', FALSE, 17),
('Capitán América', TRUE, 18), ('Thor', FALSE, 18), ('Iron Man', FALSE, 18), ('Ojo de Halcón', FALSE, 18),
('Iron Man', TRUE, 19), ('Spider-Man', FALSE, 19), ('Batman', FALSE, 19), ('Capitán América', FALSE, 19),
('Wonder Woman', TRUE, 20), ('Capitana Marvel', FALSE, 20), ('Viuda Negra', FALSE, 20), ('Jean Grey', FALSE, 20);

-- Preguntas medias (ID 21-25)
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Quién fue el primer vengador en el universo cinematográfico?', 'media', 'Su historia comienza en la Segunda Guerra Mundial.', 'Capitán América fue el primer Vengador cronológicamente.', 2),
('¿Qué superhéroe obtiene sus poderes tras exponerse a rayos gamma?', 'media', 'Su alter ego es Bruce Banner.', 'Hulk adquirió sus poderes tras un experimento fallido con rayos gamma.', 2),
('¿Cuál es la debilidad de Superman?', 'media', 'Es un mineral de su planeta natal.', 'La kryptonita debilita a Superman.', 2),
('¿Qué superhéroe de Marvel usa un martillo mágico?', 'media', 'Es el dios del trueno.', 'Thor utiliza el martillo Mjolnir como su arma principal.', 2),
('¿Qué personaje es conocido por su agilidad, sentidos arácnidos y lanzar telarañas?', 'media', 'Vive en Nueva York.', 'Spider-Man es conocido por sus habilidades arácnidas.', 2);

-- Respuestas medias
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Capitán América', TRUE, 21), ('Iron Man', FALSE, 21), ('Nick Fury', FALSE, 21), ('Thor', FALSE, 21),
('Hulk', TRUE, 22), ('Spider-Man', FALSE, 22), ('Capitán Marvel', FALSE, 22), ('Doctor Strange', FALSE, 22),
('Kryptonita', TRUE, 23), ('Plomo', FALSE, 23), ('Rayos gamma', FALSE, 23), ('Fuego', FALSE, 23),
('Thor', TRUE, 24), ('Loki', FALSE, 24), ('Odin', FALSE, 24), ('Hércules', FALSE, 24),
('Spider-Man', TRUE, 25), ('Batman', FALSE, 25), ('Wolverine', FALSE, 25), ('Flash', FALSE, 25);

-- Preguntas difíciles (ID 26-30)
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
('¿Qué personaje de DC es conocido como el mejor detective del mundo?', 'dificil', 'Opera en Gotham City.', 'Batman es reconocido como un brillante detective y estratega.', 2),
('¿Cuál es el verdadero nombre de Wolverine?', 'dificil', 'Su nombre es de origen canadiense.', 'Logan es el nombre real más usado por Wolverine, aunque su nombre verdadero es James Howlett.', 2),
('¿Qué superhéroe de Marvel posee un escudo hecho de vibranium?', 'dificil', 'Es un símbolo de la justicia americana.', 'El escudo del Capitán América está hecho de vibranium.', 2),
('¿Quién es el archienemigo de Flash conocido por su velocidad?', 'dificil', 'Viste de amarillo.', 'Reverse Flash es uno de los enemigos más peligrosos de Flash.', 2),
('¿Qué grupo lidera el personaje conocido como Star-Lord?', 'dificil', 'Protegen la galaxia.', 'Los Guardianes de la Galaxia son un grupo de antihéroes cósmicos.', 2);

-- Respuestas difíciles
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Batman', TRUE, 26), ('Superman', FALSE, 26), ('Flash', FALSE, 26), ('Green Lantern', FALSE, 26),
('Logan', TRUE, 27), ('Peter Parker', FALSE, 27), ('Tony Stark', FALSE, 27), ('Clark Kent', FALSE, 27),
('Capitán América', TRUE, 28), ('Pantera Negra', FALSE, 28), ('Iron Man', FALSE, 28), ('Hulk', FALSE, 28),
('Reverse Flash', TRUE, 29), ('Zoom', FALSE, 29), ('Capitán Frío', FALSE, 29), ('Lex Luthor', FALSE, 29),
('Guardianes de la Galaxia', TRUE, 30), ('Los Vengadores', FALSE, 30), ('X-Men', FALSE, 30), ('Liga de la Justicia', FALSE, 30);