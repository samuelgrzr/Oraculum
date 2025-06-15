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
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
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
    FOREIGN KEY (id_partida) REFERENCES partida(id) ON DELETE CASCADE,
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
-- 1
('¿Quién es el rey de los dioses griegos?', 'heroica', 'Su arma es el rayo maestro.', 'Zeus es el dios supremo del Olimpo.', 1),
-- 2
('¿Cómo se llama el dios de los mares?', 'heroica', 'Hermano de Zeus.', 'Poseidón gobierna los océanos y mares.', 1),
-- 3
('¿Quién es la diosa de la sabiduría?', 'heroica', 'Nació de la cabeza de Zeus.', 'Atenea es la diosa de la sabiduría y la guerra estratégica.', 1),
-- 4
('¿Qué héroe mató al Minotauro?', 'heroica', 'Usó un hilo para no perderse.', 'Teseo derrotó al Minotauro en el laberinto de Creta.', 1),
-- 5
('¿Quién abrió la caja que liberó todos los males?', 'heroica', 'Primera mujer creada por los dioses.', 'Pandora abrió la caja o ánfora por curiosidad, aun cuando su única instrucción era no abrirla.', 1),
-- 6
('¿Cómo se llama el caballo alado?', 'heroica', 'Nació de la sangre de Medusa.', 'Pegaso es el famoso caballo con alas.', 1),
-- 7
('¿Quién robó el fuego para dárselo a los humanos?', 'heroica', 'Fue castigado por Zeus toda la eternidad.', 'Prometeo desafió a los dioses para ayudar a la humanidad.', 1),
-- 8
('¿Cómo se llama el perro de tres cabezas?', 'heroica', 'Custodia la entrada del Inframundo.', 'Cerbero vigila las puertas del Hades.', 1),
-- 9
('¿Quién es la diosa del amor y la belleza?', 'heroica', 'Nació de la espuma del mar.', 'Afrodita es la diosa del amor.', 1),
-- 10
('¿Qué titán sostiene el firmamento?', 'heroica', 'Su nombre se usa para los mapas.', 'Atlas fue condenado por Zeus a cargar la bóveda celeste.', 1),
-- 11
('¿Quién completó los doce trabajos?', 'heroica', 'Hijo de Zeus.', 'Heracles realizó doce trabajos como penitencia por matar a su familia, confunfido por la magia de Hera.', 1),
-- 12
('¿Cómo se llama el dios de la guerra?', 'heroica', 'Hijo de Zeus y Hera.', 'Ares es el dios griego de la guerra.', 1),
-- 13
('¿Quién es el mensajero de los dioses?', 'heroica', 'Puede entrar y salir del Inframundo a voluntad.', 'Hermes es el mensajero divino.', 1),
-- 14
('¿Cómo se llama la diosa de la caza?', 'heroica', 'Hermana gemela de Apolo.', 'Artemisa es la diosa de la caza y la Luna.', 1),
-- 15
('¿Quién castigó a Sísifo?', 'heroica', 'Rey del Inframundo.', 'Hades impuso el famoso castigo eterno de empujar la roca a Sísifo.', 1),
-- 16
('¿Qué monstruo convertía en piedra con la mirada?', 'heroica', 'Tenía serpientes por cabello.', 'Medusa petrificaba a quien la mirase.', 1),
-- 17
('¿Quién mató a Medusa?', 'heroica', 'Usó un escudo como espejo.', 'Perseo decapitó a Medusa.', 1),
-- 18
('¿Cómo se llama el dios del Sol?', 'heroica', 'Hermano gemelo de Artemisa.', 'Apolo es el dios del Sol, la luz y la música, entre muchas otras cosas', 1),
-- 19
('¿Quién es la reina del Olimpo?', 'heroica', 'Diosa del matrimonio.', 'Hera es la actual esposa de Zeus y su hermana.', 1),
-- 20
('¿Qué criatura tenía cuerpo de león y cabeza humana?', 'heroica', 'Hacía acertijos mortales.', 'La Esfinge aterrorizaba Tebas con sus enigmas.', 1),
-- 21
('¿Quién es el rey del Inframundo?', 'heroica', 'Hermano mayor de Zeus y Poseidón.', 'Hades gobierna el reino de los muertos.', 1),
-- 22
('¿Cómo se llama la diosa de la agricultura?', 'heroica', 'Madre de Perséfone.', 'Deméter controla las cosechas.', 1),
-- 23
('¿Qué héroe navegó durante diez años para volver a casa?', 'heroica', 'Rey de Ítaca.', 'Odiseo protagonizó la Odisea tras la guerra de Troya.', 1),
-- 24
('¿Quién era invulnerable excepto en el talón?', 'heroica', 'Su madre lo sumergió en el Estigia.', 'Aquiles tenía un punto débil en el talón.', 1),
-- 25
('¿Cómo se llama el monte donde viven los dioses?', 'heroica', 'La montaña más alta de Grecia.', 'El monte Olimpo es el hogar de los dioses principales.', 1),
-- 26
('¿Quién construyó el laberinto de Creta?', 'heroica', 'Famoso inventor y arquitecto.', 'Dédalo diseñó el laberinto del Minotauro.', 1),
-- 27
('¿Quién murió por volar demasiado cerca del Sol?', 'heroica', 'No hizo caso a las indicaciones de su padre.', 'Ícaro se precipitó al mar cuando se derritió la cera de sus alas.', 1),
-- 28
('¿Quién es el dios del vino?', 'heroica', 'También es el dios de la locura y las fiestas.', 'Dioniso es el dios de la vid y la celebración.', 1),
-- 29
('¿Cómo se llamaba la mujer más bella del mundo?', 'heroica', 'Su rapto causó la guerra de Troya.', 'Helena de Troya era famosa por su belleza incomparable.', 1),
-- 30
('¿Quién tocaba la lira tan bien que calmaba a las fieras?', 'heroica', 'Bajó al Inframundo por amor.', 'Orfeo era un músico legendario.', 1),
-- 31
('¿Qué raza de mujeres guerreras desciende de Ares?', 'heroica', 'No permitían hombres mas que para procrear.', 'Las Amazonas eran temibles luchadoras, todas hijas del dios de la guerra.', 1),
-- 32
('¿Quién era el centauro conocido como el padre de la medicina?', 'heroica', 'Fue maestro de muchos héroes, como Aquiles y Jasón.', 'Quirón, un centauro inmortal hijo de Cronos, fue el precursor del arte de la medicina.', 1),
-- 33
('¿Cómo se llama el río principal del Hades?', 'heroica', 'Hay que pagar al barquero para no vagar 100 años en sus aguas.', 'El río Estigia, que a su vez es una deidad.', 1),
-- 34
('¿Cómo se llama el barquero del Inframundo?', 'heroica', 'Transporta las almas a través del río Estigia.', 'Caronte exigía un óbolo por el viaje, que debían enterrar los vivos junto con el cuerpo.', 1),
-- 35
('¿Qué criatura tenía múltiples cabezas que regeneraban?', 'heroica', 'Heracles la derrotó en su segundo trabajo.', 'La Hidra de Lerna regeneraba dos cabezas por cada cabeza cercenada.', 1),
-- 36
('¿Quién era el rey de Troya durante la famosa guerra?', 'heroica', 'Padre de Héctor y Paris.', 'Príamo gobernaba Troya durante la guerra.', 1),
-- 37
('¿Cómo se llamaba el mayor héroe troyano?', 'heroica', 'Hermano de Paris y príncipe heredero.', 'Héctor defendió Troya valientemente, pero murió en un duelo a manos de Aquiles.', 1),
-- 38
('¿Quién raptó a Helena de Esparta?', 'heroica', 'Príncipe troyano.', 'Paris causó la guerra de Troya al raptar a Helena.', 1),
-- 39
('¿Qué estratagema usaron los griegos para entrar en Troya?', 'heroica', 'Un regalo de madera.', 'El caballo de Troya fue una trampa disfrazada de ofrenda a los dioses, fabricado con la madera de los barcos aqueos.', 1),
-- 40
('¿Quién ideó el caballo de Troya?', 'heroica', 'Rey de Ítaca, muy astuto.', 'Odiseo planeó la estratagema del caballo para acabar con el estancamiento de la guerra tras 10 años.', 1),
-- 41
('¿Cómo se llama la diosa de la discordia?', 'heroica', 'Causó problemas en una boda.', 'Eris, hija de Ares, provocó el juicio de Paris ofreciendo una manzana a la diosa más bella, pero sin concretarla.', 1),
-- 42
('¿Qué fruta causó el juicio de Paris?', 'heroica', 'Fruto dorado de la discordia.', 'La manzana de oro inició la disputa entre diosas, e indirectamente la guerra de Troya.', 1),
-- 43
('¿Quién forja las armas de los dioses?', 'heroica', 'Dios del fuego y la forja, hijo de Hera y Zeus.', 'Hefesto es el herrero divino, recluido en su forja a causa de su deformidad.', 1),
-- 44
('¿Cómo se llamaba el mortal que se enamoró de sí mismo?', 'heroica', 'Se convirtió en flor.', 'Narciso se enamoró de su propia imagen, debido a los poderes de Afrodita, y murió intentando alcanzarla en un lago.', 1),
-- 45
('¿Qué titán fue condenado a contar cada segundo por la eternidad?', 'heroica', 'Su castigo fue impuesto por liderar la Titanomaquia.', 'Cronos fue encerrado en el Tártaro, obligado a contar los segundos eternamente, dando inicio al tiempo..', 1),
-- 46
('¿Quién es el padre de Zeus?', 'heroica', 'Titán que devoraba a sus hijos.', 'Cronos temía ser destronado por sus descendientes, debido a la profecía de su padre, Urano.', 1),
-- 47
('¿Cómo se llama la diosa del hogar?', 'heroica', 'Hermana de Zeus, muy pacífica.', 'Hestia protegía el fuego sagrado del hogar, que en la antigua Grecia era como se llamaba a la chimenea central de las casas.', 1),
-- 48
('¿Qué criatura tenía cabeza de toro y cuerpo de hombre?', 'heroica', 'Vivía en un laberinto en Creta.', 'El Minotauro era hijo de Pasífae y el toro de Creta, octavo trabajo de Heracles.', 1),
-- 49
('¿Quién es la madre de Perséfone?', 'heroica', 'Diosa de las cosechas.', 'Deméter buscó desesperadamente a su hija, raptada por Hades, y durante ese tiempo no hubo cosechas para la humanidad.', 1),
-- 50
('¿Cómo se llama el dios de los sueños?', 'heroica', 'Hijo de Hipnos, la personificación del sueño.', 'Morfeo enviaba sueños a los mortales.', 1);

