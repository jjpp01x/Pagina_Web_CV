import { Experiencia } from "@/components/paginas";
import { alternativasPagina } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("en").experiencia.titulo,
    descripcion: textos("en").experiencia.subtitulo,
    lang: "en",
    rutaNext: ruta.experiencia("en"),
    alternativas: alternativasPagina(ruta.experiencia),
  });

export default function Page() {
  return <Experiencia lang="en" />;
}
