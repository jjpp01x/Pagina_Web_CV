import { notFound } from "next/navigation";

import { PaginaProyecto } from "@/components/paginas";
import { alternativasProyecto, getProyecto, getProyectos } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { ruta } from "@/lib/rutas";

export function generateStaticParams() {
  return getProyectos("es").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proyecto = getProyecto("es", slug);
  if (!proyecto) return {};
  return construirMeta({
    titulo: proyecto.title,
    descripcion: proyecto.description,
    lang: "es",
    rutaNext: ruta.proyecto("es", slug),
    alternativas: alternativasProyecto(proyecto.translationKey),
    imagen: proyecto.image,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proyecto = getProyecto("es", slug);
  if (!proyecto) notFound();
  return <PaginaProyecto proyecto={proyecto} lang="es" />;
}
