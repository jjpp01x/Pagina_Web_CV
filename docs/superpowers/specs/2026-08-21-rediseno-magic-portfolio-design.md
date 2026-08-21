# Diseño: rediseño de josepalacios.site sobre Magic Portfolio

Fecha: 2026-08-21
Encargo: `docs/prompt-rediseno-2026-08-21.md`
Estado: aprobado por José (secciones 1-4) el 2026-08-21

## 1. Objetivo

Que un reclutador o comité de selección (perfil: analista deep tech / evaluación
tecnológica, tipo fellowship MNTY en Zúrich) entienda en 30 segundos qué sabe hacer José
y pueda **verificarlo**. Tres prioridades en orden: credibilidad visual, mensaje, captación.

No es un sitio comercial. Epokan (`epokan.com`) es cosa aparte.

## 2. Estado real verificado (2026-08-21)

El encargo describía el sitio con cinco imprecisiones que cambian el plan:

| El encargo decía | Verificado en disco |
|---|---|
| 4 páginas | También `projects.html` + **10 fichas en `proyectos/`** |
| "~17 artículos" en 3 idiomas | **17 ES, 12 EN, 12 DE** — faltan 5 × 2 traducciones |
| Trilingüe por directorios | Solo la **sección de artículos**; el resto es i18n por JS + `localStorage` sobre una sola URL |
| "y hreflang" | Solo en artículos EN/DE, los 12 ES traducidos y `articulos.html`. En `index`, `education`, `contact`, `projects`: **cero** |
| sitemap completo | 48 URLs; **las 10 fichas de `proyectos/` no están** |

**Consecuencia:** el "mayor riesgo" del encargo se invierte. En las páginas principales no
hay SEO multilingüe que conservar porque nunca existió como URL. Donde sí hay que
conservar URLs es en los 24 artículos EN/DE y los 17 ES.

**GitHub Pages no hace redirecciones 301.** Solo stubs HTML con `canonical` + meta-refresh.
De ahí la prioridad de preservar URLs literalmente en vez de redirigir.

## 3. Decisiones cerradas

| # | Decisión | Elegido |
|---|---|---|
| 1 | Alcance trilingüe | **Trilingüe completo**: las 3 lenguas en todas las páginas |
| 2 | Enrutado | **Tres árboles de rutas explícitos**, slugs traducidos intactos |
| 3 | Portada | **6 proyectos deep tech + 3 artículos**; los otros 4 proyectos en `/projects.html` |
| 4 | Sistema de diseño | **Once UI como arquitectura, identidad propia encima**; acento a explorar en Fase 3 |
| 5 | Datos | Alemán corregido; Epokan entra; ISSEP fuera; Anthropic se queda; agencia todavía no |
| 6 | Traducciones | **Traducir los 10 y publicar** (riesgo del alemán asumido explícitamente) |
| 7 | Preview | **Repo nuevo + `preview.josepalacios.site`** (DNS lo crea José en Porkbun) |
| 8 | Cutover | El sitio nuevo se construye **dentro de `Pagina_Web_CV`**; el dominio no se mueve |

## 4. Arquitectura de rutas

**Hipótesis que sostiene el diseño y que Fase 1 debe validar antes que nada:** con
`trailingSlash: false`, el export de Next escribe `out/education.html` en vez de
`out/education/index.html`. Si se confirma, **las 48 URLs indexadas sobreviven sin un solo
redirect**. Si no se confirma, el plan cambia y hay que replantear con José.

Tres *root layouts* mediante grupos de rutas (los paréntesis no salen en la URL), sin
`app/layout.tsx`, para que cada idioma tenga su `<html lang>`:

```
src/app/
  (es)/layout.tsx              <html lang="es">
    page.tsx                 -> /index.html
    articulos/page.tsx       -> /articulos.html
    articulos/[slug]/        -> /articulos/<slug>.html
    projects/page.tsx        -> /projects.html
    proyectos/[slug]/        -> /proyectos/<slug>.html
    education/page.tsx       -> /education.html
    contact/page.tsx         -> /contact.html
  (en)/en/layout.tsx           <html lang="en">
    page.tsx                 -> /en.html  +  /en/index.html (postbuild)
    articles/page.tsx        -> /en/articles.html
    articles/[slug]/         -> /en/articles/<slug>.html
    projects|education|contact
  (de)/de/layout.tsx           <html lang="de">
    artikel/[slug]/          -> /de/artikel/<slug>.html
    ...
```

