import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet, MessageCircle, Package, CalendarDays, Wifi, Download, ArrowRight, Check, Mic,
} from 'lucide-react';
import NavBar from '@/components/NavBar';

const FEATURES = [
  {
    icon: Wallet,
    title: 'Financeiro sem planilha',
    desc: 'Orçamento previsto x realizado, fluxo de caixa, pagamentos a fornecedores e curva S — tudo com alerta automático de estouro de orçamento.',
  },
  {
    icon: MessageCircle,
    title: 'Chat de obra com áudio',
    desc: 'O time de campo manda um áudio no meio do serviço em vez de parar pra digitar. Texto, foto e áudio no mesmo chat da obra.',
  },
  {
    icon: Package,
    title: 'Estoque de materiais',
    desc: 'Entrada e saída de material com alerta de estoque baixo, sem depender de planilha ou de perguntar pro almoxarife.',
  },
  {
    icon: CalendarDays,
    title: 'Cronograma físico-financeiro',
    desc: 'Compare o quanto a obra já avançou fisicamente com o quanto já foi gasto do orçamento — no mesmo gráfico.',
  },
  {
    icon: Wifi,
    title: 'Funciona sem internet',
    desc: 'Lança material, diário e relatório offline no canteiro. Sincroniza com sua confirmação assim que a conexão voltar.',
  },
  {
    icon: Mic,
    title: 'Permissão por pessoa, não por app',
    desc: 'Escritório e campo no mesmo aplicativo, cada um vendo só o que precisa — sem instalar um app pra cada função.',
  },
];

const PLANS = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '/sempre',
    tagline: 'Pra obra pequena testar sem compromisso',
    features: ['1 obra ativa', 'Chat de obra (texto)', 'Cronograma e tarefas', 'Diário de obra'],
    cta: 'Criar conta grátis',
    highlight: false,
  },
  {
    name: 'Premium',
    price: 'sob consulta',
    period: '',
    tagline: 'Pra quem toca obra de verdade',
    features: [
      'Obras ilimitadas',
      'Financeiro completo (orçamento, caixa, curva S)',
      'Chat com foto e áudio',
      'Modo offline com sincronização',
      'Relatórios em PDF',
    ],
    cta: 'Ver planos Premium',
    highlight: true,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-concrete-100 text-blueprint-950">
      <NavBar dark />

      {/* ===== HERO ===== */}
      <section className="relative bg-blueprint-950 text-concrete-100 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.12]" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-signal-500/20 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blueprint-line text-xs font-mono uppercase tracking-widest text-signal-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-500 animate-pulse" />
            App de gestão de obras
          </div>

          <h1 className="font-heading font-extrabold uppercase text-[13vw] leading-[0.92] tracking-tight sm:text-6xl md:text-7xl md:leading-[0.95] max-w-4xl">
            Gestão de obra
            <br />
            sem <span className="text-signal-500">burocracia</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg text-concrete-400 leading-relaxed">
            Cronograma, financeiro, materiais e equipe da sua obra num app só.
            Sem integração SINAPI, sem preço engessado, sem curva de aprendizado
            de uma semana. Você orça do seu jeito e começa a usar hoje.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/login?modo=cadastro"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-signal-500 text-white font-bold hover:bg-signal-400 transition-colors"
            >
              Criar conta grátis <ArrowRight size={18} />
            </Link>
            <Link
              to="/baixar"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-concrete-400/40 font-bold hover:border-signal-500 hover:text-signal-400 transition-colors"
            >
              <Download size={18} /> Baixar o APK
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-2 font-mono text-xs text-concrete-400">
            <span className="revision-stamp text-signal-400 px-2 py-1">REV. 1.0.1</span>
            <span>· instalado ocupa 11,75&nbsp;MB · Android hoje, iOS em avaliação</span>
          </div>
        </div>
      </section>

      {/* ===== RECURSOS ===== */}
      <section id="recursos" className="max-w-6xl mx-auto px-5 py-24">
        <div className="max-w-2xl mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-signal-500">O que tem dentro</span>
          <h2 className="font-heading font-bold uppercase text-4xl md:text-5xl mt-3 leading-tight">
            Feito pra quem toca obra, não pra quem preenche formulário
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-concrete-200 border border-concrete-200">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-concrete-100 p-7 hover:bg-white transition-colors">
              <f.icon className="text-signal-500" size={28} strokeWidth={1.75} />
              <h3 className="font-heading font-bold text-xl uppercase mt-4">{f.title}</h3>
              <p className="mt-2 text-sm text-concrete-700 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PLANOS ===== */}
      <section id="planos" className="bg-blueprint-950 text-concrete-100 py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="max-w-2xl mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-signal-400">Planos</span>
            <h2 className="font-heading font-bold uppercase text-4xl md:text-5xl mt-3 leading-tight">
              Comece grátis. Libere o Premium quando a obra crescer.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-lg border ${
                  plan.highlight
                    ? 'border-signal-500 bg-blueprint-900 relative'
                    : 'border-blueprint-line bg-blueprint-900/40'
                }`}
              >
                {plan.highlight && (
                  <span className="revision-stamp absolute -top-3 right-6 bg-signal-500 text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1">
                    Mais usado
                  </span>
                )}
                <h3 className="font-heading font-bold uppercase text-2xl">{plan.name}</h3>
                <p className="text-sm text-concrete-400 mt-1">{plan.tagline}</p>
                <div className="mt-5 font-mono">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-concrete-400 text-sm">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-concrete-200">
                      <Check size={16} className="text-signal-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.highlight ? '/login?modo=cadastro&destino=premium' : '/login?modo=cadastro'}
                  className={`mt-8 block text-center py-3 rounded-md font-bold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-signal-500 text-white hover:bg-signal-400'
                      : 'border border-concrete-400/40 hover:border-signal-500 hover:text-signal-400'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-concrete-400 mt-6 font-mono">
            * Obras grandes / construtoras: fale com a gente pra um contrato sob medida, fora da loja.
          </p>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="max-w-6xl mx-auto px-5 py-24 text-center">
        <h2 className="font-heading font-bold uppercase text-4xl md:text-5xl leading-tight">
          Sua próxima medição já pode
          <br /> estar registrada certinho
        </h2>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/login?modo=cadastro"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-signal-500 text-white font-bold hover:bg-signal-400 transition-colors"
          >
            Criar conta grátis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-concrete-200 py-10">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-concrete-700">
          <span className="font-heading font-bold uppercase tracking-tight">PHD Gestões</span>
          <span className="font-mono text-xs text-concrete-400">© 2026 · Gestão de obras</span>
        </div>
      </footer>
    </div>
  );
}
