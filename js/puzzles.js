/**
 * Puzzle data for Conexiones - Spanish daily word puzzle game.
 * Each puzzle has exactly 16 words forming 4 groups of 4.
 * Difficulty: 0=yellow(easy), 1=green(medium), 2=blue(hard), 3=purple(expert)
 *
 * To add a new puzzle: append an object to the PUZZLES array with a unique date.
 */
const PUZZLES = [
  {
    date: "2026-03-29",
    groups: [
      {
        category: "Paises centroamericanos",
        difficulty: 0,
        color: "yellow",
        words: ["PANAMA", "HONDURAS", "GUATEMALA", "NICARAGUA"],
        explanation: "Todos son paises de America Central"
      },
      {
        category: "Instrumentos de percusion",
        difficulty: 1,
        color: "green",
        words: ["BOMBO", "MARACAS", "TIMBAL", "BONGO"],
        explanation: "Instrumentos musicales que se golpean o sacuden"
      },
      {
        category: "Partes de un carro",
        difficulty: 2,
        color: "blue",
        words: ["BOMBA", "GATO", "PILOTO", "CAPOTA"],
        explanation: "Bomba de gasolina, gato hidraulico, luz piloto, capota del carro"
      },
      {
        category: "___ de oro",
        difficulty: 3,
        color: "purple",
        words: ["SIGLO", "EDAD", "REGLA", "MEDALLA"],
        explanation: "Siglo de oro, edad de oro, regla de oro, medalla de oro"
      }
    ]
  },
  {
    date: "2026-03-30",
    groups: [
      {
        category: "Platos de arroz latinoamericanos",
        difficulty: 0,
        color: "yellow",
        words: ["PAELLA", "CONGRI", "LOCRIO", "ASOPAO"],
        explanation: "Platos tipicos a base de arroz de distintos paises"
      },
      {
        category: "Monedas latinoamericanas",
        difficulty: 1,
        color: "green",
        words: ["PESO", "SOL", "COLON", "BOLIVAR"],
        explanation: "Unidades monetarias de paises de America Latina"
      },
      {
        category: "Tambien son nombres propios",
        difficulty: 2,
        color: "blue",
        words: ["MERCEDES", "DOLORES", "SANTOS", "CRUZ"],
        explanation: "Palabras comunes que tambien son nombres o apellidos hispanos"
      },
      {
        category: "San ___",
        difficulty: 3,
        color: "purple",
        words: ["JUAN", "MARTIN", "JOSE", "FERNANDO"],
        explanation: "San Juan, San Martin, San Jose, San Fernando — ciudades y santos"
      }
    ]
  },
  {
    date: "2026-03-31",
    groups: [
      {
        category: "Animales del horoscopo chino",
        difficulty: 0,
        color: "yellow",
        words: ["TIGRE", "DRAGON", "SERPIENTE", "CABALLO"],
        explanation: "Animales que representan anos en el zodiaco chino"
      },
      {
        category: "Sinonimos de 'dinero' en jerga",
        difficulty: 1,
        color: "green",
        words: ["LANA", "PLATA", "PASTA", "GUITA"],
        explanation: "Formas coloquiales de referirse al dinero en espanol"
      },
      {
        category: "Palabras que riman con '-cion'",
        difficulty: 2,
        color: "blue",
        words: ["CANCION", "ESTACION", "CORAZON", "RAZON"],
        explanation: "Todas terminan con el sonido -on y riman entre si"
      },
      {
        category: "Tienen un color escondido",
        difficulty: 3,
        color: "purple",
        words: ["PLATEADO", "DORADO", "VERDURA", "BLANQUEAR"],
        explanation: "Plata en plateado, oro en dorado, verde en verdura, blanco en blanquear"
      }
    ]
  },
  {
    date: "2026-04-01",
    groups: [
      {
        category: "Sinonimos de 'bonito'",
        difficulty: 0,
        color: "yellow",
        words: ["LINDO", "HERMOSO", "BELLO", "GUAPO"],
        explanation: "Adjetivos que significan atractivo o agradable a la vista"
      },
      {
        category: "Palindromos en espanol",
        difficulty: 1,
        color: "green",
        words: ["ANA", "OSO", "OJO", "SOMOS"],
        explanation: "Palabras que se leen igual de izquierda a derecha y viceversa"
      },
      {
        category: "Letras propias del espanol",
        difficulty: 2,
        color: "blue",
        words: ["ENE", "ELLE", "ERRE", "CHE"],
        explanation: "Nombres de letras que existen en el alfabeto espanol (n, ll, rr, ch)"
      },
      {
        category: "Dias de la semana (abreviados)",
        difficulty: 3,
        color: "purple",
        words: ["LUN", "MAR", "MIE", "JUE"],
        explanation: "Abreviaturas de lunes, martes, miercoles, jueves — MAR parece 'mar' (sea)"
      }
    ]
  },
  {
    date: "2026-04-02",
    groups: [
      {
        category: "Se encuentran en una pinata",
        difficulty: 0,
        color: "yellow",
        words: ["DULCE", "FRUTA", "CONFETI", "JUGUETE"],
        explanation: "Cosas que se ponen dentro de una pinata"
      },
      {
        category: "Tipos de tequila",
        difficulty: 1,
        color: "green",
        words: ["BLANCO", "REPOSADO", "ANEJO", "CRISTALINO"],
        explanation: "Clasificaciones del tequila por su tiempo de maduracion"
      },
      {
        category: "Expresiones mexicanas",
        difficulty: 2,
        color: "blue",
        words: ["ARRIBA", "ORALE", "ANDALE", "HIJOLE"],
        explanation: "Interjecciones y expresiones populares en Mexico"
      },
      {
        category: "Cambian significado con tilde",
        difficulty: 3,
        color: "purple",
        words: ["SI", "EL", "TU", "MAS"],
        explanation: "si/si, el/el, tu/tu, mas/mas — la tilde cambia el significado completamente"
      }
    ]
  },
  {
    date: "2026-04-03",
    groups: [
      {
        category: "Posiciones de futbol",
        difficulty: 0,
        color: "yellow",
        words: ["PORTERO", "DEFENSA", "VOLANTE", "DELANTERO"],
        explanation: "Posiciones clasicas en un equipo de futbol"
      },
      {
        category: "Superficies de juego",
        difficulty: 1,
        color: "green",
        words: ["CESPED", "ARCILLA", "HIELO", "ARENA"],
        explanation: "Superficies donde se practican deportes (futbol, tenis, hockey, voley playa)"
      },
      {
        category: "Golpe de ___",
        difficulty: 2,
        color: "blue",
        words: ["ESTADO", "SUERTE", "CALOR", "VISTA"],
        explanation: "Golpe de estado, golpe de suerte, golpe de calor, golpe de vista"
      },
      {
        category: "Deportes que son palabras comunes",
        difficulty: 3,
        color: "purple",
        words: ["POLO", "TIRO", "BOXEO", "ESGRIMA"],
        explanation: "Polo (prenda), tiro (disparo), boxeo (empaquetar), esgrima (argumento)"
      }
    ]
  },
  {
    date: "2026-04-04",
    groups: [
      {
        category: "Muebles del hogar",
        difficulty: 0,
        color: "yellow",
        words: ["SILLA", "ESTANTE", "CAMA", "SOFA"],
        explanation: "Piezas de mobiliario comunes en una casa"
      },
      {
        category: "Electrodomesticos",
        difficulty: 1,
        color: "green",
        words: ["NEVERA", "ESTUFA", "LAVADORA", "LICUADORA"],
        explanation: "Aparatos electricos del hogar"
      },
      {
        category: "Cosas que se cuelgan",
        difficulty: 2,
        color: "blue",
        words: ["CUADRO", "CORTINA", "HAMACA", "LAMPARA"],
        explanation: "Objetos que tipicamente van colgados en una casa"
      },
      {
        category: "Poner la ___",
        difficulty: 3,
        color: "purple",
        words: ["MESA", "CARA", "MANO", "NOTA"],
        explanation: "Poner la mesa, poner la cara, poner la mano, poner la nota"
      }
    ]
  },
  {
    date: "2026-04-05",
    groups: [
      {
        category: "Arboles comunes",
        difficulty: 0,
        color: "yellow",
        words: ["ROBLE", "PINO", "CEDRO", "OLMO"],
        explanation: "Especies de arboles conocidas"
      },
      {
        category: "Fenomenos del clima",
        difficulty: 1,
        color: "green",
        words: ["TORMENTA", "GRANIZO", "NEBLINA", "SEQUIA"],
        explanation: "Fenomenos meteorologicos o climaticos"
      },
      {
        category: "Cuerpos de agua",
        difficulty: 2,
        color: "blue",
        words: ["LAGO", "ARROYO", "CASCADA", "MANANTIAL"],
        explanation: "Formaciones naturales de agua dulce"
      },
      {
        category: "Ojo de ___",
        difficulty: 3,
        color: "purple",
        words: ["BUEY", "AGUILA", "CERRADURA", "HURACAN"],
        explanation: "Ojo de buey, ojo de aguila, ojo de la cerradura, ojo del huracan"
      }
    ]
  }
];
