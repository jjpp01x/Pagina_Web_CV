# Cerrar los pendientes de la serie «Coursework» — Implementation Plan

> **Para agentes:** SUB-SKILL OBLIGATORIA: `superpowers:subagent-driven-development`
> (recomendada) o `superpowers:executing-plans` para implementar tarea a tarea.
> Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Goal:** Dejar publicables los 32 slots del calendario de LinkedIn que van del 6-sep al
18-nov de 2026: las 4 imágenes que faltan, las memorias universitarias subidas y enlazadas,
y el SEO de los tres artículos nuevos dentro de presupuesto.

**Architecture:** Dos subsistemas en dos repos distintos, cada uno entregable por su cuenta.
La **Parte A** (`~/Projects/Pagina_Web_CV`) toca contenido MDX, PDFs en `public/docs/` y un
cerrojo nuevo en `scripts/postbuild.mjs`; su verificación es `npm run build`, que ya falla
por sí solo cuando algo no cuadra (`fallar()` pone `exitCode`). La **Parte B**
(`~/Projects/linkedin-director-ia`) genera assets PNG desde HTML con Chrome headless y
actualiza dos documentos de plan; su verificación es `render.py` y
`generar-seo-articulos.py --check`.

Se pueden ejecutar por separado y en cualquier orden. La única dependencia entre partes es
que la Parte A publica los PDF que la Parte B menciona en el calendario.

**Tech Stack:** Next.js 16 (`output: export`) + MDX + gray-matter · Node 24 · Biome ·
GitHub Actions → GitHub Pages · Python 3 · LibreOffice (`soffice`) para docx→PDF ·
Chrome headless para HTML→PNG.

---

## Global Constraints

Valores copiados de la fuente real, verificados el 2026-09-05. Aplican a todas las tareas.

- **Formatos de asset:** feed = **1200×1200 px**; portada de artículo = **1200×627 px**.
  Los cuatro assets de esta tarea son posts de feed (tipo `S` en el calendario), así que van
  a **1200×1200**. Los briefs escritos en los borradores dicen «1200x627»: es un error, ese
  es el formato de portada. Los 11 assets de feed que ya existen son 1200×1200.
- **Paleta:** fondo `#0B1524` · acento `#38E1D6` · texto `#F1F5F9` · secundario `#96A7BA` ·
  cajas `#121F33` · bordes `#1E2F49`.
- **Idioma:** del slot 9 en adelante, todo el contenido de LinkedIn va **en inglés**.
- **Meta description:** límite duro **160 caracteres** (lo que corta Google). Horquilla
  editorial 140–160.
- **`<title>`:** presupuesto **65 caracteres** ya contando el descriptor que añade
  `tituloSerp()` en `src/lib/meta.ts:66`.
- **PDFs:** se sirven desde `public/docs/`, con el convenio de nombre
  `memoria-<tema>-<modulo>.pdf` que ya siguen los tres publicados.
- **Despliegue:** en `Pagina_Web_CV`, **un push a `main` publica el sitio**
  (`.github/workflows/deploy.yml`). Todo el trabajo va en rama; el merge a `main` es el acto
  de publicar y necesita visto bueno explícito.
- **Commits:** terminan con `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

### Decisión ya tomada, no re-litigar

Los cuatro documentos universitarios están **en castellano** y los tres artículos están en
inglés. Se publican igualmente en castellano, sin traducir: es exactamente lo que ya se hace
con `memoria-heierling-information-engineering.pdf` y
`memoria-portfolio-web-internet-technology-security.pdf`, que están en castellano y se
enlazan desde las fichas de proyecto en inglés. El enlace lo declara: «(in Spanish)».

### Ya hecho, sin tarea asociada

**Separar formación de experiencia** formaba parte del encargo y no lleva tarea porque está
terminado y en producción desde el commit `f4dd55d` («feat(cv): la experiencia laboral se
separa de formacion»). Verificado el 2026-09-05: las seis URL devuelven 200 —`/experiencia`,
`/en/experience`, `/de/berufserfahrung` con los siete puestos, y `/education`,
`/en/education`, `/de/ausbildung` con titulaciones, certificaciones e idiomas—, y las dos
entradas están en el menú en los tres idiomas.

### Fuera de alcance

- **Slot 24 no lleva documento.** Su pieza habla de `Bank_Churn.xlsx`,
  `kickstarter_projects.xlsx` y `railway.xlsx` con sus diccionarios. Esos ficheros **no
  están en el disco** a fecha 2026-09-05 (buscados en todo `$HOME` menos `Library`), pese a
  que el bloque `## SOURCES` del borrador dice haberlos verificado el 2026-09-03. El slot 24
  solo necesita imagen. Si aparecen los ficheros, se decide entonces.
- **`Data Analysis and Visualization.docx` no vale para el slot 24.** Se comprobó: es
  «Entrevista y encuesta — investigación sobre el mercado de empleo de jóvenes en España»,
  de otro módulo. No tiene relación con la pieza.
- **Los títulos de más de 65 caracteres** (25 artículos del sitio) no se tocan, salvo el del
  slot 40 que sí entra en el plan. `tituloSerp()` está diseñado para ceder ante el título del
  autor; corregirlos en bloque es otra conversación.
- **`x-default` ausente en los tres artículos Coursework** no es un fallo. `meta.ts:104`
  solo lo emite cuando existe versión en castellano, y es deliberado («x-default apunta al
  español, que es la raíz del dominio»). Los tres son EN-only por diseño del calendario.

---

# PARTE A — Sitio web (`~/Projects/Pagina_Web_CV`)

Worktree sugerido: `coursework-seo-y-memorias`.

## File Structure — Parte A

| Fichero | Qué pasa | Responsabilidad |
|---|---|---|
| `src/content/articulos/es/seguridad-web.mdx` | Modificar línea 4 | Descripción heredada >160 |
| `src/content/articulos/es/senal-o-ruido.mdx` | Modificar línea 4 | Descripción heredada >160 |
| `src/content/articulos/de/ki-agenten-halber-fehlschlag.mdx` | Modificar línea 4 | Descripción heredada >160 |
| `src/content/articulos/de/schweiz-eu-ai-act-due-diligence.mdx` | Modificar línea 4 | Descripción heredada >160 |
| `src/content/articulos/en/proving-it-is-not-what-makes-it-happen.mdx` | Modificar líneas 4, 6; insertar tras línea 18 | Artículo slot 10 |
| `src/content/articulos/en/the-feature-that-was-not-in-the-rubric.mdx` | Modificar líneas 4, 6; insertar tras línea 16 | Artículo slot 20 |
| `src/content/articulos/en/where-competitive-advantage-actually-sits.mdx` | Modificar líneas 2, 4, 6; insertar tras línea 14 | Artículo slot 40 |
| `src/content/proyectos/{es,en}/ski-ticketing.mdx` | Añadir campo `memoria:` | Ficha del proyecto |
| `src/content/proyectos/{es,en}/redes-vm.mdx` | Añadir campo `memoria:` | Ficha del proyecto |
| `public/docs/memoria-canfranc-transporte-modal-tfg.pdf` | Crear | Prueba documental slot 10 |
| `public/docs/memoria-ski-ticketing-software-development.pdf` | Crear | Prueba documental slot 20 |
| `public/docs/memoria-dazn-strategic-management.pdf` | Crear | Prueba documental slot 40 |
| `public/docs/memoria-redes-vm-computer-architecture-networks.pdf` | Crear | Prueba documental ficha `redes-vm` |
| `scripts/postbuild.mjs` | Modificar (bloque nuevo al final) | Cerrojo de longitud |

El cerrojo va en `postbuild.mjs` y no en un test aparte porque el repo **no tiene runner de
tests** (`package.json` no declara `test`). `postbuild.mjs` ya es el sitio donde se verifican
invariantes del sitio construido —CNAME, `.nojekyll`, fechas de git— y ya tiene el mecanismo
`fallar()`. Un cerrojo ahí corre en cada `npm run build` y, por tanto, en cada despliegue.

## Orden de las tareas y por qué

