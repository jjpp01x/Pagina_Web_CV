/**
 * Tarjetas de proyecto y de articulo.
 *
 * La de proyecto abre con la pregunta que responde, no con una lista de
 * features: para un puesto de evaluacion tecnologica, lo que distingue no es
 * que sepas listar tecnologia sino que sepas decir que decide cada herramienta.
 * Y siempre lleva el enlace al repositorio: es la prueba, no un adorno.
 */
import { Card, Column, Heading, Row, Tag, Text } from "@once-ui-system/core";

import { type Articulo, idiomaConProyectos, type Proyecto } from "@/lib/contenido";
import type { Idioma } from "@/lib/rutas";
import { ruta } from "@/lib/rutas";
import { fechaLocalizada } from "@/content/textos";

export function TarjetaProyecto({ proyecto, lang }: { proyecto: Proyecto; lang: Idioma }) {
  return (
    <Card
      href={ruta.proyecto(idiomaConProyectos(lang), proyecto.slug)}
      fillWidth
      padding="l"
      gap="12"
      direction="column"
      radius="m"
      border="neutral-alpha-medium"
    >
      <Heading as="h3" variant="heading-strong-s">
        {proyecto.title}
      </Heading>
      <Text variant="body-default-s" onBackground="neutral-medium">
        {proyecto.pregunta || proyecto.subtitle}
      </Text>
      {proyecto.stack.length > 0 && (
        <Row gap="4" wrap>
          {proyecto.stack.slice(0, 4).map((t) => (
            <Tag key={t} size="s" variant="neutral">
              {t}
            </Tag>
          ))}
        </Row>
      )}
    </Card>
  );
}

export function TarjetaArticulo({ articulo, lang }: { articulo: Articulo; lang: Idioma }) {
  return (
    <Card
      href={ruta.articulo(lang, articulo.slug)}
      fillWidth
      padding="l"
      gap="8"
      direction="column"
      radius="m"
      border="neutral-alpha-medium"
    >
      <Row gap="8" vertical="center">
        <Text variant="label-default-s" onBackground="brand-medium">
          {articulo.category}
        </Text>
        <Text variant="label-default-s" onBackground="neutral-weak">
          <time dateTime={articulo.date}>{fechaLocalizada(articulo.date, lang)}</time>
        </Text>
      </Row>
      <Heading as="h3" variant="heading-strong-s">
        {articulo.title}
      </Heading>
      <Text variant="body-default-s" onBackground="neutral-medium">
        {articulo.subtitle}
      </Text>
    </Card>
  );
}

/** Fila de idioma/nivel y de capacidad con su prueba enlazada. */
export function FilaDato({
  etiqueta,
  valor,
  enlace,
}: {
  etiqueta: string;
  valor: string;
  enlace?: string;
}) {
  return (
    <Row fillWidth gap="16" paddingY="8" borderBottom="neutral-alpha-weak" vertical="center" wrap>
      <Text variant="label-strong-s" style={{ minWidth: "8rem" }}>
        {etiqueta}
      </Text>
      <Text variant="body-default-s" onBackground="neutral-medium">
        {enlace ? (
          <a href={enlace} rel="noopener noreferrer" target="_blank">
            {valor}
          </a>
        ) : (
          valor
        )}
      </Text>
    </Row>
  );
}

export { Column };
