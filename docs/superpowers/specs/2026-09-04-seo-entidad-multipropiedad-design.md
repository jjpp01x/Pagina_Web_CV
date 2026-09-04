# SEO de entidad multipropiedad — diseño

**Fecha:** 2026-09-04
**Alcance:** josepalacios.site · epokan.com · corpusproof.com · LinkedIn · GitHub
**Estado:** Capa 0 desplegada y verificada en producción el 2026-09-04. Capas 1-4 pendientes.

> **Capa 0 — cerrada.** El nodo `Person` se sirve idéntico desde los tres dominios:
> SHA-256 `426674f40bf0` leído de josepalacios.site, epokan.com y corpusproof.com en
> producción. Dos correcciones al diseño original, hechas durante la ejecución:
>
> - Se descarta añadir `josepalacios.site` al `sameAs` de la `Organization` de Epokan.
>   Era semánticamente falso: afirmaría que la empresa es el sitio personal. La
>   reciprocidad la da `Organization.founder → #person`, que es lo implementado.
> - `ProfilePage` en las páginas «sobre mí» pasa a la Capa 1, con el resto del
>   marcado de nivel de página. La Capa 0 queda solo con `Person` + `WebSite`
>   a nivel de sitio, que es lo que bloqueaba a las demás.

Esta spec es la maestra del programa. Vive en `Pagina_Web_CV` porque la raíz de la
entidad es josepalacios.site; los otros dos repos la referencian.

---

## 1. Objetivo

Que las consultas del racimo de nombre y las de marca devuelvan propiedades propias
en primera página, y que los buscadores basados en modelos de lenguaje citen esas
propiedades como fuente.

**Consultas objetivo, en tres grupos:**

| Grupo | Consultas | Horizonte |
|---|---|---|
| Nombre desambiguado | `jose palacios beortegui`, `josé palacios ia`, `josé palacios gobernanza ia`, `jose palacios zurich`, `josé palacios ai governance` | 1-3 meses |
| Marca | `epokan`, `corpusproof`, `epokan formación ia`, `corpusproof preparación datos` | 1-2 meses |
| Nombre pelado | `jose palacios` | 18-36 meses, sin garantía |

El grupo tres se declara **objetivo de largo plazo, no KPI de este trimestre**. La
primera página de `jose palacios` la ocupan hoy un jugador de MiLB, un actor de
IMDb, profesores de UNM y Penn State, un artista y un músico. Esa consulta no se
gana con trabajo on-page: se gana con cobertura externa y con una entidad
consolidada en el Knowledge Graph. El trabajo de esta spec es condición necesaria
para llegar ahí, no suficiente.

**Mercados:** España (Epokan, CorpusProof ES), Suiza (josepalacios.site DE/EN),
Europa y global (josepalacios.site EN, CorpusProof EN).

---

## 2. Hechos verificados

Auditoría en vivo del 3 y 4 de septiembre de 2026. Todo lo de esta sección está
comprobado contra producción, no deducido del código.

### josepalacios.site — GitHub Pages, Next.js export

- **Cero JSON-LD.** `grep -ril "application/ld+json\|schema.org" src/` devuelve vacío.
- `hreflang` y `canonical` correctos, generados desde `src/lib/meta.ts`.
- 79 URLs en sitemap. 41 artículos: 17 ES, 12 EN, 12 DE.
- **Las home de `/en/` y `/de/` sirven el título en castellano:**
  `<title>José Palacios — Analista deep tech</title>` con `lang=en` y `lang=de`.
  Las páginas interiores sí están traducidas (`/en/about` → "About me",
  `/de/ueber-mich` → "Über mich").
- Títulos sin marca ni nombre: `<title>Contacto</title>`, `<title>Artículos</title>`.
- `/proyectos.html` → **404**. El índice de proyectos en castellano vive en
  `/projects.html`, con título "Proyectos". Las fichas sí están en `/proyectos/[slug]`.