-- Respuestas nivel medio
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Zeus', TRUE, 1), ('Cronos', FALSE, 1), ('Hades', FALSE, 1), ('Apolo', FALSE, 1),
('Poseidón', TRUE, 2), ('Ponto', FALSE, 2), ('Nereo', FALSE, 2), ('Tritón', FALSE, 2),
('Atenea', TRUE, 3), ('Hera', FALSE, 3), ('Hestia', FALSE, 3), ('Artemisa', FALSE, 3),
('Teseo', TRUE, 4), ('Heracles', FALSE, 4), ('Perseo', FALSE, 4), ('Jasón', FALSE, 4),
('Pandora', TRUE, 5), ('Epimeteo', FALSE, 5), ('Zeus', FALSE, 5), ('Prometeo', FALSE, 5),
('Pegaso', TRUE, 6), ('Arión', FALSE, 6), ('Hipogrifo', FALSE, 6), ('Unicornio', FALSE, 6),
('Prometeo', TRUE, 7), ('Epimeteo', FALSE, 7), ('Atlas', FALSE, 7), ('Heracles', FALSE, 7),
('Cerbero', TRUE, 8), ('Hidra', FALSE, 8), ('Quimera', FALSE, 8), ('Hades', FALSE, 8),
('Afrodita', TRUE, 9), ('Hera', FALSE, 9), ('Psique', FALSE, 9), ('Artemisa', FALSE, 9),
('Atlas', TRUE, 10), ('Helios', FALSE, 10), ('Prometeo', FALSE, 10), ('Epimeteo', FALSE, 10),
('Heracles', TRUE, 11), ('Odiseo', FALSE, 11), ('Perseo', FALSE, 11), ('Aquiles', FALSE, 11),
('Ares', TRUE, 12), ('Hades', FALSE, 12), ('Apolo', FALSE, 12), ('Hermes', FALSE, 12),
('Hermes', TRUE, 13), ('Apolo', FALSE, 13), ('Ares', FALSE, 13), ('Prometeo', FALSE, 13),
('Artemisa', TRUE, 14), ('Atenea', FALSE, 14), ('Atalanta', FALSE, 14), ('Selene', FALSE, 14),
('Hades', TRUE, 15), ('Zeus', FALSE, 15), ('Tánatos', FALSE, 15), ('Caronte', FALSE, 15),
('Medusa', TRUE, 16), ('Mantícora', FALSE, 16), ('Quimera', FALSE, 16), ('Hidra', FALSE, 16),
('Perseo', TRUE, 17), ('Odiseo', FALSE, 17), ('Teseo', FALSE, 17), ('Poseidón', FALSE, 17),
('Apolo', TRUE, 18), ('Helios', FALSE, 18), ('Urano', FALSE, 18), ('Hefesto', FALSE, 18),
('Hera', TRUE, 19), ('Atenea', FALSE, 19), ('Afrodita', FALSE, 19), ('Hestia', FALSE, 19),
('Esfinge', TRUE, 20), ('Mantícora', FALSE, 20), ('Quimera', FALSE, 20), ('León de Nemea', FALSE, 20),
('Hades', TRUE, 21), ('Caronte', FALSE, 21), ('Tártaro', FALSE, 21), ('Ares', FALSE, 21),
('Deméter', TRUE, 22), ('Hera', FALSE, 22), ('Hestia', FALSE, 22), ('Perséfone', FALSE, 22),
('Odiseo', TRUE, 23), ('Aquiles', FALSE, 23), ('Héctor', FALSE, 23), ('Heracles', FALSE, 23),
('Aquiles', TRUE, 24), ('Heracles', FALSE, 24), ('Teseo', FALSE, 24), ('Perseo', FALSE, 24),
('Olimpo', TRUE, 25), ('Parnaso', FALSE, 25), ('Otris', FALSE, 25), ('Etna', FALSE, 25),
('Dédalo', TRUE, 26), ('Hefesto', FALSE, 26), ('Minos', FALSE, 26), ('Ícaro', FALSE, 26),
('Ícaro', TRUE, 27), ('Dédalo', FALSE, 27), ('Faetón', FALSE, 27), ('Pegaso', FALSE, 27),
('Dioniso', TRUE, 28), ('Apolo', FALSE, 28), ('Deméter', FALSE, 28), ('Ares', FALSE, 28),
('Helena', TRUE, 29), ('Hipólita', FALSE, 29), ('Psique', FALSE, 29), ('Casandra', FALSE, 29),
('Orfeo', TRUE, 30), ('Apolo', FALSE, 30), ('Hermes', FALSE, 30), ('Lino', FALSE, 30),
('Amazonas', TRUE, 31), ('Valquirias', FALSE, 31), ('Nereidas', FALSE, 31), ('Musas', FALSE, 31),
('Quirón', TRUE, 32), ('Neso', FALSE, 32), ('Folo', FALSE, 32), ('Euritión', FALSE, 32),
('Estigia', TRUE, 33), ('Leteo', FALSE, 33), ('Aqueronte', FALSE, 33), ('Guadalmedina', FALSE, 33),
('Caronte', TRUE, 34), ('Aqueronte', FALSE, 34), ('Tánatos', FALSE, 34), ('Minos', FALSE, 34),
('Hidra', TRUE, 35), ('Cerbero', FALSE, 35), ('Quimera', FALSE, 35), ('Ladón', FALSE, 35),
('Príamo', TRUE, 36), ('Menelao', FALSE, 36), ('Héctor', FALSE, 36), ('Agamenón', FALSE, 36),
('Héctor', TRUE, 37), ('Paris', FALSE, 37), ('Eneas', FALSE, 37), ('Príamo', FALSE, 37),
('Paris', TRUE, 38), ('Héctor', FALSE, 38), ('Eneas', FALSE, 38), ('Príamo', FALSE, 38),
('Caballo', TRUE, 39), ('Asedio', FALSE, 39), ('Traición', FALSE, 39), ('Soborno', FALSE, 39),
('Odiseo', TRUE, 40), ('Aquiles', FALSE, 40), ('Agamenón', FALSE, 40), ('Menelao', FALSE, 40),
('Eris', TRUE, 41), ('Hera', FALSE, 41), ('Iris', FALSE, 41), ('Afrodita', FALSE, 41),
('Manzana', TRUE, 42), ('Pera', FALSE, 42), ('Higo', FALSE, 42), ('Granada', FALSE, 42),
('Hefesto', TRUE, 43), ('Ares', FALSE, 43), ('Atenea', FALSE, 43), ('Poseidón', FALSE, 43),
('Narciso', TRUE, 44), ('Adonis', FALSE, 44), ('Endimión', FALSE, 44), ('Ganimedes', FALSE, 44),
('Cronos', TRUE, 45), ('Epimeteo', FALSE, 45), ('Prometeo', FALSE, 45), ('Ponto', FALSE, 45),
('Cronos', TRUE, 46), ('Érebo', FALSE, 46), ('Urano', FALSE, 46), ('Gea', FALSE, 46),
('Hestia', TRUE, 47), ('Hera', FALSE, 47), ('Pirra', FALSE, 47), ('Kore', FALSE, 47),
('Minotauro', TRUE, 48), ('Centauro', FALSE, 48), ('Sátiro', FALSE, 48), ('Cretáceo', FALSE, 48),
('Deméter', TRUE, 49), ('Hera', FALSE, 49), ('Hestia', FALSE, 49), ('Persefata', FALSE, 49),
('Morfeo', TRUE, 50), ('Hipnos', FALSE, 50), ('Tánatos', FALSE, 50), ('Nix', FALSE, 50);

