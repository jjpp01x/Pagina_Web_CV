import { SobreMi } from "@/components/paginas";
import { alternativasPagina } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("en").sobre.titulo,
    descripcion: textos("en").sobre.parrafos[0],
    lang: "en",
    rutaNext: ruta.sobreMi("en"),
    alternativas: alternativasPagina(ruta.sobreMi),
  });

export default function Page() {
  return <SobreMi lang="en" />;
}
