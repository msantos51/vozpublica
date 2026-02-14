"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type UserProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  birthDate: string;
  city: string;
  gender: string;
  educationLevel: string;
  nationalId: string;
  hasNationalId: boolean;
  profileCompleted: boolean;
  isAdmin: boolean;
};

type UserPreferences = {
  receiveNewsletter: boolean;
  allowNotifications: boolean;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type ProfileResponse = {
  user?: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    birthDate: string | null;
    city: string | null;
    gender: string | null;
    educationLevel: string | null;
    hasNationalId: boolean;
    profileCompleted: boolean;
    isAdmin: boolean;
  };
  message?: string;
};

type UpdateResponse = {
  message: string;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";
const preferencesStorageKey = "vp_preferences";

const educationOptions = [
  { value: "6th_grade", label: "6º Ano" },
  { value: "9th_grade", label: "9º Ano" },
  { value: "12th_grade", label: "12º Ano" },
  { value: "bachelor", label: "Licenciatura" },
  { value: "master", label: "Mestrado" },
  { value: "doctorate", label: "Doutoramento" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    receiveNewsletter: true,
    allowNotifications: true,
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);
  const [firstAccessFeedback, setFirstAccessFeedback] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isCompletingFirstAccess, setIsCompletingFirstAccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const mustCompleteProfile = useMemo(() => {
    if (!profile) {
      return false;
    }

    return !profile.profileCompleted || !profile.hasNationalId;
  }, [profile]);

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
        const response = await fetch("/api/user");
        const data = (await response.json()) as ProfileResponse;

        if (!response.ok || !data.user) {
          router.push("/login");
          return;
        }

        const normalizedProfile: UserProfile = {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          fullName: data.user.fullName,
          email: data.user.email,
          birthDate: data.user.birthDate ?? "",
          city: data.user.city ?? "",
          gender: data.user.gender ?? "",
          educationLevel: data.user.educationLevel ?? "",
          nationalId: "",
          hasNationalId: data.user.hasNationalId,
          profileCompleted: data.user.profileCompleted,
          isAdmin: data.user.isAdmin,
        };

        setProfile(normalizedProfile);
        localStorage.setItem(userStorageKey, JSON.stringify(normalizedProfile));
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

  const handleProfileChange = (field: keyof UserProfile, value: string | boolean) => {
    if (!profile) {
      return;
    }

    setProfile({ ...profile, [field]: value } as UserProfile);
  };

  const handlePreferenceChange = (field: keyof UserPreferences) => {
    setPreferences((previous) => ({ ...previous, [field]: !previous[field] }));
  };

  const handlePasswordFieldChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((previous) => ({ ...previous, [field]: value }));
  };

  const hasNationalIdValue = (nationalId: string, hasNationalId: boolean) => {
    return hasNationalId || nationalId.trim().length > 0;
  };

  const saveProfile = async (isFirstAccessCompletion: boolean) => {
    if (!profile || !sessionEmail) {
      return;
    }

    const setSavingState = isFirstAccessCompletion
      ? setIsCompletingFirstAccess
      : setIsSavingProfile;
    const setFeedbackState = isFirstAccessCompletion
      ? setFirstAccessFeedback
      : setProfileFeedback;

    setSavingState(true);
    setFeedbackState(null);

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate,
          city: profile.city,
          gender: profile.gender,
          educationLevel: profile.educationLevel,
          nationalId: profile.nationalId,
        }),
      });

      const data = (await response.json()) as UpdateResponse;

      if (!response.ok) {
        setFeedbackState(data.message);
        return;
      }


      const refreshedProfile: UserProfile = {
        ...profile,
        fullName: `${profile.firstName} ${profile.lastName}`.trim(),
        profileCompleted: true,
        hasNationalId: hasNationalIdValue(profile.nationalId, profile.hasNationalId),
        isAdmin: profile.isAdmin,
      };


      // Mantém sessão, preferências e perfil sincronizados após guardar alterações.
      localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
      localStorage.setItem(sessionStorageKey, profile.email);
      localStorage.setItem(userStorageKey, JSON.stringify(refreshedProfile));

      setSessionEmail(profile.email);
      setProfile(refreshedProfile);
      setFeedbackState(data.message);

    } catch (error) {
      setFeedbackState("Não foi possível guardar as alterações. Tente novamente.");
    } finally {
      setSavingState(false);
    }
  };

  const handleCompleteFirstAccess = async () => {
    if (!profile || isCompletingFirstAccess) {
      return;
    }

    setFirstAccessFeedback(null);

    if (
      !profile.birthDate ||
      !profile.city ||
      !profile.gender ||
      !profile.educationLevel ||
      !hasNationalIdValue(profile.nationalId, profile.hasNationalId)
    ) {
      setFirstAccessFeedback(
        "Preencha NIF, data de nascimento, cidade, género e habilitações literárias para concluir o primeiro acesso."
      );
      return;
    }

    await saveProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!profile || isSavingProfile) {
      return;
    }

    setProfileFeedback(null);

    if (
      !profile.birthDate ||
      !profile.city ||
      !profile.gender ||
      !profile.educationLevel ||
      !hasNationalIdValue(profile.nationalId, profile.hasNationalId)
    ) {
      setProfileFeedback(
        "NIF, data de nascimento, cidade, género e habilitações literárias são obrigatórios."
      );
      return;
    }

    await saveProfile(false);
  };

  const handleChangePassword = async () => {
    if (!sessionEmail || isSavingPassword) {
      return;
    }

    setPasswordFeedback(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPasswordFeedback("Preencha a senha atual e a nova senha com confirmação.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordFeedback("A confirmação da nova senha deve ser igual à nova senha.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmNewPassword: passwordForm.confirmNewPassword,
        }),
      });

      const data = (await response.json()) as UpdateResponse;

      if (!response.ok) {
        setPasswordFeedback(data.message);
        return;
      }

      setPasswordFeedback(data.message);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      setPasswordFeedback("Não foi possível atualizar a senha. Tente novamente.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    // Termina a sessão no servidor e remove os dados locais antes do redirecionamento.
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem(sessionStorageKey);
    localStorage.removeItem(userStorageKey);
    router.push("/login");
  };

  if (!profile) {
    return <p className="text-sm text-slate-500">A carregar perfil...</p>;
  }

  return (
    <section className="space-y-8">
      {mustCompleteProfile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="section-title">Complete o seu perfil</h2>
            <p className="mt-2 text-sm text-justify text-slate-600">
              Os dados seguintes nunca serão partilhados e servem apenas para fins estatísticos. Este preenchimento é obrigatório para concluir o primeiro acesso.
            </p>
            <p className="mt-3 text-sm font-semibold text-[color:var(--primary)]">
              Preencha: NIF, data de nascimento, cidade, género e habilitações literárias.
            </p>


            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                NIF
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder={
                    profile.hasNationalId
                      ? "NIF já guardado. Digite apenas para atualizar"
                      : "Digite o seu NIF (9 dígitos)"
                  }
                  value={profile.nationalId}
                  onChange={(event) => handleProfileChange("nationalId", event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Data de nascimento
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  type="date"
                  value={profile.birthDate}
                  onChange={(event) => handleProfileChange("birthDate", event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Cidade
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  value={profile.city}
                  onChange={(event) => handleProfileChange("city", event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Género
                <select
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  value={profile.gender}
                  onChange={(event) => handleProfileChange("gender", event.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Habilitações literárias
                <select
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                  value={profile.educationLevel}
                  onChange={(event) => handleProfileChange("educationLevel", event.target.value)}
                >
                  <option value="">Selecione</option>
                  {educationOptions.map((educationOption) => (
                    <option key={educationOption.value} value={educationOption.value}>
                      {educationOption.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {firstAccessFeedback && (
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {firstAccessFeedback}
              </p>
            )}

            <div className="mt-4">
              <button
                className="button-size-login bg-[color:var(--primary)] text-white"
                type="button"
                onClick={handleCompleteFirstAccess}
              >
                {isCompletingFirstAccess ? "A concluir..." : "Concluir primeiro acesso"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <h1 className="page-title">Olá, {profile.firstName}</h1>
          <p className="mt-3 text-sm text-slate-600">Faça a gestão da sua conta e segurança.</p>
          {profile.isAdmin && (
            <a className="mt-3 inline-block text-sm font-semibold text-[color:var(--primary)]" href="/admin/polls">
              Ir para painel de administração de polls
            </a>
          )}
        </header>

        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Primeiro nome
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={profile.firstName}
                onChange={(event) => handleProfileChange("firstName", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Último nome
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={profile.lastName}
                onChange={(event) => handleProfileChange("lastName", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              E-mail
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={profile.email}
                onChange={(event) => handleProfileChange("email", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              NIF
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                inputMode="numeric"
                maxLength={9}
                placeholder={
                  profile.hasNationalId
                    ? "NIF já guardado. Digite apenas para atualizar"
                    : "Digite o seu NIF (9 dígitos)"
                }
                value={profile.nationalId}
                onChange={(event) => handleProfileChange("nationalId", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Data de nascimento
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                type="date"
                value={profile.birthDate}
                onChange={(event) => handleProfileChange("birthDate", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Cidade
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={profile.city}
                onChange={(event) => handleProfileChange("city", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Género
              <select
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={profile.gender}
                onChange={(event) => handleProfileChange("gender", event.target.value)}
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Habilitações literárias
              <select
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                value={profile.educationLevel}
                onChange={(event) => handleProfileChange("educationLevel", event.target.value)}
              >
                <option value="">Selecione</option>
                {educationOptions.map((educationOption) => (
                  <option key={educationOption.value} value={educationOption.value}>
                    {educationOption.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {profileFeedback && (
            <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {profileFeedback}
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              className="button-size-login bg-[color:var(--primary)] text-white"
              type="button"
              onClick={handleSaveProfile}
            >
              {isSavingProfile ? "A guardar..." : "Guardar perfil"}
            </button>
            <button
              className="button-size-login border border-slate-200"
              type="button"
              onClick={handleLogout}
            >
              Terminar sessão
            </button>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="section-title">Alterar palavra-passe</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2"
                placeholder="Senha atual"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  handlePasswordFieldChange("currentPassword", event.target.value)
                }
              />
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Nova senha"
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  handlePasswordFieldChange("newPassword", event.target.value)
                }
              />
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Confirmar nova senha"
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={(event) =>
                  handlePasswordFieldChange("confirmNewPassword", event.target.value)
                }
              />
            </div>
            {passwordFeedback && <p className="mt-4 text-sm text-slate-600">{passwordFeedback}</p>}
            <button
              className="button-size-login mt-4 bg-[color:var(--primary)] text-white"
              type="button"
              onClick={handleChangePassword}
            >

              {isSavingPassword ? "A atualizar..." : "Atualizar senha"}
            </button>
          </div>
        </article>

        <aside className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <h3 className="card-title">Preferências</h3>
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
        </aside>
      </div>
    </section>
  );
}