Se respetan los nombres heredados **con sus incoherencias**: `articulos.html` en español
pero `projects.html`, `education.html` y `contact.html` en inglés. Son URLs indexadas; la
coherencia estética no vale una 404.

**Problema detectado y su arreglo:** con `trailingSlash: false` la portada inglesa sale
como `out/en.html`, así que `/en/` no resolvería. Un `scripts/postbuild.mjs` copia
`en.html` a `en/index.html` (y `de.html` a `de/index.html`), fija el `canonical` en una de
las dos, y además coloca `CNAME`, `.nojekyll` y regenera `sitemap.xml`.

**`next.config.mjs`:** `output: 'export'`, `trailingSlash: false`, `images.unoptimized: true`,
y fuera las **6** rutas de API (el encargo decía 5; existe también `api/og/generate`). Se
pierden la protección por contraseña y el OG dinámico: las OG se generan en build.

## 5. Contenido y arquitectura de información

### Hero reescrito

Fuera "en formación" y fuera "Jr." de la primera pantalla. Sube la frase que estaba
enterrada en el cuarto párrafo:

> **José Palacios**
> # Distingo qué tecnología está lista para producción y cuál conlleva riesgo real, antes de que una empresa apueste por ella.
> Analista deep tech · BSc (Hons) Applied Computing, UWTSD · España–Suiza
> Seis herramientas públicas de evaluación de IA y 17 artículos sobre riesgo, coste y cumplimiento. Con el código a la vista.
> `[Ver proyectos]` `[Leer artículos]`

No miente por omisión: la titulación en curso está en la segunda línea y la trayectoria
completa a un clic. La disponibilidad baja a contacto y al pie.

### Las píldoras de habilidades se eliminan

No se arreglan con mejores píldoras. Cada capacidad aparece **como fila con su prueba
enlazada** (Python -> `dd-copilot`; AI Act -> artículo + Epokan; evaluación de modelos ->
`model-card-auditor`). **Si una capacidad no tiene artefacto que la respalde, no aparece.**

### Páginas (x3 idiomas)

| URL | Contenido |
|---|---|
| `/` | Hero -> 6 proyectos deep tech -> 3 artículos -> sobre mí breve -> contacto |
| `/projects.html` | 6 deep tech arriba, 4 restantes en bloque aparte |
| `/articulos.html` | 17 artículos con filtro por tema |
| `/education.html` | Titulaciones, trayectoria (con Epokan, sin ISSEP), 6 certificaciones con enlace de verificación |
| `/contact.html` | Correo, LinkedIn, GitHub, disponibilidad |

Se elimina la columna derecha de "Sobre mí": repetía el hero.

### Modelo de contenido

MDX en `src/content/{es,en,de}/`, con `translationKey` común en el frontmatter que enlaza
las tres versiones. El `hreflang` se **genera** de ahí, no se escribe a mano — es como se
ha desincronizado hasta ahora. Los datos repetidos (persona, certificaciones, proyectos)
viven en un único `src/content/person.ts`: el nivel de alemán existe en **un solo sitio**,
no en cinco.

### Tarjetas de proyecto

No listan features: abren con la decisión defendible. `expert-probe` no dice "genera
preguntas para entrevistas"; dice *"refutar una afirmación sube la confianza igual que
confirmarla: la cifra mide la calidad de la evidencia, no la salud de la empresa"*.

**Autoría verificada** (contra notas del 31-jul y 4-ago; reconfirmar con
`git shortlog -sne --all` en Fase 2): los seis son obra propia — `dd-copilot` (34 commits),
`model-card-auditor` (45), `ai-readiness-matrix` (12), `ai-safety-incidents` (2),
`signal-radar`, `expert-probe`. Ninguno es fork.

## 6. Correcciones de datos (confirmadas por José el 2026-08-21)

1. **Alemán: `A1.1 certificado (Lingoda, abril 2026), A1.2 en curso`.** Hoy la web se
   contradice: `index.html:150` y `:216` y `translations.js:23,160,289` dicen "A2–B1",
   mientras `education.html:245` ya dice "A1.1". **NO es A2 ni B1.** Inglés:
   *"German A1.1 certified (Lingoda 2026), currently completing A1.2"*. Sin fecha prevista
   de cierre del A1.2 (26/50 lecciones; certificado a 45/50).
2. **Ubicación: `España–Suiza`.** Se retira "Actualmente basado en Zúrich" de los tres
   idiomas y del bloque de contacto.
