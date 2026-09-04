import { notFound } from "next/navigation";

import { PaginaArticulo } from "@/components/paginas";
import { alternativasArticulo, getArticulo, getArticulos } from "@/lib/contenido";
import { construirMeta } from "@/lib/meta";
import { ruta } from "@/lib/rutas";

export function generateStaticParams() {
  return getArticulos("en").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = getArticulo("en", slug);
  if (!articulo) return {};
  return construirMeta({
    titulo: articulo.title,
    descripcion: articulo.description,
    lang: "en",
    rutaNext: ruta.articulo("en", slug),
    tipoPagina: "articulo",
    alternativas: alternativasArticulo(articulo.translationKey),
    imagen: articulo.image,
    tipo: "article",
    publicado: articulo.date,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = getArticulo("en", slug);
  if (!articulo) notFound();
  return <PaginaArticulo articulo={articulo} lang="en" />;
}
