import { createClient } from '@supabase/supabase-js';

// Mesmo projeto Supabase do app mobile PHD Gestões — use as MESMAS credenciais
// que estão no .env do app (pasta PHD-GESTOES-1.0.1-main/.env), assim quem
// faz login aqui no site é a mesma conta/usuário do app.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Fica só no console — a UI trata isso com uma tela de aviso amigável (ver src/App.tsx)
  console.warn('[PHD Gestões] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configurados. Copie o .env do app mobile.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'phd-gestoes-auth', // mesma chave usada no app: numa sessão de navegador dá pra reaproveitar
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (null as any);