-- Preguntas nivel difícil
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
-- 51
('¿Cuál era el nombre del rey de Atenas cuando murió el Minotauro?', 'divina', 'Padre de Teseo y dio nombre al mar que la rodea.', 'Egeo fue el rey de Atenas, quien se suicidó al creer que Teseo no volvió con vida de su misión.', 1),
-- 52
('¿En qué árbol se transformó la ninfa Dafne para escapar de Apolo?', 'divina', 'Su nombre se asocia con las coronas de victoria.', 'Dafne pidió a su padre, un río, que la convirtiera en laurel para que el dios la dejase en paz.', 1),
-- 53
('¿Quién es la madre de las Musas?', 'divina', 'Titánide de la memoria, tía de Zeus.', 'Mnemósine, la personificación de la memoria, es madre de las nueve Musas.', 1),
-- 54
('¿Cómo se llamaba el dragón que custodiaba el Jardín de las Hespérides?', 'divina', 'Tenía 100 cabezas.', 'Ladón guardaba las manzanas de cualquier intruso, hasta que fue derrotado por Heracles en su undécimo trabajo.', 1),
-- 55
('¿Quién es el viento del norte?', 'divina', 'Es el más frío de los cuatro.', 'Bóreas es el gélido viento del norte.', 1),
-- 56
('¿Qué titán se casó con Pandora?', 'divina', 'Hermano de Prometeo.', 'Epimeteo, quien también se moría de curiosidad por ver qué había en la caja o ánfora, instigó a Pandora para que la abriera.', 1),
-- 57
('¿Qué monstruo logró derrotar a Zeus?', 'divina', 'Nació de Gea y Tártaro como respuesta a su ira por el destierro y encierro de los titanes.', 'Tifón, padre de los mayores monstruos, fue el único capaz de derrotar a Zeus, cortándole los tendones.', 1),
-- 58
('¿Quién es el dios de la riqueza?', 'divina', 'Rey de su propio reino.', 'Hades es el dios de la riqueza, ya que todas las pertenencias de los muertos acaban en su posesión.', 1),
-- 59
('¿Cómo se llamaba la primera esposa de Zeus?', 'divina', 'Titánide de la prudencia, madre de Atenea.', 'Metis fue devorada por Zeus para evitar una profecía, sin éxito.', 1),
-- 60
('¿Quién no es uno de los hijos del titán Hiperión, la luz?', 'divina', 'Es, junto a Hermes, mensajera de los dioses.', 'Iris es una diosa, hija de los titanes Taumante y Electra y hermana de las harpías.', 1),
-- 61
('¿Cuál era el nombre del perro de Orión?', 'divina', 'Se convirtió en constelación.', 'Sirio, el perro de Orión, brilla como la estrella más luminosa.', 1),
-- 62
('¿Qué diosa nació de la espuma del mar mezclada con los genitales de Urano?', 'divina', 'Surgió cerca de Chipre.', 'Afrodita nació de esta manera según Hesíodo, cuando Cronos cortó los testículos de su padre y cayeron al mar.', 1),
-- 63
('¿Quién llevaba el carro solar antes que Apolo?', 'divina', 'Titán personificación del Sol.', 'Helios conducía el carro solar hasta que Apolo, hijo de Zeus y dios del Sol y de la luz, le relevó de su puesto.', 1),
-- 64
('¿Cómo se llamaba la nodriza de Zeus en Creta?', 'divina', 'Cabra divina que lo amamantó.', 'Amaltea cuidó al joven Zeus en una cueva del monte Ida, según algunas versiones se convirtió en la constelación de Aries tras su muerte.', 1),
-- 65
('¿Qué rey podía convertir todo en oro?', 'divina', 'Recibió este don de Dioniso.', 'Midas aprendió que la riqueza no lo es todo, y acabó inmortalizado en ella para la posteridad.', 1),
-- 66
('¿Cuál es el nombre del río de fuego en el Inframundo?', 'divina', 'Uno de los cinco ríos infernales.', 'Flegetonte era el río ardiente del Hades.', 1),
-- 67
('¿Qué ninfa perdió la capacidad de hablar por voluntad propia?', 'divina', 'Solo podía repetir las últimas palabras de lo que escuchaba.', 'Eco proclamó que su voz era más hermosa que la de Hera y sufrió las consecuencias.', 1),
-- 68
('¿Quién es el padre de los Cíclopes?', 'divina', 'Personificación del cielo.', 'Urano engendró a los cíclopes con Gea, pero le parecieron horribles y los encerró en el Tártaro.', 1),
-- 69
('¿Cuál es el nombre del río del olvido en el Inframundo?', 'divina', 'Se encuentra rodeando los Campos Elíseos.', 'Los héroes o personas ejemplares que pueden comenzar de nuevo su vida en los Campos Elíseos, tienen la oportunidad de beber del río Leteo para olvidar su vida anterior y no sufrir.', 1),
-- 70
('¿Qué diosa presidía los juramentos?', 'divina', 'Hija de Nix, la noche.', 'Estigia, el río del Inframundo, personificaba los juramentos sagrados e inquebrantables, incluso los de los dioses y titanes.', 1),
-- 71
('¿Quién es el dios de la muerte?', 'divina', 'Ahora es conocido como la Parca.', 'Tánatos actúa como psicopompo, transporta al Inframundo las almas de aquellos a quienes les ha llegado la hora.', 1),
-- 72
('¿Cuál era el nombre de Perséfone antes de convertirse en la reina del Inframundo?', 'divina', 'Significa doncella.', 'Kore fue su nombre de nacimiento, que luego fue cambiado a Perséfone, "la que trae muerte".', 1),
-- 73
('¿Qué rey de Corinto fue condenado a empujar una roca eternamente?', 'divina', 'Engañó a la muerte dos veces.', 'Sísifo fue castigado por su astucia excesiva. Tras engañar a Tánatos y apresarlo, las almas no pudieron ir al Inframundo y Hades se enfureció.', 1),
-- 74
('¿Quién es la diosa de la venganza?', 'divina', 'Se le representa con una balanza.', 'Némesis castiga la hibris, un concepto griego que representa la desmesura, arrogancia u orgullo excesivo, que supere los límites establecidos por los dioses.', 1),
-- 75
('¿Cómo se llamaba el hijo de Dédalo?', 'divina', 'Voló demasiado alto con alas de cera.', 'Ícaro ignoró las advertencias de su padre al volar para escapar del laberinto de Creta y murió ahogado al precipitarse al mar.', 1),
-- 76
('¿Cómo se llamaba el monte donde reinaban los titanes?', 'divina', 'Se pensaba que era el centro del mundo.', 'El monte Otris fue el centro del reinado de Cronos, hasta que fue derrotado por Zeus y sus hermanos y se establecieron en el monte Olimpo.', 1),
-- 77
('¿Qué dios del viento ayudó a Odiseo en su viaje?', 'divina', 'Su nombre se usa ahora para la energía nacida del viento.', 'Eolo, en su isla flotante, obsequió a Odiseo con una bolsa o ánfora que contenía los vientos del Este.', 1),
-- 78
('¿Cómo se llama la esposa de Hefesto?', 'divina', 'Se casaron en contra de la voluntad de ella.', 'Afrodita, quien era deseada por todos, fue ofrecida a Hefesto como recompensa por liberar a Hera de un trono dorado que la rentendría por siempre.', 1),
-- 79
('¿Qué héroe mató a la Quimera?', 'divina', 'Montaba a Pegaso.', 'Belerofonte derrotó al monstruo desde el aire.', 1),
-- 80
('¿Cómo se llamaba la madre de Perseo?', 'divina', 'Zeus la fecundó convirtiéndose en lluvia dorada.', 'Dánae fue encerrada para evitar una profecía que mataría a su padre, pero esto no impidió que Zeus se fijase en ella.', 1),
-- 81
('¿Cómo se llamaba la nave de Jasón?', 'divina', 'Construida con ayuda de Atenea por Argos, hijo de Frixo, quien montó al Carnero de oro.', 'El Argo llevó a Jasón y los argonautas en busca del Vellocino de Oro.', 1),
-- 82
('¿Qué hechicera ayudó a Jasón a conseguir el Vellocino?', 'divina', 'Hechicera de la Cólquide, sobrina de Circe y nieta de Helios.', 'Medea traicionó a su padre por amor a Jasón, debido a las flechas de Eros.', 1),
-- 83
('¿Quién era el padre de Aquiles?', 'divina', 'Rey de los Mirmidones.', 'Peleo, uno de los argonautas, se casó con la nereida Tetis, boda en la que Eris comenzó indirectamente la guerra de Troya.', 1),
-- 84
('¿Cómo se llama la madre de Aquiles?', 'divina', 'Nereida que lo sumergió en la Estigia.', 'Tetis intentó hacer inmortal a su hijo.', 1),
-- 85
('¿Qué profeta ciego advirtió a Edipo?', 'divina', 'Vivió siete generaciones y ayudó también a Odiseo.', 'Tiresias reveló terribles verdades sobre el destino a diferentes héroes, en el caso de Edipo no ayudaron a que su final no fuera trágico.', 1),
-- 86
('¿Quién no es uno de los jueces del Inframundo?', 'divina', 'Es profeta en el Inframundo.', 'Éaco, Radamantis y Minos son los tres jueces del Inframundo, debido a su astucia en vida y a que son hijos de Zeus.', 1),
-- 87
('¿Cómo se llamaba la reina de las Amazonas?', 'divina', 'Poseía un cinturón mágico que la hacía invulnerable.', 'Hipólita fue derrotada por Heracles en su noveno trabajo, ya que pensó que los estaban traicionando, por culpa de un engaño de la diosa Hera.', 1),
-- 88
('¿Qué gigante desafió a los dioses en la Gigantomaquia?', 'divina', 'Rey de los Gigantes, de su nombre deriva un sinónimo actual de "discutir".', 'Porfirión intentó violar a Hera durante la batalla.', 1),
-- 89
('¿Quién es la diosa de la juventud?', 'divina', 'Escancia néctar en el Olimpo.', 'Hebe servía a los dioses antes que Ganimedes, pues su labor es ser la copera de los olímpicos.', 1),
-- 90
('¿Qué héroe fue conocido como Nadie por su enemigo?', 'divina', 'El más astuto de los héroes, utilizó este engaño para escapar con vida.', 'Odiseo se presentó como Nadie ante el cíclope Polifemo, para que, cuando pidiera ayuda, dijese que Nadie le estaba atacando y no la recibiera.', 1),
-- 91
('¿Cuál no es un trabajo de Heracles?', 'divina', 'Hércules tenía una gigantesca fuerza, pero no era muy inteligente.', 'Quien se adentró en el laberinto de Creta para vencer al Minotauro con ayuda de la princesa Ariadna fue Teseo.', 1),
-- 92
('¿Quién no es una Erinia?', 'divina', 'Fue princesa y había una ciudad con su nombre.', 'Megara, princesa de Tebas, fue la esposa de Heracles hasta que este la mató, engañado por Hera.', 1),
-- 93
('¿Quién es el potero del Olimpo?', 'divina', 'Como recompensa por su heroica vida, fue ascendido a divinidad.', 'Cuando Heracles murió, Zeus hizo que su parte divina ascendiera al Olimpo, donde residiría por la eternidad como portero y se casaría con su hermana Hebe.', 1),
-- 94
('¿Qué titán enseñó la astronomía a los humanos?', 'divina', 'Padre de Prometeo y Epimeteo.', 'Jápeto transmitió conocimientos celestiales a los humanos.', 1),
-- 95
('¿Quién es la diosa de la magia?', 'divina', 'Asociada con los cruces de caminos, se dice que tiene 3 cabezas.', 'Hécate tiene poder sobre la tierra, mar y cielo, su origen es anterior a los olímpicos.', 1),
-- 96
('¿Cómo se llama el hijo de Poseidón que fue cegado por Odiseo?', 'divina', 'Cíclope pastor de ovejas.', 'Polifemo fue engañado por la astucia de Odiseo y le ensartaron el ojo mientras dormía.', 1),
-- 97
('¿Qué diosa transformó a Aracne en araña?', 'divina', 'Diosa de la sabiduría y el tejido.', 'Atenea castigó la arrogancia de la tejedora mortal, quien se proclamó superior a ella.', 1),
-- 98
('¿Quién es el dios de los pastores y la Naturaleza?', 'divina', 'Tiene cuernos y patas de cabra.', 'Pan, hijo de Hermes, es parecido a un sátiro pero no comparte su naturaleza salvaje y su libido.', 1),
-- 99
('¿Cómo se llamaba la esposa de Orfeo?', 'divina', 'Murió por la mordedura de una serpiente.', 'Eurídice fue perdida dos veces por Orfeo, quien no pudo cumplir con la condición de Hades para sacarla del Inframundo.', 1),
-- 100
('¿Qué rey fue castigado a tener hambre y sed eternas?', 'divina', 'Sirvió a su hijo como comida a los dioses.', 'Tántalo dio nombre al suplicio del tantalismo, castigado por los dioses con repeler cualquier comida o bebida.', 1);

