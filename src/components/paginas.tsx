/**
 * Las paginas del sitio, parametrizadas por idioma.
 *
 * Existen una sola vez y las rutas se limitan a invocarlas con su idioma.
 *
 * El contenido es el del sitio anterior, palabra por palabra: la portada
 * mantiene su estructura original (hero, sobre mi, habilidades) y no se anaden
 * secciones nuevas. Lo que cambia es la plantilla, no lo que dice.
 */
import { Button, Column, Grid, Heading, Line, Row, Tag, Text } from "@once-ui-system/core";

import { componentesMDX } from "@/components/bloques";
import { DescargaCV } from "@/components/DescargaCV";
import { CustomMDX } from "@/components/mdx";
import { FilaDato, TarjetaArticulo, TarjetaProyecto } from "@/components/tarjetas";
import {
  certificaciones,
  experiencia,
  formacionAcademica,
  idiomas,
  persona,
} from "@/content/persona";
import { fechaLocalizada, textos } from "@/content/textos";
import {
  type Articulo,
  getArticulos,
  getProyectos,
  type Proyecto,
} from "@/lib/contenido";
import { type Idioma, ruta } from "@/lib/rutas";

/** Carril de lectura. Once UI mide maxWidth en rem, no en cadena CSS. */
const ANCHO = { maxWidth: 48 } as const;

function Seccion({
  titulo,
  children,
  pie,
}: {
  titulo: string;
  children: React.ReactNode;
  pie?: { texto: string; href: string };
}) {
  return (
    <Column fillWidth gap="16" paddingY="40">
      <Heading as="h2" variant="heading-strong-m">
        {titulo}
      </Heading>
      {children}
      {pie && (
        <Row paddingTop="4">
          <Button href={pie.href} variant="tertiary" size="s" arrowIcon>
            {pie.texto}
          </Button>
        </Row>
      )}
    </Column>
  );
}

function Cabecera({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <Column fillWidth gap="8" paddingY="32">
      <Heading as="h1" variant="display-strong-s" wrap="balance">
        {titulo}
      </Heading>
      {subtitulo && (
        <Text variant="body-default-m" onBackground="neutral-medium">
          {subtitulo}
        </Text>
      )}
    </Column>
  );
}

export function Portada({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  const proyectos = getProyectos(lang).filter((p) => p.deepTech).slice(0, 3);
  const articulos = getArticulos(lang).slice(0, 3);

  return (
    <Column fillWidth gap="8" horizontal="center" paddingX="l">
      {/*
        Hero: foto, saludo, titular y descripcion, como en el sitio anterior.
        La fila se alinea arriba (vertical="start") para que el borde superior
        de la foto cuadre con la linea del saludo; centrada, la foto quedaba
        descolgada respecto al texto.
      */}
      <Row fillWidth gap="24" paddingY="40" vertical="start" wrap {...ANCHO}>
        {/*
          <img> nativo en vez del <Media> de Once UI: con output: export e
          images.unoptimized, Media emitia width="0" height="0" y la foto se
          veia como un hueco. La imagen ya viene optimizada (webp de 74 KB).
        */}
        <img
          src={persona.foto}
          alt={persona.fotoAlt}
          width={132}
          height={132}
          loading="eager"
          style={{
            width: "132px",
            height: "132px",
            minWidth: "132px",
            objectFit: "cover",
            objectPosition: "center 20%",
            borderRadius: "var(--radius-m)",
            border: "1px solid var(--neutral-alpha-medium)",
          }}
        />
        <Column gap="8" flex={1} style={{ minWidth: "17rem" }}>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {t.hero.saludo}{" "}
            <Text as="span" variant="body-strong-s" onBackground="neutral-strong">
              {persona.nombreCompleto}
            </Text>
          </Text>
          {/*
            Un escalon por debajo del display: el titular es largo y a tamano
            display se comia la pantalla. Con heading-strong-l la jerarquia
            entre titular, cuerpo y etiquetas queda proporcionada y se lee mas
            formal, que es lo que pidio Jose.
          */}
          <Heading as="h1" variant="heading-strong-l" wrap="balance">
            {t.hero.titulo}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {t.hero.descripcion}
          </Text>
          <Row gap="8" paddingTop="8" wrap vertical="center">
            <Button href={ruta.contacto(lang)} variant="primary" size="s">
              {t.hero.btn1}
            </Button>
            <Button href={ruta.formacion(lang)} variant="secondary" size="s">
              {t.hero.btn2}
            </Button>
          </Row>
          <Row paddingTop="4">
            <DescargaCV etiqueta={t.descargarCV} />
          </Row>
        </Column>
      </Row>

      <Column fillWidth {...ANCHO}>
        <Line background="neutral-alpha-weak" />

        {/*
          Muestra de tres proyectos y tres articulos, cada uno en su seccion y
          con su enlace al listado completo. Los titulos son los que ya usaba el
          sitio ("Proyectos", "Articulos"): no se inventa ninguno.
        */}
        <Seccion titulo={t.proyectos.titulo} pie={{ texto: t.nav.proyectos, href: ruta.proyectos(lang) }}>
          <Grid columns="3" m={{ columns: 2 }} s={{ columns: 1 }} gap="12" fillWidth>
            {proyectos.map((p) => (
              <TarjetaProyecto key={p.slug} proyecto={p} lang={lang} />
            ))}
          </Grid>
        </Seccion>

        <Line background="neutral-alpha-weak" />

        <Seccion titulo={t.articulos.titulo} pie={{ texto: t.nav.articulos, href: ruta.articulos(lang) }}>
          <Column gap="12" fillWidth>
            {articulos.map((a) => (
              <TarjetaArticulo key={a.slug} articulo={a} lang={lang} />
            ))}
          </Column>
        </Seccion>
      </Column>
    </Column>
  );
}

export function IndiceArticulos({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.articulos.titulo} />
        {getArticulos(lang).map((a) => (
          <TarjetaArticulo key={a.slug} articulo={a} lang={lang} />
        ))}
      </Column>
    </Column>
  );
}