- **Google sirve caché del sitio anterior al rediseño de agosto.** El resultado
  indexado de `/contact.html` muestra el texto "open to junior roles", que ya no
  existe en la página en vivo.
- La home ya enlaza en HTML a corpusproof.com, epokan.com, github.com/jjpp01x y
  linkedin.com/in/jose-palacios-beortegui. El grafo humano existe; falta el legible
  por máquina.

### epokan.com — Netlify, HTML estático

- Disciplina de URL limpia: `/metodo` y `/metodo.html` hacen 301 a `/metodo/`.
  Canonical, sitemap y enlaces internos coinciden.
- Títulos, descripciones, canonical, OG y JSON-LD en todas las páginas auditadas.
- **Dos nodos `Person` anónimos y desconectados:**
  - En la home, `Organization.founder` = `{"@type":"Person","name":"José Palacios","sameAs":["https://github.com/jjpp01x"]}` — sin `@id`.
  - En `/nosotros/`, `AboutPage.mainEntity` = otro `Person` equivalente — sin `@id`.
  - Ninguno enlaza a josepalacios.site ni al LinkedIn personal.
- `Organization` tiene `@id: https://epokan.com/#organizacion` y `areaServed: "ES"`.
- Sin `hreflang` (sitio monolingüe ES).
- Sin `Article` en `/informe/`, que son 2.428 palabras de contenido original.
- Sin `Service` ni `Offer`.
- `/metodo/index.html` devuelve 200 sin redirigir. Duplicado menor, nada lo enlaza.

### corpusproof.com — Netlify, HTML estático

- **Cero JSON-LD en las 12 páginas.**
- Triplicación de URL: `/servicios`, `/servicios/` y `/servicios.html` devuelven
  **200 los tres, sin redirección**. Mitigado porque canonical, sitemap y enlaces
  internos apuntan todos de forma consistente a `.html`.
- Títulos, descripciones, canonical, OG y H1 bien escritos en las 12.
- **Los tres precios están publicados** (950 €, 6.500 €, 350 €/mes) y no están
  marcados como `Offer`.
- Sin `hreflang` (sitio monolingüe ES).

### LinkedIn

- `linkedin.com/in/jose-palacios-beortegui` es el resultado que rankea para el
  nombre completo, con titular de **Gabinete Jurídico**.
- 42 slots programados del 14-ago al 18-nov. Del 10 en adelante (desde el 4-sep)
  quedan 33 por publicar.
- Los slots 10, 20 y 40 son artículos de la serie universitaria y **no existen en
  josepalacios.site**.

### Los tres dominios

- `llms.txt` → **404 en los tres**.
- Google Search Console verificado en los tres (confirmado por el propietario).

---

## 3. Diagnóstico

Cinco propiedades describen al mismo ser humano y ninguna se lo dice a los
buscadores en un formato que puedan consumir. No hay grafo `sameAs`, no hay
identificador compartido, y el único `Person` declarado —el de Epokan— aparece dos
veces, anónimo y sin enlazar a nada.

De ahí salen los dos síntomas:

1. **"José Palacios" no resuelve a ti** porque no existe una entidad tuya que
   resolver. Google no está descartándote: no tiene qué consolidar.
2. **Las IA de búsqueda no te citan** porque se apoyan en entidades resueltas y en
   datos estructurados, y encima ninguno de los tres dominios expone `llms.txt`.

Hay además una incoherencia de señal: tus tres webs dicen inteligencia artificial y
tu perfil más visible dice derecho.

---

## 4. Arquitectura: el grafo de entidad

Un único nodo canónico de persona, referenciado desde los tres dominios:

```
                    https://josepalacios.site/#person
                    (Person — nodo canónico)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   worksFor              worksFor               sameAs
        │                     │                     │
  #organizacion         #organizacion      LinkedIn · GitHub
  (epokan.com)        (corpusproof.com)
        │                     │
     founder ──────────────founder
        └──────► mismo @id ◄──────┘
```

