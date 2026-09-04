import { Experiencia } from "@/components/paginas";
import { alternativasPagina } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("de").experiencia.titulo,
    descripcion: textos("de").experiencia.subtitulo,
    lang: "de",
    rutaNext: ruta.experiencia("de"),
    alternativas: alternativasPagina(ruta.experiencia),
  });

export default function Page() {
  return <Experiencia lang="de" />;
}
