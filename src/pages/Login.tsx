import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import NavBar from '@/components/NavBar';
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error);
      setGoogleLoading(false);
    }
    // Em caso de sucesso o Supabase redireciona para o Google e depois de volta pro site.
  };

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
            <>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-70 text-slate-800 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.5 29.6 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.3-.3-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.5 29.6 3.5 24 3.5c-7.7 0-14.3 4.4-17.7 11.2z" />
                  <path fill="#4CAF50" d="M24 44.5c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4c-2 1.4-4.6 2.3-7.6 2.3-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 40 16.2 44.5 24 44.5z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C41.5 35.9 44.5 30.4 44.5 24c0-1.2-.1-2.3-.3-3.5z" />
                </svg>
                <span>{googleLoading ? 'Redirecionando…' : 'Entrar com Google'}</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">ou</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
