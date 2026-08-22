import { Contacto } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("de").contacto.titulo,
    descripcion: textos("de").contacto.subtitulo,
    lang: "de",
    rutaNext: ruta.contacto("de"),
    alternativas: alternativasPagina(ruta.contacto),
  });

export default function Page() {
  return <Contacto lang="de" />;
}
