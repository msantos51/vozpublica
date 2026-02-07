import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-zinc-900 antialiased`}
      >
        {/* Cabeçalho com navegação principal do site. */}
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
            {/* Identidade visual do site. */}
            <span className="text-lg font-semibold">Voz Pública</span>
            {/* Links de navegação para as páginas principais. */}
            <nav className="flex gap-4 text-sm font-medium">
              <Link className="transition-colors hover:text-zinc-600" href="/">
                Home
              </Link>
              <Link
                className="transition-colors hover:text-zinc-600"
                href="/about"
              >
                Sobre
              </Link>
            </nav>
          </div>
        </header>

        {/* Conteúdo principal renderizado por cada página. */}
        <main className="mx-auto w-full max-w-5xl px-6 py-12">
          {children}
        </main>

        {/* Rodapé com mensagem institucional. */}
        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-zinc-500">
            Construímos pontes entre cidadãos e instituições públicas.
          </div>
        </footer>
      </body>
    </html>
  );
}
