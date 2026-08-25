/**
 * Esquema de URLs del sitio, en un solo sitio.
 *
 * Dos formas por pagina y las dos importan:
 *
 * - `ruta()` da la ruta nativa de Next (`/articulos/seguridad-web`). Es la que
 *   usan los <Link> internos.
 * - `href()` da la forma con `.html` (`/articulos/seguridad-web.html`). Es la
 *   que lleva indexada Google desde hace meses, asi que es la que va en
 *   `canonical`, en `hreflang` y en el sitemap.
 *
 * GitHub Pages sirve ambas con 200 y sin redirigir (verificado el 2026-08-21
 * contra preview.josepalacios.site), de modo que los enlaces antiguos siguen
 * funcionando. El `canonical` es lo que evita que cuenten como contenido
 * duplicado.
 *
 * Los segmentos estan traducidos a proposito: `/de/artikel/` lleva meses
 * indexado y renombrarlo a `/de/articles/` costaria esas URLs.
 */

export const IDIOMAS = ["es", "en", "de"] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_POR_DEFECTO: Idioma = "es";

export const BASE_URL = "https://josepalacios.site";

/** Etiqueta que se muestra en el conmutador de idioma. */
export const NOMBRE_IDIOMA: Record<Idioma, string> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
};

/** Codigo que va en <html lang> y en hreflang. */
export const CODIGO_HREFLANG: Record<Idioma, string> = {
  es: "es",
  en: "en",
  de: "de",
};

type Seccion = "articulos" | "proyectos";

/**
 * Prefijo de cada idioma. El espanol vive en la raiz porque es lo que Google
 * lleva indexado; moverlo a /es/ costaria las 48 URLs actuales.
 */
const PREFIJO: Record<Idioma, string> = { es: "", en: "/en", de: "/de" };

/** Segmento de cada seccion, traducido por idioma. */
const SEGMENTO: Record<Idioma, Record<Seccion, string>> = {
  es: { articulos: "articulos", proyectos: "proyectos" },
  en: { articulos: "articles", proyectos: "projects" },
  de: { articulos: "artikel", proyectos: "projekte" },
};

/**
 * Nombres heredados de las paginas sueltas. Incoherentes a proposito:
 * `articulos.html` en espanol pero `projects.html`, `education.html` y
 * `contact.html` en ingles. Son URLs indexadas y la coherencia estetica no
 * vale una 404.
 */
const PAGINA: Record<
  Idioma,
  Record<"proyectos" | "formacion" | "contacto" | "sobreMi", string>
> = {
  es: { proyectos: "projects", formacion: "education", contacto: "contact", sobreMi: "sobre-mi" },
  en: { proyectos: "projects", formacion: "education", contacto: "contact", sobreMi: "about" },
  de: { proyectos: "projekte", formacion: "ausbildung", contacto: "kontakt", sobreMi: "ueber-mich" },
};

const limpia = (s: string) => (s.startsWith("/") ? s : `/${s}`);

/** Ruta nativa de Next, para los <Link> internos. */
export const ruta = {
  inicio: (lang: Idioma) => PREFIJO[lang] || "/",
  articulos: (lang: Idioma) => `${PREFIJO[lang]}/${SEGMENTO[lang].articulos}`,
  articulo: (lang: Idioma, slug: string) => `${PREFIJO[lang]}/${SEGMENTO[lang].articulos}/${slug}`,
  proyectos: (lang: Idioma) => `${PREFIJO[lang]}/${PAGINA[lang].proyectos}`,
  proyecto: (lang: Idioma, slug: string) => `${PREFIJO[lang]}/${SEGMENTO[lang].proyectos}/${slug}`,
  formacion: (lang: Idioma) => `${PREFIJO[lang]}/${PAGINA[lang].formacion}`,
  contacto: (lang: Idioma) => `${PREFIJO[lang]}/${PAGINA[lang].contacto}`,
  /** Pagina nueva: no existia en el sitio anterior, no hay URL que conservar. */
  sobreMi: (lang: Idioma) => `${PREFIJO[lang]}/${PAGINA[lang].sobreMi}`,
};

/**
 * Forma con `.html`, que es la canonica. La portada es la excepcion: su
 * canonica es la raiz del idioma, no `index.html`.
 */
export function href(rutaNext: string): string {
  const r = limpia(rutaNext);
  if (r === "/") return "/";
  if (r === "/en" || r === "/de") return `${r}/`;
  return `${r}.html`;
}

/** URL absoluta canonica, la que va en <link rel="canonical"> y en el sitemap. */
export function urlCanonica(rutaNext: string): string {
  return `${BASE_URL}${href(rutaNext)}`;
}
