import { IndiceProyectos } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("de").proyectos.titulo,
    descripcion: textos("de").proyectos.subtitulo,
    lang: "de",
    rutaNext: ruta.proyectos("de"),
    alternativas: alternativasPagina(ruta.proyectos),
  });

export default function Page() {
  return <IndiceProyectos lang="de" />;
}
