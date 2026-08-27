# Rediseño visual de josepalacios.site — 2026-08-27

Encargo de José: elevar el impacto visual, la jerarquía y la UX **sin tocar el contenido**.
Estética Tech / Clean Minimalist, dark mode elegante, hero a dos columnas, tarjetas de
proyecto con píldoras de stack, rejilla de habilidades, navbar de cristal y métricas.

## 1. Decisión de stack: restyling sobre Once UI (opción A)

Se descarta reescribir a Tailwind **por ahora** (ver §8). El sitio se publicó el 2026-08-25
y lo caro no es el CSS: son las **48 URLs `.html` planas**, el `hreflang` trilingüe, el
export estático y el despliegue por Actions. Nada de eso aporta al rediseño visual y todo
se rompería al cambiar de sistema. Once UI ya trae tokens, dark mode y escala tipográfica.

**Lo que sí se toca:** tokens de color y tipografía, `Cabecera`, hero de `Portada`,
`TarjetaProyecto`, la rejilla de habilidades y las certificaciones.
**Lo que no se toca:** `lib/rutas.ts`, `lib/contenido.ts`, `lib/alternativas.ts`,
`scripts/postbuild.mjs`, el contenido MDX y `persona.ts` salvo datos nuevos.

## 2. Identidad visual

| Token | Valor | Por qué |
|---|---|---|
| Tema por defecto | **dark** | Lo pide el encargo; el conmutador claro/oscuro se queda |
| `neutral` | `slate` | Ya era slate: es la familia de #0f172a / #1e293b del encargo |
| `brand` | **`cyan`** | El encargo pide cobalto o cian. Sustituye a `emerald` |
| `accent` | **`cyan`** | Antes `orange`, que no pintaba nada con un acento verde |

**Sobre el verde petróleo:** era el acento de marca fijado el 2026-08-21 (commit `2fac8c4`).
El cian de Once UI es su vecino directo en el círculo cromático, así que la marca no da un
salto brusco: se desplaza de verde-azulado a azul-verdoso. Queda registrado porque es una
decisión de marca revocada, no un detalle.

**Tipografía.** `Inter` para cuerpo, titulares y etiquetas (sustituye a Space Grotesk y
Archivo). `JetBrains Mono` **solo** para píldoras de stack y cifras de métricas — es la
regla del encargo: la mono es un indicador de "esto es un dato técnico", y pierde ese valor
si se usa para texto corrido.

## 3. Hero a dos columnas

Escritorio: texto a la izquierda, foto a la derecha. Móvil: una columna, **foto primero**.

- **Izquierda:** saludo, `H1` con el nombre a tamaño display, subtítulo
  *"Analista Deep Tech & Software Builder"*, propuesta de valor y **tres CTA**:
  Contactar (primario), Ver Proyectos (secundario), Descargar CV (terciario).
- **Derecha:** la foto en tarjeta con `radius-l`, `ring` de 1px y sombra suave.
- Hover de los CTA: `transform: translateY(-1px)` y cambio de fondo, `transition` de 160ms.
  **Todo bajo `prefers-reduced-motion`**: sin esa guarda, el movimiento es un problema de
  accesibilidad, no un detalle.

El subtítulo cambia de "Analista deep tech" a **"Analista Deep Tech & Software Builder"** en
los tres idiomas. Es una decisión de posicionamiento de José, no una mejora de estilo.

## 4. Métricas: solo números verificables

Cuatro cifras, cada una contable contra el repo. **Se calculan en tiempo de build**, no se
teclean: un número a mano se queda obsoleto y nadie se entera.

| Cifra | Fuente |
|---|---|
| 17 artículos | ficheros en `src/content/articulos/es/` |
| 10 proyectos | ficheros en `src/content/proyectos/es/` |
| 3 idiomas | `IDIOMAS` en `lib/rutas.ts` |
| 4 certificaciones verificables | entradas con `verificar:` en `persona.ts` |

**Descartadas del encargo: "papers analizados" e "iteraciones".** No existen como dato en
ninguna parte. Inventar una cifra en una web de CV es el fallo más caro posible, y esta
sesión ya se ha ido en quitar tres afirmaciones falsas de los PDF.

## 5. Tarjetas de proyecto

Rejilla responsiva (3 / 2 / 1). Cada tarjeta: título, pregunta que responde el proyecto,
píldoras de stack en mono desde el campo `stack: [...]` que **ya existe** en cada MDX, y el
repo con icono de enlace externo (↗). Hover: elevación y borde que pasa a color de marca.

## 6. Habilidades y certificaciones

- Habilidades: `t.skills.grupos` (ya existe, trilingüe) pasa de lista a **rejilla de
  tarjetas por categoría**, con las tecnologías como píldoras mono.
- Certificaciones: las **cuatro de Anthropic con enlace de verificación** se maquetan como
  insignia con marca de verificado. **Salesforce Trailhead NO va como insignia**: está en
  curso. Se lista aparte, con su estado escrito. Una insignia dice "lo tengo".

## 7. Navegación

Sticky (ya lo era) + cristal esmerilado: `backdrop-filter: blur(10px)` sobre fondo
semitransparente, con `@supports` y fondo sólido de reserva. Conmutador de idioma arriba a
la derecha, junto a sociales y tema.

## 8. Opción B, guardada para más adelante: reescritura a Tailwind

Registrada a petición de José para lanzarla como proyecto propio.

**Qué daría:** control total del CSS, ecosistema estándar, y soltar la dependencia de una
plantilla **CC BY-NC 4.0** — cuya atribución es obligatoria y que **no valdría** si el sitio
pasara a ser comercial.

**Qué costaría, y es lo que hay que planificar antes de empezar:**
1. Rehacer el enrutado trilingüe y el mapa de alternativas del `hreflang`.
2. Mantener las **48 URLs `.html` planas** o aceptar redirecciones — y GitHub Pages **no
   hace 301**: solo stubs con `canonical` y meta-refresh.
3. Reconstruir el sistema de tokens, dark mode y escala tipográfica que Once UI regala.
4. Reescribir los ~14 componentes de `src/components/`.

**Condición de entrada:** hacerlo solo si se quiere soltar la licencia NC (por ejemplo, si
la web pasa a ser comercial) o si Once UI llega a estorbar de verdad. Como ejercicio de
estilo no compensa: el riesgo se concentra justo donde hoy no hay ni una 404.

## 9. Verificación

1. `npm run build` en verde y **83 páginas** en `out/`, las mismas que hoy.
2. Las **84 URLs** de producción en 200 y los **32 assets** en 200.
3. `hreflang` intacto en los tres idiomas.
4. Lighthouse: **accesibilidad 100** es condición de parada, no un objetivo. Rendimiento de
   escritorio no debe bajar de 100. El móvil tiene techo en ~85 por el `max-age=600` de
   GitHub Pages.
5. Contraste de los colores nuevos medido, no supuesto.