El cerrojo (Tarea 3) va **después** de las correcciones, no antes. Motivo: hoy hay **7**
descripciones por encima de 160 caracteres, no 3. Si el cerrojo entra primero, el árbol se
queda en rojo durante dos commits, y el convenio de este setup es que cada commit deje el
árbol verificado. Se conserva la prueba rojo-verde con una **mutación explícita** en la
Tarea 3: se rompe una descripción a mano, se comprueba que el build falla, y se restaura.
Un cerrojo que no se ha visto fallar no protege nada.

---

### Task 1: [Parte A] Recortar las 4 descripciones heredadas de más de 160 caracteres

**Esta tarea se puede descartar entera** si prefieres no tocar artículos ya publicados. Si la
descartas, la Tarea 3 (el cerrojo) tampoco puede entrar, porque seguiría fallando por estos
4 ficheros. Las Tareas 2, 4, 5 y 6 no dependen de ésta.

Las cuatro pasan de largo el corte de Google, así que la frase que cierra el argumento no se
ve en el resultado de búsqueda. Ninguna pierde información al recortarse: lo que se va es
redundante con el título o con el propio texto.

**Files:**
- Modify: `src/content/articulos/es/seguridad-web.mdx:4`
- Modify: `src/content/articulos/es/senal-o-ruido.mdx:4`
- Modify: `src/content/articulos/de/ki-agenten-halber-fehlschlag.mdx:4`
- Modify: `src/content/articulos/de/schweiz-eu-ai-act-due-diligence.mdx:4`

**Interfaces:**
- Consumes: nada.
- Produces: las 4 descripciones quedan ≤160. La Tarea 3 asume que, junto con la Tarea 2,
  ya no queda ninguna descripción por encima del límite.

- [ ] **Step 1: Ver el estado de partida**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  for f in es/seguridad-web es/senal-o-ruido de/ki-agenten-halber-fehlschlag de/schweiz-eu-ai-act-due-diligence; do
    printf '%-40s %s\n' "$f" "$(sed -n '4p' src/content/articulos/$f.mdx | sed 's/^description: "//; s/"$//' | wc -m)"
  done
  ```

  Esperado, exactamente: `179`, `162`, `164`, `163`. Son los 178, 161, 163 y 162 caracteres
  reales más el salto de línea que `wc -m` cuenta.

- [ ] **Step 2: `es/seguridad-web.mdx` — 178 → 154**

  Reemplazar la línea 4 completa por:

  ```yaml
  description: "La falsa confianza: por qué los sistemas no caen por ataques sofisticados. Permisos, SQL injection, contraseñas y cifrado en un análisis de seguridad web."
  ```

  Se va «Análisis de seguridad web por Jose Palacios Beortegui», que además duplica el nombre
  que `tituloSerp()` ya mete en el `<title>`.

- [ ] **Step 3: `es/senal-o-ruido.mdx` — 161 → 152**

  ```yaml
  description: "Cómo separar una tendencia científica real del crecimiento general de la literatura: prueba de permutación sobre 4.113 papers de arXiv en robótica e IA."
  ```

  Se va «y espacio» del final de la enumeración. La cifra 4.113 se conserva.

- [ ] **Step 4: `de/ki-agenten-halber-fehlschlag.mdx` — 163 → 153**

  ```yaml
  description: "Ein Agent, der ganz scheitert, fällt auf. Einer, der halb scheitert, hinterlässt einen Zustand, den niemand entworfen hat. Was Sie vorher fragen sollten."
  ```

  «der auf halbem Weg scheitert» → «der halb scheitert».

- [ ] **Step 5: `de/schweiz-eu-ai-act-due-diligence.mdx` — 162 → 144**

  ```yaml
  description: "Die Schweiz hat den EU AI Act nicht übernommen, doch das stellt ihre Startups nicht ausserhalb: Die Verordnung gilt nach Markt, nicht nach Sitz."
  ```

  «nicht nach Handelsregistereintrag» → «nicht nach Sitz». Mismo significado jurídico,
  18 caracteres menos.

- [ ] **Step 6: Verificar que las cuatro entran**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  python3 -c "
import pathlib, re
for f in ['es/seguridad-web','es/senal-o-ruido','de/ki-agenten-halber-fehlschlag','de/schweiz-eu-ai-act-due-diligence']:
    fm = pathlib.Path(f'src/content/articulos/{f}.mdx').read_text().split('---')[1]
    d = re.search(r'^description:\s*\"(.*)\"', fm, re.M).group(1)
    print(f'{len(d):4d}  {\"OK \" if len(d)<=160 else \"MAL\"}  {f}')
"
  ```

  Esperado: cuatro líneas `OK`, con 154, 152, 153 y 144.

- [ ] **Step 7: Commit**

  ```bash
  git add src/content/articulos/es/seguridad-web.mdx \
          src/content/articulos/es/senal-o-ruido.mdx \
          src/content/articulos/de/ki-agenten-halber-fehlschlag.mdx \
          src/content/articulos/de/schweiz-eu-ai-act-due-diligence.mdx
  git commit -m "fix(seo): las descripciones heredadas caben en el corte de Google

Cuatro articulos pasaban de 160 caracteres, asi que la frase que cierra el
argumento no llegaba a verse en el resultado de busqueda.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 2: [Parte A] Corregir SEO y fechas de los tres artículos «Coursework»

Tres problemas en el mismo sitio: descripciones de 223, 226 y 185 caracteres; un título de
74 caracteres que hace que `tituloSerp()` se rinda y deje la página sin el nombre; y los tres
con `date: "2026-09-04"` cuando sus slots de LinkedIn son 4-sep, **28-sep** y **13-nov**.

La fecha importa por dos motivos: ordena el índice de artículos (`getArticulos()` ordena por
`date` descendente, `src/lib/contenido.ts:72`) y viaja en `publishedTime` del Open Graph. Un
artículo que sale en LinkedIn el 13 de noviembre y dice «4 de septiembre» se lee como
contenido reciclado.

La fecha nueva sale del convenio que ya declara `SEO-LINKEDIN.md`: **el artículo sale en el
dominio 48 horas antes que la versión de LinkedIn**. El slot 10 se queda en `2026-09-04`
aunque sea el mismo día que su slot: ya está publicado y moverlo ahora no arregla nada.

**Files:**
- Modify: `src/content/articulos/en/proving-it-is-not-what-makes-it-happen.mdx:4`
- Modify: `src/content/articulos/en/the-feature-that-was-not-in-the-rubric.mdx:4,6`
- Modify: `src/content/articulos/en/where-competitive-advantage-actually-sits.mdx:2,4,6`

**Interfaces:**
- Consumes: nada.
- Produces: las 3 descripciones quedan en 147, 150 y 147 caracteres; el `<title>` del slot 40
  pasa de 74 a 41 caracteres propios (57 tras el descriptor). La Tarea 3 lo asume.

- [ ] **Step 1: `proving-it-is-not-what-makes-it-happen.mdx` — descripción 223 → 147**

  Reemplazar la línea 4 completa por:

  ```yaml
  description: "A thesis proved that rail beats lorries on emissions through the Pyrenees. The hauliers surveyed agreed, then refused to trade transit time for it."
  ```

  Conserva las dos cosas que el artículo demuestra —que la aritmética salía y que aun así no
  se adoptaría— y suelta el rodeo sobre el corredor, que ya está en el cuerpo.

- [ ] **Step 2: `the-feature-that-was-not-in-the-rubric.mdx` — descripción 226 → 150**

  ```yaml
  description: "A coursework ticketing system in C and Python asked for sessions, passes and persistence. The part worth writing about is the audit log nobody graded."
  ```

- [ ] **Step 3: `the-feature-that-was-not-in-the-rubric.mdx` — fecha**

  Línea 6, de `date: "2026-09-04"` a:

  ```yaml
  date: "2026-09-26"
  ```

  48 horas antes de su slot (28-sep). No colisiona con ninguna otra fecha del sitio; la más
  cercana es `limitations-inside-the-product` el 2026-09-25.

- [ ] **Step 4: `where-competitive-advantage-actually-sits.mdx` — título 74 → 41**

  Línea 2, de
  `title: "Where competitive advantage actually sits, and where everyone looks for it"` a:

  ```yaml
  title: "Where competitive advantage actually sits"
  ```

  Con 74 caracteres, `tituloSerp()` agota los tres candidatos y devuelve el título pelado, sin
  nombre. Con 41 entra el candidato `"… · José Palacios"` y el `<title>` sale a 57. La segunda
  mitad («and where everyone looks for it») no se pierde: es literalmente el argumento de la
  última frase del artículo.

- [ ] **Step 5: `where-competitive-advantage-actually-sits.mdx` — descripción 185 → 147**

  ```yaml
  description: "A strategy module asked for a five forces analysis of DAZN. The toolkit pointed away from the product and towards who owns the broadcasting rights."
  ```

- [ ] **Step 6: `where-competitive-advantage-actually-sits.mdx` — fecha**

  Línea 6, de `date: "2026-09-04"` a:

  ```yaml
  date: "2026-11-11"
  ```

  48 horas antes de su slot (13-nov).

- [ ] **Step 7: Verificar longitudes y el título que verá Google**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  python3 -c "
import pathlib, re
LIM = 65
def serp(t):
    if 'Palacios' in t: return t
    for c in [f'{t} · Article by José Palacios Beortegui', f'{t} · Article by José Palacios', f'{t} · José Palacios']:
        if len(c) <= LIM: return c
    return t
for f in ['proving-it-is-not-what-makes-it-happen','the-feature-that-was-not-in-the-rubric','where-competitive-advantage-actually-sits']:
    fm = pathlib.Path(f'src/content/articulos/en/{f}.mdx').read_text().split('---')[1]
    g = lambda k: re.search(rf'^{k}:\s*\"(.*)\"', fm, re.M).group(1)
    t, d, dt = serp(g('title')), g('description'), g('date')
    print(f'{dt}  title {len(t):3d} {\"OK \" if len(t)<=LIM else \"MAL\"}  desc {len(d):3d} {\"OK \" if 140<=len(d)<=160 else \"MAL\"}  {f}')
"
  ```

  Esperado, exactamente:

  ```
  2026-09-04  title  59 OK   desc 147 OK   proving-it-is-not-what-makes-it-happen
  2026-09-26  title  65 OK   desc 150 OK   the-feature-that-was-not-in-the-rubric
  2026-11-11  title  57 OK   desc 147 OK   where-competitive-advantage-actually-sits
  ```

