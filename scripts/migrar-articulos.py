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

from html_a_mdx import MESES, AMarkdown, campo, escapar_yaml, fecha_iso, sin_tildes

import sys as _s; _s.path.insert(0, __import__("os").path.dirname(__file__))

DESTINO = "src/content/articulos"
FUENTES = {"es": "articulos/*.html", "en": "en/articles/*.html", "de": "de/artikel/*.html"}

MESES = {
    "es": "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre",
    "en": "january february march april may june july august september october november december",
    "de": "januar februar marz april mai juni juli august september oktober november dezember",
}
BLOQUES_SALTADOS = {"articulo-breadcrumb", "articulo-meta-top", "articulo-autor", "detalle-acciones"}


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
