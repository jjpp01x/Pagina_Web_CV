import { Contacto } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("en").contacto.titulo,
    descripcion: textos("en").contacto.subtitulo,
    lang: "en",
    rutaNext: ruta.contacto("en"),
    alternativas: alternativasPagina(ruta.contacto),
  });

export default function Page() {
  return <Contacto lang="en" />;
}