-- Respuestas nivel difícil
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Egeo', TRUE, 51), ('Erecteo', FALSE, 51), ('Teseo', FALSE, 51), ('Peleo', FALSE, 51),
('Laurel', TRUE, 52), ('Sauce', FALSE, 52), ('Secuoya', FALSE, 52), ('Menta', FALSE, 52),
('Mnemósine', TRUE, 53), ('Temis', FALSE, 53), ('Rea', FALSE, 53), ('Tetis', FALSE, 53),
('Ladón', TRUE, 54), ('Pitón', FALSE, 54), ('Sísifo', FALSE, 54), ('Smaug', FALSE, 54),
('Bóreas', TRUE, 55), ('Céfiro', FALSE, 55), ('Noto', FALSE, 55), ('Eolo', FALSE, 55),
('Epimeteo', TRUE, 56), ('Prometeo', FALSE, 56), ('Ponto', FALSE, 56), ('Jápeto', FALSE, 56),
('Tifón', TRUE, 57), ('Pitón', FALSE, 57), ('Equidna', FALSE, 57), ('Nidhog', FALSE, 57),
('Hades', TRUE, 58), ('Hermes', FALSE, 58), ('Nereo', FALSE, 58), ('Euro', FALSE, 58),
('Metis', TRUE, 59), ('Temis', FALSE, 59), ('Hera', FALSE, 59), ('Leto', FALSE, 59),
('Iris', TRUE, 60), ('Selene', FALSE, 60), ('Eos', FALSE, 60), ('Helios', FALSE, 60),
('Sirio', TRUE, 61), ('Layla', FALSE, 61), ('Argos', FALSE, 61), ('Ortro', FALSE, 61),
('Afrodita', TRUE, 62), ('Atenea', FALSE, 62), ('Hera', FALSE, 62), ('Artemisa', FALSE, 62),
('Helios', TRUE, 63), ('Hiperión', FALSE, 63), ('Iris', FALSE, 63), ('Febo', FALSE, 63),
('Amaltea', TRUE, 64), ('Rea', FALSE, 64), ('Adrastea', FALSE, 64), ('Melissa', FALSE, 64),
('Midas', TRUE, 65), ('Creso', FALSE, 65), ('Giges', FALSE, 65), ('Candaules', FALSE, 65),
('Flegetonte', TRUE, 66), ('Cocito', FALSE, 66), ('Aqueronte', FALSE, 66), ('Leteo', FALSE, 66),
('Eco', TRUE, 67), ('Kore', FALSE, 67), ('Dafne', FALSE, 67), ('Clitia', FALSE, 67),
('Urano', TRUE, 68), ('Cronos', FALSE, 68), ('Zeus', FALSE, 68), ('Poseidón', FALSE, 68),
('Leteo', TRUE, 69), ('Cocito', FALSE, 69), ('Aqueronte', FALSE, 69), ('Flegetonte', FALSE, 69),
('Estigia', TRUE, 70), ('Temis', FALSE, 70), ('Némesis', FALSE, 70), ('Dice', FALSE, 70),
('Tánatos', TRUE, 71), ('Hermes', FALSE, 71), ('Hades', FALSE, 71), ('Morfeo', FALSE, 71),
('Kore', TRUE, 72), ('Rea', FALSE, 72), ('Deméter', FALSE, 72), ('Cibeles', FALSE, 72),
('Sísifo', TRUE, 73), ('Tántalo', FALSE, 73), ('Ixión', FALSE, 73), ('Ticio', FALSE, 73),
('Némesis', TRUE, 74), ('Eris', FALSE, 74), ('Metis', FALSE, 74), ('Temis', FALSE, 74),
('Ícaro', TRUE, 75), ('Talos', FALSE, 75), ('Perdix', FALSE, 75), ('Catreo', FALSE, 75),
('Otris', TRUE, 76), ('Olimpo', FALSE, 76), ('Etna', FALSE, 76), ('Parnaso', FALSE, 76),
('Eolo', TRUE, 77), ('Céfiro', FALSE, 77), ('Noto', FALSE, 77), ('Bóreas', FALSE, 77),
('Afrodita', TRUE, 78), ('Dafne', FALSE, 78), ('Talía', FALSE, 78), ('Eufrósine', FALSE, 78),
('Belerofonte', TRUE, 79), ('Perseo', FALSE, 79), ('Heracles', FALSE, 79), ('Teseo', FALSE, 79),
('Dánae', TRUE, 80), ('Io', FALSE, 80), ('Dafne', FALSE, 80), ('Anticlea', FALSE, 80),
('Argo', TRUE, 81), ('Nautilo', FALSE, 81), ('Perla Negra', FALSE, 81), ('Hipocampo', FALSE, 81),
('Medea', TRUE, 82), ('Circe', FALSE, 82), ('Hécate', FALSE, 82), ('Pasífae', FALSE, 82),
('Peleo', TRUE, 83), ('Eaco', FALSE, 83), ('Telamón', FALSE, 83), ('Menecio', FALSE, 83),
('Tetis', TRUE, 84), ('Anfitrite', FALSE, 84), ('Galatea', FALSE, 84), ('Nereida', FALSE, 84),
('Tiresias', TRUE, 85), ('Calcas', FALSE, 85), ('Anfiarao', FALSE, 85), ('Melampo', FALSE, 85),
('Tiresias', TRUE, 86), ('Éaco', FALSE, 86), ('Minos', FALSE, 86), ('Radamantis', FALSE, 86),
('Hipólita', TRUE, 87), ('Pentesilea', FALSE, 87), ('Antíope', FALSE, 87), ('Diana', FALSE, 87),
('Porfirión', TRUE, 88), ('Alcioneo', FALSE, 88), ('Encélado', FALSE, 88), ('Tifón', FALSE, 88),
('Hebe', TRUE, 89), ('Iris', FALSE, 89), ('Ganimedes', FALSE, 89), ('Peito', FALSE, 89),
('Odiseo', TRUE, 90), ('Jasón', FALSE, 90), ('Teseo', FALSE, 90), ('Heracles', FALSE, 90),
('Laberinto de Creta', TRUE, 91), ('Toro de Creta', FALSE, 91), ('Aves de Estínfalo', FALSE, 91), ('Cinturón de Hipólita', FALSE, 91),
('Megara', TRUE, 92), ('Tisífone', FALSE, 92), ('Megera', FALSE, 92), ('Alecto', FALSE, 92),
('Heracles', TRUE, 93), ('Ares', FALSE, 93), ('San Pedro', FALSE, 93), ('Argos', FALSE, 93),
('Jápeto', TRUE, 94), ('Cronos', FALSE, 94), ('Prometeo', FALSE, 94), ('Astrea', FALSE, 94),
('Hécate', TRUE, 95), ('Circe', FALSE, 95), ('Medea', FALSE, 95), ('Pasífae', FALSE, 95),
('Polifemo', TRUE, 96), ('Brontes', FALSE, 96), ('Estéropes', FALSE, 96), ('Argos', FALSE, 96),
('Atenea', TRUE, 97), ('Hera', FALSE, 97), ('Hestia', FALSE, 97), ('Artemisa', FALSE, 97),
('Pan', TRUE, 98), ('Silvano', FALSE, 98), ('Fauno', FALSE, 98), ('Hermes', FALSE, 98),
('Eurídice', TRUE, 99), ('Calíope', FALSE, 99), ('Clío', FALSE, 99), ('Euterpe', FALSE, 99),
('Tántalo', TRUE, 100), ('Sísifo', FALSE, 100), ('Ixión', FALSE, 100), ('Ticio', FALSE, 100);

-- 🟣 Superhéroes

