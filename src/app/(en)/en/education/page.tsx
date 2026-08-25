import { Formacion } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("en").formacion.titulo,
    descripcion: textos("en").formacion.subtitulo,
    lang: "en",
    rutaNext: ruta.formacion("en"),
    alternativas: alternativasPagina(ruta.formacion),
  });

export default function Page() {
  return <Formacion lang="en" />;
}
