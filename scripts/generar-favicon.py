#!/usr/bin/env python3
"""Genera el favicon del sitio: src/app/favicon.ico y public/favicon.svg.

Existe por la misma razon que generar-cv.py: el .ico es un binario y sin
fuente no se puede reeditar. Aqui viven los dos SVG maestros, y el .ico se
reconstruye a partir de ellos con `python3 scripts/generar-favicon.py`.

Colores tomados de lo que el sitio pinta de verdad, no de once-ui.config.ts:

    tile   #0f152b -> #040816   (scheme-slate-200 -> scheme-slate-100)
    glifo  #5eead4             (--brand-on-background-medium en oscuro)

OJO con el glifo: el config dice `brand: "cyan"`, pero custom.css sobrescribe
--brand-on-background-* a verde petroleo, que es lo que se ve en pantalla. Jose
lo eligio el 2026-08-23 precisamente para huir del azul, asi que un favicon
cian contradice la decision aunque el config parezca darle la razon. Si hace
falta comprobarlo, se mide sobre un pixel del subtitulo del hero, no leyendo
la configuracion.

Hay dos SVG a proposito. El grande lleva degradado y filete; a 16 px ese
filete mide 0,4 px y solo ensucia el borde, asi que los tamanos pequenos usan
una version con fondo plano, esquinas menos redondeadas y las letras mas
grandes. Es el mismo truco de optical sizing que usan los iconos de sistema.

Requisitos: Google Chrome instalado (rasteriza los SVG) y red la primera vez,
porque la tipografia Inter se carga desde Google Fonts para que el monograma
use la misma familia que los titulares del sitio.
"""

import struct
import subprocess
import sys
import tempfile
import zlib
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SVG_GRANDE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="JP">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0f152b"/>
      <stop offset="1" stop-color="#040816"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#tile)"/>
  <rect x="6" y="6" width="500" height="500" rx="106" fill="none" stroke="#5eead4" stroke-opacity="0.16" stroke-width="12"/>
  <text x="256" y="365" text-anchor="middle"
        font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="300" font-weight="700" letter-spacing="-8" fill="#5eead4">JP</text>
</svg>
"""

SVG_PEQUENO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="JP">
  <rect width="512" height="512" rx="96" fill="#0b1020"/>
  <text x="256" y="374" text-anchor="middle"
        font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="340" font-weight="700" letter-spacing="-14" fill="#5eead4">JP</text>
</svg>
"""

# (lado, svg, formato dentro del .ico). DIB para los tamanos que abren lectores
# viejos; PNG para los grandes, que si no disparan el peso del fichero.
CAPAS = [
    (16, SVG_PEQUENO, "dib"),
    (32, SVG_PEQUENO, "dib"),
    (48, SVG_GRANDE, "dib"),
    (64, SVG_GRANDE, "dib"),
    (128, SVG_GRANDE, "png"),
    (256, SVG_GRANDE, "png"),
]

PLANTILLA = """<!doctype html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=block');
html,body{{margin:0;padding:0;background:transparent;width:{lado}px;height:{lado}px;overflow:hidden}}
svg{{display:block;width:{lado}px;height:{lado}px}}
</style></head><body>
{svg}
</body></html>
"""


def rasterizar(svg, lado, destino):
    """Pinta el SVG al tamano exacto. Se rasteriza a cada tamano en vez de
    reducir el de 256, porque el antialiasing de Chrome a 16 px conserva mucho
    mejor los trazos finos que un reescalado."""
    with tempfile.TemporaryDirectory() as tmp:
        pagina = Path(tmp) / "icono.html"
        pagina.write_text(PLANTILLA.format(lado=lado, svg=svg), encoding="utf-8")
        subprocess.run(
            [
                CHROME,
                "--headless",
                "--disable-gpu",
                "--hide-scrollbars",
                "--force-device-scale-factor=1",
                f"--window-size={lado},{lado}",
                "--default-background-color=00000000",
                "--virtual-time-budget=4000",
                f"--screenshot={destino}",
                pagina.as_uri(),
            ],
            check=True,
            capture_output=True,
        )


def leer_chunks(datos):
    assert datos[:8] == b"\x89PNG\r\n\x1a\n", "no es un PNG"
    pos = 8
    while pos < len(datos):
        (longitud,) = struct.unpack(">I", datos[pos : pos + 4])
        yield datos[pos + 4 : pos + 8], datos[pos + 8 : pos + 8 + longitud]
        pos += 12 + longitud


