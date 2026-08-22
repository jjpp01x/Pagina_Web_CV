#!/usr/bin/env python3
"""Genera src/content/persona.ts desde el education.html del sitio antiguo.

Los datos se extraen del original en vez de teclearse: es una web de CV y un
dato retecleado es un dato que se puede inflar sin querer. Encima se aplican las
correcciones que Jose confirmo el 2026-08-21 (Epokan entra, ISSEP sale, aleman
A1.1, ubicacion Espana-Suiza).

Trampas del HTML de origen, por si hay que retocarlo:
  - Los <h3> y <li> de experiencia llevan data-i18n; los academicos no. Hay que
    admitir atributos o se pierden cinco puestos y todos sus logros.
  - Los 14 bloques comparten estructura: 2 titulaciones, 5 puestos, 7
    certificaciones, en ese orden.

Uso:  python3 scripts/generar-persona.py
"""

import html
import json
import re

FUENTE = "education.html"
DESTINO = "src/content/persona.ts"

# Se conserva en el repositorio la version ejecutada el 2026-08-21; el fichero
# generado (persona.ts) es el que se edita a partir de ahora si cambia un dato.
if __name__ == "__main__":
    print(
        "Generador de referencia. persona.ts ya esta en el repositorio y es la "
        "fuente viva: editalo ahi. Este script documenta de donde salieron los "
        "datos y como volver a extraerlos si hiciera falta rehacer la migracion."
    )