- [ ] **Step 8: Commit**

  ```bash
  git add src/content/articulos/en/proving-it-is-not-what-makes-it-happen.mdx \
          src/content/articulos/en/the-feature-that-was-not-in-the-rubric.mdx \
          src/content/articulos/en/where-competitive-advantage-actually-sits.mdx
  git commit -m "fix(coursework): descripciones dentro del corte, y la fecha del slot real

Las tres descripciones pasaban de 160 caracteres. El titulo de DAZN llegaba a
74 y dejaba a la pagina sin nombre en el <title>. Y los tres declaraban el
4-sep cuando sus slots son 4-sep, 28-sep y 13-nov.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 3: [Parte A] Cerrojo de longitud de description en el build

Sin esto, la Tarea 1 y la Tarea 2 son un arreglo puntual que se vuelve a romper con el
próximo artículo. El cerrojo lee el HTML **servido**, no el `.mdx`, para que compruebe lo que
de verdad va a ver Google.

Es un límite superior, no una horquilla: el mínimo de 140 es criterio editorial y vive en
`SEO-ARTICULOS.md`. Aquí se bloquea solo lo que se pierde de verdad.

**Files:**
- Modify: `scripts/postbuild.mjs` (bloque nuevo tras la generación de `llms.txt`)

**Interfaces:**
- Consumes: `paginas` (array de rutas relativas a `out/`) y `meta(rutaRelativa)`, ambas ya
  definidas en `postbuild.mjs` para generar `llms.txt`. `meta()` devuelve
  `{ titulo: string, descripcion: string }` con las entidades HTML ya deshechas.
  También `fallar(mensaje)`, que escribe en stderr y pone `process.exitCode = 1`.
- Produces: `npm run build` termina con código distinto de cero si alguna página servida
  declara una `description` de más de 160 caracteres.

- [ ] **Step 1: Escribir el cerrojo**

  En `scripts/postbuild.mjs`, **después** del bloque que escribe `out/llms.txt` y **antes**
  de las dos últimas líneas (`if (process.exitCode) …`), insertar:

  ```js
  // --- Longitud de la meta description -------------------------------------
  //
  // Google corta la descripcion alrededor de los 160 caracteres. Pasarse no
  // rompe la pagina, pero deja fuera la frase que cierra el argumento, que es
  // justo la que decide si alguien hace clic.
  //
  // Se lee del HTML servido y no del .mdx a proposito: lo que importa es lo que
  // acaba en produccion, no lo que declara la fuente.
  //
  // El limite es superior, no una horquilla. El minimo de 140 es criterio
  // editorial y vive en SEO-ARTICULOS.md; aqui solo se bloquea lo que se pierde.

  const LIMITE_DESCRIPCION = 160;

  const largas = paginas
    .map((r) => ({ ruta: r, descripcion: meta(r).descripcion }))
    .filter((p) => p.descripcion.length > LIMITE_DESCRIPCION);

  for (const { ruta, descripcion } of largas) {
    fallar(
      `/${ruta}: description de ${descripcion.length} caracteres, el limite es ${LIMITE_DESCRIPCION}`,
    );
  }

  if (largas.length === 0) {
    console.log(
      `postbuild: ${paginas.length} descripciones dentro de ${LIMITE_DESCRIPCION} caracteres`,
    );
  }
  ```

- [ ] **Step 2: Comprobar que el build pasa**

  ```bash
  cd ~/Projects/Pagina_Web_CV && npm run build 2>&1 | tail -8
  ```

  Esperado: una línea `postbuild: 85 descripciones dentro de 160 caracteres` (85 es el número
  de URLs a 2026-09-05; sube al añadir páginas) y `postbuild: ok`. Si aquí falla, es que la
  Tarea 1 o la Tarea 2 no están hechas: el mensaje dice qué ruta y cuántos caracteres.

- [ ] **Step 3: Romper una descripción a mano y ver el cerrojo en rojo**

  Un cerrojo que no se ha visto fallar no protege nada. Se rompe la más corta para que el
  fallo sea inequívoco:

  ```bash
  cd ~/Projects/Pagina_Web_CV
  python3 - <<'PY'
import pathlib
p = pathlib.Path("src/content/articulos/de/schweiz-eu-ai-act-due-diligence.mdx")
t = p.read_text()
viejo = 'nicht nach Sitz."'
p.write_text(t.replace(viejo, 'nicht nach Sitz und auch nicht nach Handelsregistereintrag des Unternehmens."'))
PY
  npm run build 2>&1 | grep -E "postbuild:" | tail -5
  ```

  Esperado: una línea
  `postbuild: /de/artikel/schweiz-eu-ai-act-due-diligence.html: description de 204 caracteres, el limite es 160`
  y `postbuild: terminado CON ERRORES`.

- [ ] **Step 4: Confirmar que el build devolvió código de error**

  ```bash
  cd ~/Projects/Pagina_Web_CV && npm run build >/dev/null 2>&1; echo "exit=$?"
  ```

  Esperado: `exit=1`. Si sale `exit=0`, el cerrojo no bloquea nada y no sirve: revisar que el
  bloque se insertó **antes** de las líneas finales que leen `process.exitCode`.

- [ ] **Step 5: Restaurar y confirmar el verde**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  git checkout -- src/content/articulos/de/schweiz-eu-ai-act-due-diligence.mdx
  npm run build >/dev/null 2>&1; echo "exit=$?"
  ```

  Esperado: `exit=0`.

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/postbuild.mjs
  git commit -m "feat(seo): el build falla si una description pasa de 160 caracteres

