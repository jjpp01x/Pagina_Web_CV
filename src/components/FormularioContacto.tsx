"use client";

import { useState } from "react";

import { Button, Column, Input, Text, Textarea } from "@once-ui-system/core";

import type { Textos } from "@/content/textos";

/**
 * Formulario de contacto, el mismo que tenia el sitio anterior.
 *
 * Sigue enviando a Formspree: el sitio se publica en GitHub Pages, que solo
 * sirve estaticos, asi que no hay backend propio donde recoger el envio.
 *
 * Mejoras sobre el original, todas de accesibilidad y de no dejar al usuario a
 * ciegas:
 *   - Envio por fetch con estado visible (enviando / enviado / error) en vez de
 *     recargar a la pagina de Formspree.
 *   - Si el envio falla, se ofrece el correo directo: un formulario roto sin
 *     salida alternativa es una candidatura perdida.
 *   - role="status" para que un lector de pantalla anuncie el resultado.
 *   - Trampa anti-spam (_gotcha) oculta, que Formspree entiende.
 */
const FORMSPREE = "https://formspree.io/f/xkokeaky";

type Estado = "vacio" | "enviando" | "enviado" | "error";

export function FormularioContacto({ t, email }: { t: Textos["contacto"]; email: string }) {
  const [estado, setEstado] = useState<Estado>("vacio");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setEstado("enviando");
    try {
      const respuesta = await fetch(FORMSPREE, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      form.reset();
      setEstado("enviado");
    } catch {
      setEstado("error");
    }
  }

  return (
    <form onSubmit={enviar} noValidate={false}>
      <Column gap="16" fillWidth>
        {/* Trampa anti-spam: invisible para personas, visible para bots. */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        />

        <Input id="nombre" name="nombre" label={t.nombre} placeholder={t.nombrePh} required />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder={t.emailPh}
          required
        />
        <Input id="asunto" name="asunto" label={t.asunto} placeholder={t.asuntoPh} required />
        {/*
          aria-label explicito: Once UI pinta la etiqueta del Textarea sin
          `for`, asi que el campo se quedaba sin nombre accesible. Los <Input>
          si lo generan bien.
        */}
        <Textarea
          id="mensaje"
          name="mensaje"
          label={t.mensaje}
          aria-label={t.mensaje}
          placeholder={t.mensajePh}
          lines={6}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="m"
          disabled={estado === "enviando"}
          loading={estado === "enviando"}
        >
          {estado === "enviando" ? t.enviando : t.enviar}
        </Button>

        {/* role="status" lo anuncia un lector de pantalla sin robar el foco. */}
        <div role="status" aria-live="polite">
          {estado === "enviado" && (
            <Text variant="body-default-s" onBackground="success-medium">
              {t.exito}
            </Text>
          )}
          {estado === "error" && (
            <Text variant="body-default-s" onBackground="danger-medium">
              {t.error}{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </Text>
          )}
        </div>
      </Column>
    </form>
  );
}
