import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import NavBar from '@/components/NavBar';

const PREMIUM_FEATURES = [
  'Obras ilimitadas',
  'Orçamento previsto x realizado por categoria',
  'Fluxo de caixa e pagamentos a fornecedores',
  'Curva S (físico x financeiro) e custo por m²',
  'Chat de obra com foto e áudio',
  'Modo offline com sincronização',
>>>>>>> 81e650ff911497f9aa49347baba54842db56952b
];

export default function Premium() {
  const { isPremium } = useAuth();
  const [starting, setStarting] = useState(false);

<<<<<<< HEAD
  const handleStartCheckout = async () => {
    setStarting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      alert(
        'Integração de checkout pronta para receber a chave do gateway (Mercado Pago ou Stripe).'
=======
  // Ponto único de entrada pro checkout. Enquanto o gateway (Mercado Pago x Stripe)
  // não é escolhido, isso fica como stub: troque o corpo desta função por uma chamada
  // à sua Edge Function de checkout (ex: supabase.functions.invoke('create-checkout'))
  // que devolve a URL de pagamento do gateway escolhido, e redirecione o usuário pra lá.
  const handleStartCheckout = async () => {
    setStarting(true);
    try {
      // TODO: substituir pelo gateway escolhido. Exemplo de formato esperado:
      // const { data } = await supabase.functions.invoke('create-checkout', { body: { plan: 'premium' } });
      // window.location.href = data.checkout_url;
      await new Promise((r) => setTimeout(r, 600));
      alert(
        'Checkout ainda não conectado a um gateway de pagamento.\n\nQuando decidir entre Mercado Pago ou Stripe, me avisa que eu conecto esse botão à cobrança de verdade.'
>>>>>>> 81e650ff911497f9aa49347baba54842db56952b
      );
    } finally {
      setStarting(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-concrete-100">
      <NavBar />

      <div className="max-w-lg mx-auto px-5 py-16 sm:py-24">
        {isPremium ? (
          <div className="text-center">
            <span className="revision-stamp inline-block text-signal-500 font-mono text-xs uppercase tracking-widest px-3 py-1.5 mb-4">
              Ativo
            </span>
            <h1 className="font-heading font-bold uppercase text-3xl">Você já é Premium</h1>
            <p className="mt-3 text-sm text-concrete-700">
              Todos os recursos do Financeiro já estão liberados no seu painel e no app.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-signal-500">Plano Premium</span>
              <h1 className="font-heading font-bold uppercase text-3xl mt-2">Libere o financeiro completo</h1>
            </div>

            <div className="p-7 rounded-lg border-2 border-signal-500 bg-white">
              <ul className="space-y-3">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="text-signal-500 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleStartCheckout}
                disabled={starting}
                className="mt-7 w-full py-3.5 rounded-md bg-signal-500 text-white font-bold hover:bg-signal-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {starting && <Loader2 size={16} className="animate-spin" />}
                {starting ? 'Abrindo pagamento…' : 'Assinar Premium'}
              </button>
              <p className="text-[11px] text-center text-concrete-400 mt-3 font-mono">
                Pagamento processado por um parceiro externo (a definir)
              </p>
            </div>

            <p className="text-xs text-center text-concrete-700 mt-6">
              Obra grande ou construtora? Contrato à parte, fora da loja — fale com a gente.
            </p>
          </>
>>>>>>> 81e650ff911497f9aa49347baba54842db56952b
        )}
      </div>
    </div>
  );
}
