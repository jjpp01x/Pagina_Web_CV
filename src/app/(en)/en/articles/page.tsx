import { IndiceArticulos } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { getArticulos, alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("en").articulos.titulo,
    descripcion: textos("en").articulos.descripcion.replace("{n}", String(getArticulos("en").length)),
    lang: "en",
    rutaNext: ruta.articulos("en"),
    alternativas: alternativasPagina(ruta.articulos),
  });

export default function Page() {
  return <IndiceArticulos lang="en" />;
}
