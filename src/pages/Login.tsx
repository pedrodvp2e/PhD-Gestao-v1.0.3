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
      </div>
    </div>
  );
}
