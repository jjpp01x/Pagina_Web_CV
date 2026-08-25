# Encargo: rediseñar josepalacios.site sobre Magic Portfolio

## 0. Cómo quiero que trabajes

Aplica el pipeline de superpowers, en este orden y sin saltarte pasos:

1. `superpowers:brainstorming` — antes de tocar una línea. El diseño visual y la
   arquitectura de información NO están cerrados: están abiertos a propuesta. Preséntame
   alternativas y espera mi aprobación.
2. `superpowers:writing-plans` — descompón en tareas de 2-5 minutos, con ruta de fichero
   exacta y criterio de verificación por tarea.
3. `superpowers:using-git-worktrees` — rama aislada antes de escribir código.
4. `superpowers:subagent-driven-development` — **para ejecutar las Fases 2, 3 y 4**: un
   subagente implementador por tarea, revisión de cada tarea, y revisión amplia al final.
   No lo uses para la Fase 1: ahí lo que hay es exploración técnica, no un plan de tareas
   independientes, y el ceremonial cuesta más que el trabajo.
5. Un commit por tarea. Nada de un commit gigante al final.
6. `superpowers:verification-before-completion` — nada se da por hecho sin comando
   ejecutado y salida pegada.

Usa también la skill `ui-ux-pro-max` para las decisiones de estilo, color, tipografía y
accesibilidad, y su checklist de pre-entrega antes de darme nada por terminado.

**No despliegues nada sin pedírmelo.** El sitio está en producción.

---

## 1. Contexto

`josepalacios.site` es mi web personal: portfolio y CV. **No es comercial** — no vende
nada, no cobra, no capta clientes. Su función es que un reclutador o un comité de
selección (perfil objetivo: analista deep tech / evaluación tecnológica, tipo fellowship
MNTY en Zúrich) entienda en 30 segundos qué sé hacer y pueda verificarlo.

No confundir con `epokan.com`, que es mi proyecto comercial y va aparte.

---

## 2. Estado verificado hoy (21 de agosto de 2026)

**Sitio actual** — repo `~/Projects/Pagina_Web_CV`, remoto `jjpp01x/Pagina_Web_CV`:

- HTML/CSS/JS estático escrito a mano. `css/styles.css` son 1642 líneas.
- 4 ficheros JS propios: `i18n.js`, `translations.js`, `i18n-articulos.js`,
  `filtro-articulos.js`.
- **Trilingüe ES/EN/DE** con directorios separados (`/en/`, `/de/`) y `hreflang`.
  El español es la raíz.
- ~17 artículos en `articulos/`, con sus traducciones en `en/articles/` y `de/artikel/`.
- Páginas: `index.html`, `articulos.html`, `education.html`, `contact.html`.
- Tiene `robots.txt` y `sitemap.xml`.
- **Se publica con GitHub Pages directamente desde una rama. No hay GitHub Actions.**
- `CNAME` contiene `josepalacios.site`.

**Plantilla de destino** — ya descargada en `~/magic-portfolio`:

- Next.js 16 + React 19 + `@once-ui-system/core` + MDX.
- **`node_modules` NO está instalado todavía.**
- Licencia **CC BY-NC 4.0**. Como esta web no es comercial, el uso está permitido,
  **pero la atribución es obligatoria**: hay que mantener el crédito a Once UI, enlazar la
  licencia e indicar que se ha modificado. Déjalo en el footer o en el README, y no lo
  quites "por limpieza".

---

## 3. Diagnóstico — qué falla hoy

Esto sale de una auditoría visual real de la portada en producción, no de suposiciones.

### Credibilidad visual

1. **Emojis usados como iconos.** 📍 en Zúrich, 💼 en "abierto a roles", 🌐 en idiomas y
   banderas 🇪🇸🇬🇧🇩🇪 en el bloque de idiomas. Es el anti-patrón número uno de cualquier
   guía de UI y es lo que más resta profesionalidad en el primer vistazo. Sustituir todo
   por SVG de un set coherente (Lucide o Heroicons).
