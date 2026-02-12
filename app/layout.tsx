import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import TopNav from "./components/TopNav";
import HeaderActions from "./components/HeaderActions";
import "./globals.css";

// Configura a fonte principal usada em todo o site.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configura a fonte monoespaçada para trechos especiais.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configura a fonte principal inspirada no design solicitado.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Define os metadados globais usados pelo Next.js.
export const metadata: Metadata = {
  title: "Voz Pública",
  description: "Portal de participação cidadã e informação pública.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} bg-[color:var(--background)] text-[color:var(--foreground)] antialiased`}
      >
        {/* Container geral que simula o layout com barra lateral e conteúdo central. */}
        <div className="min-h-screen bg-[color:var(--background)]">
          {/* Barra superior com navegação e ações rápidas adaptadas para mobile e desktop. */}
          <header className="relative z-50 mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-6 pt-6 sm:px-6 md:flex-row md:items-center md:justify-between md:pt-8">
            {/* Marca do site alinhada à esquerda em todas as resoluções. */}
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-[#b67ee8] to-[#fea076] bg-clip-text text-2xl font-semibold text-transparent">
                Voz Pública
              </span>
            </div>
            {/* Navegação principal com painel compacto em mobile e barra horizontal em desktop. */}
            <div className="flex w-full justify-start md:w-auto md:flex-1 md:justify-center">
              <TopNav />
            </div>
            {/* Ações rápidas alinhadas com comportamento fluido para evitar quebra em ecrãs pequenos. */}
            <div className="flex w-full items-center justify-start md:w-auto md:justify-end">
              <HeaderActions />
            </div>
          </header>

          {/* Conteúdo principal renderizado por cada página. */}
          <main className="relative z-0 mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
            {children}
          </main>

          {/* Rodapé removido conforme pedido. */}
        </div>
      </body>
    </html>
  );
}