Se lee del HTML servido, no del .mdx: lo que importa es lo que acaba en
produccion. Verificado por mutacion: alargar una descripcion a 204 hace que
npm run build salga con exit=1.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 4: [Parte A] Convertir y publicar las cuatro memorias universitarias

Los originales están en `~/Documents/Universidad-trabajos/`, que **no es un repo**: son la
fuente, y el PDF servido es una copia derivada. `soffice` está en `/opt/homebrew/bin/soffice`.

Datos ya verificados de cada documento (conversión de prueba hecha el 2026-09-05):

| Origen | Destino en `public/docs/` | Páginas | Entregado |
|---|---|---|---|
| `BA Business Management (CESTE) — Proyecto final de grado/TFG — Canfranc, transporte modal.docx` | `memoria-canfranc-transporte-modal-tfg.pdf` | 60 | 25/07/2025 |
| `BSc Applied Computing (UWTSD) — Level 4 2025-26/Software Development.docx` | `memoria-ski-ticketing-software-development.pdf` | 31 | 10/12/2025 |
| `BA Business Management — CESTE 4º 2024-25/Strategic Management — DAZN.docx` | `memoria-dazn-strategic-management.pdf` | 8 | 05/06/2025 |
| `BSc Applied Computing (UWTSD) — Level 4 2025-26/Computer Architecture and Networks.pdf` | `memoria-redes-vm-computer-architecture-networks.pdf` | — | ya es PDF, solo se copia |

**Files:**
- Create: `public/docs/memoria-canfranc-transporte-modal-tfg.pdf`
- Create: `public/docs/memoria-ski-ticketing-software-development.pdf`
- Create: `public/docs/memoria-dazn-strategic-management.pdf`
- Create: `public/docs/memoria-redes-vm-computer-architecture-networks.pdf`

**Interfaces:**
- Consumes: nada del código.
- Produces: cuatro rutas `/docs/memoria-*.pdf` servibles. Las Tareas 5 y 6 enlazan estas
  rutas exactas.

- [ ] **Step 1: PARADA — verificar la autoría de `Software Development.docx`**

  La portada de ese documento lista, en este orden: «Software Development», «Jorge Garrido»,
  «Francisco Javier Puig», los nombres de fichero, y luego «José Palacios Boertegui». Los
  otros tres documentos no llevan nombres ajenos.

  ```bash
  pandoc -t plain ~/Documents/Universidad-trabajos/"BSc Applied Computing (UWTSD) — Level 4 2025-26/Software Development.docx" 2>/dev/null | sed -n '1,12p'
  ```

  **Preguntar antes de seguir:** ¿Jorge Garrido y Francisco Javier Puig son los profesores del
  módulo o coautores del trabajo? Si son coautores, este PDF **no se publica** sin su
  permiso, y el artículo del slot 20 —que está escrito en primera persona del singular— hay
  que revisarlo. Si son los profesores, seguir con normalidad.

  Nota menor: la portada pone «Boertegui» donde debería decir «Beortegui». No se corrige: el
  PDF es la entrega tal cual se hizo, y retocarla la convierte en otra cosa.

- [ ] **Step 2: Convertir los tres `.docx` a PDF**

  ```bash
  cd ~/Documents/Universidad-trabajos
  DEST=~/Projects/Pagina_Web_CV/public/docs
  soffice --headless --convert-to pdf --outdir "$DEST" "BA Business Management (CESTE) — Proyecto final de grado/TFG — Canfranc, transporte modal.docx"
  soffice --headless --convert-to pdf --outdir "$DEST" "BSc Applied Computing (UWTSD) — Level 4 2025-26/Software Development.docx"
  soffice --headless --convert-to pdf --outdir "$DEST" "BA Business Management — CESTE 4º 2024-25/Strategic Management — DAZN.docx"
  ```

- [ ] **Step 3: Renombrar al convenio del sitio y copiar el que ya era PDF**

  ```bash
  cd ~/Projects/Pagina_Web_CV/public/docs
  mv "TFG — Canfranc, transporte modal.pdf"  memoria-canfranc-transporte-modal-tfg.pdf
  mv "Software Development.pdf"              memoria-ski-ticketing-software-development.pdf
  mv "Strategic Management — DAZN.pdf"       memoria-dazn-strategic-management.pdf
  cp ~/Documents/Universidad-trabajos/"BSc Applied Computing (UWTSD) — Level 4 2025-26/Computer Architecture and Networks.pdf" \
     memoria-redes-vm-computer-architecture-networks.pdf
  ```

- [ ] **Step 4: Verificar que los cuatro existen y tienen las páginas esperadas**

  ```bash
  cd ~/Projects/Pagina_Web_CV/public/docs
  python3 -c "
import re, pathlib
esperado = {'memoria-canfranc-transporte-modal-tfg.pdf': 60,
            'memoria-ski-ticketing-software-development.pdf': 31,
            'memoria-dazn-strategic-management.pdf': 8}
for f in sorted(pathlib.Path('.').glob('memoria-*.pdf')):
    d = f.read_bytes()
    n = len(re.findall(rb'/Type\s*/Page[^s]', d))
    e = esperado.get(f.name)
    print(f'{n:4d} pag  {len(d)//1024:5d} KB  {\"OK \" if e is None or n==e else \"REVISAR\"}  {f.name}')
"
  ```

  Esperado: siete ficheros `memoria-*.pdf` en total (los 3 que ya había + los 4 nuevos), y
  los tres con recuento esperado marcados `OK` con 60, 31 y 8 páginas.

- [ ] **Step 5: Abrir uno y mirarlo de verdad**

  ```bash
  open ~/Projects/Pagina_Web_CV/public/docs/memoria-canfranc-transporte-modal-tfg.pdf
  ```

  LibreOffice reflowea documentos de Word: tablas que se parten, imágenes desplazadas, saltos
  de página en sitios raros. Comprobar portada, índice y un par de tablas. Si el resultado no
  es presentable, exportar a PDF desde Microsoft Word (está instalado) en vez de `soffice`.

- [ ] **Step 6: Commit**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  git add public/docs/memoria-canfranc-transporte-modal-tfg.pdf \
          public/docs/memoria-ski-ticketing-software-development.pdf \
          public/docs/memoria-dazn-strategic-management.pdf \
          public/docs/memoria-redes-vm-computer-architecture-networks.pdf
  git commit -m "feat(docs): las cuatro memorias universitarias que faltaban

TFG de Canfranc (60 pag), Software Development (31), DAZN (8) y Computer
Architecture and Networks. Convertidas con soffice desde los originales de
~/Documents/Universidad-trabajos, que siguen siendo la fuente.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 5: [Parte A] Enlazar las memorias desde los tres artículos «Coursework»

Ahora mismo los tres artículos **no tienen un solo enlace**: ni al PDF, ni al repo, ni a su
ficha de proyecto. Son los tres únicos artículos del sitio en esa situación.

El patrón está fijado por `src/content/articulos/es/seguridad-web.mdx:16`: párrafo propio,
después de la introducción y **antes** del primer apartado, nunca al final. Los tres artículos
cierran con una frase de remate y meter un enlace detrás la desactiva.

**Files:**
- Modify: `src/content/articulos/en/proving-it-is-not-what-makes-it-happen.mdx` (insertar tras línea 18)
- Modify: `src/content/articulos/en/the-feature-that-was-not-in-the-rubric.mdx` (insertar tras línea 16)
- Modify: `src/content/articulos/en/where-competitive-advantage-actually-sits.mdx` (insertar tras línea 14)

**Interfaces:**
- Consumes: las rutas `/docs/memoria-canfranc-transporte-modal-tfg.pdf`,
  `/docs/memoria-ski-ticketing-software-development.pdf` y
  `/docs/memoria-dazn-strategic-management.pdf` que crea la Tarea 4.
- Produces: nada que consuma otra tarea.

- [ ] **Step 1: Slot 10 — Canfranc**

  En `proving-it-is-not-what-makes-it-happen.mdx`, tras la línea 18 (la que termina en
  «…point exactly where you would expect them to point.») y antes de la línea en blanco que
  precede a «The part that taught me something…», insertar como párrafo propio:

  ```markdown
  The full thesis, as submitted for my Business Management degree, is available in PDF (in Spanish): [Análisis del transporte ferroviario como alternativa sostenible al tráfico pesado en los Pirineos](/docs/memoria-canfranc-transporte-modal-tfg.pdf) — 60 pages, July 2025.
  ```

