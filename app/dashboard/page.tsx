"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProfile = {
  fullName: string;
  email: string;
  city: string;
  interest: string;
  password: string;
};

type UserPreferences = {
  receiveNewsletter: boolean;
  allowNotifications: boolean;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";
const preferencesStorageKey = "vp_preferences";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    receiveNewsletter: true,
    allowNotifications: true,
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Garante que apenas utilizadores autenticados acedem ao dashboard.
    const storedSession = localStorage.getItem(sessionStorageKey);
    const storedUser = localStorage.getItem(userStorageKey);

    if (!storedSession || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser) as UserProfile;

    if (parsedUser.email !== storedSession) {
      router.push("/login");
      return;
    }

    setProfile(parsedUser);

    const storedPreferences = localStorage.getItem(preferencesStorageKey);
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences) as UserPreferences);
    }
  }, [router]);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    if (!profile) {
      return;
    }

    setProfile({ ...profile, [field]: value });
  };

  const handlePreferenceChange = (field: keyof UserPreferences) => {
    setPreferences((previous) => ({ ...previous, [field]: !previous[field] }));
  };

  const handleSave = () => {
    if (!profile) {
      return;
    }

    // Atualiza os dados do utilizador e as preferências no armazenamento local.
    localStorage.setItem(userStorageKey, JSON.stringify(profile));
    localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
    setFeedback("Alterações guardadas com sucesso.");
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
      {/* Cabeçalho com o título do dashboard. */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-500">
          Atualize os seus dados pessoais e ajuste as preferências da sua conta.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Painel de edição dos dados pessoais. */}
        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-[color:var(--primary)]">
                Perfil
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Informações pessoais
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Mantenha os seus dados atualizados para uma experiência mais personalizada.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Nome completo
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                  name="fullName"
                  type="text"
                  value={profile.fullName}
                  onChange={(event) => handleProfileChange("fullName", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                E-mail
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={(event) => handleProfileChange("email", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Cidade
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                  name="city"
                  type="text"
                  value={profile.city}
                  onChange={(event) => handleProfileChange("city", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Área de interesse
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                  name="interest"
                  type="text"
                  value={profile.interest}
                  onChange={(event) => handleProfileChange("interest", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Nova senha
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                  name="password"
                  placeholder="Atualize a sua senha"
                  type="password"
                  value={profile.password}
                  onChange={(event) => handleProfileChange("password", event.target.value)}
                />
              </label>
            </div>
            {feedback && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedback}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                type="button"
                onClick={handleSave}
              >
                Guardar alterações
              </button>
              <button
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300"
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
            <h3 className="text-lg font-semibold text-slate-900">Preferências</h3>
            <p className="mt-2 text-sm text-slate-500">
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
            <p className="font-semibold text-slate-900">Dicas rápidas</p>
            <ul className="mt-3 space-y-2">
              <li>Atualize o perfil sempre que mudar de cidade.</li>
              <li>Ative as notificações para receber novidades.</li>
              <li>Guarde as alterações antes de sair.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