**Reglas de diseño:**

1. **Un solo `@id`.** `https://josepalacios.site/#person`. Nunca se declara un
   `Person` sin ese identificador.
2. **Nodo autocontenido en cada dominio.** Cada sitio incluye el `Person` completo
   con el mismo `@id` y el mismo `sameAs`, no solo una referencia. Una referencia
   cruzada de dominio obliga al rastreador a haber visto ya el otro sitio; el nodo
   repetido no.
3. **`sameAs` solo para perfiles de identidad** — LinkedIn y GitHub. Los dominios
   de marca se enlazan con `worksFor` desde la persona y `founder` desde la
   organización, que es lo que significan. Meter epokan.com en `sameAs` diría que
   la empresa *es* la persona.
4. **Reciprocidad obligatoria.** Si josepalacios.site declara `worksFor: Epokan`,
   epokan.com declara `founder: #person`. Una relación declarada en un solo sentido
   se descuenta.
5. **Coherencia literal de nombre.** `name: "José Palacios Beortegui"` idéntico en
   los tres, con `alternateName` para las variantes sin tilde y sin segundo
   apellido.

**Honestidad sobre el mecanismo:** la consolidación de entidad entre dominios no
está garantizada. `sameAs` y los identificadores compartidos son señales fuertes,
no instrucciones. Lo que sí es seguro es lo contrario: sin ellos no hay
consolidación posible. Wikidata sería el siguiente escalón clásico, pero exige
notabilidad y un ítem autocreado para una persona no notable se borra; queda fuera
de alcance hasta que haya cobertura de terceros que lo sostenga.

---

## 5. Las capas, en orden

El orden es de dependencia, no de preferencia. Cada capa se despliega y se verifica
en producción antes de abrir la siguiente.

### Capa 0 — Columna vertebral de entidad

**Bloquea a todas las demás.** Es la de menos trabajo y más apalancamiento: tres
ficheros de datos estructurados.

- `josepalacios.site`: componente de JSON-LD en el layout raíz → `Person` +
  `WebSite`; `ProfilePage` en `/sobre-mi`, `/en/about`, `/de/ueber-mich`.
- `epokan.com`: retirar los dos `Person` anónimos; declarar uno solo con el `@id`
  canónico; `Organization.founder` apunta a él; añadir josepalacios.site al
  `sameAs` de la organización.
- `corpusproof.com`: crear `Organization` (`#organizacion`) + `WebSite` + `Person`
  founder con el `@id` canónico.

**Verificación:** las tres URLs pasan el Rich Results Test de Google sin errores y
el nodo `Person` aparece con el mismo `@id` en los tres.

### Capa 1 — Deuda técnica y on-page

**josepalacios.site**
- Traducir el `<title>` de las home `/en/` y `/de/`.
- Plantilla de título que cargue el nombre: `{Página} — José Palacios Beortegui`.
- Unificar el índice de proyectos: la forma canónica en castellano pasa a ser
  `/proyectos.html`, coherente con las fichas que ya viven en `/proyectos/[slug]`.
  `/projects.html` se mantiene servido con `canonical` hacia `/proyectos.html`.
  **Restricción:** GitHub Pages no hace 301 de servidor, así que la consolidación
  se apoya en `canonical` y en el sitemap, y será más lenta que un 301 real.
- `BlogPosting` + `BreadcrumbList` en los 41 artículos; `CollectionPage` en índices.
- `lastmod` real en el sitemap, para forzar el re-rastreo que tire la caché vieja.

**epokan.com**
- `Article` en `/informe/`.
- `Service` + `Offer`.
- `/metodo/index.html` → 301.

**corpusproof.com**
- 301 de `/x` y `/x/` hacia `/x.html` en `netlify.toml`.
- `Service` + `Offer` con los tres precios publicados.
- `FAQPage` y `HowTo` en `/metodologia/`.
- `BreadcrumbList` en las 12 páginas.

