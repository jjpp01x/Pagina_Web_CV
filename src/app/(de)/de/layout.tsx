import { DocumentoBase } from "@/components/DocumentoBase";

// Root layout del arbol de. Los paréntesis del grupo no salen en la URL.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocumentoBase lang="de">{children}</DocumentoBase>;
}
