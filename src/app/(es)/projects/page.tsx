import { IndiceProyectos } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("es").proyectos.titulo,
    descripcion: textos("es").proyectos.subtitulo,
    lang: "es",
    rutaNext: ruta.proyectos("es"),
    alternativas: alternativasPagina(ruta.proyectos),
  });

export default function Page() {
  return <IndiceProyectos lang="es" />;
}
