"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Column, Row } from "@once-ui-system/core";

/**
 * Boton "Descargar CV" con menu desplegable, como en el sitio anterior.
 *
 * El original lo hacia con un onclick en linea que alternaba una clase. Aqui es
 * un menu con estado, que ademas se cierra con Escape y al pulsar fuera, y
 * declara aria-expanded para lectores de pantalla.
 *
 * Sin banderas emoji en las opciones: eran el diagnostico numero 1 del encargo.
 */
const IDIOMAS_CV = [
  { codigo: "ES", nombre: "Español", href: "/docs/CV_Jose_Palacios_ES.pdf" },
  { codigo: "EN", nombre: "English", href: "/docs/CV_Jose_Palacios_EN.pdf" },
  { codigo: "DE", nombre: "Deutsch", href: "/docs/CV_Jose_Palacios_DE.pdf" },
];

export function DescargaCV({ etiqueta }: { etiqueta: string }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  return (
    <div ref={contenedor} style={{ position: "relative", display: "inline-block" }}>
      <Button
        variant="secondary"
        size="s"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        suffixIcon={abierto ? "chevronUp" : "chevronDown"}
      >
        {etiqueta}
      </Button>

      {abierto && (
        <Column
          role="menu"
          gap="2"
          padding="4"
          radius="m"
          background="surface"
          border="neutral-alpha-medium"
          shadow="l"
          style={{
            position: "absolute",
            top: "calc(100% + 0.35rem)",
            left: 0,
            zIndex: 10,
            minWidth: "11rem",
          }}
        >
          {IDIOMAS_CV.map((cv) => (
            <a
              key={cv.codigo}
              href={cv.href}
              download
              role="menuitem"
              onClick={() => setAbierto(false)}
              style={{
                display: "block",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-s)",
                textDecoration: "none",
                color: "var(--neutral-on-background-strong)",
                fontSize: "0.875rem",
              }}
            >
              <Row horizontal="between" gap="12">
                <span>{cv.nombre}</span>
                <span style={{ color: "var(--neutral-on-background-weak)" }}>{cv.codigo}</span>
              </Row>
            </a>
          ))}
        </Column>
      )}
    </div>
  );
}
