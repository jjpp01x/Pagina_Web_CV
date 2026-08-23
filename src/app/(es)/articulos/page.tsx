import { IndiceArticulos } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("es").articulos.titulo,
    descripcion: textos("es").hero.descripcion,
    lang: "es",
    rutaNext: ruta.articulos("es"),
    alternativas: alternativasPagina(ruta.articulos),
  });

export default function Page() {
  return <IndiceArticulos lang="es" />;
}