- [ ] **Step 2: Slot 20 — sistema de ticketing**

  En `the-feature-that-was-not-in-the-rubric.mdx`, tras la línea 16 (la que termina en
  «…plus a separate export of the audit trail.») y antes de «Nobody was grading the audit
  log.», insertar:

  ```markdown
  The coursework report, as submitted for the *Software Development* module, is available in PDF (in Spanish): [Sistema de Ticketing — Sunrise Ski Session (Davos Parsenn)](/docs/memoria-ski-ticketing-software-development.pdf) — 31 pages, December 2025.
  ```

- [ ] **Step 3: Slot 40 — DAZN**

  En `where-competitive-advantage-actually-sits.mdx`, tras la línea 14 (la que termina en
  «…and it is what the company markets.») y antes de «The five forces analysis kept pulling
  me somewhere else.», insertar:

  ```markdown
  The full analysis, as submitted for the *Strategic Management and Sustainability* module, is available in PDF (in Spanish): [Análisis estratégico de DAZN](/docs/memoria-dazn-strategic-management.pdf) — 8 pages, June 2025.
  ```

- [ ] **Step 4: Verificar que los enlaces existen y apuntan a ficheros reales**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  python3 -c "
import pathlib, re
for f in ['proving-it-is-not-what-makes-it-happen','the-feature-that-was-not-in-the-rubric','where-competitive-advantage-actually-sits']:
    txt = pathlib.Path(f'src/content/articulos/en/{f}.mdx').read_text()
    enlaces = re.findall(r'\]\((/docs/[^)]+)\)', txt)
    if not enlaces:
        print(f'MAL  {f}: sin enlace a /docs/'); continue
    for e in enlaces:
        existe = pathlib.Path('public' + e).exists()
        print(f'{\"OK \" if existe else \"ROTO\"}  {f}  ->  {e}')
"
  ```

  Esperado: tres líneas `OK`, una por artículo.

- [ ] **Step 5: Reconstruir y comprobar que el enlace sale en el HTML servido**

  ```bash
  cd ~/Projects/Pagina_Web_CV && npm run build >/dev/null 2>&1 && \
  grep -c "memoria-canfranc-transporte-modal-tfg.pdf" out/en/articles/proving-it-is-not-what-makes-it-happen.html
  ```

  Esperado: `1`. Si sale `0`, el párrafo quedó dentro de otro bloque y MDX no lo renderizó
  como enlace.

- [ ] **Step 6: Commit**

  ```bash
  git add src/content/articulos/en/proving-it-is-not-what-makes-it-happen.mdx \
          src/content/articulos/en/the-feature-that-was-not-in-the-rubric.mdx \
          src/content/articulos/en/where-competitive-advantage-actually-sits.mdx
  git commit -m "feat(coursework): cada articulo enlaza el trabajo que lo respalda

Eran los tres unicos articulos del sitio sin ningun enlace. El PDF va tras la
introduccion y no al final, como en seguridad-web.mdx: los tres cierran con una
frase de remate y un enlace detras la desactiva.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 6: [Parte A] Campo `memoria:` en las fichas `ski-ticketing` y `redes-vm`

El mecanismo ya existe y no hay que construir nada: `Proyecto.memoria` está declarado en
`src/lib/contenido.ts:47` y `src/components/paginas.tsx:348` pinta un `<Button>` con el texto
`textos.verMemoria` cuando el campo está presente. Las fichas `heierling` y `portfolio` ya lo
usan. `ski-ticketing` y `redes-vm` son trabajo universitario con memoria entregada y no lo
tienen.

Las traducciones del botón ya están, no hay que tocarlas: `src/content/textos.ts:252` («Ver
la memoria (PDF)»), `:444` («View the report (PDF)») y `:636` («Bericht ansehen (PDF)»).

**Files:**
- Modify: `src/content/proyectos/es/ski-ticketing.mdx` (frontmatter)
- Modify: `src/content/proyectos/en/ski-ticketing.mdx` (frontmatter)
- Modify: `src/content/proyectos/es/redes-vm.mdx` (frontmatter)
- Modify: `src/content/proyectos/en/redes-vm.mdx` (frontmatter)

**Interfaces:**
- Consumes: `/docs/memoria-ski-ticketing-software-development.pdf` y
  `/docs/memoria-redes-vm-computer-architecture-networks.pdf` de la Tarea 4.
- Produces: nada que consuma otra tarea.

- [ ] **Step 1: Añadir el campo a las dos fichas de `ski-ticketing`**

  En `src/content/proyectos/es/ski-ticketing.mdx` y en `src/content/proyectos/en/ski-ticketing.mdx`,
  insertar esta línea en el frontmatter **justo después** de la línea `repo:`, que es la
  posición que ocupa en `heierling.mdx:9`:

  ```yaml
  memoria: "/docs/memoria-ski-ticketing-software-development.pdf"
  ```

- [ ] **Step 2: Añadir el campo a las dos fichas de `redes-vm`**

  Igual, en `src/content/proyectos/es/redes-vm.mdx` y `src/content/proyectos/en/redes-vm.mdx`,
  después de `repo:`:

  ```yaml
  memoria: "/docs/memoria-redes-vm-computer-architecture-networks.pdf"
  ```

- [ ] **Step 3: Verificar que los cuatro campos apuntan a ficheros que existen**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  python3 -c "
import pathlib, re
for lang in ['es','en']:
    for p in ['ski-ticketing','redes-vm','heierling','portfolio']:
        fm = pathlib.Path(f'src/content/proyectos/{lang}/{p}.mdx').read_text().split('---')[1]
        m = re.search(r'^memoria:\s*\"(.*)\"', fm, re.M)
        if not m: print(f'MAL   {lang}/{p}: sin campo memoria'); continue
        ok = pathlib.Path('public' + m.group(1)).exists()
        print(f'{\"OK \" if ok else \"ROTO\"}  {lang}/{p}  ->  {m.group(1)}')
"
  ```

  Esperado: ocho líneas `OK`.

- [ ] **Step 4: Comprobar que el botón aparece en el HTML servido**

  ```bash
  cd ~/Projects/Pagina_Web_CV && npm run build >/dev/null 2>&1 && \
  for f in out/proyectos/ski-ticketing.html out/proyectos/redes-vm.html \
           out/en/projects/ski-ticketing.html out/en/projects/redes-vm.html; do
    printf '%-42s %s\n' "$(basename $f)" "$(grep -c 'memoria-' $f)"
  done
  ```

  Esperado: `1` en las cuatro líneas.

- [ ] **Step 5: Commit**

  ```bash
  git add src/content/proyectos/es/ski-ticketing.mdx src/content/proyectos/en/ski-ticketing.mdx \
          src/content/proyectos/es/redes-vm.mdx src/content/proyectos/en/redes-vm.mdx
  git commit -m "feat(proyectos): ski-ticketing y redes-vm enlazan su memoria

Las dos son trabajo universitario con memoria entregada y eran las unicas
fichas academicas sin el campo. El mecanismo ya estaba: contenido.ts lo declara
y paginas.tsx pinta el boton.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 7: [Parte A] Verificar en producción tras el despliegue

**Requiere visto bueno explícito antes de empezar:** el paso 1 publica el sitio. Todo lo
anterior es reversible sin que lo vea nadie; esto no.

**Files:** ninguno.

**Interfaces:**
- Consumes: todo lo anterior de la Parte A.
- Produces: nada.

- [ ] **Step 1: Merge a `main` y esperar al workflow**

  ```bash
  cd ~/Projects/Pagina_Web_CV
  git checkout main && git merge --no-ff coursework-seo-y-memorias
  git push origin main
  gh run watch
  ```

  Esperado: el workflow «Desplegar en GitHub Pages» termina en verde.