3. **Epokan entra en la trayectoria:** *Fundador · Epokan (proyecto propio)*, Zaragoza
   (remoto), **agosto de 2026 — Actualidad**, con enlace a `epokan.com`. Formación en IA y
   cumplimiento del Reglamento Europeo de IA para despachos, asesorías y gestorías.
   **Solo en trayectoria, no como tarjeta de proyecto en portada.**
4. **Fuera** el curso superior de Historia del conservadurismo español (ISSEP). **Se
   quedan** las 4 certificaciones de Anthropic con su enlace de verificación.
5. **La agencia de data governance no entra todavía**: sin producto ejecutable no hay nada
   verificable que enseñar. Entra con ficha propia cuando lo haya.
6. Correo correcto y sin cambios: `palaciosbeortegui@gmail.com` (el del mercado, no el de
   Epokan).

**Abierto:** nacionalidad. Si es española, el acuerdo bilateral de libre circulación
UE–Suiza da acceso al permiso de trabajo suizo y conviene declararlo en contacto: elimina
la objeción más cara que un comité de Zúrich tiene contra un candidato extranjero. Hoy no
se declara en ningún sitio.

## 7. Identidad visual

Tokens de Once UI en `custom`. Cubre el hueco del encargo, cuya paleta solo definía claro:

| | Claro | Oscuro |
|---|---|---|
| Fondo | `#FAFAFA` | `#09090B` |
| Superficie | `#FFFFFF` | `#18181B` |
| Texto | `#09090B` | `#FAFAFA` |
| Texto secundario | `#3F3F46` | `#A1A1AA` |
| Borde | `#E4E4E7` | `#27272A` |

Los contrastes se **miden** en Fase 4, no se afirman.

**Acento — tres candidatos a decidir en Fase 3**, con medición de contraste sobre ambos
fondos antes de elegir:

- **Ámbar `#D97706`** (recomendado): lee como "señal/atención", que es el tema —riesgo,
  incidentes, qué está listo y qué no— y corta con el navy anterior.
- **Verde señal `#059669`**: sobrio, connota validación; más neutro, menos memorable.
- **Azul `#2563EB`** (el del encargo): seguro, pero es el color por defecto del sector, y
  el propio diagnóstico #2 se queja del "azul brillante" actual.

**Tipografía:** Archivo (titulares) + Space Grotesk (cuerpo) vía `next/font/google`,
autoalojadas en build. Resuelve el diagnóstico #6: los defaults de Once UI usan Geist para
heading, body y label — la misma familia para todo, exactamente el defecto a corregir.

**Ajustes de Once UI:** `border: conservative`, `surface: filled`, `dots.display: false`,
`solidStyle: flat`. La foto pierde el anillo azul degradado.

**Movimiento:** entradas al hacer scroll y hover en tarjetas. **El estado inicial del
contenido nunca será `opacity: 0` en CSS**: si el JS falla o tarda, el contenido se ve
igual; la animación se añade encima de contenido ya visible. `prefers-reduced-motion:
reduce` apaga todo, incluidas las transiciones de hover.

**Iconos:** Lucide vía `react-icons/lu` (ya es dependencia de la plantilla). **Cero emojis.**

**Atribución CC BY-NC 4.0 a Once UI** en el pie y en el README, indicando que se ha
modificado. No se retira "por limpieza".

## 8. Despliegue y verificación

**Trampa esquivada:** GitHub no permite que dos repos reclamen `josepalacios.site` a la
vez. Si el sitio nuevo viviera en otro repo habría ventana de caída y sin vuelta atrás
rápida. Por eso el sitio nuevo se construye **dentro de `Pagina_Web_CV`** y un workflow de
Actions publica `out/`. El dominio no se mueve nunca. El repo de preview es desechable.

**Vuelta atrás:** etiquetar el sitio actual (`git tag sitio-estatico-2026-08-21`) antes de
tocar nada. Revertir = restaurar la etiqueta.

**Preview:** repo aparte + `preview.josepalacios.site` (CNAME en Porkbun -> `jjpp01x.github.io`,
lo crea José). Sirve desde GitHub Pages en la raíz del dominio: paridad exacta con
producción sin rozar el apex. Lleva `robots.txt` con `Disallow: /` para no indexar un clon.

DNS verificado el 2026-08-21: NS en Porkbun, apex -> `185.199.108-111.153`,
`www` -> `jjpp01x.github.io`, `preview` libre.

**Cómo se verifica** (los criterios exigen medición, no opinión):

- **Responsive:** emulación por CDP con `Emulation.setDeviceMetricsOverride` a
  375/768/1024/1440. **Nunca `--window-size`**, que produce falsos desbordamientos.
