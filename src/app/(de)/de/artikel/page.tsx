import { IndiceArticulos } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { getArticulos, alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("de").articulos.titulo,
    descripcion: textos("de").articulos.descripcion.replace("{n}", String(getArticulos("de").length)),
    lang: "de",
    rutaNext: ruta.articulos("de"),
    alternativas: alternativasPagina(ruta.articulos),
  });

export default function Page() {
  return <IndiceArticulos lang="de" />;
}