2. **Aspecto de plantilla genérica.** Navy + azul brillante, foto circular con anillo azul
   degradado, "píldoras" azul claro. Es el look de plantilla de CV de hace unos años. Nada
   ahí comunica "analista deep tech".
3. **Las píldoras de habilidades no dicen nada.** "Python", "SQL", "AWS Cloud",
   "Prompt Engineering" sin nivel, sin evidencia y sin enlace. Un reclutador no puede
   verificar ninguna. Son palabras clave, no pruebas.
4. **La portada no enseña trabajo.** Tengo ~17 artículos publicados y varios repos
   deep-tech públicos, y en la portada no aparece **ninguno**. El activo real está
   escondido detrás de una entrada de menú. La portada solo tiene: Hero, Sobre mí,
   Habilidades, y footer.
5. **La columna derecha de "Sobre mí" repite lo ya dicho.** Zúrich ya está en el hero; los
   estudios ya están en el primer párrafo. Cuatro tarjetas que no añaden información.
6. **Sin contraste tipográfico.** Una sola familia sans para todo. Los titulares no tienen
   personalidad propia.
7. **Solo dos certificaciones, sin logo, sin fecha y sin enlace de verificación.**

### Mensaje

8. **El hero se autodescalifica.** "Analista Deep Tech **en formación**" y, más abajo,
   "Abierto a roles **Jr.**". Es honesto, pero es lo primero que lee quien decide.
9. **El buen posicionamiento está enterrado en el cuarto párrafo**: *"entender qué
   tecnología está lista para usarse en producción y cuál conlleva riesgo real, antes de
   que una empresa apueste por ella"*. Eso sí es una propuesta. Debería estar arriba.

**Mandato explícito sobre el hero: reescríbelo, y tienes permiso para quitar "en
formación" y "Abierto a roles Jr." de la portada.** Ahora bien, léelo bien, porque el
encargo tiene dos mitades y solo una es "sé agresivo":

- **Sí:** deja de abrir por mi etapa de carrera y abre por lo que sé hacer. El `h1` debería
  ser la afirmación, no mi nombre — el nombre ya está en la cabecera y en el dominio.
  Saca a portada la frase del cuarto párrafo, que es el posicionamiento de verdad.
- **No:** no inventes seniority, ni años de experiencia, ni títulos que no tengo. Acabo de
  corregir un nivel de idioma inflado en esta misma web; sería absurdo arreglar eso y
  meter exageración en el hero. Si un reclutador comprueba cualquier afirmación de la
  portada, tiene que cuadrar.
- **Los hechos no se borran, se recolocan.** "Estudiante de BSc (Hons) Applied Computing
  (UWTSD)" sigue en "Sobre mí" y en la página de formación. "Busco puesto júnior" se va a
  contacto, donde además es útil porque filtra. Lo que se elimina es que sean el marco de
  entrada.

Dos direcciones para que las propongas en el brainstorming, no para copiarlas tal cual:

- *Por capacidad*: `h1` = "Evalúo si una tecnología funciona y qué riesgo conlleva antes
  de que una empresa apueste por ella." Subtítulo con nombre, área y Zúrich.
- *Por evidencia*: `h1` sobre qué está listo para producción y qué no; subtítulo con las
  pruebas comprobables — análisis publicados en tres idiomas, repos públicos, la doble
  formación en gestión e informática.

### Captación

10. La portada **no enlaza ni un solo artículo**. Los 17 artículos en tres idiomas son el
    mejor activo de captación que tengo y no tienen escaparate.

### Verificaciones que quedaron pendientes y tienes que hacer tú

- **Móvil sin comprobar.** Intenté capturar a 390 px con Chrome headless y el resultado no
  es fiable: genera el PNG del ancho pedido pero maqueta a un ancho mayor y recorta, así
  que aparecen falsos desbordamientos. **Verifica el móvil con emulación real por CDP**
  (o DevTools), nunca con `--window-size` a secas.
- **Contraste del hero sin medir.** El texto gris claro sobre navy, y en especial la línea
  "Analista Deep Tech...", parece rondar el límite. Mídelo y corrígelo a 4.5:1 mínimo.

---

## 4. Objetivo

Tres cosas, en este orden:

