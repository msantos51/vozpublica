import { query } from "@/lib/database";

export const closeExpiredOpenPolls = async () => {
  // Fecha automaticamente as polls abertas cujo prazo final já expirou.
  await query(
    `update polls
     set status = 'closed',
         updated_at = now()
     where status = 'open'
       and ends_at is not null
       and ends_at <= now()`
  );
};
