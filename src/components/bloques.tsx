/**
 * Componentes que usan los MDX migrados.
 *
 * El sitio antiguo tenia estos tres bloques como <div> con clase. Al migrar se
 * conservaron como componentes en vez de aplanarlos a texto, para no perder la
 * semantica: una nota metodologica y un paso numerado no son un parrafo mas.
 */
import { Column, Heading, Row, Text } from "@once-ui-system/core";

/** Nota metodologica o aclaracion. Era div.articulo-nota. */
export function Nota({ children }: { children: React.ReactNode }) {
  return (
    <Column
      as="aside"
      fillWidth
      padding="l"
      gap="8"
      radius="m"
      background="neutral-alpha-weak"
      border="neutral-alpha-medium"
      marginY="16"
    >
      <Text variant="body-default-s" onBackground="neutral-medium">
        {children}
      </Text>
    </Column>
  );
}

/** Idea destacada. Era div.articulo-destacado. */
export function Destacado({ children }: { children: React.ReactNode }) {
  return (
    <Column
      as="blockquote"
      fillWidth
      paddingX="l"
      paddingY="m"
      gap="8"
      marginY="16"
      borderLeft="brand-medium"
    >
      <Text variant="heading-default-s" onBackground="neutral-strong">
        {children}
      </Text>
    </Column>
  );
}

/**
 * Paso numerado de una ficha de proyecto. Era div.detalle-paso.
 * El numero y el titulo vienen como atributos del MDX.
 */
export function Paso({
  n,
  titulo,
  children,
}: {
  n: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Row fillWidth gap="16" marginY="12" vertical="start">
      <Text
        variant="label-strong-s"
        onBackground="brand-medium"
        aria-hidden="true"
        style={{ minWidth: "2.5rem", fontVariantNumeric: "tabular-nums" }}
      >
        {n}
      </Text>
      <Column gap="4" fillWidth>
        <Heading as="h3" variant="heading-strong-xs">
          {titulo}
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-medium">
          {children}
        </Text>
      </Column>
    </Row>
  );
}

export const componentesMDX = { Nota, Destacado, Paso };
