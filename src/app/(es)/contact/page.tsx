import { Contacto } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("es").contacto.titulo,
    descripcion: textos("es").contacto.subtitulo,
    lang: "es",
    rutaNext: ruta.contacto("es"),
    alternativas: alternativasPagina(ruta.contacto),
  });

export default function Page() {
  return <Contacto lang="es" />;
}
