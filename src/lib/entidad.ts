/**
 * El nodo canonico de entidad del sitio.
 *
 * Este fichero existe por una razon concreta: josepalacios.site, epokan.com,
 * corpusproof.com, LinkedIn y GitHub describen a la misma persona y ninguno se
 * lo decia a los buscadores en un formato que pudieran consumir. Sin un
 * identificador compartido no hay entidad que consolidar, y por eso la consulta
 * "Jose Palacios" resuelve hoy a un jugador de beisbol y no a el.
 *
 * Reglas que sostienen el diseno (spec del 2026-09-04):
 *
 * 1. Un solo `@id`, `ID_PERSONA`. Ningun sitio declara un Person sin el.
 * 2. Cada dominio emite el nodo COMPLETO, no una referencia. Una referencia
 *    cruzada obliga al rastreador a haber visto ya el otro dominio; el nodo
 *    repetido no. Es duplicacion a proposito.
 *
 *    Lo que tiene que ser identico entre dominios es el `@id` y el `sameAs`:
 *    eso es lo que consolida. `description` y `jobTitle` van en el idioma de
 *    la pagina, porque /en/ y /de/ los servian en castellano -- el nodo decia
 *    inLanguage "en" y luego un parrafo en espanol, que es justo lo que un
 *    motor de respuesta no puede citar.
 * 3. `sameAs` solo lleva perfiles de identidad (LinkedIn, GitHub). Las marcas
 *    van por `worksFor`, que es lo que significan: meter epokan.com en
 *    `sameAs` afirmaria que la empresa ES la persona.
 * 4. La reciprocidad es obligatoria. Si aqui se declara `worksFor: Epokan`,
 *    epokan.com declara `founder` apuntando a `ID_PERSONA`. Una relacion
 *    declarada en un solo sentido se descuenta.
 *
 * Los datos salen de `src/content/persona.ts` y no se reescriben aqui. La regla
 * de ese fichero -- no redondear ningun dato hacia arriba -- tambien aplica:
 * por eso `knowsLanguage` no incluye el aleman. Es A1.1, y schema.org no tiene
 * forma de expresar el nivel, asi que declararlo se leeria como competencia
 * real.
 */

import { persona } from "@/content/persona";
import { textos } from "@/content/textos";
import { BASE_URL, href, type Idioma, ruta } from "./rutas";

/** El identificador canonico de Jose. Compartido por los tres dominios. */
export const ID_PERSONA = `${BASE_URL}/#person`;
export const ID_SITIO = `${BASE_URL}/#website`;

export const ID_EPOKAN = "https://epokan.com/#organizacion";
export const ID_CORPUSPROOF = "https://corpusproof.com/#organizacion";

/**
 * Perfiles de identidad. La forma con `www.` es la canonica de LinkedIn y la
 * que Google lleva indexada; `persona.ts` guarda la corta para mostrarla.
 */
const PERFILES = [
  "https://www.linkedin.com/in/jose-palacios-beortegui",
  persona.github,
];

function nodoPersona(lang: Idioma) {
  return {
  "@type": "Person",
  "@id": ID_PERSONA,
  name: persona.nombreCompleto,
  alternateName: [
    persona.nombre,
    "Jose Palacios Beortegui",
    "Jose Palacios",
  ],
  givenName: "José",
  familyName: "Palacios Beortegui",
  url: `${BASE_URL}/`,
  image: `${BASE_URL}${persona.foto}`,
  jobTitle: textos(lang).rolProfesional,
  /**
   * El parrafo que un motor de respuesta cita cuando le preguntan quien es.
   * Definicion primero, sin adjetivos: quien, donde, en que trabaja y que ha
   * fundado. Recoge lo que antes vivia suelto en el AboutPage de Epokan.
   */
  description: textos(lang).descripcionEntidad,
  email: `mailto:${persona.email}`,
  homeLocation: {
    "@type": "Place",
    name: persona.ubicacion,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zúrich",
      addressCountry: "CH",
    },
  },
  knowsLanguage: [
    { "@type": "Language", name: "Español", alternateName: "es" },
    { "@type": "Language", name: "Inglés", alternateName: "en" },
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Wales Trinity Saint David",
    url: "https://www.uwtsd.ac.uk/",
  },
  knowsAbout: [
    "Gobernanza de la inteligencia artificial",
    "Reglamento (UE) 2024/1689",
    "Preparación de datos para sistemas de IA",
    "Evaluación de sistemas de IA",
    "Due diligence técnica",
  ],
  sameAs: PERFILES,
  worksFor: [
    { "@type": "Organization", "@id": ID_EPOKAN, name: "Epokan", url: "https://epokan.com/" },
    { "@type": "Organization", "@id": ID_CORPUSPROOF, name: "CorpusProof", url: "https://corpusproof.com/" },
  ],
  };
}

