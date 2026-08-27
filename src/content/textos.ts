/**
 * Cadenas de interfaz en los tres idiomas.
 *
 * GENERADO desde js/translations.js del sitio anterior. Es el texto que ya
 * estaba publicado, palabra por palabra: en una web de CV no se redacta
 * contenido nuevo sin que lo apruebe su dueño.
 *
 * El generador (scripts/generar-textos.py) se retiro al borrar el sitio
 * antiguo, que era su entrada. Sigue en el tag sitio-estatico-2026-08-21.
 * A partir de aqui este fichero se edita a mano.
 *
 * Unico cambio sobre el original: se retiran las banderas emoji de las
 * píldoras de idiomas. Eran el diagnóstico número 1 del encargo (emojis usados
 * como iconos); el texto no se toca.
 */
import type { Idioma } from "@/lib/rutas";

export type GrupoHabilidades = { titulo: string; elementos: string[] };

export type Textos = {
  /** Etiqueta del boton de descarga. No estaba en translations.js: en el sitio
   * anterior era texto fijo en el HTML, solo en espanol. */
  descargarCV: string;
  nav: {
    inicio: string; proyectos: string; articulos: string;
    formacion: string; contacto: string; sobreMi: string;
  };
  /** Bloque de cifras de la pagina "Sobre mi". Se cuentan del contenido real. */
  cifras: { titulo: string; articulos: string; proyectos: string; idiomas: string; titulaciones: string; certificaciones: string };
  hero: { saludo: string; titulo: string; descripcion: string; btn1: string; btn2: string };
  sobre: { titulo: string; parrafos: string[]; disponible: string };
  skills: { titulo: string; grupos: GrupoHabilidades[] };
  proyectos: { titulo: string; subtitulo: string; verRepo: string; verDemo: string };
  articulos: { titulo: string; volver: string };
  formacion: {
    titulo: string; subtitulo: string; academica: string; laboral: string;
    certificaciones: string; idiomas: string; verificar: string; credencial: string;
  };
  contacto: {
    titulo: string; subtitulo: string; info: string; formTitulo: string;
    nombre: string; nombrePh: string; emailPh: string; asunto: string; asuntoPh: string;
    mensaje: string; mensajePh: string; enviar: string; enviando: string;
    exito: string; error: string;
    labelUbicacion: string; labelLinkedin: string; ubicacion: string;
  };
  pie: { copy: string; atribucion: string };
};

