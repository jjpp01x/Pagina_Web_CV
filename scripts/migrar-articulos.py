#!/usr/bin/env python3
"""Convierte los articulos HTML del sitio antiguo a MDX.

Fuente de verdad de las traducciones: el hreflang que cada articulo EN/DE
declara hacia su equivalente ES. De ahi sale el translationKey, y del
translationKey sale luego el hreflang del sitio nuevo.

Uso:  python3 scripts/migrar-articulos.py [--dry-run]
"""
from __future__ import annotations

import glob
import html
import os
import re
import sys
from html.parser import HTMLParser

DESTINO = "src/content/articulos"
FUENTES = {"es": "articulos/*.html", "en": "en/articles/*.html", "de": "de/artikel/*.html"}

MESES = {
    "es": "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre",
    "en": "january february march april may june july august september october november december",
    "de": "januar februar marz april mai juni juli august september oktober november dezember",
}
BLOQUES_SALTADOS = {"articulo-breadcrumb", "articulo-meta-top", "articulo-autor", "detalle-acciones"}


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
        if tag == "div" and "articulo-nota" in clases:
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
        if tag in ("p", "h2", "h3"):
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


def extraer(ruta: str, lang: str) -> dict:
    s = open(ruta, encoding="utf-8").read()
    cuerpo = re.search(r'(?s)<div class="contenedor articulo-body">(.*?)</article>', s)
    if not cuerpo:
        raise ValueError(f"sin cuerpo: {ruta}")
    p = AMarkdown()
    p.feed(cuerpo.group(1))
    fecha_txt = campo(s, r'class="articulo-fecha"[^>]*>(.*?)</span>')
    return {
        "slug": os.path.basename(ruta)[:-5],
        "lang": lang,
        "title": campo(s, r"<h1[^>]*>(.*?)</h1>"),
        "subtitle": campo(s, r'class="articulo-subtitulo"[^>]*>(.*?)</p>'),
        "description": campo(s, r'name="description" content="([^"]*)"'),
        "category": campo(s, r'class="articulo-categoria"[^>]*>(.*?)</span>'),
        "date": fecha_iso(fecha_txt, lang),
        "image": campo(s, r'property="og:image" content="([^"]*)"'),
        "cuerpo": p.resultado(),
    }


def mapa_traducciones() -> dict[str, dict[str, str]]:
    grupos = {os.path.basename(f)[:-5]: {"es": os.path.basename(f)[:-5]} for f in sorted(glob.glob(FUENTES["es"]))}
    for lang in ("en", "de"):
        for f in sorted(glob.glob(FUENTES[lang])):
            s = open(f, encoding="utf-8").read()
            m = re.search(r'hreflang="es"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*hreflang="es"', s)
            if not m:
                raise ValueError(f"{f} no declara hreflang es")
            clave = os.path.basename(m.group(1) or m.group(2))[:-5]
            if clave not in grupos:
                raise ValueError(f"{f} apunta a un ES inexistente: {clave}")
            grupos[clave][lang] = os.path.basename(f)[:-5]
    return grupos


def escapar_yaml(v: str) -> str:
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> int:
    seco = "--dry-run" in sys.argv
    grupos = mapa_traducciones()
    por_slug = {slug: clave for clave, langs in grupos.items() for slug in langs.values()}
    escritos = 0
    for lang, patron in FUENTES.items():
        for ruta in sorted(glob.glob(patron)):
            d = extraer(ruta, lang)
            d["translationKey"] = por_slug[d["slug"]]
            fm = "\n".join(
                f"{k}: {escapar_yaml(d[k])}"
                for k in ("title", "subtitle", "description", "category", "date", "image", "lang", "translationKey")
            )
            texto = f"---\n{fm}\n---\n\n{d['cuerpo']}\n"
            destino = os.path.join(DESTINO, lang, d["slug"] + ".mdx")
            if not seco:
                os.makedirs(os.path.dirname(destino), exist_ok=True)
                open(destino, "w", encoding="utf-8").write(texto)
            escritos += 1
    print(f"{'(dry-run) ' if seco else ''}{escritos} MDX; {len(grupos)} grupos de traduccion")
    completos = sum(1 for v in grupos.values() if len(v) == 3)
    print(f"grupos completos ES+EN+DE: {completos}; solo ES: {len(grupos) - completos}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
