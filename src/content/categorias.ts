/**
 * Color por categoria de articulo.
 *
 * El color aqui no decora: informa. Con 17 articulos en el listado, la
 * categoria coloreada hace que se escanee de un vistazo en vez de leerse linea
 * a linea. Es la diferencia entre "dos colores decorativos" y "un sistema".
 *
 * Todos los pares estan MEDIDOS sobre los dos fondos del sitio (#f4f4f2 claro
 * y #17181a oscuro) y superan 4.5:1, el minimo AA para texto normal:
 *
 *   evaluacion   4.97:1 / 12.01:1
 *   ia           7.18:1 /  8.91:1
 *   negocio      5.68:1 / 10.64:1
 *   gobernanza   7.28:1 /  9.40:1
 *   seguridad    6.45:1 /  9.62:1
 *
 * Si se anade una categoria nueva hay que medirla antes de publicarla, y el
 * color NO puede ser el unico indicador: la etiqueta lleva siempre su texto.
 */

export type ClaveCategoria =
  | "evaluacion"
  | "ia"
  | "negocio"
  | "gobernanza"
  | "seguridad";

export const COLOR_CATEGORIA: Record<ClaveCategoria, { claro: string; oscuro: string }> = {
  evaluacion: { claro: "#0f766e", oscuro: "#5eead4" },
  ia: { claro: "#4338ca", oscuro: "#a5b4fc" },
  negocio: { claro: "#9a4a06", oscuro: "#fbbf24" },
  gobernanza: { claro: "#9f1239", oscuro: "#fda4af" },
  seguridad: { claro: "#6d28d9", oscuro: "#c4b5fd" },
};

/**
 * Los articulos guardan la categoria ya traducida, asi que hace falta este
 * mapa para que la version alemana de un articulo tenga el mismo color que la
 * espanola.
 */
const POR_ETIQUETA: Record<string, ClaveCategoria> = {
  // es
  "Evaluación y método": "evaluacion",
  "Ingeniería de IA": "ia",
  "Negocio y estrategia": "negocio",
  "Gobernanza y riesgo": "gobernanza",
  "Seguridad web": "seguridad",
  // en
  "Evaluation and method": "evaluacion",
  "AI engineering": "ia",
  "Business and strategy": "negocio",
  "Governance and risk": "gobernanza",
  "Web security": "seguridad",
  // de
  "Evaluation und Methode": "evaluacion",
  "KI-Engineering": "ia",
  "Business und Strategie": "negocio",
  "Governance und Risiko": "gobernanza",
  "Web-Sicherheit": "seguridad",
};

/** Variable CSS lista para usar. Cae a neutro si la categoria no esta mapeada. */
export function colorCategoria(etiqueta: string): string {
  const clave = POR_ETIQUETA[etiqueta];
  if (!clave) return "var(--neutral-on-background-medium)";
  return `var(--cat-${clave})`;
}
