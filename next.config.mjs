import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages solo sirve ficheros estaticos.
  output: "export",
  // Sin barra final, el export escribe out/education.html en vez de
  // out/education/index.html. Es lo que preserva las 48 URLs ya indexadas.
  trailingSlash: false,
  // Obligatorio con output: export, o el build falla.
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
