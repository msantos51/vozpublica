"use client";

import { useEffect, useMemo, useState } from "react";

type PollStatus = "draft" | "open" | "closed";

type Poll = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  options: string[];
  status: PollStatus;
  starts_at: string | null;
  ends_at: string | null;
};

type PollResponse = {
  polls?: Poll[];
  message?: string;
};

type UserProfile = {
  fullName: string;
  email: string;
};

type StoredVote = {
  email: string;
  option: string;
};

type ChartItem = {
  label: string;
  count: number;
  percentage: number;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";

const votingSteps = [
  {
    title: "1. Informar",
    description:
      "Analise os documentos e dados disponibilizados antes de escolher uma opção.",
  },
  {
    title: "2. Participar",
    description: "Registe o seu voto com segurança e acompanhe o impacto em tempo real.",
  },
  {
    title: "3. Acompanhar",
    description: "Receba atualizações sobre a implementação das decisões votadas.",
  },
];

const formatDateTime = (value: string | null): string => {
  // Formata datas ISO da API para leitura simples no idioma do utilizador.
  if (!value) {
    return "Sem data definida";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return parsedDate.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: PollStatus): string => {
  // Traduz os estados técnicos para etiquetas amigáveis da interface.
  if (status === "open") {
    return "Aberta";
  }

  if (status === "closed") {
    return "Fechada";
  }

  return "Rascunho";
};

const getVoteStorageKey = (pollId: string): string => `vp_vote_${pollId}`;

const getBaseResponseCounts = (options: string[]): Record<string, number> => {
  // Cria um mapa base de resultados para garantir todas as opções visíveis no gráfico.
  return options.reduce<Record<string, number>>((accumulator, option) => {
    accumulator[option] = 0;
    return accumulator;
  }, {});
};

export default function VotacoesPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);
  const [pollsFeedback, setPollsFeedback] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const [activePollId, setActivePollId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [storedVote, setStoredVote] = useState<StoredVote | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const activePoll = useMemo(
    () => polls.find((poll) => poll.id === activePollId) ?? null,
    [polls, activePollId]
  );

  useEffect(() => {
    // Carrega as polls públicas (abertas/fechadas) para renderizar a página de votações.
    const loadPolls = async () => {
      setIsLoadingPolls(true);
      setPollsFeedback(null);

      try {

        const response = await fetch(`/api/polls?ts=${Date.now()}`, { cache: "no-store" });

        const data = (await response.json()) as PollResponse;

        if (!response.ok) {
          setPollsFeedback(data.message ?? "Não foi possível carregar as votações.");
          setPolls([]);
          setIsLoadingPolls(false);
          return;
        }

        const loadedPolls = data.polls ?? [];
        setPolls(loadedPolls);

        const firstOpenPoll = loadedPolls.find((poll) => poll.status === "open") ?? null;

        if (firstOpenPoll) {
          setActivePollId(firstOpenPoll.id);
        } else {
          setActivePollId(null);
        }
      } catch (error) {
        setPollsFeedback("Não foi possível carregar as votações. Tente novamente.");
        setPolls([]);
      } finally {
        setIsLoadingPolls(false);
      }
    };

    loadPolls();
  }, []);

  useEffect(() => {
    // Lê a sessão atual para controlar quem pode participar nas polls abertas.
    const storedSession = localStorage.getItem(sessionStorageKey);
    const storedUser = localStorage.getItem(userStorageKey);

    if (!storedSession || !storedUser) {
      setIsLoggedIn(false);
      setSessionEmail(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as UserProfile;

      if (parsedUser.email !== storedSession) {
        setIsLoggedIn(false);
        setSessionEmail(null);
        return;
      }

      setIsLoggedIn(true);
      setSessionEmail(parsedUser.email);
    } catch (error) {
      setIsLoggedIn(false);
      setSessionEmail(null);
    }
  }, []);

  useEffect(() => {
    // Sincroniza formulário e resultado local sempre que a poll ativa ou sessão mudam.
    if (!activePoll) {
      setSelectedOption("");
      setResponseCounts({});
      setStoredVote(null);
      setHasSubmitted(false);
      setConfirmationMessage(null);
      return;
    }

    const baseCounts = getBaseResponseCounts(activePoll.options);

    if (!activePoll.options.length) {
      setSelectedOption("");
      setResponseCounts(baseCounts);
      setStoredVote(null);
      setHasSubmitted(false);
      setConfirmationMessage(null);
      return;
    }

    setSelectedOption(activePoll.options[0]);
    setResponseCounts(baseCounts);
    setStoredVote(null);
    setHasSubmitted(false);
    setConfirmationMessage(null);

    if (!sessionEmail) {
      return;
    }

    const voteStorageKey = getVoteStorageKey(activePoll.id);
    const storedVoteRaw = localStorage.getItem(voteStorageKey);

    if (!storedVoteRaw) {
      return;
    }

    try {
      const parsedVote = JSON.parse(storedVoteRaw) as StoredVote;

      if (parsedVote.email !== sessionEmail || !activePoll.options.includes(parsedVote.option)) {
        localStorage.removeItem(voteStorageKey);
        return;
      }

      setStoredVote(parsedVote);
      setHasSubmitted(true);
      setSelectedOption(parsedVote.option);
      setResponseCounts({
        ...baseCounts,
        [parsedVote.option]: (baseCounts[parsedVote.option] ?? 0) + 1,
      });
    } catch (error) {
      localStorage.removeItem(voteStorageKey);
    }
  }, [activePoll, sessionEmail]);

  const totalResponses = useMemo(() => {
    return Object.values(responseCounts).reduce((total, count) => total + count, 0);
  }, [responseCounts]);

  const chartData = useMemo<ChartItem[]>(() => {
    if (!activePoll) {
      return [];
    }

    return activePoll.options.map((option) => {
      const count = responseCounts[option] ?? 0;
      const percentage = totalResponses ? Math.round((count / totalResponses) * 100) : 0;

      return {
        label: option,
        count,
        percentage,
      };
    });
  }, [activePoll, responseCounts, totalResponses]);

  const isActivePollOpen = activePoll?.status === "open";
  const canParticipate = isLoggedIn && isActivePollOpen;
  const isFormLocked = hasSubmitted && Boolean(storedVote);

  const handleOpenParticipation = (pollId: string) => {
    // Ativa a poll escolhida no cartão para abrir o formulário de participação.
    setActivePollId(pollId);
    setConfirmationMessage(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activePoll) {
      setConfirmationMessage("Selecione uma votação para participar.");
      return;
    }

    if (!isLoggedIn || !sessionEmail) {
      setConfirmationMessage("Faça login para poder participar.");
      return;
    }

    if (!isActivePollOpen) {
      setConfirmationMessage("Esta votação está encerrada e não aceita novas respostas.");
      return;
    }

    if (isFormLocked) {
      setConfirmationMessage("A sua resposta já foi submetida e não pode ser alterada.");
      return;
    }

    if (!selectedOption) {
      setConfirmationMessage("Selecione uma opção para continuar.");
      return;
    }

    setResponseCounts((previous) => ({
      ...previous,
      [selectedOption]: (previous[selectedOption] ?? 0) + 1,
    }));

    const nextVote: StoredVote = {
      email: sessionEmail,
      option: selectedOption,
    };

    localStorage.setItem(getVoteStorageKey(activePoll.id), JSON.stringify(nextVote));
    setStoredVote(nextVote);
    setHasSubmitted(true);
    setConfirmationMessage("Resposta registada com sucesso.");
  };

  return (
    <section className="space-y-10">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-4">
            <p className="section-label-uppercase">Participação ativa</p>
            <h1 className="page-title">Votações</h1>
            <p className="text-base leading-7 text-justify text-zinc-600">
              Acompanhe as consultas públicas em aberto, participe nas decisões locais e veja como a
              sua escolha impacta o planeamento urbano.
            </p>
          </div>
        </header>

        {isLoadingPolls ? (
          <p className="rounded-2xl bg-white p-4 text-sm text-zinc-600 shadow-sm">A carregar votações...</p>
        ) : null}

        {pollsFeedback ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            {pollsFeedback}
          </p>
        ) : null}

        {!isLoadingPolls && !polls.length ? (
          <p className="rounded-2xl border border-[color:var(--primary-soft)] bg-white p-4 text-sm text-zinc-600">
            Ainda não existem votações públicas. No painel admin, altere a poll para estado
            <strong> Aberta</strong> ou <strong>Fechada</strong> para aparecer aqui.
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          {polls.map((poll) => (
            <article key={poll.id} className="card">
              <div className="bg" />
              <div className="blob" />
              <div className="card-content space-y-4">
                <div className="space-y-2">
                  <h2 className="card-title">{poll.title}</h2>
                  <p className="text-sm leading-6 text-justify text-zinc-600">{poll.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[color:var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                    {formatStatus(poll.status)}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    Prazo: {formatDateTime(poll.ends_at)}
                  </span>
                </div>

                {poll.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => handleOpenParticipation(poll.id)}
                    className="button-size-login w-full border border-[color:var(--primary-soft)] bg-[color:var(--primary-soft)] text-[color:var(--primary)] transition hover:brightness-95"
                  >
                    {activePollId === poll.id
                      ? isLoggedIn
                        ? "Votação selecionada"
                        : "Selecionada (faça login)"
                      : "Participar (Aberta)"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="button-size-login w-full cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400"
                  >
                    Participação indisponível
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-[32px] border border-[color:var(--primary-soft)] bg-white p-8 shadow-[0_15px_35px_rgba(182,126,232,0.12)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="section-label-uppercase">Participação</p>
              <h2 className="section-title">{activePoll?.prompt ?? "Selecione uma votação aberta"}</h2>
              <p className="text-sm text-zinc-600">
                Participação disponível apenas para utilizadores com login efetuado e para votações
                em estado aberto.
              </p>
            </div>

            {activePoll ? (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 rounded-2xl border border-[color:var(--primary-soft)] bg-[color:var(--primary-soft)] p-6"
                >
                  <fieldset className="space-y-3">
                    <legend className="subsection-title">Selecione uma opção</legend>

                    {activePoll.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-xl border border-[color:var(--primary-soft)] bg-white p-3 text-sm text-zinc-700 shadow-sm"
                      >
                        <input
                          type="radio"
                          name="poll_option"
                          value={option}
                          checked={selectedOption === option}
                          onChange={() => setSelectedOption(option)}
                          disabled={!canParticipate || isFormLocked}
                          className="h-4 w-4 text-[color:var(--primary)]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>

                  <button
                    type="submit"
                    disabled={!canParticipate || isFormLocked}
                    className="button-size-login w-full bg-[color:var(--primary)] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[color:var(--primary-soft)]"
                  >
                    {isFormLocked ? "Resposta submetida" : "Registar resposta"}
                  </button>

                  {confirmationMessage ? (
                    <p className="text-sm font-medium text-green-600">{confirmationMessage}</p>
                  ) : null}

                  {!canParticipate ? (
                    <p className="text-sm text-[color:var(--primary)]">
                      É necessário ter login ativo e votação aberta para participar.
                    </p>
                  ) : null}

                  {isFormLocked ? (
                    <p className="text-sm text-zinc-600">
                      A sua resposta já foi submetida e não pode ser alterada.
                    </p>
                  ) : null}
                </form>

                <div className="space-y-4 rounded-2xl border border-[color:var(--primary-soft)] bg-white p-6">
                  {hasSubmitted ? (
                    <>
                      <h3 className="subsection-title">Resultado parcial</h3>

                      <div className="space-y-4">
                        {chartData.map((item) => (
                          <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-medium text-zinc-700">
                              <span>{item.label}</span>
                              <span>{item.percentage}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-[color:var(--primary-soft)]">
                              <div
                                className="h-2 rounded-full bg-[color:var(--primary)]"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[color:var(--primary-soft)] bg-[color:var(--primary-soft)] p-4 text-sm text-[color:var(--primary)]">
                      Submeta a sua resposta para ver os resultados atuais.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-[color:var(--primary-soft)] bg-[color:var(--primary-soft)] p-4 text-sm text-[color:var(--primary)]">
                Quando existir uma votação aberta, selecione o cartão para participar.
              </p>
            )}
          </div>
        </section>

        <div className="rounded-[32px] border border-[color:var(--primary-soft)] bg-white p-8 shadow-[0_15px_35px_rgba(182,126,232,0.12)]">
          <div className="space-y-6">
            <h2 className="section-title">Como participar</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {votingSteps.map((step) => (
                <div key={step.title} className="space-y-2">
                  <h3 className="subsection-title text-[color:var(--primary)]">{step.title}</h3>
                  <p className="text-sm leading-6 text-justify text-zinc-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