1. **Credibilidad visual** — que parezca hecho por alguien que evalúa tecnología.
2. **Mensaje** — que en 10 segundos se entienda qué hago y qué puedo demostrar.
3. **Captación** — que los artículos y los proyectos sean el centro, no una nota al pie.

---

## 5. Decisiones ya tomadas (no las reabras)

- Se migra a **Magic Portfolio / Next.js**. Sí, es un cambio de stack grande para un sitio
  estático que funciona; ya lo he decidido.
- **JavaScript permitido.** El sitio ya lo usa.
- **La identidad de marca se puede cambiar entera**: colores, tipografías, logo, foto.
- Se mantienen los **tres idiomas** y los **artículos existentes**.
- **El hero se reescribe** y salen de portada "en formación" y "Abierto a roles Jr.".
  Decidido. Lo que se discute es con qué se sustituyen, no si se quitan. Ver el mandato
  del apartado 3.

---

## 6. Riesgos técnicos concretos (verifícalos pronto, deciden el plan)

Estos los he comprobado yo. No son hipótesis:

1. **GitHub Pages solo sirve estáticos.** Hay que añadir `output: 'export'` a
   `next.config.mjs`, que ahora mismo **no lo tiene**.
2. **Magic Portfolio trae 5 rutas de API que son incompatibles con `output: 'export'`**:
   `api/authenticate`, `api/check-auth`, `api/rss`, `api/og/proxy`, `api/og/fetch`.
   Hay que eliminarlas o sustituirlas. En concreto, la protección por contraseña y la
   generación dinámica de imágenes OG dejan de funcionar; las OG hay que generarlas en
   build o a mano.
3. **`next/image` necesita `unoptimized: true`** con export estático, o el build falla.
4. **Magic Portfolio no trae i18n.** Es el mayor riesgo de la migración: hay que diseñar
   el enrutado trilingüe (segmento `[lang]`) y **conservar los `hreflang`**, o pierdo el
   SEO de las versiones EN y DE.
5. **`CNAME` y `.nojekyll`** tienen que acabar dentro del directorio publicado (`out/`),
   o GitHub Pages tira el dominio propio y se come los ficheros que empiezan por `_`.
6. **El despliegue cambia.** Hoy es "GitHub Pages desde la rama". Con Next.js hay que
   construir y publicar `out/`, casi seguro con un workflow de GitHub Actions. Eso hay que
   montarlo y probarlo **antes** de tocar el dominio.
7. **Conserva `robots.txt` y `sitemap.xml`**, regenerando el sitemap con las rutas nuevas.

**Regla de seguridad:** monta y verifica todo en una URL de pruebas. `josepalacios.site`
no apunta al sitio nuevo hasta que yo lo apruebe viéndolo funcionando.

---

## 7. Sistema de diseño de partida

Salida de `ui-ux-pro-max` para "personal portfolio deep tech analyst". Es un punto de
partida para discutir en el brainstorming, no una orden:

- **Patrón:** Portfolio Grid — Hero (nombre/rol) → rejilla de proyectos → sobre mí →
  contacto. CTA en hover de tarjeta y en el footer.
- **Estilo:** Motion-Driven — microinteracciones, transiciones suaves, animación de
  entrada al hacer scroll.
- **Color:** monocromo + un acento. Primario `#18181B`, secundario `#3F3F46`, fondo
  `#FAFAFA`, texto `#09090B`, acento `#2563EB`. El fondo neutro deja que destaque el
  trabajo.
- **Tipografía:** Archivo (titulares) + Space Grotesk (cuerpo).
- **Evitar:** plantillas corporativas y maquetaciones genéricas.

Dos matices míos:

- Magic Portfolio ya trae su propio sistema (Once UI). **Decide en el brainstorming si
  adoptamos su paleta y tipografía o si las sustituimos por las de arriba.** No mezcles
  las dos a medias.
- "Motion-Driven" tiene un coste: la propia skill lo marca como rendimiento solo
  "aceptable". **`prefers-reduced-motion` es obligatorio**, y la animación no puede
  retrasar el contenido.

---