-- Preguntas nivel medio
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
-- 101
('¿Cuál es el nombre real de Superman?', 'heroica', 'Reportero del Daily Planet.', 'Clark Kent es la identidad secreta de Superman.', 2),
-- 102
('¿De qué planeta viene Superman?', 'heroica', 'Fue destruido antes de que naciera.', 'Krypton era el planeta natal de Superman.', 2),
-- 103
('¿Cuál es la principal debilidad de Superman?', 'heroica', 'Mineral radioactivo de su planeta.', 'La kryptonita es mortal para Superman.', 2),
-- 104
('¿Cómo se llama la ciudad donde vive Superman?', 'heroica', 'Ciudad ficticia donde trabaja como reportero.', 'Metrópolis es el hogar adoptivo de Superman.', 2),
-- 105
('¿Cuál es el nombre real de Batman?', 'heroica', 'Millonario de Gotham City.', 'Bruce Wayne es la identidad secreta de Batman.', 2),
-- 106
('¿Cómo se llama el mayordomo de Batman?', 'heroica', 'Fiel servidor de la familia Wayne.', 'Alfred Pennyworth cuida de Bruce Wayne.', 2),
-- 107
('¿En qué ciudad opera Batman?', 'heroica', 'Ciudad oscura y corrupta.', 'Gotham City, la ciudad sin Sol, es el territorio de Batman.', 2),
-- 108
('¿Cuál es el nombre real del Spiderman original?', 'heroica', 'Estudiante que fue mordido por una araña.', 'Peter Parker se convirtió en Spiderman.', 2),
-- 109
('¿Qué le dio poderes a Spiderman?', 'heroica', 'Accidente en un laboratorio.', 'Una araña radioactiva mordió a Peter Parker.', 2),
-- 110
('¿Cuál es el nombre real de Wonder Woman?', 'heroica', 'Princesa amazona.', 'Diana Prince es la identidad de Wonder Woman.', 2),
-- 111
('¿De dónde viene Wonder Woman?', 'heroica', 'Isla habitada solo por mujeres guerreras.', 'Themyscira es el hogar de las amazonas.', 2),
-- 112
('¿Cuál es el arma característica de Wonder Woman?', 'heroica', 'Cuerda mágica que obliga a decir la verdad.', 'El lazo de la verdad es su arma principal.', 2),
-- 113
('¿Cuál es el nombre real del Flash principal?', 'heroica', 'Científico forense de Central City.', 'Barry Allen es la identidad de Flash.', 2),
-- 114
('¿Cuál es el poder de Flash?', 'heroica', 'Puede correr más rápido que la luz.', 'La súper velocidad es el poder de Flash.', 2),
-- 115
('¿Cuál es el nombre del Linterna Verde principal?', 'heroica', 'Piloto de pruebas.', 'Hal Jordan es uno de los Linterna Verde más famosos.', 2),
-- 116
('¿Cuál es la fuente de poder de los Linternas Verdes?', 'heroica', 'Forma parte de una de las emociones que conforman el espectro luminoso en DC.', 'El anillo de poder, que debe cargarse en la batería central en Oa, utiliza la fuerza de voluntad de su usuario para funcionar.', 2),
-- 117
('¿Cuál es el nombre real de Aquaman?', 'heroica', 'Rey de los océanos.', 'Arthur Curry es la identidad de Aquaman.', 2),
-- 118
('¿Dónde gobierna Aquaman?', 'heroica', 'Reino submarino.', 'Atlantis es el reino de Aquaman.', 2),
-- 119
('¿Cuál es el nombre del archienemigo de Batman?', 'heroica', 'Payaso criminal loco.', 'El Joker es el némesis principal de Batman.', 2),
-- 120
('¿Cómo se llama el archienemigo de Superman?', 'heroica', 'Genio criminal calvo.', 'Lex Luthor es el enemigo más conocido de Superman, con un CI más alto que el de Batman, ha llegado a ser presidente de los Estados Unidos.', 2),
-- 121
('¿Cuál es el nombre real de Iron Man?', 'heroica', 'Genio millonario, inventor, filántropo y playboy.', 'Tony Stark es la identidad de Iron Man.', 2),
-- 122
('¿Qué alimenta el traje de Iron Man?', 'heroica', 'Lo tiene implantado en su pecho, sustituyendo a su corazón.', 'El reactor arc mantiene vivo a Tony Stark.', 2),
-- 123
('¿Cuál es el nombre real del Captitán América original?', 'heroica', 'Soldado de la Segunda Guerra Mundial.', 'Steve Rogers se convirtió en el Capitán América.', 2),
-- 124
('¿Qué objeto característico usa el Capitán América?', 'heroica', 'Arma defensiva circular.', 'Su escudo de vibranium es indestructible.', 2),
-- 125
('¿Cuál es el nombre real de Thor?', 'heroica', 'Dios nórdico del trueno.', 'Thor Odinson es su nombre completo.', 2),
-- 126
('¿Cómo se llama el martillo de Thor?', 'heroica', 'Solo los dignos pueden levantarlo.', 'Mjolnir es el martillo encantado de Thor.', 2),
-- 127
('¿Cuál es el nombre real de Hulk?', 'heroica', 'Científico expuesto a radiación gamma.', 'Bruce Banner se transforma en Hulk.', 2),
-- 128
('¿Qué desencadena la transformación de Hulk?', 'heroica', 'Emoción intensa negativa.', 'La ira convierte a Banner en Hulk.', 2),
-- 129
('¿Cuál es el nombre real de la Viuda Negra?', 'heroica', 'Espía rusa entrenada desde niña.', 'Natasha Romanoff es la Viuda Negra.', 2),
-- 130
('¿Cuál es el nombre real de Hawkeye?', 'heroica', 'Arquero experto de S.H.I.E.L.D.', 'Clint Barton es la identidad de Hawkeye.', 2),
-- 131
('¿Cómo se llama el grupo principal de superhéroes de Marvel?', 'heroica', 'Los héroes más poderosos de la Tierra.', 'Los Vengadores protegen el mundo de las amenazas, y si no pueden, lo vengarán.', 2),
-- 132
('¿Cómo se llama el grupo principal de superhéroes de DC?', 'heroica', 'Son dioses entre humanos.', 'La Liga de la Justicia defiende la Tierra.', 2),
-- 133
('¿Cuál es el nombre real de Lobezno?', 'divina', 'Mutante con garras de adamantium.', 'Ha cambiado varias veces de nombre a lo largo de su vida, y aunque ahora mismo se haga llamar Logan, su verdadero nombre, el que recibió al nacer, es James Howlett.', 2),
-- 134
('¿Cuál es el poder principal de Lobezno?', 'heroica', 'Puede curarse de cualquier herida.', 'El factor de curación regenera su cuerpo.', 2),
-- 135
('¿Cuál es el nombre real de Cíclope?', 'heroica', 'Líder de los X-Men.', 'Scott Summers es la identidad de Cíclope.', 2),
-- 136
('¿Cuál es el poder de Cíclope?', 'heroica', 'Rayos destructivos de sus ojos.', 'Los rayos ópticos son su habilidad mutante.', 2),
-- 137
('¿A qué grupo pertenece Tormenta?', 'heroica', 'Mutante que controla el clima.', 'Ororo Munroe, Tormenta, pertenece y ha sido líder de los X-Men.', 2),
-- 138
('¿Cuál es el poder de Tormenta?', 'heroica', 'Domina los fenómenos meteorológicos.', 'Puede controlar el tiempo atmosférico.', 2),
-- 139
('¿Quién es el maestro de los X-Men?', 'heroica', 'Profesor telepático en silla de ruedas.', 'Charles Xavier fundó la escuela para mutantes.', 2),
-- 140
('¿Cuál es el poder de Charles Xavier?', 'heroica', 'Se dedica a encontrar mutantes ocultos por el mundo.', 'Charles Xavier es uno de los telépatas más poderosos de Marvel.', 2),
-- 141
('¿Cuál es el enemigo principal de los X-Men?', 'heroica', 'Mutante que controla el magnetismo.', 'Magneto es el némesis principal de los X-Men.', 2),
-- 142
('¿Cuál es el poder de Magneto?', 'heroica', 'Es más fuerte cuanta más chatarra tenga alrededor.', 'Magneto controla el magnetismo, pudiendo crear y manipular todo tipo de campos magnéticos y energías similares.', 2),
-- 143
('¿Cuál es el nombre real de Deadpool?', 'heroica', 'Mercenario con factor de curación.', 'Wade Wilson se convirtió en Deadpool, el mercenario bocazas, al intentar curarse de cáncer en Arma X.', 2),
-- 144
('¿Qué característica única tiene Deadpool?', 'heroica', 'Habla directamente con el lector.', 'Rompe la cuarta pared constantemente.', 2),
-- 145
('¿Cuál es el nombre real de Daredevil?', 'heroica', 'Abogado ciego de Hells Kitchen.', 'Matt Murdock es la identidad de Daredevil.', 2),
-- 146
('¿Qué sentido perdió Daredevil?', 'heroica', 'Accidente químico en su infancia.', 'Perdió la vista pero ganó otros sentidos.', 2),
-- 147
('¿Cuál es el nombre real de Punisher?', 'heroica', 'Ex-marine que busca venganza.', 'Frank Castle se convirtió en Punisher.', 2),
-- 148
('¿Qué motivó a Punisher a convertirse en vigilante?', 'heroica', 'Tragedia familiar causada por criminales.', 'La muerte de su familia lo transformó.', 2),
-- 149
('¿Cuál es el nombre real del Doctor Strange?', 'heroica', 'Cirujano que se convirtió en hechicero.', 'Stephen Strange es el Hechicero Supremo.', 2),
-- 150
('¿Cuál es el poder del Doctor Strange?', 'heroica', 'Artes místicas y dimensiones alternativas.', 'Domina la magia y protege la realidad.', 2);

