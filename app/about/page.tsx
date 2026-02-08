export default function AboutPage() {
  return (
    <section className="space-y-10">
      {/* Contém o conteúdo centrado e agrupado num único cartão. */}
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* Cartão principal com o texto institucional atualizado. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          {/* Bloco de texto com a história, o propósito e a missão. */}
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-zinc-900">
              Sobre a <span className="text-[#b67ee8]">Voz Pública</span>
            </h1>
            <p className="text-base leading-7 text-justify text-zinc-600">
              A <span className="text-[#b67ee8]">Voz Pública</span> nasceu para
              dar espaço à opinião das pessoas. Acreditamos que todos devem
              poder participar, votar e acompanhar a opinião coletiva sobre os
              temas que realmente importam — de forma simples, acessível e
              transparente.
            </p>
            <p className="text-base leading-7 text-justify text-zinc-600">
              Aqui, qualquer pessoa pode fazer parte das votações, partilhar o
              seu ponto de vista e ver como a sua opinião se cruza com a de
              milhares de outras pessoas. Não há respostas certas ou erradas.
              Há apenas pessoas reais a expressar o que pensam.
            </p>
            <p className="text-base leading-7 text-justify text-zinc-600">
              Ao mesmo tempo, a <span className="text-[#b67ee8]">Voz Pública</span>{" "}
              transforma essa participação em conhecimento. As votações geram
              dados anónimos e agregados que permitem identificar tendências,
              padrões e sinais relevantes da sociedade.
            </p>
            <p className="text-base leading-7 text-justify text-zinc-600">
              É por isso que a <span className="text-[#b67ee8]">Voz Pública</span>{" "}
              é também uma oportunidade para empresas, marcas e organizações.
              Através de estudos de opinião discretos e imparciais, ajudamos a
              compreender melhor públicos, perceções e comportamentos — sem
              expor marcas, sem enviesar respostas e sempre com respeito total
              pela privacidade.
            </p>
            <p className="text-base leading-7 text-justify text-zinc-600">
              A nossa missão é simples:
            </p>
            <p className="text-base leading-7 text-justify font-semibold text-zinc-700">
              dar voz às pessoas e transformar essa voz em dados claros, úteis e
              responsáveis.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
