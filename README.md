# VozPublica

Plataforma web para participação cívica e votação pública, construída com Next.js (App Router) e PostgreSQL.

## Requisitos

- Node.js 22.x
- npm 10+
- PostgreSQL com variável `DATABASE_URL`

## Execução local

1. Instale dependências:

```bash
npm install
```

2. Defina as variáveis de ambiente num ficheiro `.env.local`.

3. Inicie em modo desenvolvimento:

```bash
npm run dev
```

4. Abra `http://localhost:3000`.

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy no Render (Node Web Service)

Para evitar o erro `No runtime configured` mostrado nos logs, confirme estes pontos:

1. **Repositório correto**
   - O serviço no Render tem de apontar para este repositório (`vozpublica`).
   - Se os logs mostrarem `Cloning from .../ClienteMisterio`, o Render está ligado ao projeto errado.

2. **Build command**

```bash
npm ci && npm run build
```

3. **Start command**

```bash
npm run start
```

4. **Node version**
   - Defina `22.x` no Render (já compatível com o `package.json`).

5. **Variáveis obrigatórias**
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `ADMIN_EMAIL`

6. **Variáveis recomendadas para e-mail**
   - `RESEND_API_KEY`
   - `RESEND_FROM`
   - `APP_BASE_URL`

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

```text
/admin/polls
```

No painel é possível:
- criar polls;
- definir datas de abertura e fecho;
- alterar estado (`draft`, `open`, `closed`).

## Configuração de envio de e-mail com Resend

Defina estas variáveis no ambiente de execução:

```bash
RESEND_API_KEY=<resend-api-key>
RESEND_FROM="PubliQuestão <onboarding@resend.dev>"

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
