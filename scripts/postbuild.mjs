/**
 * Retoques sobre out/ que el export de Next no hace por si solo.
 *
 * 1. `/en/` y `/de/` con barra final.
 *    Con trailingSlash:false el export escribe out/en.html, asi que /en/ no
 *    resuelve: da 404. Verificado contra GitHub Pages el 2026-08-21 con
 *    /about/. Se copia en/index.html para que las dos formas funcionen; la
 *    canonica ya la fija cada pagina.
 *
 * 2. CNAME y .nojekyll.
 *    Llegan desde public/, pero se comprueban aqui: sin .nojekyll, GitHub Pages
 *    pasa el sitio por Jekyll y se come out/_next/ entero.
 *
 * 3. sitemap.xml con las URLs reales.
 *    El sitemap que genera Next usa las rutas sin extension. El sitio lleva
 *    indexadas las .html, asi que se reescribe recorriendo out/.
 *
 * Uso:  node scripts/postbuild.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "out";
const BASE = "https://josepalacios.site";
const IDIOMAS_CON_PREFIJO = ["en", "de"];

function fallar(mensaje) {
  console.error(`postbuild: ${mensaje}`);
  process.exitCode = 1;
}

// 1. Portadas de idioma accesibles tambien con barra final.
for (const lang of IDIOMAS_CON_PREFIJO) {
  const plano = join(OUT, `${lang}.html`);
  if (!existsSync(plano)) {
    fallar(`falta ${plano}; /${lang}/ se quedaria sin portada`);
    continue;
  }
  writeFileSync(join(OUT, lang, "index.html"), readFileSync(plano));
  console.log(`postbuild: /${lang}/ servido desde ${lang}/index.html`);
}

// 2. Ficheros que GitHub Pages necesita.
for (const [fichero, comprobacion] of [
  ["CNAME", (c) => c.trim() === "josepalacios.site"],
  [".nojekyll", () => true],
]) {
  const ruta = join(OUT, fichero);
  if (!existsSync(ruta)) fallar(`falta out/${fichero}`);
  else if (!comprobacion(readFileSync(ruta, "utf-8")))
    fallar(`out/${fichero} tiene un contenido inesperado`);
}

// 3. Sitemap con las URLs .html, que son las indexadas.
function htmlDe(dir) {
  const salida = [];
  for (const entrada of readdirSync(dir)) {
    if (entrada.startsWith("_")) continue; // out/_next
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) salida.push(...htmlDe(ruta));
    else if (entrada.endsWith(".html")) salida.push(ruta);
  }
  return salida;
}

const paginas = htmlDe(OUT)
  .map((r) => relative(OUT, r).split("\\").join("/"))
  .filter((r) => r !== "404.html" && !r.endsWith("_not-found.html"))
  // /en/index.html es un duplicado de /en.html: se declara una sola vez.
  .filter((r) => !IDIOMAS_CON_PREFIJO.some((l) => r === `${l}/index.html`))
  .map((r) => (r === "index.html" ? "" : r))
  .sort();

// --- lastmod ---------------------------------------------------------------
//
// Sin <lastmod> el sitemap no dice que algo haya cambiado, y pedir reindexacion
// con el es pedirle a Google que se fie. Con la fecha del build tampoco vale:
// si en cada despliegue las 79 URLs dicen "modificada hoy", Google deja de
// mirar el campo. Asi que la fecha sale de git, que es la unica que no miente.
//
// La fecha de una pagina es la mas reciente entre la de su propio .mdx y la del
// ultimo cambio en los ficheros compartidos, porque un cambio ahi -- la
// cabecera, el pie, el grafo de entidad -- reescribe de verdad el HTML de todas.
//
// Consecuencia, y conviene no confundirla con un fallo: el dia que se toca un
// fichero compartido, las 79 URLs comparten fecha. Es lo que ha pasado hoy con
// el grafo de entidad, y es cierto: todas cambiaron. Las fechas se separan
// solas despues, segun se vayan editando articulos sueltos.
//
// Aviso: esto lee el historial, no el arbol de trabajo. Si se despliega con
// cambios sin commitear, la fecha se queda corta.

const COMPARTIDOS = [
  "src/components/DocumentoBase.tsx",
  "src/components/Cabecera.tsx",
  "src/components/Pie.tsx",
  "src/lib/entidad.ts",
  "src/lib/meta.ts",
  "src/content/persona.ts",
];

/** Fecha del ultimo commit de cada fichero, en una sola pasada por el historial. */
function fechasDeGit() {
  const salida = execSync("git log --pretty=format:%cI --name-only --no-merges", {
    encoding: "utf-8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const fechas = new Map();
  let actual = null;
  for (const linea of salida.split("\n")) {
    if (!linea.trim()) continue;
    if (/^\d{4}-\d{2}-\d{2}T/.test(linea)) actual = linea.slice(0, 10);
    else if (actual && !fechas.has(linea)) fechas.set(linea, actual); // el log viene de nuevo a viejo
  }
  return fechas;
}

const fechas = fechasDeGit();
const mayor = (a, b) => (!a ? b : !b ? a : a > b ? a : b);
const fechaCompartida = COMPARTIDOS.map((f) => fechas.get(f)).reduce(mayor, null);

/** El .mdx del que sale esta pagina, si es un articulo o un proyecto. */
function fuenteDe(ruta) {
  const m =
    /^articulos\/(.+)\.html$/.exec(ruta) ??
    /^en\/articles\/(.+)\.html$/.exec(ruta) ??
    /^de\/artikel\/(.+)\.html$/.exec(ruta) ??
    /^proyectos\/(.+)\.html$/.exec(ruta) ??
    /^en\/projects\/(.+)\.html$/.exec(ruta);
  if (!m) return null;
  const lang = ruta.startsWith("en/") ? "en" : ruta.startsWith("de/") ? "de" : "es";
  const tipo = /articulos|articles|artikel/.test(ruta) ? "articulos" : "proyectos";
  return `src/content/${tipo}/${lang}/${m[1]}.mdx`;
}

function lastmodDe(ruta) {
  const fuente = fuenteDe(ruta);
  return mayor(fuente ? fechas.get(fuente) : null, fechaCompartida);
}

if (!fechaCompartida) fallar("no se pudo leer ninguna fecha de git para el sitemap");

const cuerpo = paginas
  .map((r) => {
    const lastmod = lastmodDe(r);
    return (
      `  <url>\n    <loc>${BASE}/${r}</loc>` +
      (lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "") +
      `\n  </url>`
    );
  })
  .join("\n");

writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${cuerpo}\n</urlset>\n`.replace(
    "www.sitemap.org",
    "www.sitemaps.org",
  ),
);
console.log(`postbuild: sitemap.xml con ${paginas.length} URLs`);

// --- llms.txt ------------------------------------------------------------
//
// Indice del sitio para los motores de respuesta (llmstxt.org). Se genera, no
// se escribe a mano: un indice escrito a mano se queda obsoleto en cuanto se
// publica un articulo, que es exactamente lo que le paso a SEO-ARTICULOS.md.
//
// Los titulos y descripciones se leen del HTML servido, no del .mdx, para que
// lo que anuncia el fichero sea literalmente lo que hay en la pagina.
//
// Google dice que no hace falta para sus resumenes de IA, y es cierto. Esto es
// para ChatGPT, Claude y Perplexity, que si leen el fichero cuando existe.

function meta(rutaRelativa) {
  const html = readFileSync(join(OUT, rutaRelativa || "index.html"), "utf-8");
  const t = /<title>([^<]*)<\/title>/.exec(html);
  const d = /<meta name="description" content="([^"]*)"/.exec(html);
  const limpia = (x) =>
    x ? x.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim() : "";
  return { titulo: limpia(t?.[1]), descripcion: limpia(d?.[1]) };
}

const SECCIONES = [
  { titulo: "Español", prefijo: (r) => !r.startsWith("en/") && !r.startsWith("de/") },
  { titulo: "English", prefijo: (r) => r.startsWith("en/") },
  { titulo: "Deutsch", prefijo: (r) => r.startsWith("de/") },
];

const raiz = meta("");
const bloques = SECCIONES.map(({ titulo, prefijo }) => {
  const items = paginas
    .filter((r) => prefijo(r))
    .map((r) => {
      const { titulo: t, descripcion } = meta(r);
      const url = `${BASE}/${r}`;
      return `- [${t}](${url})${descripcion ? `: ${descripcion}` : ""}`;
    });
  return `## ${titulo}\n\n${items.join("\n")}`;
});

writeFileSync(
  join(OUT, "llms.txt"),
  `# José Palacios Beortegui\n\n` +
    `> ${raiz.descripcion}\n\n` +
    `Sitio personal de José Palacios Beortegui, analista deep tech afincado en Zúrich. ` +
    `Publica en castellano, inglés y alemán sobre gobernanza de inteligencia artificial, ` +
    `evaluación de sistemas de IA y preparación de datos. Fundador de Epokan ` +
    `(https://epokan.com) y de CorpusProof (https://corpusproof.com).\n\n` +
    `Cada página declara datos estructurados schema.org con el identificador ` +
    `canónico ${BASE}/#person.\n\n` +
    bloques.join("\n\n") + "\n",
);
console.log(`postbuild: llms.txt con ${paginas.length} entradas`);

if (process.exitCode) console.error("postbuild: terminado CON ERRORES");
else console.log("postbuild: ok");