export function PaginaArticulo({ articulo, lang }: { articulo: Articulo; lang: Idioma }) {
  const t = textos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO} paddingY="32">
        <Row gap="8" vertical="center">
          <Text variant="label-default-s" onBackground="brand-medium">
            {articulo.category}
          </Text>
          <Text variant="label-default-s" onBackground="neutral-weak">
            <time dateTime={articulo.date}>{fechaLocalizada(articulo.date, lang)}</time>
          </Text>
        </Row>
        <Heading as="h1" variant="display-strong-s" wrap="balance">
          {articulo.title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-medium">
          {articulo.subtitle}
        </Text>
        <Line background="neutral-alpha-weak" marginY="16" />
        <Column as="article" fillWidth gap="16">
          <CustomMDX source={articulo.cuerpo} components={componentesMDX} />
        </Column>
        <Row paddingTop="32">
          <Button href={ruta.articulos(lang)} variant="tertiary" size="s">
            {t.articulos.volver}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

export function IndiceProyectos({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.proyectos.titulo} subtitulo={t.proyectos.subtitulo} />
        <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
          {getProyectos(lang).map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} lang={lang} />
          ))}
        </Grid>
      </Column>
    </Column>
  );
}

export function PaginaProyecto({ proyecto, lang }: { proyecto: Proyecto; lang: Idioma }) {
  const t = textos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO} paddingY="32">
        <Heading as="h1" variant="display-strong-s" wrap="balance">
          {proyecto.title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-medium">
          {proyecto.subtitle}
        </Text>
        {proyecto.stack.length > 0 && (
          <Row gap="4" wrap paddingTop="8">
            {proyecto.stack.map((s) => (
              <Tag key={s} size="s" variant="neutral">
                {s}
              </Tag>
            ))}
          </Row>
        )}
        <Row gap="8" paddingTop="8" wrap>
          {proyecto.repo && (
            <Button href={proyecto.repo} variant="primary" size="s">
              {t.proyectos.verRepo}
            </Button>
          )}
          {proyecto.demo && (
            <Button href={proyecto.demo} variant="secondary" size="s">
              {t.proyectos.verDemo}
            </Button>
          )}
        </Row>
        <Line background="neutral-alpha-weak" marginY="16" />
        <Column as="article" fillWidth gap="16">
          <CustomMDX source={proyecto.cuerpo} components={componentesMDX} />
        </Column>
      </Column>
    </Column>
  );
}