**Verificación:** rastreo completo de los tres dominios sin 404 ni cadenas de
redirección; envío de sitemaps en Search Console con `lastmod` actualizado.

### Capa 2 — Contenido y racimo de nombre

- `/sobre-mi` pasa a ser el hub de entidad: nombre completo en `<title>` y `<h1>`,
  bloque de desambiguación, enlaces a las tres propiedades.
- LinkedIn: titular alineado (nombre + gobernanza de IA + Zúrich) y sección
  destacada con los tres dominios. El texto lo preparo yo; lo pegas tú.
- Los artículos de los slots 10, 20 y 40 se publican en josepalacios.site **antes**
  que en LinkedIn, con su `canonical` propio.
- Flujo dominio-propio-primero para los 33 slots restantes: el artículo sale en
  josepalacios.site 24-48 h antes y la versión de LinkedIn enlaza de vuelta desde
  el primer comentario.

**Por qué:** el valor de enlace y de indexación de un artículo publicado en
LinkedIn se lo queda LinkedIn. Publicando primero en dominio propio, Google indexa
tu dominio como fuente y LinkedIn aporta la distribución.

**Verificación:** los tres artículos accesibles y en sitemap; el titular de
LinkedIn se relee 24 h después de guardarlo (LinkedIn lo sobrescribe solo).

### Capa 3 — AEO/GEO, visibilidad en IA de búsqueda

- `llms.txt` en los tres dominios.
- Estructura citable: párrafo de definición al abrir, encabezados en forma de
  pregunta, cifras con fecha y fuente.
- Se apoya en la skill `marketing-skills:ai-seo`.

**Verificación:** los tres `llms.txt` responden 200; consultas de prueba en
Perplexity y ChatGPT sobre las marcas, con registro de si citan y qué citan.

### Capa 4 — CorpusProof en inglés

12 páginas traducidas, `hreflang` recíproco ES/EN, sitemap ampliado. Unas 8.000
palabras. Va la última porque es la de más volumen y la que menos depende del
resto.

**Verificación:** `hreflang` recíproco validado; ninguna alternativa declarada
apunta a una página que no exista.

---

## 6. Decisión con hora límite

El **slot 10** sale **hoy 4-sep a las 08:30**. Es un artículo
(`02-publicaciones/borradores-en/10-canfranc-modal-shift.md`) y no existe en
josepalacios.site. Publicarlo antes en el dominio propio exige hacerlo esta
madrugada. Si no llega, la alternativa es publicarlo en el sitio después y enlazarlo
desde el primer comentario — menos valor, pero no se pierde el slot.

Es decisión del propietario.

---

## 7. Fuera de alcance

- Traducir Epokan. Su producto es cumplimiento del artículo 4 con jurisprudencia
  española; en alemán no vende.
- Wikidata, hasta que haya cobertura de terceros.
- Compra de enlaces o cualquier táctica de enlazado artificial.
- Rediseño visual de cualquiera de los tres sitios.
- Los slots 1-9, ya publicados o vencidos.

---

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| La consolidación de entidad entre dominios no ocurre | Nodo autocontenido en cada dominio + reciprocidad + enlaces HTML ya existentes. No hay palanca mejor disponible. |
| Cambiar el titular de LinkedIn afecta a la situación laboral declarable | Se acordó alinear manteniendo visible la relación con el despacho. |
| GitHub Pages no permite 301 reales | Redirección por página con `canonical`, asumiendo que consolida más lento. |
| Tocar URLs ya indexadas cuesta posiciones a corto plazo | Solo se toca `/projects.html`, que hoy tiene título en castellano y slug inglés. El resto se deja. |
| El caché viejo de Google tarda en refrescarse | `lastmod` real + solicitud de indexación en Search Console. Semanas, no días. |
