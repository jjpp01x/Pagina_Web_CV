import { baseURL } from "@/resources";

// Requerido con output: export — si no, el build falla al recoger la ruta.
export const dynamic = "force-static";

/**
 * El grupo `*` declaraba un `User-Agent` y ninguna directiva. Es valido -- un
 * grupo vacio no prohibe nada -- pero un `Allow: /` explicito se lee sin
 * ambiguedad y es lo que sirven los otros dos dominios.
 *
 * No se bloquea ningun rastreador de IA a proposito. GPTBot, ClaudeBot,
 * PerplexityBot y Google-Extended pueden entrar: bloquearlos impide que esos
 * motores entrenen con el contenido, pero tambien impide que lo CITEN, y aqui
 * el objetivo es que citen.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}
