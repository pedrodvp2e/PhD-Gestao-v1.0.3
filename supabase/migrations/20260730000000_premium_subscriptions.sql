-- ==========================================================
-- PHD Gestões — Estrutura de assinatura Premium
-- Rode esta migração no MESMO projeto Supabase usado pelo app mobile
-- (Supabase Dashboard > SQL Editor > cole e execute), pra manter tudo
-- na mesma base de usuários (profiles).
--
-- Feita de propósito SEM amarrar num gateway específico (Mercado Pago
-- ou Stripe ainda não decidido) — guarda o "provider" como texto livre,
-- então dá pra plugar qualquer um sem migrar o schema de novo.
-- ==========================================================

-- 1) Status de acesso Premium direto no perfil (consulta rápida em toda a UI)
alter table public.profiles
  add column if not exists premium_status text not null default 'free'
    check (premium_status in ('free', 'premium')),
  add column if not exists premium_expires_at timestamptz;

-- 2) Histórico/controle de assinaturas e pagamentos
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null default 'premium',
  status text not null default 'pending'
    check (status in ('pending', 'active', 'canceled', 'expired', 'failed')),
  provider text,                 -- 'mercado_pago' | 'stripe' | outro, definido depois
  provider_reference text,       -- id da cobrança/assinatura no gateway escolhido
  amount_cents integer,
  currency text default 'BRL',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- 3) RLS: o usuário só enxerga a própria assinatura.
-- IMPORTANTE: não existe policy de INSERT/UPDATE para o usuário comum de propósito —
-- quem marca uma assinatura como "active" é sempre o backend (Edge Function com
-- service role), depois de confirmar o pagamento direto com o gateway via webhook.
-- Isso evita que alguém libere o Premium pra si mesmo manipulando o app.
alter table public.subscriptions enable row level security;

create policy "Usuário vê apenas as próprias assinaturas"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ==========================================================
-- PRÓXIMO PASSO (quando escolher o gateway):
-- Criar uma Supabase Edge Function (ex: /functions/payment-webhook) que:
--   1. Recebe o webhook de confirmação de pagamento do Mercado Pago/Stripe
--   2. Valida a assinatura do webhook (segurança)
--   3. Faz upsert em public.subscriptions com status='active'
--   4. Atualiza public.profiles.premium_status='premium' e premium_expires_at
-- Isso é rodado com a service_role key (nunca exposta no site), então fica
-- fora do alcance do usuário final.
-- ==========================================================