export function Formacion({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.formacion.titulo} subtitulo={t.formacion.subtitulo} />

        <Seccion titulo={t.formacion.academica}>
          {formacionAcademica.map((e) => (
            <Column key={e.titulo} gap="4" paddingBottom="16">
              <Text variant="label-default-s" onBackground="neutral-weak">
                {e.fecha}
              </Text>
              <Heading as="h3" variant="heading-strong-s">
                {e.titulo}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-medium">
                {e.lugar}
              </Text>
              {e.descripcion && (
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {e.descripcion}
                </Text>
              )}
            </Column>
          ))}
        </Seccion>

        <Seccion titulo={t.formacion.laboral}>
          {experiencia.map((e) => (
            <Column key={`${e.titulo}-${e.fecha}`} gap="4" paddingBottom="16">
              <Text variant="label-default-s" onBackground="neutral-weak">
                {e.fecha}
              </Text>
              <Heading as="h3" variant="heading-strong-s">
                {e.titulo}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-medium">
                {e.enlace ? (
                  <a href={e.enlace} rel="noopener noreferrer" target="_blank">
                    {e.lugar}
                  </a>
                ) : (
                  e.lugar
                )}
              </Text>
              {e.logros && (
                <Column as="ul" gap="4" paddingLeft="16" paddingTop="4">
                  {e.logros.map((l) => (
                    <Text as="li" key={l} variant="body-default-s" onBackground="neutral-medium">
                      {l}
                    </Text>
                  ))}
                </Column>
              )}
            </Column>
          ))}
        </Seccion>

        <Seccion titulo={t.formacion.certificaciones}>
          {certificaciones.map((c) => (
            <FilaDato
              key={c.titulo}
              etiqueta={c.fecha}
              valor={`${c.titulo} · ${c.emisor}${c.credencial ? ` · ${t.formacion.credencial}: ${c.credencial}` : ""}`}
              enlace={c.verificar}
            />
          ))}
        </Seccion>

        <Seccion titulo={t.formacion.idiomas}>
          {idiomas.map((i) => (
            <FilaDato key={i.idioma} etiqueta={i.idioma} valor={i.nivel} />
          ))}
        </Seccion>
      </Column>
    </Column>
  );
}

export function Contacto({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.contacto.titulo} subtitulo={t.contacto.subtitulo} />
        <Column gap="8" paddingBottom="32">
          <FilaDato etiqueta="Email" valor={persona.email} enlace={`mailto:${persona.email}`} />
          <FilaDato etiqueta="GitHub" valor="jjpp01x" enlace={persona.github} />
          <FilaDato etiqueta="LinkedIn" valor="jose-palacios-beortegui" enlace={persona.linkedin} />
        </Column>
      </Column>
    </Column>
  );
}

export function SobreMi({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  // Cifras contadas del contenido real: si publicas otro articulo, suben solas.
  const cifras = [
    { n: getArticulos("es").length, etiqueta: t.cifras.articulos },
    { n: getProyectos("es").filter((p) => p.repo).length, etiqueta: t.cifras.proyectos },
    { n: idiomas.length, etiqueta: t.cifras.idiomas },
    { n: formacionAcademica.length, etiqueta: t.cifras.titulaciones },
    { n: certificaciones.length, etiqueta: t.cifras.certificaciones },
  ];

  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.sobre.titulo} />

        <Row gap="24" vertical="start" wrap paddingBottom="16">
          <img
            src={persona.foto}
            alt={persona.fotoAlt}
            width={132}
            height={132}
            loading="eager"
            style={{
              width: "132px",
              height: "132px",
              minWidth: "132px",
              objectFit: "cover",
              objectPosition: "center 20%",
              borderRadius: "var(--radius-m)",
              border: "1px solid var(--neutral-alpha-medium)",
            }}
          />
          <Column gap="12" flex={1} style={{ minWidth: "17rem" }}>
            {t.sobre.parrafos.map((p) => (
              <Text key={p.slice(0, 32)} variant="body-default-s" onBackground="neutral-medium">
                {p}
              </Text>
            ))}
            <Row paddingTop="4">
              <Tag size="s" variant="brand">
                {t.sobre.disponible}
              </Tag>
            </Row>
          </Column>
        </Row>

        <Line background="neutral-alpha-weak" />

        <Seccion titulo={t.cifras.titulo}>
          <Grid columns="3" s={{ columns: 2 }} gap="16" fillWidth>
            {cifras.map((c) => (
              <Column key={c.etiqueta} gap="2">
                <Heading as="p" variant="heading-strong-l">
                  {c.n}
                </Heading>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {c.etiqueta}
                </Text>
              </Column>
            ))}
          </Grid>
        </Seccion>

        <Line background="neutral-alpha-weak" />

        <Seccion titulo={t.skills.titulo}>
          <Grid columns="2" s={{ columns: 1 }} gap="24" fillWidth>
            {t.skills.grupos.map((grupo) => (
              <Column key={grupo.titulo} gap="8">
                <Heading as="h3" variant="heading-strong-xs">
                  {grupo.titulo}
                </Heading>
                <Row gap="4" wrap>
                  {grupo.elementos.map((e) => (
                    <Tag key={e} size="s" variant="neutral">
                      {e}
                    </Tag>
                  ))}
                </Row>
              </Column>
            ))}
          </Grid>
        </Seccion>
      </Column>
    </Column>
  );
}