const ES: Textos = {
  cifras: {
    titulo: "En cifras",
    articulos: "artículos publicados",
    proyectos: "proyectos con repositorio público",
    idiomas: "idiomas",
    titulaciones: "titulaciones",
    certificaciones: "certificaciones",
  },
  descargarCV: "Descargar CV",
  nav: {
    inicio: "Inicio",
    proyectos: "Proyectos",
    articulos: "Artículos",
    formacion: "Formación",
    contacto: "Contacto",
  
    sobreMi: "Sobre mí",},
  hero: {
    saludo: "Hola, soy",
    titulo: "Analista Deep Tech en formación — evalúo si una tecnología funciona y qué riesgo conlleva",
    descripcion: "Estudiante de BSc (Hons) Applied Computing (UWTSD). Combino una base sólida en gestión empresarial con la capacidad de evaluar y construir tecnología: ingeniería informática, IA y analítica de datos. Actualmente entre España y Suiza.",
    btn1: "Contactar",
    btn2: "Ver experiencia",
  },
  sobre: {
    titulo: "Sobre mí",
    parrafos: [
      "Graduado en BA (Hons) Business Management por University of Wales Trinity Saint David (2021–2025) y actualmente cursando BSc (Hons) Applied Computing — una combinación que me permite unir pensamiento estratégico con ejecución técnica.",
      "Me especializo en la intersección de IA, Data Analytics y estrategia de negocio: entender una tecnología lo bastante bien como para evaluar si funciona y qué riesgo conlleva, no solo para usarla. Especial interés en la digitalización de la cadena de suministro y la automatización de procesos.",
      "Experiencia profesional internacional en Suiza, España y entornos multilingües (español nativo, inglés profesional, alemán A1.1 — A1.2 en curso).",
      "Me interesa especialmente el lado de la evaluación: entender qué tecnología está lista para usarse en producción y cuál conlleva riesgo real, antes de que una empresa apueste por ella.",
    ],
    disponible: "Abierto a roles Jr. en Análisis Tecnológico, Investigación en IA & Tech",
  },
  skills: {
    titulo: "Habilidades",
    grupos: [
      { titulo: "Tecnología & IA", elementos: ["Python", "SQL", "AWS Cloud", "Prompt Engineering", "Data Analytics", "Salesforce"] },
      { titulo: "Negocio & Gestión", elementos: ["Supply Chain", "Business Strategy", "Project Management", "Logística", "ERP Systems"] },
      { titulo: "Idiomas", elementos: ["Español — Nativo", "Inglés — Profesional", "Alemán — A1.1"] },
      { titulo: "Certificaciones", elementos: ["Salesforce Trailhead", "Claude Code in Action"] },
    ],
  },
  proyectos: {
    titulo: "Proyectos",
    subtitulo: "Herramientas de evaluación técnica y trabajo de ingeniería",
    verRepo: "Ver el repositorio",
    verDemo: "Ver la demo",
  },
  articulos: {
    titulo: "Artículos",
    volver: "Volver a artículos",
  },
  formacion: {
    titulo: "Formación y Experiencia",
    subtitulo: "Mi trayectoria académica y profesional",
    academica: "Formación Académica",
    laboral: "Experiencia Laboral",
    certificaciones: "Certificaciones",
    idiomas: "Idiomas",
    verificar: "Ver credencial",
    credencial: "ID de credencial",
  },
  contacto: {
    titulo: "Contacto",
    subtitulo: "¿Tienes una propuesta o quieres conectar? Escríbeme",
    info: "Información",
    formTitulo: "Envíame un mensaje",
    nombre: "Nombre",
    nombrePh: "Tu nombre",
    emailPh: "tu@email.com",
    asunto: "Asunto",
    asuntoPh: "¿De qué se trata?",
    mensaje: "Mensaje",
    mensajePh: "Escribe tu mensaje aquí...",
    enviar: "Enviar mensaje",
    enviando: "Enviando…",
    exito: "¡Mensaje enviado correctamente! Me pondré en contacto pronto.",
    error: "No se pudo enviar. Escríbeme directamente a",
    labelUbicacion: "Ubicación",
    labelLinkedin: "LinkedIn",
    ubicacion: "España–Suiza",
  },
  pie: {
    copy: "© 2026 Jose Palacios Beortegui",
    atribucion: "Construido sobre Magic Portfolio de Once UI, con modificaciones.",
  },
};

