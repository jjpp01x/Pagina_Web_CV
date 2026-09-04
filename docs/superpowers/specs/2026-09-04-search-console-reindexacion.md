# Search Console — qué inspeccionar y en qué orden

**Fecha:** 2026-09-04. Acompaña a `2026-09-04-seo-entidad-multipropiedad-design.md`.

Esto lo ejecuta José. No hay `gcloud` ni credenciales de aplicación en la máquina
—solo las del MCP de Calendar, con otro ámbito—, así que la API de Search Console
no es accesible desde Claude Code.

---

## Por qué ahora

Los tres dominios acaban de cambiar: grafo de entidad nuevo, títulos nuevos en
josepalacios.site y `lastmod` real en su sitemap. Google no se entera hasta que
vuelve a rastrear, y en josepalacios.site tiene cacheada una versión anterior al
rediseño de agosto: el resultado de `/contact.html` todavía muestra el texto
«open to junior roles», que ya no existe en la página.

## Cómo se inspecciona una URL

1. Entra en <https://search.google.com/search-console> y elige la propiedad.
2. Pega la URL en la barra de arriba («Inspeccionar cualquier URL de…») y pulsa Enter.
3. Espera a «Obteniendo datos del índice de Google».
4. Lee el veredicto: **«La URL está en Google»** o **«La URL no está en Google»**.
5. Pulsa **«Ver página rastreada» → pestaña HTML**. Esto es lo que Google tiene
   guardado. Es donde vas a ver con tus ojos el «junior roles» que ya no existe.
6. Pulsa **«Probar URL publicada»**. Compara lo vivo con lo indexado.
7. Pulsa **«Solicitar indexación»**.

**Cuota:** la solicitud de indexación está limitada a unas 10-12 URLs al día por
propiedad. Por eso la lista va ordenada: si solo llegas a la mitad, que sea la
mitad que importa.

**Lo que NO hay que hacer:** volver a solicitar la misma URL cada día. No acelera
nada y consume la cuota que necesitan las demás.

---

## Paso 1 — Reenviar los tres sitemaps

Menú lateral → **Sitemaps** → escribe la ruta → **Enviar**. Reenvíalo aunque ya
esté: es lo que fuerza a Google a releer el fichero y ver los `lastmod` nuevos.

| Propiedad | Sitemap |
|---|---|
| josepalacios.site | `sitemap.xml` |
| epokan.com | `sitemap.xml` |
| corpusproof.com | `sitemap.xml` |

---

## Paso 2 — Inspeccionar y solicitar indexación

### josepalacios.site — por orden

| # | URL | Por qué esta |
|---|---|---|
| 1 | `https://josepalacios.site/contact.html` | La que sirve caché vieja con «junior roles». La más urgente. |
| 2 | `https://josepalacios.site/` | Título nuevo + grafo de entidad. Es la raíz. |
| 3 | `https://josepalacios.site/en/` | Título ya no está en castellano. Mercado global. |
| 4 | `https://josepalacios.site/de/` | Título ya no está en castellano. Mercado suizo. |
| 5 | `https://josepalacios.site/sobre-mi.html` | Hub de entidad. Consulta de nombre. |
| 6 | `https://josepalacios.site/en/about.html` | Íd. en inglés. |
| 7 | `https://josepalacios.site/de/ueber-mich.html` | Íd. en alemán. |
| 8 | `https://josepalacios.site/articulos.html` | Índice de artículos, título nuevo. |
| 9 | `https://josepalacios.site/projects.html` | Índice de proyectos. |
| 10 | `https://josepalacios.site/en/contact.html` | Contacto en inglés. |

### epokan.com

| # | URL | Por qué esta |
|---|---|---|
| 1 | `https://epokan.com/` | `Organization.founder` ahora apunta al `@id` canónico. |
| 2 | `https://epokan.com/nosotros/` | `AboutPage.mainEntity`, el nodo de persona. |
| 3 | `https://epokan.com/informe/` | 2.428 palabras, el mejor contenido del dominio. |

### corpusproof.com

| # | URL | Por qué esta |
|---|---|---|
| 1 | `https://corpusproof.com/` | Pasó de cero datos estructurados a grafo completo. |
| 2 | `https://corpusproof.com/sobre.html` | La página de la persona detrás de la marca. |
| 3 | `https://corpusproof.com/precios.html` | Precios publicados. |
| 4 | `https://corpusproof.com/servicios.html` | Índice de los tres servicios. |

---

## Paso 3 — Bing Webmaster Tools

No es un extra opcional: **la búsqueda de ChatGPT se apoya en el índice de Bing.**
Si el objetivo incluye aparecer en las IA de búsqueda, Bing no es secundario.

<https://www.bing.com/webmasters> → se pueden importar las propiedades
directamente desde Search Console, sin volver a verificar dominio por dominio.
Envía los tres sitemaps igual que arriba.

---

## Paso 4 — Qué mirar dentro de una semana

- **Indexación → Páginas:** que el número de páginas indexadas no baje.
- **Mejoras / Resultados enriquecidos:** deberían aparecer tipos nuevos según se
  vayan desplegando las capas.
- **Rendimiento → filtro por consulta:** buscar `palacios`, `epokan`, `corpusproof`
  y anotar impresiones y posición media. Esa es la línea base contra la que se
  mide todo lo demás.

Anota las cifras del primer día que aparezcan. Sin línea base no hay forma de
saber si algo funcionó.
