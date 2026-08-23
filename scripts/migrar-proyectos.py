#!/usr/bin/env python3
"""Convierte las 10 fichas de proyecto HTML a MDX.

Estructura distinta a la de los articulos: metadatos con etiqueta, secciones con
h2 y pasos numerados. Los pasos salen como <Paso n titulo> para conservar la
semantica en vez de aplanarlos a texto.

Uso:  python3 scripts/migrar-proyectos.py [--dry-run]
"""
from __future__ import annotations

import glob
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from html_a_mdx import a_markdown, campo, escapar_yaml

DESTINO = "src/content/proyectos/es"

# Verificado con git shortlog el 2026-07-31 y las notas del 4 de agosto: obra propia.
DEEP_TECH = {
    "ai-readiness-matrix", "ai-safety-incidents", "dd-copilot",
    "expert-probe", "model-card-auditor", "signal-radar",
}
CLAVES = {
    "Estado": "estado",
    "Tipo": "tipo",
    "Pregunta que responde": "pregunta",
    "Modulo": "modulo",
    "Institucion": "institucion",
    "URL en produccion": "demo",
}


def limpio(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def sin_tildes(s: str) -> str:
    for a, b in zip("áéíóúÁÉÍÓÚ", "aeiouAEIOU"):
        s = s.replace(a, b)
    return s


def extraer(ruta: str) -> dict:
    s = open(ruta, encoding="utf-8").read()
    main = re.search(r"(?s)<main.*?</main>", s).group(0)

    meta: dict[str, str] = {}
    # Cada item cierra en su primer </div> y no anida: no-voraz simple.
    for bloque in re.findall(r'(?s)<div class="detalle-meta-item">(.*?)</div>', main):
        etiqueta = re.search(r'<span class="detalle-meta-label"[^>]*>(.*?)</span>', bloque)
        if not etiqueta:
            continue
        clave = CLAVES.get(sin_tildes(limpio(etiqueta.group(1))))
        valor = limpio(re.sub(r'(?s)<span class="detalle-meta-label".*?</span>', "", bloque))
        if clave and valor:
            # Una URL sin esquema se convierte en enlace relativo al renderizar
            # (demo: "josepalacios.site" -> /proyectos/josepalacios.site, un 404).
            if clave == "demo" and not valor.startswith(("http://", "https://")):
                valor = f"https://{valor}"
            meta[clave] = valor

    stack = [limpio(t) for t in re.findall(r'<span class="tag"[^>]*>(.*?)</span>', main)]
    # Solo repositorios: el perfil suelto (github.com/jjpp01x) no vale como repo.
    enlaces = [u for u in re.findall(r'href="(https://github\.com/[^"]+)"', s)
               if re.match(r"https://github\.com/[^/]+/[^/]+$", u)]

    # El cuerpo: secciones con h2, y los pasos convertidos a <Paso>.
    cuerpo = re.sub(r'(?s)<div class="detalle-meta".*?</div>\s*</div>\s*</div>', "", main)
    cuerpo = re.sub(r'(?s)<div class="detalle-acciones">.*?</div>', "", cuerpo)

    def paso(m: re.Match) -> str:
        interior = m.group(1)
        n = limpio(re.search(r'<span class="paso-numero"[^>]*>(.*?)</span>', interior).group(1))
        titulo = limpio(re.search(r"<h3[^>]*>(.*?)</h3>", interior).group(1))
        resto = re.sub(r'(?s)<span class="paso-numero".*?</span>|<h3[^>]*>.*?</h3>', "", interior)
        return f'<Paso n="{n}" titulo="{titulo}">{resto}</Paso>'

    cuerpo = re.sub(r'(?s)<div class="detalle-paso">(.*?)</div>\s*</div>', paso, cuerpo)
    # Fuera cabecera de pagina: h1, subtitulo y breadcrumb ya van al frontmatter.
    # La cabecera lleva estilos inline, asi que hay que admitir mas atributos.
    cuerpo = re.sub(r'(?s)<section class="page-header"[^>]*>.*?</section>', "", cuerpo)

    md = a_markdown(cuerpo)
    md = re.sub(r"\n{3,}", "\n\n", md).strip()

    # El <p> que sigue al <h1> dentro de la cabecera es el subtitulo real.
    sub = re.search(r"(?s)<h1[^>]*>.*?</h1>\s*<p[^>]*>(.*?)</p>", main)

    slug = os.path.basename(ruta)[:-5]
    d = {
        "subtitle": limpio(sub.group(1)) if sub else "",
        "slug": slug,
        "title": campo(s, r"<h1[^>]*>(.*?)</h1>"),
        "description": campo(s, r'name="description" content="([^"]*)"'),
        "image": campo(s, r'property="og:image" content="([^"]*)"'),
        "repo": enlaces[0] if enlaces else "",
        "lang": "es",
        "translationKey": slug,
        "cuerpo": md,
        **meta,
    }
    d["deepTech"] = slug in DEEP_TECH
    d["stack"] = stack
    return d


def main() -> int:
    seco = "--dry-run" in sys.argv
    orden = ("title", "subtitle", "description", "tipo", "pregunta", "estado",
             "modulo", "institucion", "repo", "demo", "image", "lang", "translationKey")
    n = 0
    for ruta in sorted(glob.glob("proyectos/*.html")):
        d = extraer(ruta)
        fm = [f"{k}: {escapar_yaml(d[k])}" for k in orden if d.get(k)]
        fm.append("stack: [" + ", ".join(escapar_yaml(x) for x in d["stack"]) + "]")
        fm.append(f"deepTech: {'true' if d['deepTech'] else 'false'}")
        texto = "---\n" + "\n".join(fm) + "\n---\n\n" + d["cuerpo"] + "\n"
        if not seco:
            os.makedirs(DESTINO, exist_ok=True)
            open(os.path.join(DESTINO, d["slug"] + ".mdx"), "w", encoding="utf-8").write(texto)
        n += 1
    print(f"{'(dry-run) ' if seco else ''}{n} fichas; deep tech: {sum(1 for r in glob.glob('proyectos/*.html') if os.path.basename(r)[:-5] in DEEP_TECH)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
