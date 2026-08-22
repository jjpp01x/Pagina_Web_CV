/**
 * Cadenas de interfaz en los tres idiomas.
 *
 * El hero es lo unico que se reescribio de verdad respecto al sitio antiguo:
 * "Analista Deep Tech en formacion" y "Abierto a roles Jr." abrian con la
 * limitacion, que es lo primero que lee quien decide. Lo que dicen ahora es lo
 * mismo sin autodescalificarse: la titulacion en curso sigue en la segunda
 * linea y la trayectoria completa esta a un clic. La disponibilidad baja a
 * contacto, donde se lee despues de las pruebas y no antes.
 */
import type { Idioma } from "@/lib/rutas";

export type Textos = {
  nav: { inicio: string; proyectos: string; articulos: string; formacion: string; contacto: string };
  hero: {
    titular: string;
    entradilla: string;
    verProyectos: string;
    leerArticulos: string;
  };
  portada: {
    proyectosTitulo: string;
    proyectosPie: string;
    articulosTitulo: string;
    articulosPie: string;
    sobreMiTitulo: string;
    sobreMi: string;
  };
  proyectos: { titulo: string; subtitulo: string; otrosTitulo: string; otrosSubtitulo: string; verRepo: string; verDemo: string };
  articulos: { titulo: string; subtitulo: string; todos: string; volver: string };
  formacion: { titulo: string; subtitulo: string; academica: string; laboral: string; certificaciones: string; idiomas: string; verificar: string; credencial: string };
  contacto: { titulo: string; subtitulo: string; disponibilidad: string; correo: string };
  pie: { atribucion: string; codigo: string };
};

const ES: Textos = {
  nav: { inicio: "Inicio", proyectos: "Proyectos", articulos: "Artículos", formacion: "Formación", contacto: "Contacto" },
  hero: {
    titular:
      "Distingo qué tecnología está lista para producción y cuál conlleva riesgo real, antes de que una empresa apueste por ella.",
    entradilla:
      "Seis herramientas públicas de evaluación de IA y 17 artículos sobre riesgo, coste y cumplimiento. Con el código a la vista.",
    verProyectos: "Ver proyectos",
    leerArticulos: "Leer artículos",
  },
  portada: {
    proyectosTitulo: "Trabajo que puedes verificar",
    proyectosPie: "Ver los proyectos",
    articulosTitulo: "Escrito recientemente",
    articulosPie: "Ver los artículos",
    sobreMiTitulo: "Sobre mí",
    sobreMi:
      "Estudio BSc (Hons) Applied Computing y vengo de gestión empresarial, así que evalúo tecnología sabiendo lo que cuesta ponerla en producción y lo que pasa cuando falla. Construyo herramientas de evaluación —due diligence técnica, auditoría de model cards, detección de temas emergentes— y escribo sobre lo que aprendo al hacerlo.",
  },
  proyectos: {
    titulo: "Proyectos",
    subtitulo: "Herramientas de evaluación de IA, con el código público.",
    otrosTitulo: "Otros proyectos",
    otrosSubtitulo: "Trabajo académico y de sistemas del Level 4.",
    verRepo: "Ver el repositorio",
    verDemo: "Ver la demo",
  },
  articulos: {
    titulo: "Artículos",
    subtitulo: "Sobre evaluación de IA, riesgo, coste y cumplimiento.",
    todos: "Todos los artículos",
    volver: "Volver a artículos",
  },
  formacion: {
    titulo: "Formación y experiencia",
    subtitulo: "Trayectoria académica y profesional.",
    academica: "Formación académica",
    laboral: "Experiencia laboral",
    certificaciones: "Licencias y certificaciones",
    idiomas: "Idiomas",
    verificar: "Verificar credencial",
    credencial: "ID de credencial",
  },
  contacto: {
    titulo: "Contacto",
    subtitulo: "Abierto a posiciones de analista en evaluación tecnológica.",
    disponibilidad: "Abierto a posiciones de analista en evaluación tecnológica.",
    correo: "Escríbeme",
  },
  pie: {
    atribucion: "Construido sobre Magic Portfolio de Once UI, con modificaciones.",
    codigo: "Código de este sitio",
  },
};

