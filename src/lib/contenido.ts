/**
 * Carga el contenido MDX migrado del sitio antiguo.
 *
 * La pieza que importa es `translationKey`: cada articulo o ficha lo lleva en
 * su frontmatter, y las tres versiones de un mismo texto comparten valor. De
 * ahi salen las alternativas de idioma, y de ellas el `hreflang`.
 *
 * Se genera, no se escribe a mano. El sitio antiguo lo escribia a mano y por
 * eso acabo desincronizado: `index.html`, `education.html`, `contact.html` y
 * `projects.html` no declaraban ninguna alternativa pese a ser un sitio
 * trilingue.
 */
import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { IDIOMAS, type Idioma, ruta } from "./rutas";

export type Articulo = {
  slug: string;
  lang: Idioma;
  translationKey: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  /** ISO `AAAA-MM-DD`. Se localiza al pintar, no al guardar. */
  date: string;
  image: string;
  cuerpo: string;
};

export type Proyecto = {
  slug: string;
  lang: Idioma;
  translationKey: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** Enlace al repositorio publico. Es la prueba, no un adorno. */
  repo: string;
  demo?: string;
  estado: string;
  tipo?: string;
  pregunta?: string;
  modulo?: string;
  institucion?: string;
  stack: string[];
  /** Los seis alineados con el perfil objetivo. Solo estos van a portada. */
  deepTech: boolean;
  cuerpo: string;
};

const RAIZ = path.join(process.cwd(), "src", "content");

function leerDirectorio(seccion: string, lang: Idioma) {
  const dir = path.join(RAIZ, seccion, lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf-8"));
      return { slug: f.replace(/\.mdx$/, ""), data, cuerpo: content.trim() };
    });
}

export function getArticulos(lang: Idioma): Articulo[] {
  return leerDirectorio("articulos", lang)
    .map(({ slug, data, cuerpo }) => ({ slug, lang, cuerpo, ...(data as object) }) as Articulo)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticulo(lang: Idioma, slug: string): Articulo | undefined {
  return getArticulos(lang).find((a) => a.slug === slug);
}

export function getProyectos(lang: Idioma): Proyecto[] {
  const propios = leerDirectorio("proyectos", lang);
  // Las fichas solo existen en espanol por ahora. Mientras no se traduzcan, los
  // demas idiomas caen al espanol en vez de quedarse sin seccion de proyectos.
  const fuente = propios.length > 0 ? propios : leerDirectorio("proyectos", "es");
  return fuente.map(
    ({ slug, data, cuerpo }) =>
      ({ stack: [], ...(data as object), slug, lang, cuerpo }) as unknown as Proyecto,
  );
}

/**
 * Idioma en el que existen de verdad las fichas de proyecto.
 *
 * Por decision de Jose (2026-08-21) las fichas se traducen a ES y EN, no a DE.
 * Un lector aleman va a la version inglesa, que le sirve; servirle espanol bajo
 * /de/ no le sirve y ademas mentiria al hreflang.
 */
export function idiomaConProyectos(lang: Idioma): Idioma {
  if (fs.existsSync(path.join(RAIZ, "proyectos", lang))) return lang;
  if (fs.existsSync(path.join(RAIZ, "proyectos", "en"))) return "en";
  return "es";
}

export function getProyecto(lang: Idioma, slug: string): Proyecto | undefined {
  return getProyectos(lang).find((p) => p.slug === slug);
}

/** Los seis deep tech, que son los unicos que van a la rejilla de portada. */
export function getProyectosDeepTech(lang: Idioma): Proyecto[] {
  return getProyectos(lang).filter((p) => p.deepTech);
}

type Alternativa = { lang: Idioma; rutaNext: string };

/**
 * Devuelve en que idiomas existe realmente este contenido y con que ruta.
 *
 * Solo declara lo que existe: anunciar en `hreflang` una alternativa que no
 * existe es peor que no declararla.
 */
export function alternativasArticulo(translationKey: string): Alternativa[] {
  const alts: Alternativa[] = [];
  for (const lang of IDIOMAS) {
    const encontrado = getArticulos(lang).find((a) => a.translationKey === translationKey);
    if (encontrado) alts.push({ lang, rutaNext: ruta.articulo(lang, encontrado.slug) });
  }
  return alts;
}

export function alternativasProyecto(translationKey: string): Alternativa[] {
  const alts: Alternativa[] = [];
  for (const lang of IDIOMAS) {
    const dir = path.join(RAIZ, "proyectos", lang);
    if (!fs.existsSync(dir)) continue;
    const encontrado = leerDirectorio("proyectos", lang).find(
      (p) => (p.data as { translationKey?: string }).translationKey === translationKey,
    );
    if (encontrado) alts.push({ lang, rutaNext: ruta.proyecto(lang, encontrado.slug) });
  }
  return alts;
}

/** Alternativas de una pagina fija, que existe en los tres idiomas por definicion. */
export function alternativasPagina(
  constructor: (lang: Idioma) => string,
): Alternativa[] {
  return IDIOMAS.map((lang) => ({ lang, rutaNext: constructor(lang) }));
}
