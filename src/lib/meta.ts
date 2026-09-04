/**
 * Metadatos y hreflang.
 *
 * El sitio antiguo escribia el hreflang a mano y por eso acabo desincronizado:
 * los articulos lo tenian y `index.html`, `education.html`, `contact.html` y
 * `projects.html` no declaraban ninguna alternativa pese a ser un sitio
 * trilingue. Aqui se genera desde las alternativas reales del contenido.
 *
 * Reglas que se aplican:
 *   - El `canonical` usa la forma con `.html`, que es la que Google lleva
 *     indexada. GitHub Pages sirve tambien la forma sin extension, y el
 *     canonical es lo que evita que cuenten como duplicado.
 *   - Solo se declara el idioma en el que el contenido existe de verdad.
 *     Anunciar una alternativa inexistente es peor que no declararla.
 *   - `x-default` apunta al espanol, que es la raiz del dominio.
 */
import type { Metadata } from "next";

import { BASE_URL, CODIGO_HREFLANG, type Idioma, IDIOMA_POR_DEFECTO, urlCanonica } from "./rutas";

type Alternativa = { lang: Idioma; rutaNext: string };

/**
 * El <title> que se manda al buscador.
 *
 * Dos problemas medidos el 2026-09-04 sobre las 79 URLs en produccion:
 *
 * 1. Solo 3 titulos de 79 contenian "Palacios". Pidiendo posicionar por el
 *    nombre con 76 paginas que no lo nombran en el titulo.
 * 2. Los 9 proyectos tenian el titulo IDENTICO en castellano y en ingles
 *    ("DD-Copilot" las dos veces): nada con lo que distinguirlos.
 *
 * El descriptor localizado arregla los dos de una vez -- mete el nombre y hace
 * que las tres versiones difieran -- sin tocar el titulo que escribio el autor.
 *
 * El presupuesto existe porque un nombre cortado no lo lee nadie. Se pone en 65
 * y no en los 60 de la regla de bolsillo: Google corta por anchura en pixeles
 * (~600px), y 65 caracteres de castellano, ingles o aleman corrientes caben.
 * Con 60, "SkiCraft Custom Boots -- Inventory DB" se quedaba sin descriptor y
 * el titulo salia identico en castellano y en ingles; un duplicado entre
 * idiomas es peor problema que cuatro caracteres justos.
 *
 * Si aun asi el titulo propio llena el espacio, gana el titulo: esa pagina
 * compite por su tema, no por el nombre, y la entidad ya viaja en el JSON-LD.
 */
const LIMITE_SERP = 65;

const DESCRIPTOR: Record<Idioma, { articulo: string; proyecto: string; pagina: string }> = {
  es: { articulo: "Artículo de", proyecto: "Proyecto de", pagina: "" },
  en: { articulo: "Article by", proyecto: "Project by", pagina: "" },
  de: { articulo: "Artikel von", proyecto: "Projekt von", pagina: "" },
};

function tituloSerp(titulo: string, lang: Idioma, tipoPagina: TipoPagina): string {
  if (titulo.includes("Palacios")) return titulo;

  const descriptor = DESCRIPTOR[lang][tipoPagina];
  const candidatos = [
    ...(descriptor
      ? [`${titulo} · ${descriptor} José Palacios Beortegui`, `${titulo} · ${descriptor} José Palacios`]
      : [`${titulo} — José Palacios Beortegui`, `${titulo} — José Palacios`]),
    // Ultimo recurso: el nombre a secas, con punto medio para no encadenar dos
    // rayas cuando el titulo del autor ya lleva una.
    `${titulo} · José Palacios`,
  ];

  return candidatos.find((c) => c.length <= LIMITE_SERP) ?? titulo;
}

/** Que clase de pagina es, solo para elegir el descriptor del <title>. */
export type TipoPagina = "articulo" | "proyecto" | "pagina";

export type DatosMeta = {
  titulo: string;
  descripcion: string;
  lang: Idioma;
  /** Ruta nativa de Next de ESTA pagina. */
  rutaNext: string;
  /** En que idiomas existe esta pagina. Si se omite, no se declara hreflang. */
  alternativas?: Alternativa[];
  imagen?: string;
  tipo?: "website" | "article";
  /** Clase de pagina, para el descriptor localizado del <title>. */
  tipoPagina?: TipoPagina;
  publicado?: string;
};

export function construirMeta({
  titulo,
  descripcion,
  lang,
  rutaNext,
  alternativas,
  imagen,
  tipo = "website",
  tipoPagina = "pagina",
  publicado,
}: DatosMeta): Metadata {
  const canonical = urlCanonica(rutaNext);

  const languages: Record<string, string> = {};
  for (const alt of alternativas ?? []) {
    languages[CODIGO_HREFLANG[alt.lang]] = urlCanonica(alt.rutaNext);
  }
  const porDefecto = (alternativas ?? []).find((a) => a.lang === IDIOMA_POR_DEFECTO);
  if (porDefecto) languages["x-default"] = urlCanonica(porDefecto.rutaNext);

  const imagenAbsoluta = imagen?.startsWith("http") ? imagen : `${BASE_URL}${imagen ?? "/img/og-image.png"}`;

  return {
    title: tituloSerp(titulo, lang, tipoPagina),
    description: descripcion,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      ...(Object.keys(languages).length > 0 ? { languages } : {}),
    },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: canonical,
      siteName: "José Palacios",
      locale: lang,
      type: tipo,
      images: [{ url: imagenAbsoluta }],
      ...(publicado ? { publishedTime: publicado } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagenAbsoluta],
    },
  };
}
