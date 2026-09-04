import { Experiencia } from "@/components/paginas";
import { alternativasPagina } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("es").experiencia.titulo,
    descripcion: textos("es").experiencia.subtitulo,
    lang: "es",
    rutaNext: ruta.experiencia("es"),
    alternativas: alternativasPagina(ruta.experiencia),
  });

export default function Page() {
  return <Experiencia lang="es" />;
}
