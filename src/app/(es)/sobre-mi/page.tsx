import { SobreMi } from "@/components/paginas";
import { alternativasPagina } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("es").sobre.titulo,
    descripcion: textos("es").sobre.parrafos[0],
    lang: "es",
    rutaNext: ruta.sobreMi("es"),
    alternativas: alternativasPagina(ruta.sobreMi),
  });

export default function Page() {
  return <SobreMi lang="es" />;
}
