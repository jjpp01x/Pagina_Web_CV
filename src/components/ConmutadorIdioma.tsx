"use client";

import { usePathname } from "next/navigation";

import { Row, ToggleButton } from "@once-ui-system/core";

import { IDIOMAS, type Idioma, NOMBRE_IDIOMA, ruta } from "@/lib/rutas";

/**
 * Conmutador de idioma que lleva a la MISMA pagina en el otro idioma.
 *
 * El sitio antiguo cambiaba de idioma con localStorage sobre una sola URL, asi
 * que Google nunca vio una version inglesa ni alemana de la portada. Aqui cada
 * idioma es una URL de verdad y el conmutador es un enlace, no un interruptor
 * de JavaScript: se puede compartir, indexar y abrir en otra pestana.
 *
 * El mapa lo calcula el servidor en tiempo de build y llega como prop, porque
 * los slugs estan traducidos (`senal-o-ruido` / `signal-or-noise`) y no se
 * pueden deducir de la URL. Si una pagina no existe en un idioma, ese boton
 * lleva a su portada en vez de a una 404.
 */
export function ConmutadorIdioma({
  lang,
  mapa,
}: {
  lang: Idioma;
  /** ruta actual -> { idioma: ruta equivalente } */
  mapa: Record<string, Partial<Record<Idioma, string>>>;
}) {
  const pathname = usePathname() ?? "/";
  const actual = pathname.replace(/\.html$/, "").replace(/(.+)\/$/, "$1");
  const equivalentes = mapa[actual] ?? mapa[pathname] ?? {};

  return (
    <Row gap="2" vertical="center" aria-label="Idioma">
      {IDIOMAS.map((destino) => (
        <ToggleButton
          key={destino}
          size="s"
          selected={destino === lang}
          href={equivalentes[destino] ?? ruta.inicio(destino)}
          aria-label={NOMBRE_IDIOMA[destino]}
          lang={destino}
        >
          {destino.toUpperCase()}
        </ToggleButton>
      ))}
    </Row>
  );
}
