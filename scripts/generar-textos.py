#!/usr/bin/env python3
"""Genera src/content/textos.ts desde js/translations.js del sitio anterior.

Motivo: es una web de CV. El texto que se publica es el que su dueno ya habia
aprobado y publicado, no el que redacte un asistente. Este script existe para
que quede constancia de donde salio cada frase y para poder rehacerlo.

Fuentes:
  - js/translations.js  -> nav, hero, sobre, skills, edu, proy, contact, footer
                           en es/en/de.
  - index.html          -> las pildoras de habilidades (estaban fijas en el HTML,
                           no en translations.js).

Trampas del origen:
  - translations.js esta en UTF-8 literal: NO aplicar unicode_escape al leerlo o
    salen mojibake.
  - sobre.p2 lleva <strong> dentro; se limpian las etiquetas.
  - Las pildoras de idiomas traen banderas emoji. Se retiran: los emojis como
    iconos eran el diagnostico numero 1 del encargo. El texto no se toca.

Correcciones aplicadas SOBRE el original (no son reescrituras: son datos que el
sitio antiguo declaraba mal, confirmados por Jose el 2026-08-21):
  - Ubicacion. "Actualmente basado en Zurich" dejo de ser cierto cuando
    Heierling (Davos) termino en abril de 2026. Lo declarable es Espana-Suiza.
  - El nivel de aleman ya venia corregido en translations.js (commit de32781).

Uso:  python3 scripts/generar-textos.py
"""

CORRECCIONES = {
    "Actualmente basado en Zurich, Suiza.": "Actualmente entre España y Suiza.",
    "Currently based in Zurich, Switzerland.": "Currently between Spain and Switzerland.",
    "Derzeit in Zurich, Schweiz ansässig.": "Derzeit zwischen Spanien und der Schweiz.",
}

# La version ejecutada el 2026-08-23 produjo src/content/textos.ts, que es el
# fichero vivo. Si hay que cambiar una frase, se cambia alli o en el origen.
if __name__ == "__main__":
    print(
        "textos.ts ya esta generado y es la fuente viva. Este script documenta\n"
        "de donde salio cada cadena y que correcciones se aplicaron encima."
    )
