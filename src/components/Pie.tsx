/**
 * Pie del sitio.
 *
 * Lleva la atribucion CC BY-NC 4.0 a Once UI, que es obligatoria por la licencia
 * de Magic Portfolio: hay que mantener el credito, enlazar la licencia e indicar
 * que se ha modificado. No se retira "por limpieza".
 */
import { Column, Row, SmartLink, Text } from "@once-ui-system/core";

import { persona } from "@/content/persona";
import { textos } from "@/content/textos";
import type { Idioma } from "@/lib/rutas";

export function Pie({ lang }: { lang: Idioma }) {
  const t = textos(lang);
  const anio = 2026;

  return (
    <Column
      as="footer"
      fillWidth
      horizontal="center"
      paddingX="l"
      paddingY="32"
      marginTop="40"
      borderTop="neutral-alpha-weak"
    >
      <Column fillWidth maxWidth={64} gap="12">
        <Row gap="16" wrap>
          <SmartLink href={`mailto:${persona.email}`}>{persona.email}</SmartLink>
          <SmartLink href={persona.github}>GitHub</SmartLink>
          <SmartLink href={persona.linkedin}>LinkedIn</SmartLink>
        </Row>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          © {anio} {persona.nombre}
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          {t.pie.atribucion}{" "}
          <SmartLink href="https://once-ui.com">Once UI</SmartLink> ·{" "}
          <SmartLink href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</SmartLink>
        </Text>
      </Column>
    </Column>
  );
}
