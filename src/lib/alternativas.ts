/**
 * Mapa de equivalencias entre idiomas para TODAS las rutas del sitio.
 *
 * Se calcula en el servidor durante el build y viaja al conmutador de idioma
 * como prop. Hace falta porque los slugs estan traducidos —`senal-o-ruido` en
 * espanol, `signal-or-noise` en ingles— y por tanto la ruta equivalente no se
 * puede deducir de la URL actual.
 *
 * La fuente de verdad es la misma que la del hreflang: el `translationKey` del
 * frontmatter. Asi el conmutador y el hreflang no pueden discrepar.
 */
import {
  alternativasArticulo,
  alternativasProyecto,
  getArticulos,
  getProyectosPropios,
} from "./contenido";
import { IDIOMAS, type Idioma, ruta } from "./rutas";

export type MapaAlternativas = Record<string, Partial<Record<Idioma, string>>>;

/** Paginas fijas: existen en los tres idiomas por definicion. */
const FIJAS: ((lang: Idioma) => string)[] = [
  ruta.inicio,
  ruta.sobreMi,
  ruta.articulos,
  ruta.proyectos,
  ruta.formacion,
  ruta.contacto,
];

export function construirMapaAlternativas(): MapaAlternativas {
  const mapa: MapaAlternativas = {};

  const registrar = (alts: { lang: Idioma; rutaNext: string }[]) => {
    const porIdioma = Object.fromEntries(alts.map((a) => [a.lang, a.rutaNext]));
    for (const a of alts) mapa[a.rutaNext] = porIdioma;
  };

  for (const constructor of FIJAS) {
    registrar(IDIOMAS.map((lang) => ({ lang, rutaNext: constructor(lang) })));
  }

  // Articulos: se agrupan por translationKey, no por slug.
  const vistos = new Set<string>();
  for (const lang of IDIOMAS) {
    for (const articulo of getArticulos(lang)) {
      if (vistos.has(articulo.translationKey)) continue;
      vistos.add(articulo.translationKey);
      registrar(alternativasArticulo(articulo.translationKey));
    }
  }

  // Fichas de proyecto: solo las escritas de verdad en cada idioma.
  const fichasVistas = new Set<string>();
  for (const lang of IDIOMAS) {
    for (const proyecto of getProyectosPropios(lang)) {
      if (fichasVistas.has(proyecto.translationKey)) continue;
      fichasVistas.add(proyecto.translationKey);
      registrar(alternativasProyecto(proyecto.translationKey));
    }
  }

  return mapa;
}
