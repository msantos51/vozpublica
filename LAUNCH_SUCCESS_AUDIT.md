# Launch & Success Audit — PubliQuestão

## Objetivo
Checklist prático do que falta para o site estar pronto para lançamento e aumentar a probabilidade de sucesso de produto.

## Estado atual observado
- O projeto usa Next.js App Router com páginas institucionais, autenticação básica e sistema de votações.
- Existe backend para registo/login, gestão de polls e submissão de votos.
- Há suporte inicial para admin por e-mail configurado em variável de ambiente.

## Lacunas críticas antes de lançar

### 1) Autenticação/sessão ainda frágil
**Risco:** endpoints críticos aceitam `email` no payload/query sem sessão assinada do utilizador.

**Evidência no código:**
- Login devolve dados do utilizador, mas não cria cookie de sessão/token no servidor.
- Rotas de admin e voto confiam no e-mail enviado pelo cliente.

**Ação recomendada:**
- Implementar sessão segura via cookie HTTP-only assinado (ou NextAuth/Auth.js).
- Trocar `requesterEmail`/`email` por identidade de sessão no servidor.
- Adicionar middleware para proteger rotas admin.

### 2) Falta proteção anti-abuso
**Risco:** brute force/login abuse e spam de requests podem degradar segurança e disponibilidade.

**Ação recomendada:**
- Rate limiting por IP + endpoint (login, register, vote, admin).
- Captcha progressivo em ações sensíveis.
- Logs e alertas para padrões anómalos.

### 3) Observabilidade insuficiente para produção
**Risco:** falhas em produção sem diagnóstico rápido.

**Ação recomendada:**
- Logging estruturado com request id.
- Error tracking (ex.: Sentry).
- Métricas de latência/erro e uptime checks.

### 4) Qualidade e CI/CD incompletos
**Risco:** regressões em deploy.

**Ação recomendada:**
- Corrigir lockfile e garantir instalação determinística.
- Pipeline com `lint`, `typecheck`, testes e build.
- Bloquear merge sem checks verdes.

### 5) Conformidade legal e confiança
**Risco:** baixa confiança do utilizador e risco legal (dados pessoais).

**Ação recomendada:**
- Publicar Política de Privacidade, Termos e base legal de tratamento.
- Banner/gestão de cookies conforme necessidade.
- Página “Como garantimos integridade das votações”.

## Lacunas de produto para “ter sucesso”

### 6) Proposta de valor e onboarding
**Risco:** utilizadores não percebem em segundos porque voltar.

**Ação recomendada:**
- Hero com promessa mensurável.
- Onboarding em 2–3 passos.
- Empty states com CTAs claros.

### 7) Loops de retenção
**Risco:** tráfego inicial sem recorrência.

**Ação recomendada:**
- Notificações (email/push) para novas votações.
- Resumo semanal com resultados.
- Perfil com histórico de participação.

### 8) Distribuição e growth
**Risco:** produto bom sem aquisição.

**Ação recomendada:**
- SEO técnico + páginas para temas relevantes.
- Programa de partilha social por votação.
- Parcerias com comunidades/associações locais.

### 9) Analytics orientado a decisão
**Risco:** decisões de produto sem dados.

**Ação recomendada:**
- Definir North Star Metric (ex.: votos válidos semanais).
- Funil: visita → registo → 1º voto → 2ª votação.
- Cohorts de retenção D1/D7/D30.

### 10) Acessibilidade e performance
**Risco:** abandono por UX/performance e pior SEO.

**Ação recomendada:**
- Meta de Lighthouse (Perf/A11y/SEO >= 90).
- Revisão de contraste, foco teclado e labels ARIA.
- Otimizar carregamento e conteúdo acima da dobra.

## Plano de execução sugerido (30 dias)

### Semana 1 — Segurança e base de produção
- Sessão server-side + proteção admin.
- Rate limiting em endpoints críticos.
- Política de privacidade/termos publicados.

### Semana 2 — Confiabilidade
- CI/CD completo e checks obrigatórios.
- Logging + monitorização + alertas.
- Backup e plano de recuperação.

### Semana 3 — Conversão e retenção
- Melhorias no onboarding e CTAs.
- Instrumentação de analytics/funil.
- Experimentos A/B de hero e fluxo de voto.

### Semana 4 — Distribuição
- SEO técnico e conteúdos de entrada.
- Loop de partilha e campanhas iniciais.
- Painel semanal com métricas de crescimento.

## Definição prática de “pronto para lançar”
- Segurança: sem rotas críticas dependentes de e-mail no client.
- Operação: monitorização + alertas ativos.
- Qualidade: build e lint verdes em CI.
- Legal: páginas legais publicadas.
- Produto: funil monitorizado e baseline de retenção medido.