def desfiltrar(cruda, ancho, alto, canales):
    stride = ancho * canales
    salida = bytearray(stride * alto)
    previa = bytearray(stride)
    pos = 0
    for y in range(alto):
        filtro = cruda[pos]
        pos += 1
        linea = bytearray(cruda[pos : pos + stride])
        pos += stride
        if filtro == 1:
            for i in range(canales, stride):
                linea[i] = (linea[i] + linea[i - canales]) & 0xFF
        elif filtro == 2:
            for i in range(stride):
                linea[i] = (linea[i] + previa[i]) & 0xFF
        elif filtro == 3:
            for i in range(stride):
                izq = linea[i - canales] if i >= canales else 0
                linea[i] = (linea[i] + ((izq + previa[i]) >> 1)) & 0xFF
        elif filtro == 4:
            for i in range(stride):
                izq = linea[i - canales] if i >= canales else 0
                arriba = previa[i]
                diag = previa[i - canales] if i >= canales else 0
                p = izq + arriba - diag
                pa, pb, pc = abs(p - izq), abs(p - arriba), abs(p - diag)
                pred = izq if (pa <= pb and pa <= pc) else (arriba if pb <= pc else diag)
                linea[i] = (linea[i] + pred) & 0xFF
        elif filtro != 0:
            raise ValueError(f"filtro PNG desconocido: {filtro}")
        salida[y * stride : (y + 1) * stride] = linea
        previa = linea
    return salida


def png_a_rgba(ruta):
    """Decodifica el PNG a mano. Es eso o meter Pillow como dependencia solo
    para poder escribir las capas DIB del .ico."""
    datos = Path(ruta).read_bytes()
    idat = bytearray()
    paleta = trns = None
    ancho = alto = tipo_color = None
    for tipo, cuerpo in leer_chunks(datos):
        if tipo == b"IHDR":
            ancho, alto, prof, tipo_color, _, _, entrelazado = struct.unpack(">IIBBBBB", cuerpo)
            if prof != 8 or entrelazado != 0:
                raise ValueError(f"{ruta}: solo 8 bits por canal y sin entrelazar")
        elif tipo == b"PLTE":
            paleta = cuerpo
        elif tipo == b"tRNS":
            trns = cuerpo
        elif tipo == b"IDAT":
            idat += cuerpo
    canales = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[tipo_color]
    plano = desfiltrar(zlib.decompress(bytes(idat)), ancho, alto, canales)

    rgba = bytearray(ancho * alto * 4)
    for i in range(ancho * alto):
        muestra = plano[i * canales : (i + 1) * canales]
        if tipo_color == 6:
            pixel = bytes(muestra)
        elif tipo_color == 2:
            pixel = bytes(muestra) + b"\xff"
        elif tipo_color == 0:
            pixel = bytes([muestra[0]] * 3 + [255])
        elif tipo_color == 4:
            pixel = bytes([muestra[0]] * 3 + [muestra[1]])
        else:
            idx = muestra[0]
            alfa = trns[idx] if trns and idx < len(trns) else 255
            pixel = paleta[idx * 3 : idx * 3 + 3] + bytes([alfa])
        rgba[i * 4 : i * 4 + 4] = pixel
    return ancho, alto, bytes(rgba)


def a_dib(ancho, alto, rgba):
    """DIB de 32 bits: BGRA, filas de abajo arriba y mascara AND vacia (el
    canal alfa ya lleva la transparencia; la mascara esta por formato)."""
    cabecera = struct.pack(
        "<IiiHHIIiiII", 40, ancho, alto * 2, 1, 32, 0, ancho * alto * 4, 0, 0, 0, 0
    )
    pixeles = bytearray()
    for y in range(alto - 1, -1, -1):
        fila = rgba[y * ancho * 4 : (y + 1) * ancho * 4]
        for x in range(ancho):
            r, g, b, a = fila[x * 4 : x * 4 + 4]
            pixeles += bytes([b, g, r, a])
    mascara = bytes(((ancho + 31) // 32) * 4 * alto)
    return cabecera + bytes(pixeles) + mascara


def main():
    if not Path(CHROME).exists():
        sys.exit(f"No encuentro Chrome en {CHROME}; hace falta para rasterizar los SVG.")

    (RAIZ / "public" / "favicon.svg").write_text(SVG_GRANDE, encoding="utf-8")

    imagenes = []
    with tempfile.TemporaryDirectory() as tmp:
        for lado, svg, formato in CAPAS:
            png = Path(tmp) / f"{lado}.png"
            rasterizar(svg, lado, png)
            ancho, alto, rgba = png_a_rgba(png)
            if (ancho, alto) != (lado, lado):
                sys.exit(f"Chrome devolvio {ancho}x{alto} en vez de {lado}x{lado}")
            imagenes.append(
                (lado, png.read_bytes() if formato == "png" else a_dib(ancho, alto, rgba))
            )

    desplazamiento = 6 + 16 * len(imagenes)
    directorio = b""
    for lado, cuerpo in imagenes:
        # 0 en el .ico significa 256: el campo es de un byte.
        octeto = 0 if lado >= 256 else lado
        directorio += struct.pack(
            "<BBBBHHII", octeto, octeto, 0, 0, 1, 32, len(cuerpo), desplazamiento
        )
        desplazamiento += len(cuerpo)

    destino = RAIZ / "src" / "app" / "favicon.ico"
    destino.write_bytes(
        struct.pack("<HHH", 0, 1, len(imagenes)) + directorio + b"".join(c for _, c in imagenes)
    )
    print(f"{destino.relative_to(RAIZ)}: {len(imagenes)} capas, {desplazamiento} bytes")
    print("public/favicon.svg: reescrito")


if __name__ == "__main__":
    main()
