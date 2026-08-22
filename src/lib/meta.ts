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
    title: titulo,
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
