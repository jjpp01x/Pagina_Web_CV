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

/** Epokan va primero por ser lo actual; el resto sale del sitio antiguo. */
export const experiencia: Entrada[] = [
    {
      fecha: "Ago 2026 — Actualidad",
      titulo: "Fundador",
      lugar: "Epokan · proyecto propio · remoto",
      enlace: "https://epokan.com",
      logros: [
        "Formación en IA y cumplimiento del Reglamento Europeo de IA para despachos, asesorías y gestorías",
        "Diseño del programa, del material formativo y de la captación",
      ],
    },
    {
      fecha: "Oct 2025 — Abr 2026",
      titulo: "Agente de Ventas",
      lugar: "Heierling GmbH · Davos, Suiza",
      logros: [
        "Atención personalizada a clientes internacionales de más de 15 nacionalidades (inglés y alemán)",
        "Gestión de procesos de inventario y reposición mediante sistemas internos",
        "Enfoque data-driven para optimizar recomendaciones de producto y la operativa diaria",
      ],
    },
    {
      fecha: "Dic 2021 — Feb 2022",
      titulo: "Analista de Logística",
      lugar: "Inditex (Zara) · Zaragoza, España",
      logros: [
        "Procesamiento de mercancía entrante y saliente: recepción, organización de stock y reposición",
        "Operación de sistemas TPV y control de inventario en un entorno de alto volumen",
        "Apoyo a la organización del almacén durante los lanzamientos de nuevas colecciones",
      ],
    },
    {
      fecha: "Jul 2021 — Sep 2021",
      titulo: "Encargado de Compras y Logística",
      lugar: "El Corte Inglés · Zaragoza, España",
      logros: [
        "Coordinación de aprovisionamiento y logística entrante, asegurando la disponibilidad de stock",
        "Aplicación de principios Lean para optimizar los flujos de almacén",
        "Uso de sistemas de inventario y ERP para seguimiento de stock y gestión de pedidos",
      ],
    },
    {
      fecha: "Feb 2020 — Ago 2020",
      titulo: "Especialista en Ventas Minoristas",
      lugar: "El Corte Inglés · Zaragoza, España",
      logros: [
        "Ventas y captación de clientes en múltiples categorías de producto",
        "Asesoramiento de producto para ajustar las necesidades del cliente y contribuir a objetivos de venta",
        "Mantenimiento de estándares de exposición y merchandising visual",
      ],
    },
    {
      fecha: "Dic 2019 — Ene 2020",
      titulo: "Operaciones de Logística",
      lugar: "El Corte Inglés · Zaragoza, España",
      logros: [
        "Recepción y procesamiento de entregas de proveedores en campaña de temporada alta",
        "Gestión de flujos de distribución física y enrutado de producto a departamentos",
        "Categorización sistemática de producto y seguimiento de inventario",
      ],
    },
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
