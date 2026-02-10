"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProfile = {
  fullName: string;
  email: string;
  city: string;
  interest: string;
};

type UserFormState = UserProfile & {
  password: string;
};

type UserPreferences = {
  receiveNewsletter: boolean;
  allowNotifications: boolean;
};

type ProfileResponse = {
  user?: {
    fullName: string;
    email: string;
    city: string | null;
    interest: string | null;
  };
  message?: string;
};

type UpdateResponse = {
  message: string;
};

const sessionStorageKey = "vp_session";
const preferencesStorageKey = "vp_preferences";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserFormState | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    receiveNewsletter: true,
    allowNotifications: true,
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Garante que apenas utilizadores autenticados acedem ao dashboard.
    const storedSession = localStorage.getItem(sessionStorageKey);

    if (!storedSession) {
      router.push("/login");
      return;
    }

    setSessionEmail(storedSession);

    const loadProfile = async () => {
      try {
        const response = await fetch(
          `/api/user?email=${encodeURIComponent(storedSession)}`
        );
        const data = (await response.json()) as ProfileResponse;

        if (!response.ok || !data.user) {
          router.push("/login");
          return;
        }

        setProfile({
          fullName: data.user.fullName,
          email: data.user.email,
          city: data.user.city ?? "",
          interest: data.user.interest ?? "",
          password: "",
        });
      } catch (error) {
        router.push("/login");
      }
    };

    loadProfile();

    const storedPreferences = localStorage.getItem(preferencesStorageKey);
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences) as UserPreferences);
    }
  }, [router]);

  const handleProfileChange = (field: keyof UserFormState, value: string) => {
    if (!profile) {
      return;
    }

    setProfile({ ...profile, [field]: value });
  };

  const handlePreferenceChange = (field: keyof UserPreferences) => {
    setPreferences((previous) => ({ ...previous, [field]: !previous[field] }));
  };

  const handleSave = async () => {
    if (!profile || !sessionEmail || isSaving) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail: sessionEmail,
          email: profile.email,
          fullName: profile.fullName,
          city: profile.city,
          interest: profile.interest,
          password: profile.password ? profile.password : undefined,
        }),
      });

      const data = (await response.json()) as UpdateResponse;

      if (!response.ok) {
        setFeedback(data.message);
        return;
      }

      // Atualiza as preferências no armazenamento local.
      localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
      setProfile({ ...profile, password: "" });
      if (sessionEmail !== profile.email) {
        localStorage.setItem(sessionStorageKey, profile.email);
        setSessionEmail(profile.email);
      }
      setFeedback(data.message);
    } catch (error) {
      setFeedback("Não foi possível guardar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // Remove a sessão ativa e regressa ao login.
    localStorage.removeItem(sessionStorageKey);
    router.push("/login");
  };

  if (!profile) {
    return null;
  }

  return (
    <section className="space-y-8">
      {/* Contém o conteúdo centrado e agrupado em caixas. */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Cabeçalho com o título do dashboard dentro de um cartão. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h1 className="page-title">Dashboard</h1>
            <p className="text-base leading-7 text-justify text-slate-500">
              Atualize os seus dados pessoais e ajuste as preferências da sua conta.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Painel de edição dos dados pessoais. */}
          <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
            <div className="flex flex-col gap-6">
              <div>
                <p className="section-label">Perfil</p>
                <h2 className="mt-2 section-title">Informações pessoais</h2>
                <p className="mt-2 text-sm text-justify text-slate-500">
                  Mantenha os seus dados atualizados para uma experiência mais personalizada.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Nome completo
                  <input
                    className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                    name="fullName"
                    type="text"
                    value={profile.fullName}
                    onChange={(event) => handleProfileChange("fullName", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  E-mail
                  <input
                    className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={(event) => handleProfileChange("email", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Cidade
                  <input
                    className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                    name="city"
                    type="text"
                    value={profile.city}
                    onChange={(event) => handleProfileChange("city", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Área de interesse
                  <input
                    className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                    name="interest"
                    type="text"
                    value={profile.interest}
                    onChange={(event) => handleProfileChange("interest", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Nova senha
                  <input
                    className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                    name="password"
                    placeholder="Atualize a sua senha"
                    type="password"
                    value={profile.password}
                    onChange={(event) => handleProfileChange("password", event.target.value)}
                  />
                </label>
              </div>
              {feedback && (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-justify text-emerald-700">
                  {feedback}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="button-size-login bg-[color:var(--primary)] text-white shadow-sm transition hover:brightness-95"
                  type="button"
                  onClick={handleSave}
                >
                  {isSaving ? "A guardar..." : "Guardar alterações"}
                </button>
                <button
                  className="button-size-login border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
                  type="button"
                  onClick={handleLogout}
                >
                  Terminar sessão
                </button>
              </div>
            </div>
          </article>

          {/* Painel lateral com funções básicas da conta. */}
          <aside className="space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
              <h3 className="card-title">Preferências</h3>
              <p className="mt-2 text-sm text-justify text-slate-500">
                Ajuste as opções essenciais para receber comunicações.
              </p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between text-sm text-slate-700">
                  Receber newsletter
                  <input
                    className="h-4 w-4 accent-[color:var(--primary)]"
                    type="checkbox"
                    checked={preferences.receiveNewsletter}
                    onChange={() => handlePreferenceChange("receiveNewsletter")}
                  />
                </label>
                <label className="flex items-center justify-between text-sm text-slate-700">
                  Notificações da comunidade
                  <input
                    className="h-4 w-4 accent-[color:var(--primary)]"
                    type="checkbox"
                    checked={preferences.allowNotifications}
                    onChange={() => handlePreferenceChange("allowNotifications")}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[32px] bg-[color:var(--surface)] p-6 text-sm text-slate-600 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
              <p className="font-semibold text-[color:var(--foreground)]">
                Dicas rápidas
              </p>
              <ul className="mt-3 space-y-2 text-justify">
                <li>Atualize o perfil sempre que mudar de cidade.</li>
                <li>Ative as notificações para receber novidades.</li>
                <li>Guarde as alterações antes de sair.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
