import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithPassword, signUp } = useAuth();

  const [mode, setMode] = useState<'entrar' | 'cadastro'>(
    params.get('modo') === 'cadastro' ? 'cadastro' : 'entrar'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const destino = params.get('destino') === 'premium' ? '/premium' : '/painel';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result =
      mode === 'entrar'
        ? await signInWithPassword(email, password)
        : await signUp(email, password, fullName);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate(destino);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-concrete-100">
        <NavBar />
        <div className="max-w-md mx-auto px-5 py-24 text-center">
          <h1 className="font-heading font-bold uppercase text-2xl">Login ainda não configurado</h1>
          <p className="mt-3 text-sm text-concrete-700 leading-relaxed">
            Copie <code className="font-mono bg-concrete-200 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> e{' '}
            <code className="font-mono bg-concrete-200 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> do
            arquivo <code className="font-mono bg-concrete-200 px-1.5 py-0.5 rounded">.env</code> do app mobile
            pra um arquivo <code className="font-mono bg-concrete-200 px-1.5 py-0.5 rounded">.env</code> aqui na
            raiz do site, assim o login passa a usar a mesma conta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-concrete-100">
      <NavBar />

      <div className="max-w-md mx-auto px-5 py-16 sm:py-24">
        <div className="flex border border-blueprint-950 rounded-md overflow-hidden mb-8">
          <button
            onClick={() => setMode('entrar')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              mode === 'entrar' ? 'bg-blueprint-950 text-white' : 'bg-transparent text-blueprint-950'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode('cadastro')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              mode === 'cadastro' ? 'bg-blueprint-950 text-white' : 'bg-transparent text-blueprint-950'
            }`}
          >
            Criar conta
          </button>
        </div>

        <h1 className="font-heading font-bold uppercase text-3xl mb-1">
          {mode === 'entrar' ? 'Acessar sua conta' : 'Criar conta grátis'}
        </h1>
        <p className="text-sm text-concrete-700 mb-8">
          {mode === 'entrar'
            ? 'A mesma conta que você usa no app.'
            : 'Leva menos de um minuto. Depois use o mesmo login no app mobile.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'cadastro' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-concrete-700 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-concrete-400/50 bg-white text-sm focus:border-signal-500 outline-none"
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-concrete-700 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-concrete-400/50 bg-white text-sm focus:border-signal-500 outline-none"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-concrete-700 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-concrete-400/50 bg-white text-sm focus:border-signal-500 outline-none"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-error font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-md bg-signal-500 text-white font-bold hover:bg-signal-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Um momento…' : mode === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-8 text-xs text-center text-concrete-700">
          Prefere usar pelo celular?{' '}
          <Link to="/baixar" className="font-bold text-signal-500 hover:underline">
            Baixe o APK
          </Link>
        </p>
      </div>
    </div>
  );
}
