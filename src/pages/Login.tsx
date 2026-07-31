import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import NavBar from '@/components/NavBar';
<<<<<<< HEAD
import GlobalBackground from '@/components/GlobalBackground';
import phdLogo from '@/assets/images/phd_app_logo_1785469467323.jpg';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Lock, UserCheck, ShieldCheck, Sparkles, HardHat } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const isSignUpMode = searchParams.get('modo') === 'cadastro';
  const destination = searchParams.get('destino');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signInWithPassword, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUpMode) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setErrorMsg(error);
          return;
        }
      } else {
        const { error } = await signInWithPassword(email, password);
        if (error) {
          setErrorMsg(error);
          return;
        }
      }

      if (destination === 'premium') {
        navigate('/premium');
      } else {
        navigate('/painel');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans relative overflow-hidden flex flex-col">
      <GlobalBackground />

      <NavBar dark />

      <div className="max-w-md mx-auto px-5 py-12 sm:py-20 w-full relative z-10 my-auto">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <img
              src={phdLogo}
              alt="Logo PHD Gestões"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl border border-cyan-400/30 mx-auto shadow-xl shadow-cyan-500/20 object-cover"
            />
            <h1 className="text-2xl font-extrabold text-white">
              {isSignUpMode ? 'Criar Conta PHD Gestões' : 'Acessar Conta'}
            </h1>
            <p className="text-xs text-slate-400">
              Gerencie cronograma, financeiro e equipe do seu canteiro.
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              <strong>Login ainda não configurado.</strong> Copie{' '}
              <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_URL</code> e{' '}
              <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code>{' '}
              do app mobile para o arquivo <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">.env</code> deste site, assim o login passa a usar a mesma conta.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {isSignUpMode && (
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-300">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Eng. Pedro Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-signal-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-300">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="engenheiro@obra.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-signal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-300">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-signal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-signal-500 hover:bg-signal-400 text-white font-extrabold text-sm shadow-xl shadow-signal-500/20 transition-all"
              >
                {loading ? 'Entrando…' : isSignUpMode ? 'Cadastrar e Entrar' : 'Entrar na Conta'}
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                {isSignUpMode ? (
                  <span>
                    Já possui conta?{' '}
                    <Link to="/login" className="text-signal-400 font-bold hover:underline">
                      Entrar
                    </Link>
                  </span>
                ) : (
                  <span>
                    Não possui conta?{' '}
                    <Link to="/login?modo=cadastro" className="text-signal-400 font-bold hover:underline">
                      Cadastrar
                    </Link>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
=======
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
>>>>>>> 81e650ff911497f9aa49347baba54842db56952b
      </div>
    </div>
  );
}
