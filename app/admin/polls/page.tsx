"use client";

import { useRouter } from "next/navigation";
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

type SessionUser = {
  email: string;
  isAdmin: boolean;
};

type PollForm = {
  title: string;
  description: string;
  prompt: string;
  options: string;
  startsAt: string;
  endsAt: string;
  status: PollStatus;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";

const emptyForm: PollForm = {
  title: "",
  description: "",
  prompt: "",
  options: "Sim\nNão",
  startsAt: "",
  endsAt: "",
  status: "draft",
};

export default function AdminPollsPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [form, setForm] = useState<PollForm>(emptyForm);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPoll = useMemo(
    () => polls.find((poll) => poll.id === selectedPollId) ?? null,
    [polls, selectedPollId]
  );

  useEffect(() => {
    try {
      // Carrega o utilizador da sessão para validar acesso ao painel de administração.
      const storedUser = localStorage.getItem(userStorageKey);

      if (!storedUser) {
        setSessionUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser) as SessionUser;
      const hasValidAdminShape =
        typeof parsedUser.email === "string" && typeof parsedUser.isAdmin === "boolean";

      if (!hasValidAdminShape) {
        setSessionUser(null);
        setFeedback("Sessão inválida. Faça login novamente.");
        return;
      }

      setSessionUser(parsedUser);
    } catch (error) {
      // Evita bloquear o ecrã em modo de carregamento quando o navegador bloqueia o localStorage.
      setSessionUser(null);
      setFeedback("Não foi possível validar a sessão neste navegador.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Busca as polls quando existe um admin autenticado.
    if (!sessionUser?.email || !sessionUser.isAdmin) {
      return;
    }

    const loadPolls = async () => {
      const response = await fetch(
        "/api/admin/polls"
      );
      const data = (await response.json()) as { polls?: Poll[]; message?: string };

      if (!response.ok) {
        setFeedback(data.message ?? "Não foi possível carregar as polls.");
        return;
      }

      setPolls(data.polls ?? []);
    };

    loadPolls();
  }, [sessionUser]);

  const mapPollToForm = (poll: Poll): PollForm => ({
    title: poll.title,
    description: poll.description,
    prompt: poll.prompt,
    options: poll.options.join("\n"),
    startsAt: poll.starts_at ? poll.starts_at.slice(0, 16) : "",
    endsAt: poll.ends_at ? poll.ends_at.slice(0, 16) : "",
    status: poll.status,
  });

  const handleSelectPoll = (poll: Poll) => {
    setSelectedPollId(poll.id);
    setForm(mapPollToForm(poll));
    setFeedback(null);
  };

  const handleNewPoll = () => {
    setSelectedPollId(null);
    setForm(emptyForm);
    setFeedback(null);
  };

  const handleSave = async () => {
    // Cria ou atualiza a poll de acordo com o item selecionado no painel.
    if (!sessionUser?.email) {
      setFeedback("Sem sessão ativa.");
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const payload = {
      title: form.title,
      description: form.description,
      prompt: form.prompt,
      options: form.options.split("\n").map((option) => option.trim()).filter(Boolean),
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
      status: form.status,
    };

    const endpoint = selectedPollId ? `/api/admin/polls/${selectedPollId}` : "/api/admin/polls";
    const method = selectedPollId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { message?: string; poll?: Poll };

    if (!response.ok) {
      setFeedback(data.message ?? "Não foi possível guardar a poll.");
      setIsSaving(false);
      return;
    }

    setFeedback(data.message ?? "Poll guardada com sucesso.");

    const refreshResponse = await fetch("/api/admin/polls");
    const refreshData = (await refreshResponse.json()) as { polls?: Poll[] };

    setPolls(refreshData.polls ?? []);
    setIsSaving(false);

    if (!selectedPollId && data.poll?.id) {
      setSelectedPollId(data.poll.id);
      setForm(mapPollToForm(data.poll));
    }
  };


  const handleAdminLogout = async () => {
    // Termina a sessão administrativa e limpa os dados locais para evitar acesso indevido.
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem(sessionStorageKey);
    localStorage.removeItem(userStorageKey);
    router.push("/login");
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">A carregar painel admin...</p>;
  }

  if (!sessionUser?.isAdmin) {
    return (
      <section className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <h1 className="page-title">Admin de Polls</h1>
        <p className="mt-3 text-sm text-slate-600">
          Esta área está disponível apenas para contas com permissões de administração.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold">Como aceder:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Defina a variável de ambiente <code>ADMIN_EMAIL</code> com o e-mail de administrador.</li>
            <li>Registe (ou use) uma conta com esse mesmo e-mail.</li>
            <li>Inicie sessão e volte a abrir esta página.</li>
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="page-title">Administração de Polls</h1>
            <p className="mt-3 text-sm text-slate-600">
              Crie polls, defina prazos e altere estados para abrir ou fechar votações.
            </p>
          </div>
          <button
            className="button-size-login border border-slate-200 bg-white"
            type="button"
            onClick={handleAdminLogout}
          >
            Terminar sessão (admin)
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Polls</h2>
            <button className="text-sm font-semibold text-[color:var(--primary)]" onClick={handleNewPoll}>
              Nova
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {polls.map((poll) => (
              <li key={poll.id}>
                <button
                  className={`w-full rounded-2xl border px-3 py-2 text-left text-sm ${
                    selectedPollId === poll.id
                      ? "border-[color:var(--primary)] bg-[color:var(--surface)]"
                      : "border-slate-200"
                  }`}
                  onClick={() => handleSelectPoll(poll)}
                >
                  <p className="font-semibold text-slate-700">{poll.title}</p>
                  <p className="text-xs text-slate-500">Estado: {poll.status}</p>
                </button>
              </li>
            ))}
            {!polls.length && <p className="text-sm text-slate-500">Ainda sem polls criadas.</p>}
          </ul>
        </aside>

        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Título
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={form.title}
                onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Descrição
              <textarea
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, description: event.target.value }))
                }
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Pergunta principal
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={form.prompt}
                onChange={(event) => setForm((previous) => ({ ...previous, prompt: event.target.value }))}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Opções (uma por linha)
              <textarea
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                rows={4}
                value={form.options}
                onChange={(event) => setForm((previous) => ({ ...previous, options: event.target.value }))}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Abre em
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, startsAt: event.target.value }))
                  }
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Fecha em
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(event) => setForm((previous) => ({ ...previous, endsAt: event.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Estado
                <select
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  value={form.status}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, status: event.target.value as PollStatus }))
                  }
                >
                  <option value="draft">Rascunho</option>
                  <option value="open">Aberta</option>
                  <option value="closed">Fechada</option>
                </select>
              </label>
            </div>

            {feedback && (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {feedback}
              </p>
            )}

            <div>
              <button
                className="button-size-login bg-[color:var(--primary)] text-white"
                disabled={isSaving}
                type="button"
                onClick={handleSave}
              >
                {isSaving ? "A guardar..." : selectedPoll ? "Guardar alterações" : "Criar poll"}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
