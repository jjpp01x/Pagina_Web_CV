# 19 meta descriptions por encima de 160 caracteres — pendiente

**Encontrado:** 2026-09-05, al intentar añadir un cerrojo de longitud al build.
**Estado:** pendiente. El cerrojo se revirtió; estas 19 siguen como están.

## Qué pasó

El plan [`2026-09-05-coursework-septiembre-noviembre.md`](../plans/2026-09-05-coursework-septiembre-noviembre.md)
arregló 7 descripciones de artículo que pasaban de 160 caracteres y añadió un cerrojo en
`scripts/postbuild.mjs` para que el build fallara si alguna volvía a pasarse.

El cerrojo funcionaba —verificado por mutación: se alargó una descripción a 204 caracteres,
el build la nombró y salió con `exit=1`— pero al encenderlo destapó **19 descripciones más
por encima del límite, ninguna de ellas en un artículo**. La auditoría original solo había
mirado `src/content/articulos/`.

Con esas 19 sin arreglar, el cerrojo dejaba el build en rojo, y el workflow de despliegue
ejecuta `npm run build`. Se decidió **revertir el cerrojo** y dejar la rama fusionable, en
lugar de ampliar el alcance a un barrido de SEO de todo el sitio.

Producción nunca se vio afectada: nada de esto llegó a empujarse.

## Las 19

Medido sobre el HTML servido en `out/`, el 2026-09-05. El límite es **160**; la horquilla
editorial del sitio es **140–160**.

### Fichas de proyecto — 13

En el frontmatter, campo `description:`, en `src/content/proyectos/{es,en}/*.mdx`.
Los proyectos solo existen en ES y EN; no hay versión alemana.

| Proyecto | ES | EN |
|---|---|---|
| `expert-probe` | **235** | **215** |
| `signal-radar` | **202** | **195** |
| `portfolio` | **181** | **192** |
| `dd-copilot` | **174** | **169** |
| `redes-vm` | **168** | **170** |
| `ski-ticketing` | **167** | **161** |
| `heierling` | **164** | — (dentro de límite) |

### Páginas — 6

Todas en `src/content/textos.ts`:

| Página | Idioma | Caracteres | Línea aprox. |
|---|---|---|---|
| Portada | es | **219** | 130 |
| Portada | en | **207** | — |
| Portada | de | **232** | — |
| Sobre mí | es | **234** | 231 |
| Sobre mí | en | **223** | — |
| Sobre mí | de | **236** | 615 |

Estas seis son las páginas más leídas del sitio y su texto es la voz del autor, así que
**no se reescriben sin que las vea él**. Es la razón principal por la que esto no se arregló
sobre la marcha.

## Cómo comprobarlo

Sobre `out/` después de un `npm run build`:

```bash
python3 - <<'PY'
import re, html, pathlib
OUT = pathlib.Path("out")
filas = []
for f in OUT.rglob("*.html"):
    r = str(f.relative_to(OUT))
    if r.startswith("_") or r == "404.html" or r.endswith("_not-found.html"):
        continue
    m = re.search(r'<meta name="description" content="(.*?)"', f.read_text(errors="ignore"), re.S)
    d = html.unescape(m.group(1)) if m else ""
    if len(d) > 160:
        filas.append((len(d), r))
for n, r in sorted(filas, reverse=True):
    print(f"{n:4d}  {r}")
print("total:", len(filas))
PY
```

Da 21 líneas y no 19: `out/en.html` y `out/en/index.html` son el mismo documento, igual que
el par alemán. El cerrojo contaba 19 porque `postbuild.mjs` filtra los `<lang>/index.html`
duplicados antes de recorrer las páginas.

## El cerrojo, para cuando se retome

El código íntegro está en la Tarea 3 del plan, listo para volver a pegar. Va en
`scripts/postbuild.mjs`, **después** del bloque que escribe `out/llms.txt` y **antes** de
las dos últimas líneas que leen `process.exitCode` — si va después, fija el código de salida
demasiado tarde y no se reporta.

Reutiliza tres cosas que ya existen en ese fichero: `paginas`, `meta(ruta)` y `fallar(msg)`.

Orden correcto para retomarlo: **primero** arreglar las 19, **después** añadir el cerrojo,
y comprobarlo por mutación (romper una descripción a propósito y ver el build en rojo). Un
cerrojo que no se ha visto fallar no protege nada.
