import { baseURL } from "@/resources";

// Requerido con output: export — si no, el build falla al recoger la ruta.
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
