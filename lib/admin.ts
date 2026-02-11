import { query } from "@/lib/database";

type AdminRow = {
  id: string;
  email: string;
  is_admin: boolean;
};

export const getAdminByEmail = async (email: string): Promise<AdminRow | null> => {
  // Procura o utilizador pelo e-mail normalizado para validar permissões de administração.
  const normalizedEmail = email.trim().toLowerCase();
  const result = await query<AdminRow>(
    "select id, email, is_admin from users where email = $1",
    [normalizedEmail]
  );

  return result.rows[0] ?? null;
};

export const ensureAdminAccess = async (email: string): Promise<AdminRow> => {
  // Bloqueia operações sensíveis quando a conta não existe ou não tem perfil de admin.
  const user = await getAdminByEmail(email);

  if (!user || !user.is_admin) {
    throw new Error("UNAUTHORIZED_ADMIN");
  }

  return user;
};