const EN: Textos = {
  nav: { inicio: "Home", proyectos: "Projects", articulos: "Articles", formacion: "Education", contacto: "Contact" },
  hero: {
    titular:
      "I tell which technology is ready for production and which carries real risk, before a company bets on it.",
    entradilla:
      "Six public AI evaluation tools and 17 articles on risk, cost and compliance. With the code in plain sight.",
    verProyectos: "See projects",
    leerArticulos: "Read articles",
  },
  portada: {
    proyectosTitulo: "Work you can verify",
    proyectosPie: "See the projects",
    articulosTitulo: "Recently written",
    articulosPie: "See the articles",
    sobreMiTitulo: "About me",
    sobreMi:
      "I am studying BSc (Hons) Applied Computing and come from business management, so I evaluate technology knowing what it costs to put into production and what happens when it fails. I build evaluation tools — technical due diligence, model card auditing, emerging topic detection — and write about what I learn doing it.",
  },
  proyectos: {
    titulo: "Projects",
    subtitulo: "AI evaluation tools, with the code public.",
    otrosTitulo: "Other projects",
    otrosSubtitulo: "Academic and systems work from Level 4.",
    verRepo: "View repository",
    verDemo: "View demo",
  },
  articulos: {
    titulo: "Articles",
    subtitulo: "On AI evaluation, risk, cost and compliance.",
    todos: "All articles",
    volver: "Back to articles",
  },
  formacion: {
    titulo: "Education and experience",
    subtitulo: "Academic and professional background.",
    academica: "Education",
    laboral: "Work experience",
    certificaciones: "Licenses and certifications",
    idiomas: "Languages",
    verificar: "Verify credential",
    credencial: "Credential ID",
  },
  contacto: {
    titulo: "Contact",
    subtitulo: "Open to analyst roles in technology evaluation.",
    disponibilidad: "Open to analyst roles in technology evaluation.",
    correo: "Write to me",
  },
  pie: {
    atribucion: "Built on Magic Portfolio by Once UI, with modifications.",
    codigo: "Source of this site",
  },
};

const DE: Textos = {
  nav: { inicio: "Start", proyectos: "Projekte", articulos: "Artikel", formacion: "Ausbildung", contacto: "Kontakt" },
  hero: {
    titular:
      "Ich unterscheide, welche Technologie produktionsreif ist und welche ein echtes Risiko birgt — bevor ein Unternehmen darauf setzt.",
    entradilla:
      "Sechs öffentliche Werkzeuge zur KI-Bewertung und 17 Artikel über Risiko, Kosten und Compliance. Mit offenem Quellcode.",
    verProyectos: "Projekte ansehen",
    leerArticulos: "Artikel lesen",
  },
  portada: {
    proyectosTitulo: "Nachprüfbare Arbeit",
    proyectosPie: "Zu den Projekten",
    articulosTitulo: "Zuletzt geschrieben",
    articulosPie: "Zu den Artikeln",
    sobreMiTitulo: "Über mich",
    sobreMi:
      "Ich studiere BSc (Hons) Applied Computing und komme aus der Betriebswirtschaft. Deshalb bewerte ich Technologie mit dem Wissen, was ihr Produktiveinsatz kostet und was passiert, wenn sie ausfällt. Ich baue Bewertungswerkzeuge — technische Due Diligence, Model-Card-Audits, Erkennung aufkommender Themen — und schreibe über das, was ich dabei lerne.",
  },
  proyectos: {
    titulo: "Projekte",
    subtitulo: "Werkzeuge zur KI-Bewertung, mit öffentlichem Quellcode.",
    otrosTitulo: "Weitere Projekte",
    otrosSubtitulo: "Akademische und Systemarbeiten aus Level 4.",
    verRepo: "Repository ansehen",
    verDemo: "Demo ansehen",
  },
  articulos: {
    titulo: "Artikel",
    subtitulo: "Über KI-Bewertung, Risiko, Kosten und Compliance.",
    todos: "Alle Artikel",
    volver: "Zurück zu den Artikeln",
  },
  formacion: {
    titulo: "Ausbildung und Erfahrung",
    subtitulo: "Akademischer und beruflicher Werdegang.",
    academica: "Ausbildung",
    laboral: "Berufserfahrung",
    certificaciones: "Lizenzen und Zertifikate",
    idiomas: "Sprachen",
    verificar: "Zertifikat prüfen",
    credencial: "Zertifikats-ID",
  },
  contacto: {
    titulo: "Kontakt",
    subtitulo: "Offen für Analystenrollen in der Technologiebewertung.",
    disponibilidad: "Offen für Analystenrollen in der Technologiebewertung.",
    correo: "Schreiben Sie mir",
  },
  pie: {
    atribucion: "Aufgebaut auf Magic Portfolio von Once UI, mit Änderungen.",
    codigo: "Quellcode dieser Seite",
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
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
