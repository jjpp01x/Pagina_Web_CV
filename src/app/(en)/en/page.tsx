import { Portada } from "@/components/paginas";
import { construirMeta } from "@/lib/meta";
import { alternativasPagina } from "@/lib/contenido";
import { textos } from "@/content/textos";
import { persona } from "@/content/persona";
import { ruta } from "@/lib/rutas";

export const generateMetadata = () =>
  construirMeta({
    titulo: `${persona.nombre} — ${persona.rol}`,
    descripcion: textos("en").hero.descripcion,
    lang: "en",
    rutaNext: ruta.inicio("en"),
    alternativas: alternativasPagina(ruta.inicio),
  });

export default function Page() {
  return <Portada lang="en" />;
}
