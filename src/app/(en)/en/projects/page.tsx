import { IndiceProyectos } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("en").proyectos.titulo,
    descripcion: textos("en").proyectos.subtitulo,
    lang: "en",
    rutaNext: ruta.proyectos("en"),
    alternativas: alternativasPagina(ruta.proyectos),
  });

export default function Page() {
  return <IndiceProyectos lang="en" />;
}
