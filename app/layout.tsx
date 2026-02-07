import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
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
              <nav className="hidden items-center gap-2 rounded-full bg-[color:var(--surface)] px-2 py-1 text-sm shadow-sm md:flex">
                <Link
                  className="rounded-full bg-[color:var(--primary)] px-4 py-2 text-white transition"
                  href="/"
                >
                  Home
                </Link>
                <Link
                  className="rounded-full px-4 py-2 text-slate-500 transition hover:text-slate-700"
                  href="/about"
                >
                  About
                </Link>
                <Link
                  className="rounded-full px-4 py-2 text-slate-500 transition hover:text-slate-700"
                  href="/contact"
                >
                  Contact
                </Link>
              </nav>
            </div>
            {/* Ações rápidas alinhadas à direita. */}
            <div className="flex items-center gap-4">
              {/* Botão de login para acesso rápido do usuário. */}
              <button className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300">
                Login
              </button>
              {/* Resumo do perfil com espaço reservado para foto do usuário. */}
              <div className="flex items-center gap-3 rounded-full bg-[color:var(--surface)] px-4 py-2 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[color:var(--primary)] text-[10px] font-semibold text-[color:var(--primary)]">
                  Foto
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Lia Martins</p>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo principal renderizado por cada página. */}
          <main className="mx-auto w-full max-w-6xl px-6 pb-16">
            {children}
          </main>

          {/* Rodapé com mensagem institucional. */}
          <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-sm text-slate-400">
            Construímos pontes entre cidadãos e instituições públicas.
          </footer>
        </div>
      </body>
    </html>
  );
}
