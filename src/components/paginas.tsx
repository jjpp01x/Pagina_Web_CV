/**
 * Las paginas del sitio, parametrizadas por idioma.
 *
 * Existen una sola vez y las rutas se limitan a invocarlas con su idioma.
 *
 * El contenido es el del sitio anterior, palabra por palabra: la plantilla
 * cambio, lo que dice el sitio no. La unica seccion que no venia de alli es
 * "Empresas", que Jose pidio el 2026-09-03; su texto sale de lo que las dos
 * webs ya publican de si mismas, no de redaccion nueva sin contrastar.
 */
import { Button, Column, Grid, Heading, Line, Row, Tag, Text } from "@once-ui-system/core";

import { FiCheckCircle } from "react-icons/fi";

import { componentesMDX } from "@/components/bloques";
import estilos from "@/components/portada.module.scss";
import { DescargaCV } from "@/components/DescargaCV";
import { FormularioContacto } from "@/components/FormularioContacto";
import { CustomMDX } from "@/components/mdx";
import { FilaDato, TarjetaArticulo, TarjetaEmpresa, TarjetaProyecto } from "@/components/tarjetas";
import {
  certificaciones,
  empresas,
  experiencia,
  formacionAcademica,
  idiomas,
  persona,
} from "@/content/persona";
import { colorCategoria } from "@/content/categorias";
import { fechaLocalizada, textos } from "@/content/textos";
import {
  type Articulo,
  getArticulos,
  getProyectos,
  type Proyecto,
} from "@/lib/contenido";
import { cifrasDe } from "@/lib/cifras";
import { grafoArticulo } from "@/lib/entidad";
import { BASE_URL, href, type Idioma, ruta } from "@/lib/rutas";

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
        Hero a dos columnas: texto a la izquierda, foto a la derecha.

        El H1 va primero en el DOM aunque en movil la foto se vea antes: el
        orden visual lo invierte el CSS (column-reverse), no el marcado. Un
        lector de pantalla y Google siguen encontrando el encabezado al
        principio, que es donde debe estar.
      */}
      <Row
        fillWidth
        gap="40"
        paddingY="56"
        vertical="center"
        wrap
        className={estilos.hero}
        {...ANCHO}
      >
        <Column gap="12" flex={1} style={{ minWidth: "18rem" }}>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {t.hero.saludo}
          </Text>
          <Heading as="h1" variant="display-strong-m" wrap="balance">
            {persona.nombreCompleto}
          </Heading>
          {/*
            El subtitulo es la linea de posicionamiento; el titular largo pasa a
            propuesta de valor debajo. Antes el H1 era el titular entero y el
            nombre quedaba en letra pequena encima, que es justo al reves de lo
            que busca quien llega desde LinkedIn.
          */}
          <Heading as="p" variant="heading-strong-m" onBackground="brand-medium" wrap="balance">
            {t.hero.subtitulo}
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-medium" wrap="balance">
            {t.hero.titulo}
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {t.hero.descripcion}
          </Text>
          <Row gap="8" paddingTop="12" wrap vertical="center">
            <Button href={ruta.contacto(lang)} variant="primary" size="m" className={estilos.cta}>
              {t.hero.btn1}
            </Button>
            <Button href={ruta.proyectos(lang)} variant="secondary" size="m" className={estilos.cta}>
              {t.hero.btn2}
            </Button>
            <DescargaCV etiqueta={t.descargarCV} />
          </Row>
        </Column>

        {/*
          <img> nativo en vez del <Media> de Once UI: con output: export e
          images.unoptimized, Media emitia width="0" height="0" y la foto se
          veia como un hueco. La imagen ya viene optimizada (webp de 13,8 KB).
        */}
        <div className={estilos.marcoFoto} style={{ width: "clamp(11rem, 26vw, 16rem)" }}>
          <img
            src={persona.foto}
            alt={persona.fotoAlt}
            width={400}
            height={400}
            loading="eager"
            className={estilos.foto}
          />
        </div>
      </Row>

      {/*
        Empresas propias, lo primero que se lee tras el hero.

        Va aqui y no dentro de la columna del hero porque ahi comparte ancho
        con la foto y las dos tarjetas saldrian estranguladas. A ancho completo
        del carril siguen quedando justo debajo de los botones, que es donde
        Jose las pidio, y ademas por delante de las cifras: para un perfil que
        se vende como constructor, "he montado dos negocios" pesa mas que el
        recuento de articulos.
      */}
      <Column fillWidth {...ANCHO}>
        <Line background="neutral-alpha-weak" />
        <Column fillWidth gap="16" paddingY="32">
          <Column gap="4">
            <Heading as="h2" variant="heading-strong-m">
              {t.empresas.titulo}
            </Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {t.empresas.subtitulo}
            </Text>
          </Column>
          <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
            {empresas.map((e) => (
              <TarjetaEmpresa
                key={e.id}
                empresa={e}
                ficha={t.empresas.fichas[e.id]}
                rol={t.empresas.rol}
              />
            ))}
          </Grid>
        </Column>
      </Column>

      {/*
        Banda de cifras. Todas contadas del contenido real por cifrasDe(): si
        se publica otro articulo, sube sola. Ninguna esta tecleada.
      */}
      <Column fillWidth {...ANCHO}>
        <Line background="neutral-alpha-weak" />
        <Grid columns="4" m={{ columns: 4 }} s={{ columns: 2 }} gap="16" fillWidth paddingY="24">
          {cifrasDe(t).slice(0, 4).map((c) => (
            <Column key={c.etiqueta} gap="4">
              <Heading as="p" variant="display-strong-xs" className={estilos.cifra}>
                {c.n}
              </Heading>
              <Text variant="label-default-s" onBackground="neutral-weak">
                {c.etiqueta}
              </Text>
            </Column>
          ))}
        </Grid>
      </Column>


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
  // Las migas siguen la navegacion real del sitio: portada -> indice -> articulo.
  const migas = [
    { nombre: t.nav.inicio, url: `${BASE_URL}${href(ruta.inicio(lang))}` },
    { nombre: t.nav.articulos, url: `${BASE_URL}${href(ruta.articulos(lang))}` },
    { nombre: articulo.title, url: `${BASE_URL}${href(ruta.articulo(lang, articulo.slug))}` },
  ];
  return (
    <Column fillWidth horizontal="center" paddingX="l">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(grafoArticulo(articulo, lang, migas)) }}
      />
      <Column fillWidth gap="12" {...ANCHO} paddingY="32">
        <Row gap="8" vertical="center">
          <Text variant="label-strong-s" style={{ color: colorCategoria(articulo.category) }}>
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

        {/*
          Certificaciones como insignias.

          La marca de verificado se pinta SOLO si hay `verificar`, es decir, un
          enlace publico donde comprobarla. Ponerla en todas convertiria el
          icono en decoracion: el tipo Certificacion ya avisa de que una
          certificacion sin enlace es una afirmacion, no una credencial.
        */}
        <Seccion titulo={t.formacion.certificaciones}>
          <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
            {certificaciones.map((c) => (
              <Column
                key={c.titulo}
                gap="8"
                padding="16"
                radius="l"
                border="neutral-alpha-weak"
                background="neutral-alpha-weak"
                className={estilos.insignia}
              >
                <Row gap="8" vertical="center" horizontal="between" wrap>
                  <Heading as="h3" variant="heading-strong-xs" wrap="balance">
                    {c.titulo}
                  </Heading>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {c.fecha}
                  </Text>
                </Row>
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {c.emisor}
                </Text>
                {c.credencial && (
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {t.formacion.credencial}: {c.credencial}
                  </Text>
                )}
                {c.verificar && (
                  <a
                    href={c.verificar}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                  >
                    <FiCheckCircle size={13} aria-hidden="true" />
                    <Text as="span" variant="label-default-s">
                      {t.formacion.verificar}
                    </Text>
                  </a>
                )}
              </Column>
            ))}
          </Grid>
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

        {/* Dos columnas: los datos a la izquierda y el formulario a la derecha,
            como en el sitio anterior. En movil se apilan. */}
        <Grid columns="2" m={{ columns: 1 }} gap="40" fillWidth paddingBottom="40">
          <Column gap="16">
            <Heading as="h2" variant="heading-strong-s">
              {t.contacto.info}
            </Heading>
            <Column gap="4">
              <FilaDato etiqueta="Email" valor={persona.email} enlace={`mailto:${persona.email}`} />
              <FilaDato etiqueta={t.contacto.labelLinkedin} valor="jose-palacios-beortegui" enlace={persona.linkedin} />
              <FilaDato etiqueta="GitHub" valor="jjpp01x" enlace={persona.github} />
              <FilaDato etiqueta={t.contacto.labelUbicacion} valor={t.contacto.ubicacion} />
            </Column>
            <Row paddingTop="8">
              <Tag size="s" variant="brand">
                {t.sobre.disponible}
              </Tag>
            </Row>
          </Column>

          <Column gap="16">
            <Heading as="h2" variant="heading-strong-s">
              {t.contacto.formTitulo}
            </Heading>
            <FormularioContacto t={t.contacto} email={persona.email} />
          </Column>
        </Grid>
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
          {/* Mismo marco que el hero: con dos tratamientos distintos de la
              misma foto, el sitio se lee como dos sitios. */}
          <div className={estilos.marcoFoto} style={{ width: "8.25rem", minWidth: "8.25rem" }}>
            <img
              src={persona.foto}
              alt={persona.fotoAlt}
              width={400}
              height={400}
              loading="eager"
              className={estilos.foto}
            />
          </div>
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

        {/*
          Certificaciones con enlace de verificacion EN VIVO. Estaban solo en
          Formacion, a dos clics. Para un comite que duda, un enlace que se
          comprueba en el momento vale mas que tres parrafos.
        */}
        <Seccion titulo={t.formacion.certificaciones}>
          <Grid columns="2" s={{ columns: 1 }} gap="12" fillWidth>
            {certificaciones
              .filter((c) => c.verificar)
              .map((c) => (
                <Column
                  key={c.titulo}
                  gap="4"
                  padding="16"
                  radius="m"
                  border="neutral-alpha-medium"
                >
                  <Text variant="label-strong-s">{c.titulo}</Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {c.emisor} · {c.fecha}
                  </Text>
                  <a href={c.verificar} rel="noopener noreferrer" target="_blank">
                    <Text variant="label-default-s" onBackground="brand-medium">
                      {t.formacion.verificar} →
                    </Text>
                  </a>
                </Column>
              ))}
          </Grid>
        </Seccion>

        <Line background="neutral-alpha-weak" />

        {/*
          Habilidades en tarjetas por categoria en vez de listas sueltas. Los
          grupos y sus elementos son los de textos.ts, ya traducidos: aqui solo
          cambia como se ven.
        */}
        <Seccion titulo={t.skills.titulo}>
          <Grid columns="2" s={{ columns: 1 }} gap="16" fillWidth>
            {t.skills.grupos.map((grupo) => (
              <Column
                key={grupo.titulo}
                gap="12"
                padding="l"
                radius="l"
                border="neutral-alpha-weak"
                background="neutral-alpha-weak"
              >
                <Heading as="h3" variant="heading-strong-xs">
                  {grupo.titulo}
                </Heading>
                <Row gap="4" wrap>
                  {grupo.elementos.map((e) => (
                    <Tag key={e} size="s" variant="neutral" className={estilos.pildoraSkill}>
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
