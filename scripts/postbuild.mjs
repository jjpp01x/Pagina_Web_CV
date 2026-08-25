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

const cuerpo = paginas
  .map((r) => `  <url>\n    <loc>${BASE}/${r}</loc>\n  </url>`)
  .join("\n");

writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${cuerpo}\n</urlset>\n`.replace(
    "www.sitemap.org",
    "www.sitemaps.org",
  ),
);
console.log(`postbuild: sitemap.xml con ${paginas.length} URLs`);

if (process.exitCode) console.error("postbuild: terminado CON ERRORES");
else console.log("postbuild: ok");
