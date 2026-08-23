/**
 * Las siete paginas del sitio, parametrizadas por idioma.
 *
 * Existen una sola vez y las 21 rutas (7 x 3 idiomas) se limitan a invocarlas
 * con su idioma. Si la portada cambia, cambia en los tres sitios a la vez.
 */
import { Button, Column, Grid, Heading, Line, Row, Tag, Text } from "@once-ui-system/core";

import { CustomMDX } from "@/components/mdx";
import { componentesMDX } from "@/components/bloques";
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
  getProyectosDeepTech,
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
    <Column fillWidth gap="20" paddingY="32">
      <Heading as="h2" variant="heading-strong-l">
        {titulo}
      </Heading>
      {children}
      {pie && (
        <Row>
          <Button href={pie.href} variant="tertiary" size="s">
            {pie.texto}
          </Button>
        </Row>
      )}
    </Column>
  );
}

export function Portada({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  const proyectos = getProyectosDeepTech(lang);
  const articulos = getArticulos(lang).slice(0, 3);

  return (
    <Column fillWidth gap="24" horizontal="center" paddingX="l">
      {/*
        Hero con foto y nombre, como en el sitio anterior. Sin la foto y sin el
        nombre delante, la portada se leia como la de una agencia y no como la
        de una persona. Lo que si cambia respecto al original es el orden del
        mensaje: la propuesta va antes que la limitacion.
      */}
      <Row fillWidth gap="24" paddingY="48" vertical="center" wrap {...ANCHO}>
        {/*
          <img> nativo en vez del <Media> de Once UI: con output: export y
          images.unoptimized, Media emitia width="0" height="0" y la foto se
          veia como un hueco. La imagen ya viene optimizada (webp de 74 KB), asi
          que no hay nada que ganar pasandola por next/image.
        */}
        <img
          src={persona.foto}
          alt={persona.fotoAlt}
          width={160}
          height={160}
          loading="eager"
          style={{
            width: "160px",
            height: "160px",
            minWidth: "160px",
            objectFit: "cover",
            borderRadius: "var(--radius-l)",
            border: "1px solid var(--neutral-alpha-medium)",
          }}
        />
        <Column gap="8" flex={1} style={{ minWidth: "16rem" }}>
          <Text variant="body-default-m" onBackground="neutral-medium">
            {t.hero.saludo}{" "}
            <Text as="span" variant="body-strong-m" onBackground="neutral-strong">
              {persona.nombreCompleto}
            </Text>
          </Text>
          <Heading as="h1" variant="display-strong-s" wrap="balance">
            {t.hero.titular}
          </Heading>
          <Text variant="label-default-s" onBackground="neutral-weak">
            {persona.rol} · BSc (Hons) Applied Computing, UWTSD · {persona.ubicacion}
          </Text>
        </Column>
      </Row>

      <Column fillWidth {...ANCHO}>
        {/* Sobre mi en parrafo, justo debajo del hero: es una web de CV. */}
        <Column fillWidth gap="12" paddingBottom="24">
          <Text variant="body-default-l" onBackground="neutral-medium">
            {t.portada.sobreMi}
          </Text>
          <Text variant="body-default-m" onBackground="neutral-medium">
            <Text as="span" variant="body-strong-m" onBackground="neutral-strong">
              {t.portada.ahoraTitulo}:{" "}
            </Text>
            {t.portada.ahora}
          </Text>
          <Row gap="8" paddingTop="8" wrap>
            <Button href={ruta.proyectos(lang)} variant="primary" size="m">
              {t.hero.verProyectos}
            </Button>
            <Button href={ruta.formacion(lang)} variant="secondary" size="m">
              {t.portada.verExperiencia}
            </Button>
            <Button href={ruta.contacto(lang)} variant="tertiary" size="m">
              {t.portada.contactar}
            </Button>
          </Row>
        </Column>
      </Column>

      <Column fillWidth {...ANCHO}>
        <Line background="neutral-alpha-weak" />

        <Seccion
          titulo={t.portada.proyectosTitulo}
          pie={{ texto: t.portada.proyectosPie, href: ruta.proyectos(lang) }}
        >
          <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
            {proyectos.map((p) => (
              <TarjetaProyecto key={p.slug} proyecto={p} lang={lang} />
            ))}
          </Grid>
        </Seccion>

        <Line background="neutral-alpha-weak" />

        <Seccion
          titulo={t.portada.articulosTitulo}
          pie={{ texto: t.portada.articulosPie, href: ruta.articulos(lang) }}
        >
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

export function IndiceArticulos({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  const articulos = getArticulos(lang);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.articulos.titulo} subtitulo={t.articulos.subtitulo} />
        {articulos.map((a) => (
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
  const todos = getProyectos(lang);
  const deep = todos.filter((p) => p.deepTech);
  const otros = todos.filter((p) => !p.deepTech);
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <Column fillWidth gap="12" {...ANCHO}>
        <Cabecera titulo={t.proyectos.titulo} subtitulo={t.proyectos.subtitulo} />
        <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
          {deep.map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} lang={lang} />
          ))}
        </Grid>
        <Column fillWidth gap="12" paddingTop="32">
          <Heading as="h2" variant="heading-strong-m">
            {t.proyectos.otrosTitulo}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {t.proyectos.otrosSubtitulo}
          </Text>
          <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
            {otros.map((p) => (
              <TarjetaProyecto key={p.slug} proyecto={p} lang={lang} />
            ))}
          </Grid>
        </Column>
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
          <FilaDato etiqueta={t.formacion.idiomas} valor={persona.ubicacion} />
        </Column>
      </Column>
    </Column>
  );
}
