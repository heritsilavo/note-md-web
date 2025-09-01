import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteMD | Historique",
  description: "la page historique d'une application de prise de note utilisant Markdow (creé avec; nextjs, tailwind) par heritsilavo",
};

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
   return <> {children} </> 
}