- [ ] **Step 2: Comprobar los cuatro PDF nuevos en el dominio**

  La caché de GitHub Pages es de `max-age=600`, así que puede hacer falta esperar unos
  minutos o forzar con `Cache-Control: no-cache`.

  ```bash
  for d in memoria-canfranc-transporte-modal-tfg memoria-ski-ticketing-software-development \
           memoria-dazn-strategic-management memoria-redes-vm-computer-architecture-networks; do
    printf '%s  %s\n' "$(curl -s -o /dev/null -w '%{http_code} %{content_type}' -H 'Cache-Control: no-cache' https://josepalacios.site/docs/$d.pdf)" "$d"
  done
  ```

  Esperado: `200 application/pdf` en las cuatro.

- [ ] **Step 3: Comprobar que la descripción servida es la nueva**

  ```bash
  for u in en/articles/proving-it-is-not-what-makes-it-happen \
           en/articles/the-feature-that-was-not-in-the-rubric \
           en/articles/where-competitive-advantage-actually-sits; do
    curl -s -H 'Cache-Control: no-cache' "https://josepalacios.site/$u.html" \
      | python3 -c "
import sys, re, html
s = sys.stdin.read()
d = re.search(r'<meta name=\"description\" content=\"(.*?)\"', s, re.S)
t = re.search(r'<title>(.*?)</title>', s, re.S)
d = html.unescape(d.group(1)) if d else ''
t = html.unescape(t.group(1)) if t else ''
print(f'title {len(t):3d}  desc {len(d):3d}  {\"OK\" if len(d)<=160 and len(t)<=65 else \"MAL\"}')
"
  done
  ```

  Esperado: `desc 147`, `desc 150`, `desc 147`, las tres `OK`.

- [ ] **Step 4: Pedir reindexación en Search Console**

  Manual, en `https://search.google.com/search-console`. Inspeccionar y solicitar indexación
  de las tres URL de artículo. Las fechas del `sitemap.xml` salen de git
  (`postbuild.mjs`), así que el `<lastmod>` ya refleja el cambio y no hace falta tocarlo.

---

# PARTE B — Assets y calendario (`~/Projects/linkedin-director-ia`)

Worktree sugerido: `assets-coursework-pendientes`.

Independiente de la Parte A. Se puede ejecutar antes, después o en paralelo.

## File Structure — Parte B

| Fichero | Qué pasa | Responsabilidad |
|---|---|---|
| `07-assets-fuente/en/11-reserved-is-a-place.html` | Crear | Fuente del asset slot 11 |
| `07-assets-fuente/en/24-read-the-dictionary-first.html` | Crear | Fuente del asset slot 24 |
| `07-assets-fuente/en/31-this-site-was-coursework.html` | Crear | Fuente del asset slot 31 |
| `07-assets-fuente/en/41-two-degrees-one-bridge.html` | Crear | Fuente del asset slot 41 |
| `07-assets-fuente/render.py` | Modificar (`MAPA`, líneas 76-79) | Slot → destino del PNG |
| `03-plan-contenido/CALENDARIO-MAESTRO.md` | Modificar (tabla + nota del 03-sep) | Secuencia |
| `03-plan-contenido/SEO-ARTICULOS.md` | Regenerar | Se genera, no se escribe |

Los PNG **no van al repo**: `render.py` los escribe en
`~/Desktop/Documentos/LinkedIn - Multimedia EN/`, que es de donde se suben a LinkedIn.

---

### Task 8: [Parte B] Los cuatro assets HTML que faltan

Cada uno reutiliza la hoja de estilo de un asset de feed ya existente. No hay que reinventar
la paleta ni las medidas: se copia el bloque `<style>` íntegro de
`07-assets-fuente/en/23-who-is-accountable.html` (1200×1200, ya con `.header`, `.eyebrow`,
`.title`, `.footer`, `.monogram`, `.stack` y `.s-card`) y se cambia solo el `<body>` y las
reglas extra que se indican.

**Files:**
- Create: `07-assets-fuente/en/11-reserved-is-a-place.html`
- Create: `07-assets-fuente/en/24-read-the-dictionary-first.html`
- Create: `07-assets-fuente/en/31-this-site-was-coursework.html`
- Create: `07-assets-fuente/en/41-two-degrees-one-bridge.html`

**Interfaces:**
- Consumes: el bloque `<style>` de `23-who-is-accountable.html`.
- Produces: cuatro ficheros HTML con `body { width: 1200px; height: 1200px; }`. La Tarea 9
  los registra en `render.py` por estos nombres exactos, sin extensión.

- [ ] **Step 1: Slot 11 — «reserved is a place, not a flag»**

  Copiar `23-who-is-accountable.html` entero a `11-reserved-is-a-place.html`. Su estructura
  `.stack` con tres `.s-card` y una `.active` es exactamente el brief. Sustituir el `<body>`
  por:

  ```html
  <body>
    <div class="header">
      <div class="eyebrow-container"><div class="eyebrow-bar"></div><div class="eyebrow">POST · COURSEWORK 2/7</div></div>
      <h1 class="title">Reserved is a place, not a flag</h1>
    </div>
    <div class="stack">
      <div class="s-card">WAREHOUSE</div>
      <div class="s-card">SHOP FLOOR</div>
      <div class="s-card active">
        RESERVED
        <div class="s-sub">two of these are places. So is the third.</div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left"><div class="monogram">JP</div>Jose Palacios <span>· Deep Tech Analyst</span></div>
      <div class="footer-right">github.com/jjpp01x</div>
    </div>
  </body>
  ```

- [ ] **Step 2: Slot 24 — «three datasets, three dictionaries»**

  Crear `24-read-the-dictionary-first.html` con el mismo `<style>`, más estas reglas al final
  del bloque:

  ```css
  .files { display: flex; flex-direction: column; gap: 40px; margin: 100px 0; z-index: 2; }
  .file { background-color: #121F33; border: 1px solid #1E2F49; border-radius: 8px; padding: 56px 60px; font-family: "SF Mono", "DejaVu Sans Mono", Menlo, monospace; font-size: 44px; color: #96A7BA; opacity: 0.55; }
  .file.active { border: 2px solid #38E1D6; border-left: 6px solid #38E1D6; color: #38E1D6; opacity: 1; }
  .file-note { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 34px; color: #96A7BA; margin-top: 20px; }
  ```

  Y el `<body>`:

  ```html
  <body>
    <div class="header">
      <div class="eyebrow-container"><div class="eyebrow-bar"></div><div class="eyebrow">POST · COURSEWORK 4/7</div></div>
      <h1 class="title">Read the dictionary first</h1>
    </div>
    <div class="files">
      <div class="file">railway.xlsx</div>
      <div class="file active">
        railway_data_dictionary.xlsx
        <div class="file-note">the second file is the one that tells you what the first one means</div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left"><div class="monogram">JP</div>Jose Palacios <span>· Deep Tech Analyst</span></div>
      <div class="footer-right">github.com/jjpp01x</div>
    </div>
  </body>
  ```

- [ ] **Step 3: Slot 31 — «this website started as coursework»**

  Crear `31-this-site-was-coursework.html` con el mismo `<style>`, más:

  ```css
  .compare { display: flex; align-items: center; gap: 40px; margin: 100px 0; z-index: 2; }
  .side { flex: 1; background-color: #121F33; border: 1px solid #1E2F49; border-radius: 8px; padding: 48px; }
  .side.active { border: 2px solid #38E1D6; }
  .side-label { font-family: "SF Mono", "DejaVu Sans Mono", Menlo, monospace; font-size: 30px; color: #38E1D6; letter-spacing: 0.1em; margin-bottom: 26px; }
  .side-item { font-family: "SF Mono", "DejaVu Sans Mono", Menlo, monospace; font-size: 40px; color: #F1F5F9; line-height: 1.7; }
  .arrow { font-size: 56px; color: #38E1D6; }
  .caption { font-size: 34px; color: #96A7BA; text-align: center; z-index: 2; }
  ```

  Y el `<body>`:

  ```html
  <body>
    <div class="header">
      <div class="eyebrow-container"><div class="eyebrow-bar"></div><div class="eyebrow">POST · COURSEWORK 5/7</div></div>
      <h1 class="title">This website started as coursework</h1>
    </div>
    <div class="compare">
      <div class="side">
        <div class="side-label">APR 2026</div>
        <div class="side-item">translations.js</div>
      </div>
      <div class="arrow">→</div>
      <div class="side active">
        <div class="side-label">AUG 2026</div>
        <div class="side-item">/es &nbsp; hreflang<br>/en &nbsp; hreflang<br>/de &nbsp; hreflang</div>
      </div>
    </div>
    <div class="caption">same repository, five months apart</div>
    <div class="footer">
      <div class="footer-left"><div class="monogram">JP</div>Jose Palacios <span>· Deep Tech Analyst</span></div>
      <div class="footer-right">github.com/jjpp01x</div>
    </div>
  </body>
  ```