## 8. Alcance por fases, con puerta de salida

**Regla que gobierna todo este apartado: una fase no está terminada hasta que su puerta
está pasada, y la puerta se pasa enseñándome la salida de los comandos, no afirmando que
funciona.** Si algo de la puerta falla, se arregla dentro de esa fase. No se avanza con
deuda: la Fase 3 sobre una Fase 2 rota es trabajo tirado, porque el diseño se construye
encima del enrutado y del contenido.

Si una puerta no se puede pasar por algo ajeno a ti (una limitación real de la plataforma,
por ejemplo), **párate y dímelo con el error en la mano**. No la des por buena "en lo
esencial".

---

**Fase 1 — Viabilidad.** Instala Magic Portfolio, quita las rutas de API, activa
`output: 'export'`, consigue un build estático que se sirva bien, y despliega una prueba a
una URL temporal. Con contenido de ejemplo. Si aquí algo no funciona, quiero saberlo antes
de invertir un minuto en diseño.

*Puerta 1:*
- `npm run build` termina en 0 y genera `out/`. Pega la salida.
- `out/` servido en local: la portada y una ruta interna responden 200.
- Desplegado en URL de pruebas: esa misma comprobación, contra la URL pública.
- `CNAME` y `.nojekyll` presentes dentro de `out/`.

---

**Fase 2 — Arquitectura de información y contenido.** Portada nueva que incluya proyectos
y artículos. Reescritura del hero y del "sobre mí" según el mandato del apartado 3.
Migración de los 17 artículos a MDX conservando URLs o, si no es posible, con
redirecciones. Enrutado trilingüe con hreflang.

*Puerta 2:*
- Inventario de URLs: lista de todas las del sitio actual frente a las nuevas.
  **Cero 404.** Compruébalo con un bucle de `curl` sobre la URL de pruebas, no a ojo.
- Las 4 páginas y los 17 artículos responden 200 **en los tres idiomas**.
- `hreflang` recíproco y correcto entre ES, EN y DE.
- `sitemap.xml` y `robots.txt` regenerados y coherentes con las rutas nuevas.
- Ningún dato del apartado 10 sin verificar.

---

**Fase 3 — Identidad visual.** Paleta, tipografía, logo, iconos SVG, tratamiento de la
foto, animaciones.

*Puerta 3:*
- `grep -rP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" out/` no devuelve nada usado como
  icono. **Cero emojis.**
- Contraste ≥ 4.5:1 en todo el texto, **medido con herramienta**, en claro y en oscuro.
  Pega los números.
- Sin scroll horizontal a 375, 768, 1024 y 1440 px, **verificado con emulación CDP**.
  Recuerda que `--window-size` a secas miente: genera el PNG del ancho pedido pero maqueta
  más ancho y recorta, y te inventarás desbordamientos que no existen.
- Foco visible con teclado en todo elemento interactivo.
- `prefers-reduced-motion` respetado: con la preferencia activada no hay animación.

---

**Fase 4 — Verificación y publicación.**

*Puerta 4:*
- Lighthouse ≥ 90 en las cuatro categorías **contra la URL desplegada**, no en local.
- Todo el apartado 9 marcado, con su evidencia.
- **Los tres CV en PDF regenerados** con los datos corregidos del apartado 10, y su
  generador versionado dentro del repo. Comprueba con `pdftotext` que no queda ningún
  "A2–B1" ni ningún "Davos" como residencia actual.
- **Y solo entonces me pides permiso para apuntar el dominio.** Nunca antes.

---

## 9. Criterios de aceptación

No me digas que está terminado sin haber ejecutado esto y enseñado la salida:

- [ ] `npm run build` termina sin errores y genera `out/`.
- [ ] Las 4 páginas y los 17 artículos responden 200 en los 3 idiomas.
- [ ] Las URLs antiguas siguen funcionando o redirigen. Ninguna 404 nueva.
- [ ] `hreflang` correcto entre las tres versiones.
- [ ] `CNAME`, `.nojekyll`, `robots.txt` y `sitemap.xml` presentes en `out/`.
- [ ] **Cero emojis usados como iconos** en todo el sitio.
- [ ] Contraste ≥ 4.5:1 en todo el texto, medido, en claro y en oscuro.
- [ ] Sin scroll horizontal a 375, 768, 1024 y 1440 px, **verificado con emulación CDP**.
- [ ] Foco visible con teclado en todo elemento interactivo.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Lighthouse ≥ 90 en las cuatro categorías **medido contra la URL desplegada**, no en
      local. Si Next.js no llega a donde llegaba el sitio estático, dímelo con el número
      en la mano en vez de esconderlo.
- [ ] La atribución CC BY-NC a Once UI está presente.
- [ ] **El alemán figura como "A1.1 certificado, A1.2 en curso" en ES, EN y DE**, y no
      queda ni un "A2" ni un "B1" suelto. Compruébalo con `grep -ri` sobre el sitio
      generado, no a ojo.
- [ ] Ninguna afirmación de la portada es incomprobable o está inflada.

---

## 10. Datos verificables

### Ya corregido — no lo revuelvas

El nivel de alemán **ya está arreglado en el HTML y el JS** (commit `de32781`, del
2026-08-21, verificado en producción en los tres idiomas). Publicaba "A2–B1", que es
falso. Lo declarable y lo que ahora dice la web es **A1.1 certificado, A1.2 en curso**.

Al migrar el contenido, **arrastra el valor correcto**. Si en algún borrador, caché o
traducción reaparece un "A2" o un "B1" referido al alemán, es un error de migración:
corrígelo, no lo copies.

### Pendiente, y aplazado a propósito — los tres CV en PDF

`docs/CV_Jose_Palacios_ES.pdf`, `_EN.pdf` y `_DE.pdf` **están desactualizados y lo sabemos**.
Decisión mía del 2026-08-21: **se quedan como están durante las Fases 1 a 3 y se rehacen al
final.** No los toques antes; no es despiste, es una decisión.

Lo que contienen y hay que corregir al regenerarlos:

**Datos confirmados por José el 2026-08-21. Son definitivos: no vuelvas a preguntar por
ellos, úsalos.**

| Dice el PDF | Debe decir |
|---|---|
| "Alemán (A2–B1, uso profesional diario)" | **Alemán A1.1, cursando A1.2.** Nada más: sin "uso profesional diario" |
| "Residente en Davos" | **Fuera Davos.** Experiencia internacional entre **España y Suiza**, en general |
| "Certificado AWS (AI Practitioner y Cloud Practitioner)" | **AWS en curso**, no certificado |
| "cursando Ingeniería Informática" | Correcto: Ingeniería Informática y Applied Computing son la misma titulación |
| "Inglés (C1)" | Correcto, se queda |

Contexto que necesitas para rehacerlos:

- Se generaron con **ReportLab** (Python) el 17 de julio de 2026. **El script generador no
  está en el repo**: los datos vivían en un `cv_data.py` dentro del archivo de una sesión
  suelta de Claude Desktop, y ese fichero está obsoleto — **no lo uses como fuente**.
- **Cuando los regeneres, el generador tiene que quedarse en el repo**, versionado y con los
  datos en un único sitio. Que se perdiera el rastro es exactamente por qué hoy hay tres
  PDF que nadie puede editar.
- El CV que se envió a MNTY sí tenía el alemán correcto; está en
  `~/Projects/linkedin-director-ia/05-busqueda-empleo/`. Sirve de referencia.

**Añade esto a la Puerta 4**, y no des el sitio por publicable sin ello.

### Repaso general

Antes de escribir el contenido nuevo, repasa conmigo el resto de datos comprobables:
titulaciones, fechas, certificaciones y herramientas listadas. Todo lo que un reclutador
pueda verificar tiene que cuadrar. Si encuentras otra afirmación que no puedas respaldar,
párate y pregúntame en vez de arrastrarla al sitio nuevo.

Un aviso concreto de por qué esto importa: antes de la corrección, **la propia web se
contradecía** — `education.html` decía "Alemán A1.1" mientras la portada decía "A2/B1".
Ese tipo de incoherencia entre páginas es justo lo que se nota al leer con atención.