const EN: Textos = {
  cifras: {
    titulo: "In numbers",
    articulos: "published articles",
    proyectos: "projects with a public repository",
    idiomas: "languages",
    titulaciones: "degrees",
    certificaciones: "certifications",
  },
  descargarCV: "Download CV",
  nav: {
    inicio: "Home",
    proyectos: "Projects",
    articulos: "Articles",
    formacion: "Education",
    contacto: "Contact",
  
    sobreMi: "About me",},
  hero: {
    saludo: "Hi, I'm",
    titulo: "Deep Tech Analyst in training — I evaluate whether a technology works and what risk it carries",
    descripcion: "BSc (Hons) Applied Computing student (UWTSD). I combine a solid background in business management with the ability to evaluate and build technology: computer engineering, AI and data analytics. Currently between Spain and Switzerland.",
    btn1: "Contact me",
    btn2: "See experience",
  },
  sobre: {
    titulo: "About me",
    parrafos: [
      "BA (Hons) Business Management graduate at University of Wales Trinity Saint David (2021–2025), currently studying BSc (Hons) Applied Computing — a combination that lets me bridge strategic thinking with technical execution.",
      "I specialise in the intersection of AI, Data Analytics and Business Strategy: understanding a technology well enough to evaluate whether it works and what risk it carries, not just to use it. Strong interest in supply chain digitalisation and process automation.",
      "International professional experience in Switzerland and Spain, working in multilingual environments (native Spanish, professional English, German A1.1 — A1.2 in progress).",
      "I'm particularly interested in the evaluation side: understanding which technology is ready for real use and which carries real risk, before a business bets on it.",
    ],
    disponible: "Open to Jr. roles in Technology Analysis, AI Research & Tech",
  },
  skills: {
    titulo: "Skills",
    grupos: [
      { titulo: "Technology & AI", elementos: ["Python", "SQL", "AWS Cloud", "Prompt Engineering", "Data Analytics", "Salesforce"] },
      { titulo: "Business & Management", elementos: ["Supply Chain", "Business Strategy", "Project Management", "Logística", "ERP Systems"] },
      { titulo: "Languages", elementos: ["Español — Nativo", "Inglés — Profesional", "Alemán — A1.1"] },
      { titulo: "Certifications", elementos: ["Salesforce Trailhead", "Claude Code in Action"] },
    ],
  },
  proyectos: {
    titulo: "Projects",
    subtitulo: "Technical evaluation tooling and engineering work",
    verRepo: "View repository",
    verDemo: "View demo",
  },
  articulos: {
    titulo: "Articles",
    volver: "Back to articles",
  },
  formacion: {
    titulo: "Education & Experience",
    subtitulo: "My academic and professional background",
    academica: "Academic Education",
    laboral: "Work Experience",
    certificaciones: "Certifications",
    idiomas: "Languages",
    verificar: "View credential",
    credencial: "Credential ID",
  },
  contacto: {
    titulo: "Contact",
    subtitulo: "Have a proposal or want to connect? Write to me",
    info: "Information",
    formTitulo: "Send me a message",
    nombre: "Name",
    nombrePh: "Your name",
    emailPh: "your@email.com",
    asunto: "Subject",
    asuntoPh: "What is it about?",
    mensaje: "Message",
    mensajePh: "Write your message here...",
    enviar: "Send message",
    enviando: "Sending…",
    exito: "Message sent successfully! I will get back to you soon.",
    error: "Could not send. Write to me directly at",
    labelUbicacion: "Location",
    labelLinkedin: "LinkedIn",
    ubicacion: "Spain–Switzerland",
  },
  pie: {
    copy: "© 2026 Jose Palacios Beortegui",
    atribucion: "Built on Magic Portfolio by Once UI, with modifications.",
  },
};