-- Respuestas nivel medio
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('Clark Kent', TRUE, 101), ('Bruce Wayne', FALSE, 101), ('Conner Kent', FALSE, 101), ('Jon Kent', FALSE, 101),
('Krypton', TRUE, 102), ('Marte', FALSE, 102), ('Korugar', FALSE, 102), ('Saturno', FALSE, 102),
('Kryptonita', TRUE, 103), ('Acero', FALSE, 103), ('Fuego', FALSE, 103), ('Plasma', FALSE, 103),
('Metrópolis', TRUE, 104), ('Gotham', FALSE, 104), ('Central City', FALSE, 104), ('Nueva York', FALSE, 104),
('Bruce Wayne', TRUE, 105), ('Clark Kent', FALSE, 105), ('Tony Stark', FALSE, 105), ('Steve Rogers', FALSE, 105),
('Alfred', TRUE, 106), ('Jarvis', FALSE, 106), ('Winston', FALSE, 106), ('Sebastian', FALSE, 106),
('Gotham', TRUE, 107), ('Metrópolis', FALSE, 107), ('Central City', FALSE, 107), ('Coast City', FALSE, 107),
('Peter Parker', TRUE, 108), ('Miles Morales', FALSE, 108), ('Ben Reilly', FALSE, 108), ('Miguel Ohara', FALSE, 108),
('Araña radioactiva', TRUE, 109), ('Experimento químico', FALSE, 109), ('Rayo', FALSE, 109), ('Mutación', FALSE, 109),
('Diana Prince', TRUE, 110), ('Diana Trevor', FALSE, 110), ('Diana Kane', FALSE, 110), ('Diana Queen', FALSE, 110),
('Themyscira', TRUE, 111), ('Amazonia', FALSE, 111), ('Olimpo', FALSE, 111), ('Atlantis', FALSE, 111),
('Lazo de la verdad', TRUE, 112), ('Espada', FALSE, 112), ('Escudo', FALSE, 112), ('Brazaletes', FALSE, 112),
('Barry Allen', TRUE, 113), ('Wally West', FALSE, 113), ('Jay Garrick', FALSE, 113), ('Bart Allen', FALSE, 113),
('Súper velocidad', TRUE, 114), ('Telequinesis táctil', FALSE, 114), ('Teletransporte', FALSE, 114), ('Invisibilidad', FALSE, 114),
('Hal Jordan', TRUE, 115), ('Alan Scott', FALSE, 115), ('Guy Gardner', FALSE, 115), ('Kyle Rayner', FALSE, 115),
('Fuerza de voluntad', TRUE, 116), ('Linterna', FALSE, 116), ('Luz', FALSE, 116), ('Furia', FALSE, 116),
('Arthur Curry', TRUE, 117), ('Orin', FALSE, 117), ('Orm', FALSE, 117), ('Namor', FALSE, 117),
('Atlantis', TRUE, 118), ('Rapture', FALSE, 118), ('Pacifica', FALSE, 118), ('Oceania', FALSE, 118),
('Joker', TRUE, 119), ('Bane', FALSE, 119), ('Enigma', FALSE, 119), ('Dos Caras', FALSE, 119),
('Lex Luthor', TRUE, 120), ('Brainiac', FALSE, 120), ('Doomsday', FALSE, 120), ('Bizarro', FALSE, 120),
('Tony Stark', TRUE, 121), ('James Rhodes', FALSE, 121), ('Pepper Potts', FALSE, 121), ('Happy Hogan', FALSE, 121),
('Reactor', TRUE, 122), ('Energía solar', FALSE, 122), ('Batería', FALSE, 122), ('Combustible', FALSE, 122),
('Steve Rogers', TRUE, 123), ('Bucky Barnes', FALSE, 123), ('Sam Wilson', FALSE, 123), ('Johnny Walker', FALSE, 123),
('Escudo', TRUE, 124), ('Martillo', FALSE, 124), ('Espada', FALSE, 124), ('Hacha', FALSE, 124),
('Thor Odinson', TRUE, 125), ('Loki Laufeyson', FALSE, 125), ('Thor Bjornson', FALSE, 125), ('Thor Laufeyson', FALSE, 125),
('Mjolnir', TRUE, 126), ('Stormbreaker', FALSE, 126), ('Gungnir', FALSE, 126), ('Gram', FALSE, 126),
('Bruce Banner', TRUE, 127), ('Rick Jones', FALSE, 127), ('Thaddeus Ross', FALSE, 127), ('Emil Blonsky', FALSE, 127),
('Ira', TRUE, 128), ('Miedo', FALSE, 128), ('Tristeza', FALSE, 128), ('Dolor', FALSE, 128),
('Natasha Romanoff', TRUE, 129), ('Yelena Belova', FALSE, 129), ('Melina Vostokoff', FALSE, 129), ('Dottie Underwood', FALSE, 129),
('Clint Barton', TRUE, 130), ('Oliver Queen', FALSE, 130), ('Floyd Lawton', FALSE, 130), ('Lester', FALSE, 130),
('Vengadores', TRUE, 131), ('Guardianes de la Galaxia', FALSE, 131), ('Cuatro Fantásticos', FALSE, 131), ('X-Men', FALSE, 131),
('Liga de la Justicia', TRUE, 132), ('Sociedad de la Justicia', FALSE, 132), ('Titanes', FALSE, 132), ('Sociedad de la Justicia', FALSE, 132),
('James Howlett', TRUE, 133), ('Logan', FALSE, 133), ('Scott Summers', FALSE, 133), ('Lobo', FALSE, 133),
('Factor de curación', TRUE, 134), ('Garras', FALSE, 134), ('Fuerza', FALSE, 134), ('Sentidos', FALSE, 134),
('Scott Summers', TRUE, 135), ('Alex Summers', FALSE, 135), ('Gabriel Summers', FALSE, 135), ('Nathan Summers', FALSE, 135),
('Rayos ópticos', TRUE, 136), ('Telepatía', FALSE, 136), ('Telequinesis', FALSE, 136), ('Fuerza', FALSE, 136),
('X-Men', TRUE, 137), ('Vengadores', FALSE, 137), ('Guardianes de la Galaxia', FALSE, 137), ('S.H.I.E.L.D', FALSE, 137),
('Control del clima', TRUE, 138), ('Electroquinesis', FALSE, 138), ('Telequinesis', FALSE, 138), ('Teletransporte', FALSE, 138),
('Charles Xavier', TRUE, 139), ('Erik Lehnsherr', FALSE, 139), ('Logan', FALSE, 139), ('Scott Summers', FALSE, 139),
('Telepatía', TRUE, 140), ('Supervelocidad', FALSE, 140), ('Telequinesis', FALSE, 140), ('Metamorfosis', FALSE, 140),
('Magneto', TRUE, 141), ('Apocalipsis', FALSE, 141), ('Siniestro', FALSE, 141), ('Centinelas', FALSE, 141),
('Control del magnetismo', TRUE, 142), ('Control del clima', FALSE, 142), ('Creación de armas', FALSE, 142), ('Control del metal', FALSE, 142),
('Wade Wilson', TRUE, 143), ('Slade Wilson', FALSE, 143), ('Ryan Reynolds', FALSE, 143), ('Wade Williams', FALSE, 143),
('Romper la cuarta pared', TRUE, 144), ('Inmortalidad', FALSE, 144), ('Teletransporte', FALSE, 144), ('Regeneración', FALSE, 144),
('Matt Murdock', TRUE, 145), ('Mike Murdock', FALSE, 145), ('Jack Murdock', FALSE, 145), ('Frank Murdock', FALSE, 145),
('Vista', TRUE, 146), ('Oído', FALSE, 146), ('Tacto', FALSE, 146), ('Olfato', FALSE, 146),
('Frank Castle', TRUE, 147), ('Frank Castiglione', FALSE, 147), ('Cletus Kasady', FALSE, 147), ('Frank Costa', FALSE, 147),
('Muerte de su familia', TRUE, 148), ('Traición militar', FALSE, 148), ('Experimento fallido', FALSE, 148), ('Accidente', FALSE, 148),
('Stephen Strange', TRUE, 149), ('Kent Nelson', FALSE, 149), ('Vincent Strange', FALSE, 149), ('Stewart Strange', FALSE, 149),
('Magia', TRUE, 150), ('Piroquinesis', FALSE, 150), ('Es un fantasma', FALSE, 150), ('Teletransporte', FALSE, 150);

