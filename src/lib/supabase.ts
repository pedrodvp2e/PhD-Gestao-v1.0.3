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

// Upload de fotos (comprovantes de material, ocorrências etc.) — espelha o mesmo
// bucket 'project-photos' usado no app mobile, pra manter tudo no mesmo lugar.
export async function uploadProjectPhoto(
  projectId: string,
  kind: 'diario' | 'ocorrencia' | 'nota-fiscal' | 'chat-imagem',
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!file.type.startsWith('image/')) {
    return { url: null, error: 'Selecione um arquivo de imagem válido.' };
  }
  const MAX_SIZE_MB = 8;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { url: null, error: `O arquivo deve ter no máximo ${MAX_SIZE_MB}MB.` };
  }
  if (!isSupabaseConfigured) {
    return { url: null, error: 'Supabase não configurado.' };
  }
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${projectId}/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('project-photos')
      .upload(filePath, file, { cacheControl: '3600', contentType: file.type });

    if (uploadError) return { url: null, error: uploadError.message };

    const { data: signedData, error: signedError } = await supabase.storage
      .from('project-photos')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    if (signedError || !signedData) {
      return { url: null, error: signedError?.message || 'Falha ao gerar link da imagem.' };
    }
    return { url: signedData.signedUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || 'Falha ao enviar a imagem.' };
  }
}
