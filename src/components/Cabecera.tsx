/**
 * Cabecera del sitio.
 *
 * Sustituye a la de Magic Portfolio, que enlazaba a /about, /work, /blog y
 * /gallery: rutas de la demo de la plantilla que aqui no existen y que
 * generaban 280 enlaces rotos, cuatro en cada una de las 70 paginas.
 *
 * Las secciones son las del sitio anterior —proyectos, articulos, formacion,
 * contacto— para que quien ya conocia la web no tenga que reaprenderla.
 */
import { Row, ToggleButton } from "@once-ui-system/core";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

import { ConmutadorIdioma } from "@/components/ConmutadorIdioma";
import { ThemeToggle } from "@/components/ThemeToggle";
import { persona } from "@/content/persona";
import { textos } from "@/content/textos";
import { construirMapaAlternativas } from "@/lib/alternativas";
import { type Idioma, ruta } from "@/lib/rutas";

/**
 * Iconos de GitHub y LinkedIn, arriba a la derecha como en el sitio anterior.
 * SVG de un set coherente (Font Awesome via react-icons), no emojis: el
 * diagnostico numero 1 del encargo era precisamente usar emojis como iconos.
 */
function Sociales() {
  const enlaces = [
    { href: persona.github, etiqueta: "GitHub", Icono: FaGithub },
    { href: persona.linkedin, etiqueta: "LinkedIn", Icono: FaLinkedinIn },
  ];
  return (
    <Row gap="4" vertical="center">
      {enlaces.map(({ href, etiqueta, Icono }) => (
        <a
          key={etiqueta}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={etiqueta}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            height: "2rem",
            borderRadius: "var(--radius-s)",
            color: "var(--neutral-on-background-weak)",
          }}
        >
          <Icono size={16} aria-hidden="true" />
        </a>
      ))}
    </Row>
  );
}

export function Cabecera({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  const mapa = construirMapaAlternativas();

  const secciones = [
    { href: ruta.sobreMi(lang), etiqueta: t.nav.sobreMi },
    { href: ruta.proyectos(lang), etiqueta: t.nav.proyectos },
    { href: ruta.articulos(lang), etiqueta: t.nav.articulos },
    { href: ruta.formacion(lang), etiqueta: t.nav.formacion },
    { href: ruta.contacto(lang), etiqueta: t.nav.contacto },
  ];

  return (
    <Row
      as="header"
      fillWidth
      horizontal="center"
      paddingX="l"
      paddingY="12"
      zIndex={1}
      position="sticky"
      top="0"
      background="page"
      borderBottom="neutral-alpha-weak"
    >
      <Row fillWidth maxWidth={64} horizontal="between" vertical="center" gap="12" wrap>
        <Row as="nav" gap="4" vertical="center" wrap aria-label={t.nav.inicio}>
          <ToggleButton size="s" href={ruta.inicio(lang)} prefixIcon="home" aria-label={t.nav.inicio} />
          {secciones.map((s) => (
            <ToggleButton key={s.href} size="s" href={s.href}>
              {s.etiqueta}
            </ToggleButton>
          ))}
        </Row>
        <Row gap="8" vertical="center">
          <Sociales />
          <ConmutadorIdioma lang={lang} mapa={mapa} />
          <ThemeToggle />
        </Row>
      </Row>
    </Row>
  );
}
