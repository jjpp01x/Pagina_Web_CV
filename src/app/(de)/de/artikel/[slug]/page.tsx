import { notFound } from "next/navigation";

import { PaginaArticulo } from "@/components/paginas";
import { alternativasArticulo, getArticulo, getArticulos } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { ruta } from "@/lib/rutas";

export function generateStaticParams() {
  return getArticulos("de").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = getArticulo("de", slug);
  if (!articulo) return {};
  return construirMeta({
    titulo: articulo.title,
    descripcion: articulo.description,
    lang: "de",
    rutaNext: ruta.articulo("de", slug),
    alternativas: alternativasArticulo(articulo.translationKey),
    imagen: articulo.image,
    tipo: "article",
    publicado: articulo.date,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = getArticulo("de", slug);
  if (!articulo) notFound();
  return <PaginaArticulo articulo={articulo} lang="de" />;
}