-- Preguntas nivel difícil
INSERT INTO pregunta (enunciado, dificultad, pista, explicacion, id_categoria) VALUES
-- 151
('¿En qué año fue creado Superman?', 'divina', 'Década de los 30 del siglo XX.', 'Superman apareció por primera vez en Action Comics #1 en 1938.', 2),
-- 152
('¿Cuál es el nombre kryptoniano de Superman?', 'divina', 'Su nombre de nacimiento en Krypton.', 'Kal-El es su verdadero nombre kryptoniano.', 2),
-- 153
('¿Cómo se llama el padre biológico de Superman?', 'divina', 'Científico de Krypton que lo envió a la Tierra.', 'Jor-El salvó a su hijo del destino de Krypton.', 2),
-- 154
('¿Cuál es el nombre de la base de Superman?', 'divina', 'Refugio en el Ártico hecho de cristal.', 'La Fortaleza de la Soledad es su santuario, repleto de tecnología kryptoniana.', 2),
-- 155
('¿Qué significa la "S" en el pecho de Superman?', 'divina', 'No es una letra del alfabeto terrestre.', 'Es el símbolo kryptoniano de la esperanza.', 2),
-- 156
('¿Quién es el primer Robin?', 'divina', 'Acróbata huérfano del circo.', 'Richard Grayson fue el primer compañero de Batman.', 2),
-- 157
('¿Cómo se llama la cárcel psiquiátrica de Gotham?', 'divina', 'Donde encierran a los villanos locos.', 'Arkham Asylum alberga a los criminales dementes.', 2),
-- 158
('¿Cuál es el nombre del comisario de policía aliado de Batman?', 'heroica', 'Es el padre de Batgirl.', 'James Gordon es el aliado más leal de Batman dentro de la policía.', 2),
-- 159
('¿Cuál es el nombre real de Dos Caras?', 'divina', 'Fue un importante fiscal en Gotham.', 'Harvey Dent sufrió un accidente con ácido que le desfiguró medio rostro, creando una hiperfijación en él por la dualidad y convirtiéndolo en un criminal.', 2),
-- 160
('¿Cuál es el nombre real del Pingüino?', 'divina', 'Asqueroso mafioso que traiciona a todos a su alrededor.', 'Oswald Cobblepot llevó una vida de acoso y desilusión que le hizo convertirse en criminal, en busca de poder y reconocimiento.', 2),
-- 161
('¿Quién es el tercer Robin?', 'divina', 'Averiguó por su cuenta la identidad de Batman y Robin.', 'Timothy Drake, el mejor detective entre los Robins, fue el tercero y llegó a liderar a los Titanes.', 2),
-- 162
('¿Cuál es el nombre del periódico donde trabaja Peter Parker?', 'divina', 'Diario sensacionalista de Nueva York.', 'El Daily Bugle publica fotos de Spiderman.', 2),
-- 163
('¿Cómo se llama el jefe de Peter Parker en el periódico?', 'divina', 'Editor que odia a Spiderman.', 'J. Jonah Jameson considera a Spiderman una amenaza e intenta demostrarlo cada vez que puede.', 2),
-- 164
('¿Cuál es el nombre de la madre de Wonder Woman?', 'divina', 'Reina de las Amazonas.', 'Hipólita gobierna Themyscira y es madre de Diana.', 2),
-- 165
('¿Cómo se llama el perro de Superman?', 'divina', 'Llegó con él en su nave tras destruirse su planeta.', 'Krypto, el súper perro, tiene los mismos poderes que Superman, pero en menor medida.', 2),
-- 166
('¿Quién es el padre de Wonder Woman?', 'divina', 'Rey de los dioses griegos.', 'Zeus tuvo a Diana con Hipólita, reina de las Amazonas.', 2),
-- 167
('¿Cómo se llama la ciudad natal de Flash?', 'divina', 'Ciudad gemela de Keystone City.', 'Central City es el hogar de Barry Allen.', 2),
-- 168
('¿Cuál es el nombre de la dimensión de donde obtiene sus poderes Flash?', 'divina', 'Fuente extradimensional de energía.', 'La Speed Force es el origen de los poderes de todos los velocistas.', 2),
-- 169
('¿Quién fue el Flash original de la Edad de Oro?', 'divina', 'Miembro de la Sociedad de la Justicia.', 'Jay Garrick fue el primer Flash en los cómics.', 2),
-- 170
('¿Quién fue el Linterna Verde original de la Edad de Oro?', 'divina', 'Miembro de la Sociedad de la Justicia, usaba una linterna en lugar del Anillo de poder.', 'Alan Scott fue el primer Linterna Verde, usando magia en lugar del poder del espectro de las emociones.', 2),
-- 171
('¿En qué planeta está la sede del Cuerpo de Linternas Verdes?', 'divina', 'Planeta artificial en el centro del universo.', 'Oa es el planeta hogar de los Guardianes del Universo, creadores del Cuerpo de Linternas Verdes.', 2),
-- 172
('¿Cómo se llaman los creadores del Cuerpo de Linternas Verdes?', 'divina', 'Seres azules inmortales.', 'Los Guardianes del Universo fundaron el cuerpo.', 2),
-- 173
('¿Qué Robin se convierte en Red Hood?', 'divina', 'Es el segundo.', 'Jason Todd es asesinado por el Joker, pero revive en una Fosa de Lázaro y pierde su bondad, convirtiéndose en Red Hood para azotar a los criminales de Gotham.', 2),
-- 174
('¿Cuál de estos villanos de Aquaman es familiar suyo?', 'divina', 'Pretendiente al trono de Atlantis.', 'Ocean Master es uno de sus enemigos recurrentes.', 2),
-- 175
('¿Cuál es el nombre real de Ocean Master?', 'divina', 'Hermano celoso del rey de Atlantis.', 'Orm Marius es la identidad de Ocean Master.', 2),
-- 176
('¿Cómo se llama la inteligencia artificial que Iron Man deja a Spiderman?', 'divina', 'Asistente virtual del traje.', 'FRIDAY reemplazó a JARVIS en algunas versiones.', 2),
-- 177
('¿Cuál era el nombre de la IA anterior de Tony Stark?', 'divina', 'Mayordomo virtual basado en Alfred.', 'JARVIS fue la primera IA de Iron Man.', 2),
-- 178
('¿Cómo se llama la prima de Superman?', 'divina', 'Llegó a la Tierra 13 años después que él.', 'Kara Zor-El fue enviada para proteger a su primo pequeño, pero su nave se extravió y llegó a la Tierra 13 años más tarde, encontrándose con un Kal-El ya adulto debido a la diferencia del transcurso del tiempo en el espacio.', 2),
-- 179
('¿Cuál no es una debilidad de Superman?', 'divina', 'No puede dañarle, pero no es posible para él ver a través de este elemento.', 'Además de la kryptonita, la magia es una debilidad de Superman debido a que no se encuentra atada a las leyes del mundo y no existía en su planeta natal. Los sonidos fuertes y estridentes son otra de sus debilidades, ya que le aturden mucho más que al resto por su súper oído.', 2),
-- 180
('¿Cuál es una debilidad de los Green Lantern?', 'divina', 'Era el elemento principal del Cuerpo de Linternas enemigo.', 'En los primeros años, alguien decidió que el color amarillo sería una buena debilidad para un cuerpo de policías intergalácticos capaces de materializar lo que imaginen.', 2),
-- 181
('¿Cuál es el nombre del reino de Thor?', 'divina', 'Uno de los nueve mundos nórdicos.', 'Asgard es el hogar de los dioses nórdicos.', 2),
-- 182
('¿Quién es Batman en el futuro?', 'divina', 'No es un Robin.', 'Terry McGinnis encuentra la Batcueva por accidente cuando Bruce ya es anciano, y este ve potencial en él.', 2),
-- 183
('¿Quién es Spiderman en 2099?', 'divina', 'Ya ha aparecido en las películas.', 'Miguel Ohara es un científico genetista que, intentando recrear las habilidades de Spiderman en otras personas, acaba recibiéndolas él mismo.', 2),
-- 184
('¿Cómo se llama el puente que conecta los nueve mundos?', 'divina', 'Puente arcoíris de la mitología nórdica.', 'Bifrost conecta Asgard con otros reinos.', 2),
-- 185
('¿Quién es Spiderman en el universo Ultimate?', 'divina', 'También le pica una araña, pero no en un evento científico.', 'Miles Morales se convierte en Spiderman en un universo en el que Peter Parker ya ha fallecido.', 2),
-- 186
('¿Cómo se llama la prima de Bruce Banner?', 'divina', 'Abogada que también se volvió verde.', 'Jennifer Walters se convirtió en She-Hulk.', 2),
-- 187
('¿Cuál es el nombre de la organización de espías de Marvel?', 'divina', 'Agencia internacional de seguridad.', 'S.H.I.E.L.D. protege el mundo de amenazas, tanto internas como externas.', 2),
-- 188
('¿Quién es el principal director de S.H.I.E.L.D.?', 'divina', 'Veterano de guerra con parche en el ojo.', 'Nick Fury dirigió la organización durante décadas.', 2),
-- 189
('¿Quién hizo que Superman asesinara con sus propias manos a su mujer embarazada?', 'divina', 'Normalmente opera en otra ciudad.', 'El Joker, harto de perder contra Batman, decidió jugar con Superman y le atacó con gas del miedo del Espantapájaros mezclado con kryptonita, lo que hizo que viera a Lois Lane como Doomsday, uno de sus mayores enemigos, y acabó con ella y su hijo nonato llevándola al espacio exterior.', 2),
-- 190
('¿Cómo se llama el programa que entrenó a la Viuda Negra?', 'divina', 'Programa soviético de espías.', 'La Habitación Roja creó asesinas perfectas.', 2),
-- 191
('¿Cuál es el nombre del metal que cubre el esqueleto de Lobezno?', 'divina', 'Metal indestructible creado artificialmente.', 'El adamantium fue fusionado con sus huesos.', 2),
-- 192
('¿Cómo se llama el programa que experimentó con Lobezno?', 'divina', 'Proyecto militar canadiense secreto.', 'Arma X creó soldados mutantes mejorados, con Lobezno, que ya tenía regeneración, sentidos mejorados y garras óseas, implantó adamantium en su esqueleto para volverlo más mortal, pero esto entorpecía su regeneración y aumentó muchísimo su peso, lo cual lo ralentizaba.', 2),
-- 193
('¿Quién se convierte en Carnage?', 'divina', 'Carnage es un simbionte hijo de Venom.', 'Cletus Kasady, un asesino irracional, se encontró con el simbionte y comenzó a sembrar el caos.', 2),
-- 194
('¿Cuál no es un poder del Detective Marciano?', 'divina', 'Sus habilidades son increíblemente útiles para la infiltración.', 'Debido a un trauma por la destrucción de su familia, el Detective Marciano teme al fuego más que a nada.', 2),
-- 195
('¿Cuál es el nombre real de Fénix, de los X-Men?', 'divina', 'Telépata que se convirtió en Fénix.', 'Jean Grey-Summers es su nombre completo, tras casarse con Scott Summers, Cíclope.', 2),
-- 196
('¿Cómo se llama la entidad cósmica que poseyó a Jean Grey?', 'divina', 'Fuerza primordial de llamas y resurrección.', 'La Fuerza Fénix es una entidad cósmica inmortal e imparable que dota de poderes inigualables a su huésped.', 2),
-- 197
('¿Cuál es el nombre del metal del escudo de Capitán América?', 'divina', 'Metal ficticio más resistente que existe.', 'El vibranium absorbe vibraciones y energía.', 2),
-- 198
('¿De qué país africano proviene el vibranium?', 'divina', 'Nación tecnológicamente avanzada.', 'Wakanda es la fuente principal de vibranium.', 2),
-- 199
('¿Cuál es el nombre del anterior rey de Wakanda y Black Panther?', 'divina', 'Es el padre del actual Black Panther.', 'TChaka era un rey sabio y justo, que abogaba por abrir Wakanda al mundo entero. Su partida convirtió a TChalla en el rey, quien siguió con su voluntad y acabó convirtiendo el país en el Imperio Intergaláctico de Wakanda.', 2),
-- 200
('¿En qué serie de cómics Superman se vuelve un dictador?', 'divina', 'La verdad es que no es muy justo lo que pasa.', 'En Injustice, Superman asesina al Joker, cruzando la línea que juró no cruzar. Tras esto, se da cuenta de que asesinando a los villanos y controlando el planeta puede evitar que la gente sufra, pero acaba desatando una guerra contra los demás héroes.', 2);