const DE: Textos = {
  cifras: {
    titulo: "In Zahlen",
    articulos: "veröffentlichte Artikel",
    proyectos: "Projekte mit öffentlichem Repository",
    idiomas: "Sprachen",
    titulaciones: "Abschlüsse",
    certificaciones: "Zertifikate",
  },
  descargarCV: "Lebenslauf herunterladen",
  nav: {
    inicio: "Start",
    proyectos: "Projekte",
    articulos: "Artikel",
    formacion: "Ausbildung",
    contacto: "Kontakt",
  
    sobreMi: "Über mich",},
  hero: {
    saludo: "Hallo, ich bin",
    titulo: "Deep-Tech-Analyst in Ausbildung — ich bewerte, ob eine Technologie funktioniert und welches Risiko sie birgt",
    descripcion: "Student des BSc (Hons) Applied Computing (UWTSD). Ich verbinde eine solide Grundlage im Betriebswirtschaftsmanagement mit der Fähigkeit, Technologie zu bewerten und zu entwickeln: Informatik, KI und Datenanalyse. Derzeit zwischen Spanien und der Schweiz.",
    btn1: "Kontakt",
    btn2: "Erfahrung ansehen",
  },
  sobre: {
    titulo: "Über mich",
    parrafos: [
      "Absolvent in BA (Hons) Business Management an der University of Wales Trinity Saint David (2021–2025), derzeit im Studium des BSc (Hons) Applied Computing — eine Kombination, die strategisches Denken mit technischer Umsetzung verbindet.",
      "Ich spezialisiere mich auf die Schnittstelle von KI, Datenanalyse und Unternehmensstrategie: eine Technologie so gut zu verstehen, dass ich bewerten kann, ob sie funktioniert und welches Risiko sie birgt — nicht nur, sie zu nutzen. Besonderes Interesse an der Digitalisierung von Lieferketten.",
      "Internationale Berufserfahrung in der Schweiz und Spanien in mehrsprachigen Umgebungen (Spanisch Muttersprache, Englisch professionell, Deutsch A1.1 — A1.2 laufend).",
      "Mich interessiert besonders die Bewertungsseite: zu verstehen, welche Technologie produktionsreif ist und welche echtes Risiko birgt, bevor ein Unternehmen darauf setzt.",
    ],
    disponible: "Offen für Einsteigerstellen in Technologieanalyse, KI-Research & Tech",
  },
  skills: {
    titulo: "Fähigkeiten",
    grupos: [
      { titulo: "Technologie & KI", elementos: ["Python", "SQL", "AWS Cloud", "Prompt Engineering", "Data Analytics", "Salesforce"] },
      { titulo: "Wirtschaft & Management", elementos: ["Supply Chain", "Business Strategy", "Project Management", "Logística", "ERP Systems"] },
      { titulo: "Sprachen", elementos: ["Español — Nativo", "Inglés — Profesional", "Alemán — A1.1"] },
      { titulo: "Zertifizierungen", elementos: ["Salesforce Trailhead", "Claude Code in Action"] },
    ],
  },
  proyectos: {
    titulo: "Projekte",
    subtitulo: "Werkzeuge zur technischen Bewertung und Ingenieurarbeit",
    verRepo: "Repository ansehen",
    verDemo: "Demo ansehen",
  },
  articulos: {
    titulo: "Artikel",
    volver: "Zurück zu den Artikeln",
  },
  formacion: {
    titulo: "Ausbildung & Erfahrung",
    subtitulo: "Mein akademischer und beruflicher Werdegang",
    academica: "Akademische Ausbildung",
    laboral: "Berufserfahrung",
    certificaciones: "Zertifizierungen",
    idiomas: "Sprachen",
    verificar: "Zertifikat ansehen",
    credencial: "Zertifikats-ID",
  },
  contacto: {
    titulo: "Kontakt",
    subtitulo: "Haben Sie ein Angebot oder möchten Sie sich vernetzen?",
    info: "Informationen",
    formTitulo: "Schreib mir eine Nachricht",
    nombre: "Name",
    nombrePh: "Ihr Name",
    emailPh: "ihre@email.com",
    asunto: "Betreff",
    asuntoPh: "Worum geht es?",
    mensaje: "Nachricht",
    mensajePh: "Schreiben Sie hier Ihre Nachricht...",
    enviar: "Nachricht senden",
    enviando: "Wird gesendet…",
    exito: "Nachricht erfolgreich gesendet! Ich melde mich bald.",
    error: "Konnte nicht gesendet werden. Schreiben Sie mir direkt an",
    labelUbicacion: "Standort",
    labelLinkedin: "LinkedIn",
    ubicacion: "Spanien–Schweiz",
  },
  pie: {
    copy: "© 2026 Jose Palacios Beortegui",
    atribucion: "Aufgebaut auf Magic Portfolio von Once UI, mit Änderungen.",
  },
};

const TEXTOS: Record<Idioma, Textos> = { es: ES, en: EN, de: DE };

export function textos(lang: Idioma): Textos {
  return TEXTOS[lang];
}

/** Fecha localizada. Los MDX guardan ISO; el idioma se aplica al pintar. */
export function fechaLocalizada(iso: string, lang: Idioma): string {
  const locale = { es: "es-ES", en: "en-GB", de: "de-DE" }[lang];
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}
