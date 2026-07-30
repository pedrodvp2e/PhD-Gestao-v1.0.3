import React, { useState } from 'react';
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
];

export default function Premium() {
  const { isPremium } = useAuth();
  const [starting, setStarting] = useState(false);

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
      );
    } finally {
      setStarting(false);
    }
  };

  return (
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
        )}
      </div>
    </div>
  );
}
