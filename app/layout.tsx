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
          {/* Barra superior com navegação e ações rápidas. */}
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-6 pt-8">
            {/* Marca e navegação principal do site. */}
            <div className="flex items-center gap-6">
              <span className="text-xl font-semibold text-slate-900">Voz Pública</span>
              {/* Componente cliente que controla o destaque do menu ativo. */}
              <TopNav />
            </div>
            {/* Ações rápidas alinhadas à direita (login ou perfil). */}
            <HeaderActions />
          </header>

          {/* Conteúdo principal renderizado por cada página. */}
          <main className="mx-auto w-full max-w-6xl px-6 pb-16">{children}</main>

          {/* Rodapé com mensagem institucional. */}
          <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-sm text-slate-400">
            Construímos pontes entre cidadãos e instituições públicas.
          </footer>
        </div>
      </body>
    </html>
  );
}
