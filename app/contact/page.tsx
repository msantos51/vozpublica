export default function ContactPage() {
  return (
    <section className="space-y-8">
      {/* Cabeçalho com título e descrição de contato. */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-zinc-900">Contact</h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          Fale com a equipa da Voz Pública para parcerias, dúvidas ou suporte
          institucional.
        </p>
      </header>

      {/* Cartão com informações principais de contato. */}
      <article className="rounded-2xl border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Informações</h2>
        <div className="mt-4 space-y-3 text-sm text-zinc-600">
          <p>
            <span className="font-semibold text-zinc-900">Email:</span>{" "}
            contato@vozpublica.org
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Telefone:</span>{" "}
            +351 210 000 000
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Atendimento:</span>{" "}
            Segunda a sexta, 9h às 18h
          </p>
        </div>
      </article>
    </section>
  );
}
