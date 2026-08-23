import { SobreMi } from "@/components/paginas";
import { alternativasPagina } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { textos } from "@/content/textos";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: textos("de").sobre.titulo,
    descripcion: textos("de").sobre.parrafos[0],
    lang: "de",
    rutaNext: ruta.sobreMi("de"),
    alternativas: alternativasPagina(ruta.sobreMi),
  });

export default function Page() {
  return <SobreMi lang="de" />;
}