- [ ] **Step 4: Slot 41 — «six projects, one habit» (cierre de serie)**

  Crear `41-two-degrees-one-bridge.html` con el mismo `<style>`, más:

  ```css
  .rows { display: flex; flex-direction: column; gap: 22px; margin: 70px 0; z-index: 2; }
  .row { display: flex; align-items: baseline; gap: 18px; font-size: 30px; line-height: 1.3; }
  .row .was { color: #96A7BA; flex: 1; text-align: right; }
  .row .arrow { color: #38E1D6; font-size: 26px; }
  .row .is { color: #38E1D6; flex: 1; font-weight: 700; }
  ```

  Y el `<body>` con las seis piezas de la serie, en orden de slot (10, 11, 20, 24, 31, 40):

  ```html
  <body>
    <div class="header">
      <div class="eyebrow-container"><div class="eyebrow-bar"></div><div class="eyebrow">POST · COURSEWORK 7/7</div></div>
      <h1 class="title">Six projects, one habit</h1>
    </div>
    <div class="rows">
      <div class="row"><span class="was">supposed to be about emissions</span><span class="arrow">→</span><span class="is">was about adoption</span></div>
      <div class="row"><span class="was">supposed to be about inventory</span><span class="arrow">→</span><span class="is">was about naming</span></div>
      <div class="row"><span class="was">supposed to be about ticketing</span><span class="arrow">→</span><span class="is">was about evidence</span></div>
      <div class="row"><span class="was">supposed to be about datasets</span><span class="arrow">→</span><span class="is">was about definitions</span></div>
      <div class="row"><span class="was">supposed to be about a website</span><span class="arrow">→</span><span class="is">was about maintenance</span></div>
      <div class="row"><span class="was">supposed to be about streaming</span><span class="arrow">→</span><span class="is">was about rights</span></div>
    </div>
    <div class="footer">
      <div class="footer-left"><div class="monogram">JP</div>Jose Palacios <span>· Deep Tech Analyst</span></div>
      <div class="footer-right">github.com/jjpp01x</div>
    </div>
  </body>
  ```

  El brief ofrecía la alternativa de un carrusel de 6 slides. Se hace en una sola imagen: seis
  filas caben de sobra en 1200×1200, y un carrusel obliga a deslizar para llegar al remate de
  una serie de siete piezas.

- [ ] **Step 5: Verificar que los cuatro declaran el lienzo de feed**

  ```bash
  cd ~/Projects/linkedin-director-ia/07-assets-fuente/en
  for f in 11-reserved-is-a-place 24-read-the-dictionary-first 31-this-site-was-coursework 41-two-degrees-one-bridge; do
    printf '%-34s %s\n' "$f" "$(grep -oE 'width: [0-9]+px|height: [0-9]+px' $f.html | head -2 | tr '\n' ' ')"
  done
  ```

  Esperado: `width: 1200px height: 1200px` en los cuatro. Si alguno sale 627, es el formato de
  portada y `render.py` generará un PNG con la proporción equivocada.

- [ ] **Step 6: Commit**

  ```bash
  cd ~/Projects/linkedin-director-ia
  git add 07-assets-fuente/en/11-reserved-is-a-place.html \
          07-assets-fuente/en/24-read-the-dictionary-first.html \
          07-assets-fuente/en/31-this-site-was-coursework.html \
          07-assets-fuente/en/41-two-degrees-one-bridge.html
  git commit -m "feat(assets): las cuatro fuentes de los posts de Coursework

Slots 11, 24, 31 y 41, los unicos del calendario sin asset. A 1200x1200, que
es el formato de feed: los briefs de los borradores decian 1200x627, que es el
de portada de articulo.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 9: [Parte B] Registrar los cuatro slots en `render.py` y renderizar

`MAPA` en `render.py:76` traduce número de slot a fichero fuente y destino del PNG. Es, a
propósito, la misma ruta que declara el calendario, «así un fallo de nombre se ve aquí y no al
ir a publicar».

Los PNG de feed que ya existen van numerados del `03` al `17` en
`1 - Posts y lanzamientos`. Los cuatro nuevos siguen la serie desde el `18`.

**Files:**
- Modify: `07-assets-fuente/render.py` (dentro de `MAPA`, tras la línea 79)

**Interfaces:**
- Consumes: los cuatro HTML de la Tarea 8, por nombre sin extensión.
- Produces: cuatro PNG de 1200×1200 en
  `~/Desktop/Documentos/LinkedIn - Multimedia EN/1 - Posts y lanzamientos/`. La Tarea 10
  escribe estas rutas exactas en el calendario.

- [ ] **Step 1: Añadir las cuatro entradas**

  En `render.py`, justo después de la línea 79 (`40: ("40-dazn-upstream-constraint", …)`), que
  cierra el grupo de portadas de la serie universitaria, insertar:

  ```python
      11: ("11-reserved-is-a-place", FEED + "/18 - Reserved is a place.png"),
      24: ("24-read-the-dictionary-first", FEED + "/19 - Read the dictionary first.png"),
      31: ("31-this-site-was-coursework", FEED + "/20 - This site was coursework.png"),
      41: ("41-two-degrees-one-bridge", FEED + "/21 - Six projects one habit.png"),
  ```

- [ ] **Step 2: Renderizar los cuatro**

  ```bash
  cd ~/Projects/linkedin-director-ia/07-assets-fuente
  python3 render.py en 11 24 31 41
  ```

  `render.py` ya comprueba con `sips` que el PNG sale al tamaño declarado y revienta si no
  («Chrome headless no siempre respeta `--window-size`»). Si falla ahí, el asset no vale.

- [ ] **Step 3: Verificar los cuatro PNG en su destino**

  ```bash
  cd ~/Desktop/Documentos/"LinkedIn - Multimedia EN"/"1 - Posts y lanzamientos"
  for f in "18 - Reserved is a place.png" "19 - Read the dictionary first.png" \
           "20 - This site was coursework.png" "21 - Six projects one habit.png"; do
    printf '%-38s %s\n' "$f" "$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | grep -oE '[0-9]+$' | tr '\n' 'x')"
  done
  ```

  Esperado: `1200x1200x` en los cuatro.

- [ ] **Step 4: Mirarlos**

  ```bash
  open ~/Desktop/Documentos/"LinkedIn - Multimedia EN"/"1 - Posts y lanzamientos"/1[89]*.png \
       ~/Desktop/Documentos/"LinkedIn - Multimedia EN"/"1 - Posts y lanzamientos"/2[01]*.png
  ```

  Comprobar que no hay texto cortado ni desbordado. `ajustar-escala.py`, en la misma carpeta,
  existe justo para esto si algo no cabe.

- [ ] **Step 5: Commit**

  ```bash
  cd ~/Projects/linkedin-director-ia
  git add 07-assets-fuente/render.py
  git commit -m "feat(assets): render.py conoce los slots 11, 24, 31 y 41

Los PNG siguen la numeracion de feed desde el 18. Los ficheros no entran al
repo: render.py los escribe en Desktop/Documentos, que es de donde se suben.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 10: [Parte B] Poner el calendario al día

