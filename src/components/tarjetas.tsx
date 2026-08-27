/**
 * Tarjetas de proyecto y de articulo.
 *
 * La de proyecto abre con la pregunta que responde, no con una lista de
 * features: para un puesto de evaluacion tecnologica, lo que distingue no es
 * que sepas listar tecnologia sino que sepas decir que decide cada herramienta.
 * Y siempre lleva el enlace al repositorio: es la prueba, no un adorno.
 */
import { Card, Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import { FaGithub } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

import estilos from "@/components/tarjetas.module.scss";

import { type Articulo, idiomaDeFicha, type Proyecto } from "@/lib/contenido";
import type { Idioma } from "@/lib/rutas";
import { ruta } from "@/lib/rutas";
import { fechaLocalizada } from "@/content/textos";
import { colorCategoria } from "@/content/categorias";

export function TarjetaProyecto({ proyecto, lang }: { proyecto: Proyecto; lang: Idioma }) {
  return (
    <Card
      href={ruta.proyecto(idiomaDeFicha(lang, proyecto.slug), proyecto.slug)}
      fillWidth
      padding="l"
      gap="12"
      direction="column"
      radius="l"
      border="neutral-alpha-medium"
      className={estilos.tarjeta}
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
            <Tag key={t} size="s" variant="neutral" className={estilos.pildora}>
              {t}
            </Tag>
          ))}
        </Row>
      )}
      {/*
        El enlace al repositorio, visible en la propia tarjeta. Sin esto el
        visitante lee "dice que sabe"; con esto lee "puedo comprobarlo ahora",
        que es toda la tesis del sitio.
      */}
      {proyecto.repo && (
        <Row gap="8" vertical="center" paddingTop="4" className={estilos.repo}>
          <FaGithub size={13} aria-hidden="true" />
          <Text variant="label-default-s" onBackground="neutral-weak">
            {proyecto.repo.replace("https://github.com/", "")}
          </Text>
          {/*
            Flecha de enlace externo. aria-hidden porque no aporta nada a un
            lector de pantalla: el destino ya lo dice el texto del repo, y
            anunciar "flecha" en cada tarjeta seria ruido.
          */}
          <FiArrowUpRight size={13} aria-hidden="true" />
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
      className={estilos.tarjeta}
    >
      <Row gap="8" vertical="center" wrap>
        {/* El color informa, pero nunca es el unico indicador: la etiqueta
            lleva siempre su texto. */}
        <Text variant="label-strong-s" style={{ color: colorCategoria(articulo.category) }}>
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
