This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Acesso de administrador (polls)

Para aceder ao painel `/admin/polls`, é necessário ter uma conta com permissão de admin.

### 1) Configurar o e-mail admin

Defina a variável de ambiente `ADMIN_EMAIL` com o e-mail que deve ser administrador:

```bash
ADMIN_EMAIL=admin@vozpublica.pt
```

### 2) Criar conta com esse e-mail

No registo (`/account`), crie a conta com exatamente o mesmo e-mail definido em `ADMIN_EMAIL`.

### 3) Iniciar sessão

Faça login com essa conta em `/login`. O sistema devolve `isAdmin: true` para essa sessão.

### 4) Abrir o painel admin

Aceda a:

```
/admin/polls
```

No painel é possível:
- criar polls;
- definir datas de abertura e fecho;
- alterar estado (`draft`, `open`, `closed`).

## Configuração de envio de e-mail com Resend (recuperação de password e confirmação de e-mail)

Defina estas variáveis no ambiente de execução:

```bash
RESEND_API_KEY=<resend-api-key>
RESEND_FROM="VozPublica <onboarding@resend.dev>"

# Opcional: endpoint custom (útil para testes/integração interna)
RESEND_API_URL=https://api.resend.com/emails

# Opcional: timeout da chamada HTTP em milissegundos
RESEND_TIMEOUT_MS=10000

# Recomendado: URL pública da aplicação para links dos e-mails
APP_BASE_URL=https://vozpublica.onrender.com
```

Notas importantes para Resend:
- `RESEND_API_KEY` é obrigatória para autorizar o envio.
- `RESEND_FROM` deve usar um remetente válido no Resend (domínio verificado em produção).
- `onboarding@resend.dev` pode ser usado para testes iniciais, seguindo as regras da conta.
- Se não definir `APP_BASE_URL`, o sistema tenta `NEXT_PUBLIC_APP_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL` e `RENDER_EXTERNAL_URL`; em último caso usa `http://localhost:3000`.
