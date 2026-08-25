#!/usr/bin/env python3
"""Conversor compartido de HTML a Markdown/MDX para la migracion del sitio.

Lo usan scripts/migrar-articulos.py y scripts/migrar-proyectos.py. El juego de
etiquetas es el que produce el sitio antiguo, censado sobre los 51 ficheros:
p, h2, h3, strong, em, a, code, ul/ol/li y dos bloques propios.
"""
from __future__ import annotations

import html
import re
from html.parser import HTMLParser

MESES = {
    "es": "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre",
    "en": "january february march april may june july august september october november december",
    "de": "januar februar marz april mai juni juli august september oktober november dezember",
}
BLOQUES_SALTADOS = {"articulo-breadcrumb", "articulo-meta-top", "articulo-autor", "detalle-acciones"}
# Componentes MDX que hay que dejar pasar tal cual, con sus atributos.
# HTMLParser baja el nombre a minusculas, asi que se remapea al escribirlo.
COMPONENTES = {"paso": "Paso"}


def sin_tildes(s: str) -> str:
    for a, b in zip("áéíóúü", "aeiouu"):
        s = s.replace(a, b)
    return s


def fecha_iso(texto: str, lang: str) -> str:
    """'1 de agosto de 2026' / '18 September 2026' / '18. September 2026' -> 2026-08-01."""
    t = sin_tildes(texto.lower().replace(".", " "))
    numeros = re.findall(r"\d+", t)
    mes = next((i + 1 for i, m in enumerate(MESES[lang].split()) if m in t), None)
    if not numeros or mes is None:
        raise ValueError(f"fecha no reconocida ({lang}): {texto!r}")
    dia = int(numeros[0])
    anio = int(numeros[-1])
    return f"{anio:04d}-{mes:02d}-{dia:02d}"


class AMarkdown(HTMLParser):
    """Convierte el subarbol del cuerpo del articulo a Markdown/MDX."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.buf: list[str] = []
        self.pila: list[str] = []
        self.listas: list[dict] = []
        self.saltar = 0

    # -- utilidades ----------------------------------------------------
    def _cerrar_parrafo(self, prefijo: str = "") -> None:
        texto = re.sub(r"\s+", " ", "".join(self.buf)).strip()
        self.buf.clear()
        if texto:
            self.out.append(prefijo + texto)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        clases = set((a.get("class") or "").split())
        if self.saltar or clases & BLOQUES_SALTADOS:
            self.saltar += 1
            return
        if tag in COMPONENTES:
            self._cerrar_parrafo()
            attrs_txt = "".join(f' {k}="{v}"' for k, v in attrs)
            self.out.append(f"<{COMPONENTES[tag]}{attrs_txt}>")
        elif tag == "div" and "articulo-nota" in clases:
            self._cerrar_parrafo()
            self.pila.append("nota")
            self.out.append("<Nota>")
        elif tag == "div" and "articulo-destacado" in clases:
            self._cerrar_parrafo()
            self.pila.append("destacado")
            self.out.append("<Destacado>")
        elif tag in ("ul", "ol"):
            self._cerrar_parrafo()
            self.listas.append({"tipo": tag, "n": 0})
        elif tag == "li":
            self._cerrar_parrafo()
        elif tag == "strong":
            self.buf.append("**")
        elif tag == "em":
            self.buf.append("*")
        elif tag == "code":
            self.buf.append("`")
        elif tag == "a":
            self.buf.append("[")
            self.pila.append(a.get("href", ""))
        elif tag == "br":
            self.buf.append(" ")

    def handle_endtag(self, tag):
        if self.saltar:
            self.saltar -= 1
            return
        if tag in COMPONENTES:
            self._cerrar_parrafo()
            self.out.append(f"</{COMPONENTES[tag]}>")
        elif tag in ("p", "h2", "h3"):
            self._cerrar_parrafo("## " if tag == "h2" else "### " if tag == "h3" else "")
        elif tag == "li":
            lista = self.listas[-1] if self.listas else {"tipo": "ul", "n": 0}
            lista["n"] += 1
            marca = f"{lista['n']}. " if lista["tipo"] == "ol" else "- "
            self._cerrar_parrafo(marca)
        elif tag in ("ul", "ol"):
            if self.listas:
                self.listas.pop()
        elif tag == "div" and self.pila and self.pila[-1] in ("nota", "destacado"):
            self._cerrar_parrafo()
            self.out.append("</Nota>" if self.pila.pop() == "nota" else "</Destacado>")
        elif tag == "strong":
            self.buf.append("**")
        elif tag == "em":
            self.buf.append("*")
        elif tag == "code":
            self.buf.append("`")
        elif tag == "a" and self.pila:
            self.buf.append(f"]({self.pila.pop()})")

    def handle_data(self, data):
        if not self.saltar:
            self.buf.append(data)

    def resultado(self) -> str:
        self._cerrar_parrafo()
        return "\n\n".join(x for x in self.out if x.strip())


def campo(s: str, patron: str) -> str:
    m = re.search(patron, s, re.S)
    if not m:
        raise ValueError(f"no encontrado: {patron}")
    return html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()



def escapar_yaml(v: str) -> str:
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


def a_markdown(fragmento: str) -> str:
    p = AMarkdown()
    p.feed(fragmento)
    return p.resultado()
