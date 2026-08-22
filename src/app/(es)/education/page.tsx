import { Formacion } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("es").formacion.titulo,
    descripcion: textos("es").formacion.subtitulo,
    lang: "es",
    rutaNext: ruta.formacion("es"),
    alternativas: alternativasPagina(ruta.formacion),
  });

export default function Page() {
  return <Formacion lang="es" />;
}