/**
 * El grafo de un articulo.
 *
 * `author` y `publisher` no repiten los datos de Jose: apuntan al `@id`
 * canonico. Es la mitad que faltaba del trabajo de entidad -- cada uno de los
 * 41 articulos pasa a ser una obra atribuida a la misma persona, en lugar de 41
 * paginas sueltas que Google no sabe de quien son.
 *
 * No se declara `dateModified`. El .mdx no guarda esa fecha y la del build seria
 * inventada; una fecha de modificacion falsa es peor que ninguna.
 */
export function grafoArticulo(a: {
  title: string;
  description: string;
  date: string;
  image: string;
  category?: string;
  slug: string;
}, lang: Idioma, migas: { nombre: string; url: string }[]) {
  const url = `${BASE_URL}${href(ruta.articulo(lang, a.slug))}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#articulo`,
        headline: a.title,
        description: a.description,
        image: a.image,
        datePublished: a.date,
        inLanguage: lang,
        ...(a.category ? { articleSection: a.category } : {}),
        author: { "@id": ID_PERSONA },
        publisher: { "@id": ID_PERSONA },
        isPartOf: { "@id": ID_SITIO },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: migas.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.nombre,
          ...(i < migas.length - 1 ? { item: m.url } : {}),
        })),
      },
    ],
  };
}

/**
 * El grafo de la pagina "sobre mi".
 *
 * `ProfilePage` es el tipo con el que schema.org dice "esta pagina VA SOBRE esta
 * persona", que es distinto de "esta pagina la escribio esta persona". Las 79
 * paginas del sitio declaran el nodo Person; solo estas tres declaran que la
 * persona es el asunto de la pagina.
 *
 * Para una consulta de nombre es la senal que decide cual de las 79 merece
 * salir, y es el ancla que un motor de respuesta usa cuando le preguntan "quien
 * es Jose Palacios".
 */
export function grafoPerfil(lang: Idioma, rutaNext: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE_URL}${href(rutaNext)}#perfil`,
    url: `${BASE_URL}${href(rutaNext)}`,
    inLanguage: lang,
    mainEntity: { "@id": ID_PERSONA },
    about: { "@id": ID_PERSONA },
    isPartOf: { "@id": ID_SITIO },
  };
}

/**
 * El grafo que va en el <head> de las tres versiones de idioma.
 *
 * `inLanguage` es lo unico que cambia entre idiomas: el nodo de persona es el
 * mismo objeto en los tres, que es justamente el punto.
 */
export function grafoEntidad(lang: Idioma) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      nodoPersona(lang),
      {
        "@type": "WebSite",
        "@id": ID_SITIO,
        url: `${BASE_URL}/`,
        name: persona.nombreCompleto,
        alternateName: `${persona.nombre} — ${persona.rol}`,
        inLanguage: lang,
        publisher: { "@id": ID_PERSONA },
        author: { "@id": ID_PERSONA },
        copyrightHolder: { "@id": ID_PERSONA },
      },
    ],
  };
}