-- Respuestas nivel difícil
INSERT INTO respuesta (texto, es_correcta, id_pregunta) VALUES
('1938', TRUE, 151), ('1939', FALSE, 151), ('1940', FALSE, 151), ('1928', FALSE, 151),
('Kal-El', TRUE, 152), ('Jor-El', FALSE, 152), ('Zor-El', FALSE, 152), ('Kara-El', FALSE, 152),
('Jor-El', TRUE, 153), ('Zor-El', FALSE, 153), ('Kal-El', FALSE, 153), ('Lor-El', FALSE, 153),
('Fortaleza de la Soledad', TRUE, 154), ('Cueva de Cristal', FALSE, 154), ('Santuario Ártico', FALSE, 154), ('Refugio Polar', FALSE, 154),
('Esperanza', TRUE, 155), ('Fuerza', FALSE, 155), ('Justicia', FALSE, 155), ('Superman', FALSE, 155),
('Dick Grayson', TRUE, 156), ('Jason Todd', FALSE, 156), ('Tim Drake', FALSE, 156), ('Damian Wayne', FALSE, 156),
('Arkham', TRUE, 157), ('Blackgate', FALSE, 157), ('Belle Reve', FALSE, 157), ('Iron Heights', FALSE, 157),
('James Gordon', TRUE, 158), ('Harvey Bullock', FALSE, 158), ('Sarah Essen', FALSE, 158), ('Harvey Dent', FALSE, 158),
('Harvey Dent', TRUE, 159), ('Pamela Isley', FALSE, 159), ('Waylon Jones', FALSE, 159), ('Terry McGinnis', FALSE, 159),
('Oswald Cobblepot', TRUE, 160), ('Harvey Dent', FALSE, 160), ('Floyd Lawton', FALSE, 160), ('Slade Wilson', FALSE, 160),
('Tim Drake', TRUE, 161), ('Jason Todd', FALSE, 161), ('Damian Wayne', FALSE, 161), ('Dick Grayson', FALSE, 161),
('Daily Bugle', TRUE, 162), ('Daily Globe', FALSE, 162), ('New York Times', FALSE, 162), ('Daily Planet', FALSE, 162),
('J. Jonah Jameson', TRUE, 163), ('Robbie Robertson', FALSE, 163), ('Ben Urich', FALSE, 163), ('Frederick Foswell', FALSE, 163),
('Hipólita', TRUE, 164), ('Antíope', FALSE, 164), ('Penthesilea', FALSE, 164), ('Artemisa', FALSE, 164),
('Krypto', TRUE, 165), ('Bolt', FALSE, 165), ('Ace', FALSE, 165), ('Rex', FALSE, 165),
('Zeus', TRUE, 166), ('Hermes', FALSE, 166), ('Ares', FALSE, 166), ('Apolo', FALSE, 166),
('Central City', TRUE, 167), ('Keystone City', FALSE, 167), ('Coast City', FALSE, 167), ('Star City', FALSE, 167),
('Speed Force', TRUE, 168), ('Time Force', FALSE, 168), ('Velocity Force', FALSE, 168), ('Kinetic Force', FALSE, 168),
('Jay Garrick', TRUE, 169), ('Barry Allen', FALSE, 169), ('Wally West', FALSE, 169), ('Bart Allen', FALSE, 169),
('Alan Scott', TRUE, 170), ('Guy Gardner', FALSE, 170), ('Abin Sur', FALSE, 170), ('Kyle Rayner', FALSE, 170),
('Oa', TRUE, 171), ('Mogo', FALSE, 171), ('Korugar', FALSE, 171), ('Rann', FALSE, 171),
('Guardianes del Universo', TRUE, 172), ('Controladores del Universo', FALSE, 172), ('Zamarones', FALSE, 172), ('Manhunters', FALSE, 172),
('Jason Todd', TRUE, 173), ('Damian Wayne', FALSE, 173), ('Dick Grayson', FALSE, 173), ('Tim Drake', FALSE, 173),
('Ocean Master', TRUE, 174), ('Black Manta', FALSE, 174), ('King Shark', FALSE, 174), ('Killer Croc', FALSE, 174),
('Orm Marius', TRUE, 175), ('David Hyde', FALSE, 175), ('Stephen Shin', FALSE, 175), ('Nanaue', FALSE, 175),
('FRIDAY', TRUE, 176), ('JARVIS', FALSE, 176), ('KAREN', FALSE, 176), ('EDITH', FALSE, 176),
('JARVIS', TRUE, 177), ('FRIDAY', FALSE, 177), ('KAREN', FALSE, 177), ('EDITH', FALSE, 177),
('Kara Zor-El', TRUE, 178), ('Lara Zor-El', FALSE, 178), ('Clara Jor-El', FALSE, 178), ('Luna Jor-El', FALSE, 178),
('Plomo', TRUE, 179), ('Kryptonita', FALSE, 179), ('Magia', FALSE, 179), ('Sonido', FALSE, 179),
('Color amarillo', TRUE, 180), ('Telepatía', FALSE, 180), ('Temperaturas gélidas', FALSE, 180), ('Fuego', FALSE, 180),
('Asgard', TRUE, 181), ('Valhalla', FALSE, 181), ('Midgard', FALSE, 181), ('Jotunheim', FALSE, 181),
('Terry McGinnis', TRUE, 182), ('Damian Wayne', FALSE, 182), ('Dick Grayson', FALSE, 182), ('William Pennyworth', FALSE, 182),
('Miguel Ohara', TRUE, 183), ('May Parker', FALSE, 183), ('Miles Morales', FALSE, 183), ('Cynthia Moon', FALSE, 183),
('Bifrost', TRUE, 184), ('Yggdrasil', FALSE, 184), ('Gjallarhorn', FALSE, 184), ('Gungnir', FALSE, 184),
('Miles Morales', TRUE, 185), ('Miguel Ohara', FALSE, 185), ('May Parker', FALSE, 185), ('Gwen Stacy', FALSE, 185),
('Jennifer Walters', TRUE, 186), ('Betty Ross', FALSE, 186), ('Rebecca Banner', FALSE, 186), ('Susan Banner', FALSE, 186),
('S.H.I.E.L.D.', TRUE, 187), ('H.A.M.M.E.R.', FALSE, 187), ('A.I.M.', FALSE, 187), ('HYDRA', FALSE, 187),
('Nick Fury', TRUE, 188), ('Phil Coulson', FALSE, 188), ('Maria Hill', FALSE, 188), ('Tum Tum Tum Sahur', FALSE, 188),
('Joker', TRUE, 189), ('Black Adam', FALSE, 189), ('General Zod', FALSE, 189), ('Lex Luthor', FALSE, 189),
('Habitación Roja', TRUE, 190), ('Programa Invierno', FALSE, 190), ('Proyecto Insight', FALSE, 190), ('Operación Paperclip', FALSE, 190),
('Adamantium', TRUE, 191), ('Vibranium', FALSE, 191), ('Unobtainium', FALSE, 191), ('Carbonadium', FALSE, 191),
('Arma X', TRUE, 192), ('Arma Gedón', FALSE, 192), ('Proyecto Rebirth', FALSE, 192), ('Experimento X', FALSE, 192),
('Cletus Kasady', TRUE, 193), ('Patrick Mulligan', FALSE, 193), ('Donna Diego', FALSE, 193), ('Mac Gargan', FALSE, 193),
('Piroquinesis', TRUE, 194), ('Metamorfosis', FALSE, 194), ('Telepatía', FALSE, 194), ('Intangibilidad', FALSE, 194),
('Jean Grey', TRUE, 195), ('Jean Summers', FALSE, 195), ('Emma Frost', FALSE, 195), ('Anna Marie', FALSE, 195),
('Fuerza Fénix', TRUE, 196), ('Fuerza Odín', FALSE, 196), ('Ecuación de la Anti-Vida', FALSE, 196), ('Espíritu del Fénix', FALSE, 196),
('Vibranium', TRUE, 197), ('Adamantium', FALSE, 197), ('Décimo Metal', FALSE, 197), ('Proto-Adamantium', FALSE, 197),
('Wakanda', TRUE, 198), ('Genosha', FALSE, 198), ('Krakoa', FALSE, 198), ('Lulusia', FALSE, 198),
('TChaka', TRUE, 199), ('TChalla', FALSE, 199), ('MBaku', FALSE, 199), ('WKabi', FALSE, 199),
('Injustice', TRUE, 200), ('Darkest Night', FALSE, 200), ('Dark Justice League', FALSE, 200), ('Superman Red Son', FALSE, 200);