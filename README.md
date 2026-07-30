# PHD Gestões — Site

Site com login, painel web (versão web do app) e página de upgrade Premium,
usando o **mesmo Supabase** do app mobile — quem cria conta aqui consegue
entrar com a mesma conta no app, e vice-versa.

## 1. Configurar

```bash
npm install
cp .env.example .env
```

Abra `.env` e cole os **mesmos** valores que estão no `.env` do projeto do app
mobile (`PHD-GESTOES-1.0.1-main/.env`):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## 2. Rodar a migração do banco (uma vez só)

No painel do Supabase do MESMO projeto usado pelo app → **SQL Editor** → cole
o conteúdo de `supabase/migrations/20260730000000_premium_subscriptions.sql`
e rode. Isso adiciona:
- `profiles.premium_status` (`'free'` ou `'premium'`) e `profiles.premium_expires_at`
- tabela `subscriptions`, pronta pra receber pagamentos de qualquer gateway

## 3. Rodar local

```bash
npm run dev
```

Abre em `http://localhost:3000`.

## 4. Conectar o pagamento (quando decidir o gateway)

O botão "Assinar Premium" em `src/pages/Premium.tsx` está pronto, mas o
checkout em si está como placeholder (`handleStartCheckout`). Quando decidir
entre Mercado Pago ou Stripe:

1. Criar uma Supabase Edge Function que gera o link/preferência de pagamento
2. Trocar o `TODO` em `handleStartCheckout` pela chamada dessa função
3. Criar uma segunda Edge Function como webhook do gateway, que confirma o
   pagamento e atualiza `subscriptions` + `profiles.premium_status` — **nunca**
   deixe o próprio app do usuário marcar a assinatura como paga direto no banco

## 5. Colocar o APK pra download

Gere o `.apk` assinado a partir do projeto do app (`npm run cap:sync` +
build release no Android Studio) e coloque o arquivo em:

```
public/downloads/phd-gestoes.apk
```

A página `/baixar` já aponta pra esse caminho.

## 6. Build de produção

```bash
npm run build
```

Gera a pasta `dist/` pronta pra subir em qualquer hospedagem de site estático
(Vercel, Netlify, Cloudflare Pages etc).

## 7. Publicar na Vercel (grátis)

1. Suba esta pasta pra um repositório novo no GitHub (o `.gitignore` já
   exclui `node_modules`, `dist` e `.env` — não sobem por engano).
2. Entre em [vercel.com](https://vercel.com) e faça login com a conta do GitHub.
3. **Add New Project** → escolha esse repositório. A Vercel detecta sozinha
   que é um projeto Vite/React (não precisa mudar nenhuma configuração de build).
4. Antes de clicar em Deploy, vá em **Environment Variables** e adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (os mesmos valores do `.env` do app mobile)
5. Clique em **Deploy**. Em ~1 minuto você recebe um link tipo
   `phd-gestoes.vercel.app`, já no ar.

O arquivo `vercel.json` já está configurado pra redirecionar todas as rotas
pro `index.html` — sem isso, dar F5 em `/painel` ou `/login` cairia num 404,
porque essas páginas só existem no roteamento do React, não como arquivos reais.

Depois do primeiro deploy, qualquer `git push` pro repositório já republica
o site sozinho, sem precisar repetir esses passos.

## Estrutura

- `src/App.tsx` — landing page
- `src/pages/Login.tsx` — login/cadastro (Supabase Auth)
- `src/pages/Dashboard.tsx` — painel web, lê as mesmas tabelas do app; Financeiro
  fica bloqueado se o usuário não for Premium
- `src/pages/Premium.tsx` — página de upgrade (checkout ainda por conectar)
- `src/pages/Download.tsx` — download do APK
- `src/lib/auth.tsx` — contexto de autenticação
- `src/lib/supabase.ts` — cliente Supabase (mesmas credenciais do app)
