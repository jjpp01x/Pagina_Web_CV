import { Formacion } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("de").formacion.titulo,
    descripcion: textos("de").formacion.subtitulo,
    lang: "de",
    rutaNext: ruta.formacion("de"),
    alternativas: alternativasPagina(ruta.formacion),
  });

export default function Page() {
  return <Formacion lang="de" />;
}
