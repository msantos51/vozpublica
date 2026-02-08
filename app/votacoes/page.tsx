"use client";


import { useEffect, useMemo, useState } from "react";


type VotingHighlight = {
  title: string;
  description: string;
  status: string;
  deadline: string;
  isOpen: boolean;
};

type VotingQuestion = {
  title: string;
  prompt: string;
  options: string[];
};


type UserProfile = {
  fullName: string;
  email: string;
  city: string;
  interest: string;
  password: string;
};

type StoredVote = {
  email: string;
  option: string;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";
const votingStorageKey = "vp_vote_orcamento_2024";
const baseResponseCounts: Record<string, number> = {
  "Requalificação de bairros": 12,
  "Mobilidade urbana sustentável": 18,
  "Espaços públicos e lazer": 9,
};


export default function VotacoesPage() {
  // Lista das votações em destaque exibidas no topo da página.
  const votingHighlights: VotingHighlight[] = [
    {
      title: "Orçamento participativo 2024",
      description:
        "Defina as prioridades de investimento para bairros, mobilidade urbana e espaços públicos.",
      status: "Aberta",
      deadline: "Prazo: 30 de junho",
      isOpen: true,
    },
    {
      title: "Plano municipal de sustentabilidade",
      description:
        "Contribua com sugestões para reduzir emissões e ampliar a reciclagem na cidade.",
      status: "Em consulta",
      deadline: "Prazo: 18 de julho",
      isOpen: false,
    },
    {
      title: "Programa de juventude e emprego",
      description:
        "Vote em propostas que fortalecem formação profissional e oportunidades locais.",
      status: "A iniciar",
      deadline: "Abre em 5 dias",
      isOpen: false,
    },
  ];

  // Pergunta única utilizada para recolher prioridades do orçamento participativo.
  const votingQuestion: VotingQuestion = {
    title: "Orçamento participativo 2024",

    prompt: "Qual deve ser a prioridade de investimento para 2024?",

    options: [
      "Requalificação de bairros",
      "Mobilidade urbana sustentável",
      "Espaços públicos e lazer",
    ],
  };

  // Passos resumidos da experiência de participação.
  const votingSteps = [
    {
      title: "1. Informar",
      description:
        "Analise os documentos e dados disponibilizados antes de escolher uma opção.",
    },
    {
      title: "2. Participar",
      description:
        "Registe o seu voto com segurança e acompanhe o impacto em tempo real.",
    },
    {
      title: "3. Acompanhar",
      description:
        "Receba atualizações sobre a implementação das decisões votadas.",
    },
  ];

  // Controla se o utilizador abriu o painel de participação da votação aberta.
  const [isParticipationOpen, setIsParticipationOpen] = useState(false);

  // Guarda o estado de login para permitir ou bloquear a participação.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Guarda o email do utilizador autenticado para limitar um voto por conta.
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  // Guarda a opção selecionada no formulário.
  const [selectedOption, setSelectedOption] = useState<string>(
    votingQuestion.options[0]
  );
  // Armazena a contagem de respostas locais para simular recolha de dados.

  const [responseCounts, setResponseCounts] = useState<Record<string, number>>(
    baseResponseCounts
  );
  // Guarda a resposta previamente registada para permitir alteração.
  const [storedVote, setStoredVote] = useState<StoredVote | null>(null);
  // Indica se o utilizador já submeteu a resposta para mostrar resultados.
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Mensagem de confirmação exibida após o envio da resposta.
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );


  useEffect(() => {
    // Lê a sessão atual e a resposta guardada para sincronizar a experiência.
    const storedSession = localStorage.getItem(sessionStorageKey);
    const storedUser = localStorage.getItem(userStorageKey);

    if (!storedSession || !storedUser) {
      setIsLoggedIn(false);
      setSessionEmail(null);
      setResponseCounts(baseResponseCounts);
      return;
    }

    const parsedUser = JSON.parse(storedUser) as UserProfile;

    if (parsedUser.email !== storedSession) {
      setIsLoggedIn(false);
      setSessionEmail(null);
      setResponseCounts(baseResponseCounts);
      return;
    }

    setIsLoggedIn(true);
    setSessionEmail(parsedUser.email);

    const storedVoteRaw = localStorage.getItem(votingStorageKey);

    if (!storedVoteRaw) {
      setResponseCounts(baseResponseCounts);
      return;
    }

    const parsedVote = JSON.parse(storedVoteRaw) as StoredVote;

    if (parsedVote.email !== parsedUser.email) {
      setResponseCounts(baseResponseCounts);
      return;
    }

    setStoredVote(parsedVote);
    setSelectedOption(parsedVote.option);
    setHasSubmitted(true);
    setResponseCounts({
      ...baseResponseCounts,
      [parsedVote.option]: (baseResponseCounts[parsedVote.option] ?? 0) + 1,
    });
  }, [votingQuestion.options]);


  const totalResponses = useMemo(() => {
    return Object.values(responseCounts).reduce(
      (total, count) => total + count,
      0
    );
  }, [responseCounts]);

  const chartData = useMemo(() => {
    return votingQuestion.options.map((option) => {
      const count = responseCounts[option] ?? 0;
      const percentage = totalResponses
        ? Math.round((count / totalResponses) * 100)
        : 0;
      return {
        label: option,
        count,
        percentage,
      };
    });
  }, [responseCounts, totalResponses, votingQuestion.options]);

  const handleParticipationToggle = () => {
    setIsParticipationOpen((previous) => !previous);
    setConfirmationMessage(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    if (!isLoggedIn || !sessionEmail) {
      setConfirmationMessage("Faça login para poder participar.");
      return;
    }

    setResponseCounts((previous) => {
      const nextCounts = { ...previous };

      if (storedVote?.option && storedVote.option !== selectedOption) {
        nextCounts[storedVote.option] = Math.max(
          (nextCounts[storedVote.option] ?? 1) - 1,
          0
        );
      }

      if (!storedVote || storedVote.option !== selectedOption) {
        nextCounts[selectedOption] = (nextCounts[selectedOption] ?? 0) + 1;
      }

      return nextCounts;
    });

    const nextVote: StoredVote = {
      email: sessionEmail,
      option: selectedOption,
    };

    localStorage.setItem(votingStorageKey, JSON.stringify(nextVote));
    setStoredVote(nextVote);
    setHasSubmitted(true);
    setConfirmationMessage(
      storedVote
        ? "Resposta atualizada com sucesso."
        : "Resposta registada com sucesso."
    );
  };

  const isOpenVoting = votingHighlights[0]?.isOpen ?? false;
  const canParticipate = isLoggedIn && isOpenVoting;
  const hasStoredVote = Boolean(storedVote);


  return (
    <section className="space-y-10">
      {/* Área principal com largura máxima e espaçamento entre blocos. */}
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* Cabeçalho com resumo da experiência de votações. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Participação ativa
            </p>
            <h1 className="text-3xl font-semibold text-zinc-900">Votações</h1>
            <p className="text-base leading-7 text-justify text-zinc-600">
              Acompanhe as consultas públicas em aberto, participe nas decisões
              locais e veja como a sua escolha impacta o planeamento urbano.
            </p>
          </div>
        </header>

        {/* Destaques das votações em cartões com status. */}
        <div className="grid gap-6 lg:grid-cols-3">
          {votingHighlights.map((voting) => (
            <article key={voting.title} className="card">
              {/* Camada translúcida para realçar o conteúdo. */}
              <div className="bg" />
              {/* Efeito visual animado ao fundo do cartão. */}
              <div className="blob" />
              {/* Conteúdo textual principal do cartão. */}
              <div className="card-content space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {voting.title}
                  </h2>
                  <p className="text-sm leading-6 text-justify text-zinc-600">
                    {voting.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {voting.status}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {voting.deadline}
                  </span>
                </div>
                {voting.isOpen ? (
                  <button
                    type="button"
                    onClick={handleParticipationToggle}
                    className="w-full rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                  >

                    {isParticipationOpen
                      ? "Fechar votação"
                      : isLoggedIn
                        ? "Participar (Aberta)"
                        : "Login para participar"}

                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-400"
                  >
                    Participação indisponível
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Bloco interativo para recolher dados da votação aberta. */}
        <section className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-[0_15px_35px_rgba(249,115,22,0.12)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Orçamento participativo 2024
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900">
                {votingQuestion.prompt}
              </h2>
              <p className="text-sm text-zinc-600">
                Participação disponível apenas para utilizadores com login
                efetuado.
              </p>
            </div>

            {isParticipationOpen ? (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Formulário de resposta única. */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-6"
                >
                  <fieldset className="space-y-3">
                    <legend className="text-base font-semibold text-zinc-900">
                      Selecione uma prioridade
                    </legend>
                    {votingQuestion.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-3 text-sm text-zinc-700 shadow-sm"
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={option}
                          checked={selectedOption === option}
                          onChange={() => setSelectedOption(option)}

                          disabled={!canParticipate}

                          className="h-4 w-4 text-orange-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>

                  <button
                    type="submit"

                    disabled={!canParticipate}
                    className="w-full rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-200"
                  >
                    {hasStoredVote ? "Atualizar resposta" : "Registar resposta"}

                  </button>

                  {confirmationMessage ? (
                    <p className="text-sm font-medium text-green-600">
                      {confirmationMessage}
                    </p>
                  ) : null}


                  {!canParticipate ? (
                    <p className="text-sm text-orange-700">
                      É necessário ter login ativo para votar.
                    </p>
                  ) : null}

                  {hasStoredVote && isOpenVoting ? (
                    <p className="text-sm text-zinc-600">
                      Pode alterar a sua resposta enquanto a votação estiver
                      aberta.
                    </p>
                  ) : null}
                </form>

                {/* Painel de resultados apresentado apenas após submissão. */}
                <div className="space-y-4 rounded-2xl border border-orange-100 bg-white p-6">
                  {hasSubmitted ? (
                    <>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-zinc-900">
                          Resultado parcial
                        </h3>
                        <p className="text-sm text-zinc-500">
                          {totalResponses} respostas registadas
                        </p>
                      </div>

                      <div className="space-y-4">
                        {chartData.map((item) => (
                          <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-medium text-zinc-700">
                              <span>{item.label}</span>
                              <span>
                                {item.percentage}% ({item.count})
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-orange-100">
                              <div
                                className="h-2 rounded-full bg-orange-500"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-orange-700">
                      Submeta a sua resposta para ver os resultados atuais.
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-orange-700">
                Clique no botão "Participar (Aberta)" para responder e acompanhar
                o gráfico de resultados.
              </p>
            )}
          </div>
        </section>

        {/* Guia rápido de como participar. */}
        <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-[0_15px_35px_rgba(249,115,22,0.12)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Como participar
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {votingSteps.map((step) => (
                <div key={step.title} className="space-y-2">
                  <h3 className="text-base font-semibold text-orange-700">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-justify text-zinc-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