El `CALENDARIO-MAESTRO.md` miente en dos sitios. Dice `PENDIENTE` en los slots 10, 20 y 40,
cuyas portadas existen desde el 3 y 4 de septiembre y están registradas en `render.py:77-79`.
Y su nota del 2026-09-03 afirma que «las 7 piezas nuevas no tienen asset» y que «los 3
artículos nuevos no existen todavía en josepalacios.site»: las dos cosas dejaron de ser
ciertas.

Un documento que dice `PENDIENTE` sobre algo hecho es peor que no decir nada: obliga a
comprobarlo a mano cada vez.

**Files:**
- Modify: `03-plan-contenido/CALENDARIO-MAESTRO.md` (filas 10, 11, 20, 24, 31, 40, 41 de la tabla; nota del 2026-09-03)

**Interfaces:**
- Consumes: las rutas de PNG de la Tarea 9 y de `render.py:77-79`.
- Produces: nada.

- [ ] **Step 1: Rellenar la columna Multimedia de las siete filas**

  En la tabla, sustituir `PENDIENTE` por la ruta real. El prefijo `1/` es
  `1 - Posts y lanzamientos` y `3/` es `3 - Portadas de articulos`, según la leyenda del
  propio fichero; `EN` marca la carpeta `LinkedIn - Multimedia EN`.

  | Slot | Poner en la columna Multimedia |
  |---|---|
  | 10 | ``EN 3/`18 - Canfranc modal shift (TFG).png` `` |
  | 11 | ``EN 1/`18 - Reserved is a place.png` `` |
  | 20 | ``EN 3/`19 - Audit log not in the rubric.png` `` |
  | 24 | ``EN 1/`19 - Read the dictionary first.png` `` |
  | 31 | ``EN 1/`20 - This site was coursework.png` `` |
  | 40 | ``EN 3/`20 - DAZN upstream constraint.png` `` |
  | 41 | ``EN 1/`21 - Six projects one habit.png` `` |

- [ ] **Step 2: Corregir la nota del 2026-09-03**

  En la sección «Reorganización del 2026-09-03», sustituir los dos últimos puntos:

  ```markdown
  - Las 7 piezas nuevas **no tienen asset**: cada borrador lleva su brief de imagen en la
    sección `## MEDIA`. Hasta que existan, la columna Multimedia dice `PENDIENTE`.
  - Los 3 artículos nuevos (slots 10, 20 y 40) **no existen todavía en josepalacios.site**.
    Ver la nota sobre artículos frente a posts en `GUIA-DE-PUBLICACION.md`.
  ```

  por:

  ```markdown
  - **Las 7 piezas ya tienen asset** (2026-09-05). Las tres portadas de artículo se
    renderizaron el 3 y 4 de septiembre; los cuatro posts de feed, el 5. Todas están
    registradas en `07-assets-fuente/render.py`, que es lo que las regenera.
  - **Los 3 artículos ya están en josepalacios.site** y devuelven 200 en producción:
    `proving-it-is-not-what-makes-it-happen`, `the-feature-that-was-not-in-the-rubric` y
    `where-competitive-advantage-actually-sits`, los tres bajo `/en/articles/`. Cada uno
    enlaza su memoria en PDF desde el cuerpo.
  - El slot 24 es la única pieza de la serie **sin documento que adjuntar**: los `.xlsx` que
    cita no están en el disco a 2026-09-05. Va solo con imagen.
  ```

- [ ] **Step 3: Verificar que no queda ningún `PENDIENTE` y que las rutas existen**

  ```bash
  cd ~/Projects/linkedin-director-ia/03-plan-contenido
  echo "PENDIENTE restantes: $(grep -c PENDIENTE CALENDARIO-MAESTRO.md)"
  python3 - <<'PY'
import re, pathlib
BASE = pathlib.Path.home() / "Desktop/Documentos"
SUB = {"1": "1 - Posts y lanzamientos", "2": "2 - Carruseles", "3": "3 - Portadas de articulos"}
txt = pathlib.Path("CALENDARIO-MAESTRO.md").read_text()
faltan = 0
for n, mm in re.findall(r"^\|\s*(\d+)\s*\|(?:[^|]*\|){4}[^|]*\|\s*([^|]+?)\s*\|\s*$", txt, re.M):
    raw = mm.strip()
    carpeta = BASE / ("LinkedIn - Multimedia EN" if raw.startswith("EN ") else "LinkedIn - Multimedia")
    r = raw[3:].strip() if raw.startswith("EN ") else raw
    m = re.match(r"(\d)/`([^`]+)`", r)
    if not m:
        print(f"  slot {n}: no parseado -> {raw}"); faltan += 1; continue
    p = carpeta / SUB[m.group(1)] / m.group(2)
    if not p.exists():
        print(f"  slot {n}: NO EXISTE -> {p.name}"); faltan += 1
print("rutas rotas:", faltan)
PY
  ```

  Esperado: `PENDIENTE restantes: 0` y `rutas rotas: 0`.

- [ ] **Step 4: Commit**

  ```bash
  cd ~/Projects/linkedin-director-ia
  git add 03-plan-contenido/CALENDARIO-MAESTRO.md
  git commit -m "docs(calendario): las 42 filas apuntan a un asset que existe

Decia PENDIENTE en los slots 10, 20 y 40, cuyas portadas llevaban hechas desde
el 3-sep, y afirmaba que los tres articulos no estaban en el dominio. Las siete
rutas de la serie Coursework verificadas contra el disco.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 11: [Parte B] Regenerar `SEO-ARTICULOS.md`

Este fichero se genera leyendo los `.mdx` del sitio. Tras la Tarea 2 está desincronizado: las
descripciones y dos de las fechas cambiaron. Su propia cabecera explica por qué existe el
script: «un documento que copia datos de otro sitio se queda obsoleto en cuanto la fuente
cambia».

**Depende de la Tarea 2.** Si la Parte A no está hecha, esta tarea no aporta nada; sáltala y
vuelve luego.

**Files:**
- Modify: `03-plan-contenido/SEO-ARTICULOS.md` (generado)

**Interfaces:**
- Consumes: `~/Projects/Pagina_Web_CV/src/content/articulos/**/*.mdx` (rutas fijadas en
  `generar-seo-articulos.py:17`).
- Produces: nada.

- [ ] **Step 1: Confirmar que está desincronizado**

  ```bash
  cd ~/Projects/linkedin-director-ia/03-plan-contenido
  python3 generar-seo-articulos.py --check; echo "exit=$?"
  ```

  Esperado: `exit=1`. Si sale `exit=0`, la Tarea 2 no se ha hecho.

- [ ] **Step 2: Regenerar**

  ```bash
  cd ~/Projects/linkedin-director-ia/03-plan-contenido && python3 generar-seo-articulos.py
  ```

- [ ] **Step 3: Verificar**

  ```bash
  cd ~/Projects/linkedin-director-ia/03-plan-contenido
  python3 generar-seo-articulos.py --check; echo "exit=$?"
  grep -E "coursework|Coursework" SEO-ARTICULOS.md | head -5
  ```

  Esperado: `exit=0`, y las tres filas `Coursework` con `Car. description` de 147, 150 y 147,
  y fechas `2026-09-04`, `2026-09-26` y `2026-11-11`.

- [ ] **Step 4: Commit**

  ```bash
  cd ~/Projects/linkedin-director-ia
  git add 03-plan-contenido/SEO-ARTICULOS.md
  git commit -m "docs(seo): SEO-ARTICULOS.md regenerado tras recortar las descripciones

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
  ```

---

## Cierre

Antes de dar por terminada cualquiera de las dos ramas, `superpowers:verification-before-completion`.

Comprobación de extremo a extremo, no «compila»: coger un slot cualquiera de la serie —el 20
sirve— y recorrer el camino real de publicación. Que el borrador tenga texto y primer
comentario; que el calendario dé una ruta de imagen que existe en disco; que `SEO-LINKEDIN.md`
dé título, descripción, hashtags y enlace al dominio; que ese enlace devuelva 200; y que el
artículo enlace su PDF y el PDF se abra.

Si alguno de esos seis eslabones falla, la pieza no está lista aunque todos los tests pasen.
