import React, { useState } from 'react';
import { Check, Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import GlobalBackground from '@/components/GlobalBackground';

const PREMIUM_FEATURES = [
  'Obras ilimitadas simultâneas',
  'Orçamento previsto x realizado com alerta de desvio',
  'Fluxo de caixa completo e gestão de pagamentos',
  'Curva S (avanço físico x desembolso financeiro)',
  'Chat da obra com envio de fotos e mensagens de áudio',
  'Modo offline completo com sincronização inteligente',
  'Emissão de relatórios e Ordens de Serviço em PDF',
];

export default function Premium() {
  const { isPremium } = useAuth();
  const [starting, setStarting] = useState(false);

  const handleStartCheckout = async () => {
    setStarting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      alert(
        'Integração de checkout pronta para receber a chave do gateway (Mercado Pago ou Stripe).'
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans relative overflow-hidden flex flex-col">
      <GlobalBackground />

      <NavBar dark />

      <div className="max-w-xl mx-auto px-5 py-16 sm:py-24 w-full relative z-10 my-auto">
        {isPremium ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
              Assinatura Ativa
            </span>
            <h1 className="text-3xl font-extrabold text-white">Você já é Membro Premium</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Todos os recursos financeiros e obras ilimitadas já estão ativados na sua conta.
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-signal-500/20 text-signal-400 border border-signal-500/30 font-mono text-xs font-bold uppercase tracking-wider">
                Plano Premium Profissional
              </span>
              <h1 className="text-3xl font-extrabold text-white">Libere o controle financeiro total</h1>
              <p className="text-sm text-slate-400">
                Transforme a gestão de orçamentos e insumos da sua construtora.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <ul className="space-y-3">
                {PREMIUM_FEATURES.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <Check className="w-5 h-5 text-signal-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={handleStartCheckout}
                disabled={starting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-signal-500 via-orange-500 to-amber-500 hover:from-signal-400 hover:to-orange-400 text-white font-extrabold text-base shadow-xl shadow-signal-500/25 transition-all flex items-center justify-center gap-2"
              >
                {starting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{starting ? 'Processando…' : 'Assinar Plano Premium'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 font-mono">
                Assinatura flexível sem fidelidade obrigatoria.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
