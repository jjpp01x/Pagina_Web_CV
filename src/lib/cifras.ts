/**
 * Las cifras de impacto del sitio, contadas del contenido real.
 *
 * Viven aqui y no en cada pagina porque las usan la portada y "Sobre mi": con
 * dos copias, publicar un articulo dejaria una de las dos mintiendo y nadie se
 * enteraria. Se cuentan siempre sobre el corpus en espanol, que es el completo;
 * ingles y aleman tienen menos articulos traducidos y darian cifras distintas
 * segun el idioma en que estuvieras leyendo.
 *
 * Ninguna cifra se teclea. Si no se puede contar, no se publica: en una web de
 * CV un numero inventado es lo primero que un reclutador puede desmentir.
 */
import { certificaciones, formacionAcademica, idiomas } from "@/content/persona";
import type { textos } from "@/content/textos";
import { getArticulos, getProyectos } from "@/lib/contenido";

export type Cifra = { n: number; etiqueta: string };

export function cifrasDe(t: ReturnType<typeof textos>): Cifra[] {
  return [
    { n: getArticulos("es").length, etiqueta: t.cifras.articulos },
    // Solo los que tienen repositorio publico: un proyecto que no se puede
    // abrir no es una prueba de nada.
    { n: getProyectos("es").filter((p) => p.repo).length, etiqueta: t.cifras.proyectos },
    { n: certificaciones.length, etiqueta: t.cifras.certificaciones },
    { n: idiomas.length, etiqueta: t.cifras.idiomas },
    { n: formacionAcademica.length, etiqueta: t.cifras.titulaciones },
  ];
}