- **Contraste:** calculado sobre los tokens y comprobado sobre la página renderizada, en
  claro y en oscuro.
- **Rutas:** las ~150 URLs de `out/` a 200 contra la URL desplegada, más las 48 antiguas.
- **Lighthouse:** contra `preview.josepalacios.site`, no en local. Si Next no llega a donde
  llegaba el sitio estático, se reporta el número aunque sea peor.

## 9. Fases y puertas

| Fase | Termina cuando | Puerta |
|---|---|---|
| **1 · Viabilidad** | `preview.josepalacios.site` sirve un build de ejemplo y se confirma que el export escribe `.html` planos | **Parar y enseñar a José** |
| **2 · Contenido** | 51 artículos en MDX (17x3, con las 10 traducciones), datos corregidos, hreflang generado | Revisión de textos con José |
| **3 · Identidad** | Tokens, tipografías, acento elegido, iconos, movimiento | Enseñar el acento antes de aplicarlo |
| **4 · Verificación** | Los 12 criterios de aceptación con salida pegada | **No apuntar el dominio sin OK de José** |

Trabajo en worktree desde rama aislada, un commit por tarea, árbol verificado en cada uno.

## 10. Criterios de aceptación

Del encargo, sin rebajar:

- [ ] `npm run build` termina sin errores y genera `out/`
- [ ] Las páginas y los 17 artículos responden 200 en los 3 idiomas
- [ ] Las URLs antiguas siguen funcionando o redirigen. Ninguna 404 nueva
- [ ] `hreflang` correcto entre las tres versiones
- [ ] `CNAME`, `.nojekyll`, `robots.txt` y `sitemap.xml` presentes en `out/`
- [ ] Cero emojis usados como iconos
- [ ] Contraste >= 4.5:1 en todo el texto, medido, en claro y en oscuro
- [ ] Sin scroll horizontal a 375, 768, 1024 y 1440 px, verificado con emulación CDP
- [ ] Foco visible con teclado en todo elemento interactivo
- [ ] `prefers-reduced-motion` respetado
- [ ] Lighthouse >= 90 en las cuatro categorías, medido contra la URL desplegada
- [ ] La atribución CC BY-NC a Once UI está presente

## 11. Riesgos y supuestos a validar

1. **`trailingSlash: false` -> `.html` planos.** Load-bearing. Se valida en Fase 1.
2. **`public/.nojekyll` sobrevive al copiado del export.** Next a veces ignora los ficheros
   que empiezan por punto. Se valida en Fase 1; si no, lo coloca el postbuild.
3. **Alemán sin revisor competente.** Las 5 traducciones DE nuevas se publican sin que
   nadie con nivel suficiente las lea. Riesgo asumido explícitamente por José el
   2026-08-21 tras plantearlo. Los 12 artículos DE ya publicados arrastran el mismo riesgo
   desde antes y quedan **fuera de alcance**.
4. **Lighthouse puede bajar** respecto al sitio estático actual. Se reporta con el número.
5. **Actions es nuevo en este repo** (hoy publica desde rama). El cambio de fuente de
   publicación se hace en el cutover, no antes.

## 12. Fuera de alcance

- Revisar los 12 artículos alemanes ya publicados.
- La agencia de data governance en la web.
- Rediseñar `epokan.com`.
- Traducir artículos futuros automáticamente.

## 13. Pendientes aplazados por decisión de José (2026-08-21)

- **Los tres CV en PDF (`docs/CV_Jose_Palacios_{ES,EN,DE}.pdf`).** Siguen enlazados para
  descarga desde `index.html:110-112` y afirman, verificado con `pdftotext`:
  - "Certificado AWS (AI Practitioner y Cloud Practitioner)" — **AWS está en curso, no
    certificado**. Aparece en el resumen y otra vez en la sección de certificaciones.
  - "Davos, Suiza" en la cabecera y "Residente en Davos con uso profesional diario del
    alemán" — Heierling terminó en abril de 2026; el nivel real es A1.1.
  - "Alemán (A2–B1, uso profesional diario)".

  José decidió el 2026-08-21 aplazarlo y priorizar el lanzamiento. **Se retoma en Fase 4**,
  con el generador versionado en el repo y verificación por `pdftotext` de que no queda
  ningún "A2–B1" ni ningún "Davos" como residencia actual. Recomendación registrada y no
  aceptada: retirar los tres enlaces mientras tanto.

- **Nacionalidad.** Si es española, conviene declarar el acceso al permiso de trabajo suizo
  por el acuerdo bilateral UE–Suiza. Sin confirmar.
