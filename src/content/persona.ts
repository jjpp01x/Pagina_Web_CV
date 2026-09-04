/**
 * Fuente unica de los datos verificables de Jose.
 *
 * Generado desde el education.html del sitio antiguo, no tecleado a mano, mas
 * las correcciones que Jose confirmo el 2026-08-21. El generador
 * (scripts/generar-persona.py) se retiro al borrar el sitio antiguo, que era su
 * entrada; sigue en el tag sitio-estatico-2026-08-21 y ya no se puede rehacer.
 *
 * Si un dato cambia, cambia AQUI y en ningun otro sitio:
 * el nivel de aleman vivia en cinco ficheros y por eso la portada decia A2/B1
 * mientras la pagina de formacion decia A1.1.
 *
 * Regla: no redondear ningun dato hacia arriba. Es una web de CV.
 */

export type Entrada = {
  fecha: string;
  titulo: string;
  lugar: string;
  enlace?: string;
  descripcion?: string;
  logros?: string[];
};

export type Certificacion = {
  titulo: string;
  emisor: string;
  fecha: string;
  /** Enlace publico de verificacion. Sin el, la certificacion es una afirmacion. */
  verificar?: string;
  credencial?: string;
};

export const persona = {
  nombre: "José Palacios",
  /** El del CV y el que abre la portada: nombre y dos apellidos. */
  nombreCompleto: "José Palacios Beortegui",
  foto: "/img/jpalacios.webp",
  fotoAlt: "José Palacios Beortegui, con gafas y traje oscuro, sobre fondo azul",
  rol: "Analista deep tech",
  /**
   * Zurich, la misma que se declaro en la candidatura de MNTY. Jose lo fijo el
   * 2026-08-22 y eso revoca el "Espana-Suiza" que el mismo habia puesto el dia
   * antes. La regla es que web, CV y outreach digan lo mismo. Lo que NO es
   * declarable es "Davos": Heierling acabo en abril de 2026.
   */
  ubicacion: "Zúrich, Suiza",
  /** El del mercado laboral. jpalacios.contact@ es el de Epokan y no se mezcla. */
  email: "palaciosbeortegui@gmail.com",
  github: "https://github.com/jjpp01x",
  linkedin: "https://linkedin.com/in/jose-palacios-beortegui",
};

export type Empresa = {
  /** Clave con la que textos.ts guarda la ficha traducida de esta empresa. */
  id: string;
  nombre: string;
  url: string;
};

/**
 * Marcas propias de Jose: las funda y las opera el, no son encargos de
 * cliente. Las dos estan publicadas y respondiendo en su dominio.
 *
 * Aqui solo van el nombre y la URL, que no cambian con el idioma. Lo que dice
 * cada ficha vive en textos.ts, indexado por `id`.
 *
 * Precision sobre la forma juridica: la marca Epokan esta a nombre personal de
 * Jose y licenciada a Gabinete Juridico Hispanidad SL, que es quien factura de
 * momento. Por eso el rol que se declara es "Fundador" y no "mi sociedad": lo
 * primero es cierto hoy, lo segundo no.
 */
export const empresas: Empresa[] = [
  { id: "epokan", nombre: "Epokan", url: "https://epokan.com" },
  { id: "corpusproof", nombre: "CorpusProof", url: "https://corpusproof.com" },
];

/**
 * Idiomas. El aleman es A1.1 certificado y A1.2 en curso: NO es A2 ni B1, y no
 * se declara "uso profesional diario".
 */
export const idiomas = [
  { idioma: "Español", nivel: "Nativo" },
  { idioma: "Inglés", nivel: "C1" },
  { idioma: "Alemán", nivel: "A1.1 certificado (Lingoda, 2026) · A1.2 en curso" },
];

export const formacionAcademica: Entrada[] = [
    {
      fecha: "2025 — 2028",
      titulo: "BSc (Hons) Applied Computing",
      lugar: "University of Wales Trinity Saint David · Carmarthen, Gales, Reino Unido",
      descripcion: "Programación, desarrollo de software, redes informáticas, bases de datos, ciberseguridad y computación en la nube.",
    },
    {
      fecha: "2021 — 2025",
      titulo: "BA (Hons) Business Management",
      lugar: "University of Wales Trinity Saint David · Carmarthen, Gales, Reino Unido",
      descripcion: "Gestión empresarial, gestión de proyectos, finanzas, contabilidad, logística y gestión de la cadena de suministro.",
    },
];

/**
 * Experiencia laboral: solo los hechos que no cambian con el idioma.
 *
 * El puesto, el sitio y los logros viven en `textos.ts`, indexados por `id`, igual
 * que las fichas de `empresas`. Hasta el 2026-09-04 estaban aqui en castellano y
 * se servian tal cual en las tres versiones: /en/education.html mostraba
 * "Fundador" y "Agente de Ventas" a un lector ingles.
 *
 * El orden es deliberado y no es cronologico puro: Gabinete Juridico va primero
 * porque es el empleo actual con empleador real, y eso es lo que un reclutador
 * lee como "empleado y estable". Las dos marcas propias van despues, como
 * evidencia de lo construido, no como negocio en marcha.
 */
export type Puesto = {
  /** Clave con la que textos.ts guarda este puesto traducido. */
  id: string;
  fecha: string;
  enlace?: string;
};

export const experiencia: Puesto[] = [
  // La fecha de inicio replica la de Epokan por coherencia con la relacion con
  // la SL; NO esta verificada con Jose. Si empezo antes, se corrige aqui.
  { id: "gabinete", fecha: "Ago 2026 — Actualidad" },
  { id: "corpusproof", fecha: "Ago 2026 — Actualidad", enlace: "https://corpusproof.com" },
  { id: "epokan", fecha: "Ago 2026 — Actualidad", enlace: "https://epokan.com" },
  { id: "heierling", fecha: "Oct 2025 — Abr 2026" },
  { id: "inditex", fecha: "Dic 2021 — Feb 2022" },
  { id: "eci-compras", fecha: "Jul 2021 — Sep 2021" },
  { id: "eci-ventas", fecha: "Feb 2020 — Ago 2020" },
  { id: "eci-logistica", fecha: "Dic 2019 — Ene 2020" },
];

/** Sin el curso de ISSEP, retirado por decision de Jose el 2026-08-21. */
export const certificaciones: Certificacion[] = [
    {
      titulo: "Claude Code in Action",
      emisor: "Anthropic",
      fecha: "Abr 2026",
      verificar: "https://verify.skilljar.com/c/8zt98va7poxj",
    },
    {
      titulo: "Claude Code 101",
      emisor: "Anthropic",
      fecha: "Abr 2026",
      verificar: "https://verify.skilljar.com/c/cvh2e86yoeci",
    },
    {
      titulo: "Claude 101",
      emisor: "Anthropic",
      fecha: "Abr 2026",
      verificar: "https://verify.skilljar.com/c/epntj246xgiv",
    },
    {
      titulo: "Introduction to Claude Cowork",
      emisor: "Anthropic",
      fecha: "Abr 2026",
      verificar: "https://verify.skilljar.com/c/ff3f5noxn89i",
    },
    {
      titulo: "Responsible Prompting: Maximize AI in Your Business",
      emisor: "Santander Open Academy",
      fecha: "Jul 2026",
      credencial: "OA-2026-0718002895391",
    },
    {
      titulo: "Alemán A1.1",
      emisor: "Lingoda GmbH",
      fecha: "Abr 2026",
    },
];
