import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  MessageCircle,
  Package,
  CalendarDays,
  Wifi,
  Download,
  ArrowRight,
  Check,
  ShieldCheck,
  Building2,
  Users,
  Zap,
  Monitor,
  LayoutGrid,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Cpu,
  ChevronDown,
  HelpCircle,
  Smartphone,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import GlobalBackground from '@/components/GlobalBackground';
import phdLogo from '@/assets/images/phd_app_logo_1785469467323.jpg';

const FEATURES = [
  {
    icon: CalendarDays,
    color: 'from-violet-500 to-purple-500',
    glowColor: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:border-violet-500/60',
    glowBg: 'bg-violet-500/15',
    title: 'Cronograma Físico-Financeiro Desktop',
    desc: 'Visão expandida estilo Gantt para monitores e notebooks. Acompanhe o avanço da obra etapa por etapa com gráficos comparativos de desembolso.',
  },
  {
    icon: Wallet,
    color: 'from-amber-500 to-orange-500',
    glowColor: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:border-amber-500/60',
    glowBg: 'bg-amber-500/15',
    title: 'Gestão Financeira & Curva S',
    desc: 'Painel completo de previsto x realizado, controle de notas fiscais, medições de empreiteiros e alertas de estouro orçamentário.',
  },
  {
    icon: Package,
    color: 'from-emerald-500 to-teal-500',
    glowColor: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:border-emerald-500/60',
    glowBg: 'bg-emerald-500/15',
    title: 'Estoque de Materiais & Almoxarifado',
    desc: 'Tabelas detalhadas de insumos, histórico de compras por fornecedor e controle automatizado de saldo de materiais no canteiro.',
  },
  {
    icon: MessageCircle,
    color: 'from-cyan-500 to-blue-500',
    glowColor: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.35)] hover:border-cyan-500/60',
    glowBg: 'bg-cyan-500/15',
    title: 'Central de Ocorrências & Áudios',
    desc: 'Receba fotos e mensagens gravadas em campo pelo aplicativo mobile direto no seu painel web desktop com sincronização em tempo real.',
  },
  {
    icon: FileSpreadsheet,
    color: 'from-blue-500 to-indigo-500',
    glowColor: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:border-blue-500/60',
    glowBg: 'bg-blue-500/15',
    title: 'Diário de Obra & Relatórios PDF',
    desc: 'Emissão automatizada de diários de obra digitais com condições climáticas, contagem de mão de obra e exportação em alta resolução.',
  },
  {
    icon: ShieldCheck,
    color: 'from-rose-500 to-red-500',
    glowColor: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.35)] hover:border-rose-500/60',
    glowBg: 'bg-rose-500/15',
    title: 'Segurança & Ordens de Serviço',
    desc: 'Supervisão de checklists de EPI, registro de ocorrências de TST e emissão de Ordens de Serviço formais para terceirizados.',
  },
];

const DESKTOP_HIGHLIGHTS = [
  {
    icon: Monitor,
    title: 'Otimizado para Monitores & Widescreen',
    desc: 'Aproveitamento total da área de tela com tabelas expansíveis, abas laterais e múltiplos indicadores visuais simultâneos.',
  },
  {
    icon: LayoutGrid,
    title: 'Multi-Obras no Mesmo Painel',
    desc: 'Gerencie dezenas de canteiros simultaneamente com alternância rápida entre projetos e dashboards consolidados.',
  },
  {
    icon: Cpu,
    title: 'Sem Instalação Requerida',
    desc: 'Acesse diretamente pelo navegador Google Chrome, Edge ou Safari em qualquer computador com Windows, Mac ou Linux.',
  },
];

const PLANS = [
  {
    name: 'Degustação Web',
    price: 'R$ 0',
    period: '/sempre',
    tagline: 'Para engenheiros testarem no navegador do computador',
    features: [
      '1 obra ativa completa no painel web',
      'Cronograma físico de tarefas',
      'Diário de obra digital com registro de clima',
      'Chat de equipe em tempo real',
      'Acesso livre no modo demonstração',
    ],
    cta: 'Acessar Portal Demo',
    highlight: false,
  },
  {
    name: 'Portal Premium Construtora',
    price: 'R$ 89',
    period: '/mês por obra',
    tagline: 'Sistema completo para escritórios e canteiros',
    features: [
      'Obras ilimitadas no painel desktop',
      'Módulo financeiro completo (fluxo de caixa, medições e pagamentos)',
      'Curva S e inteligência preditiva de atrasos e custos',
      'Relatórios e Ordens de Serviço em PDF para impressão',
      'Sincronização instantânea web + app mobile',
      'Suporte técnico prioritário para engenharia',
    ],
    cta: 'Ativar Plano Premium Desktop',
    highlight: true,
  },
];

const FAQS = [
  {
    question: 'Preciso instalar algum programa no computador para usar a versão desktop?',
    answer:
      'Não. O portal desktop do PHD Gestões roda 100% diretamente no seu navegador de preferência (Google Chrome, Microsoft Edge, Safari ou Firefox). Você não precisa baixar nem instalar nenhum arquivo pesado no seu computador ou notebook — basta acessar e fazer login.',
  },
  {
    question: 'Como funciona a sincronização entre o aplicativo do celular (APK) e o portal desktop?',
    answer:
      'A sincronização é instantânea e em tempo real via nuvem. Fotos do canteiro, diários de obra preenchidos e mensagens de áudio gravadas pela equipe no aplicativo de celular aparecem imediatamente nos painéis e relatórios do computador do escritório.',
  },
  {
    question: 'E se o canteiro de obras ficar sem conexão com a internet ou sinal móvel?',
    answer:
      'O aplicativo de campo foi construído com tecnologia offline-first. A equipe pode continuar preenchendo diários de obra, registrando fotos e anotando ocorrências normalmente sem internet. Assim que o celular se reconectar ao Wi-Fi ou rede 4G/5G, todos os dados são sincronizados automaticamente com o sistema desktop.',
  },
  {
    question: 'Posso usar minha conta ao mesmo tempo no computador e no celular?',
    answer:
      'Com certeza! Sua licença permite acessos simultâneos em múltiplos dispositivos. Você pode acompanhar o fluxo de caixa, a Curva S e emitir relatórios em PDF no computador do escritório enquanto os mestres e fiscais atualizam o canteiro diretamente no smartphone.',
  },
  {
    question: 'Quais são as principais vantagens de usar o painel no computador em vez do celular?',
    answer:
      'No computador você conta com uma interface otimizada para telas grandes e widescreen: visão expandida do cronograma estilo Gantt, tabelas completas de estoque e insumos, gráficos detalhados de orçamentos (previsto x realizado) e gerenciamento de múltiplas obras simultâneas no mesmo painel.',
  },
  {
    question: 'Consigo migrar minhas planilhas antigas e orçamentos para o sistema?',
    answer:
      'Sim! O portal desktop conta com recursos estruturados para cadastro de insumos, lançamento de orçamentos e fornecedores, facilitando a substituição gradual de planilhas de Excel por um banco de dados centralizado e seguro.',
  },
];

export default function App() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans relative overflow-hidden flex flex-col selection:bg-signal-500 selection:text-white">
      {/* Global Background image of worker with smartphone + gradient overlay */}
      <GlobalBackground />

      <NavBar dark />

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Desktop Portal Messaging */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono uppercase tracking-widest text-cyan-300 backdrop-blur-md shadow-xl shadow-cyan-500/10">
                <img
                  src={phdLogo}
                  alt="Logo PHD Gestões"
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-md border border-cyan-400/30 shadow"
                />
                <span className="font-bold text-white">PHD Gestões</span>
                <span className="text-slate-500">•</span>
                <span>Portal Web Desktop — Engenharia Civil</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
                Sistema Web de Gestão de Obras <br />
                para <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-500 via-orange-400 to-amber-300">Computador e Escritório</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
                O portal desktop definitivo para engenheiros e construtoras. Acompanhe cronograma, fluxo de caixa, estoque e diário de obra diretamente no monitor do seu computador ou notebook.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/painel"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-signal-500 via-orange-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-signal-500/25 hover:scale-105 transition-all flex items-center gap-2.5"
                >
                  <Monitor className="w-5 h-5 text-amber-200" />
                  <span>Acessar Sistema Desktop</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/baixar"
                  className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white font-bold text-sm backdrop-blur-xl transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Baixar APK Mobile (Campo)</span>
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Otimizado para Monitores 1080p e 4K</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Modo Degustação Interativo</span>
                </div>
              </div>
            </div>

            {/* Right Column: Simulated Desktop Portal Screen */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg bg-slate-950/90 border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 backdrop-blur-2xl">
                {/* Simulated Desktop Window Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-xs font-mono text-slate-400">
                      https://phdgestoes.com/painel
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-signal-500/20 text-signal-400 border border-signal-500/30 text-[10px] font-mono rounded font-bold">
                    PORTAL WEB DESKTOP
                  </span>
                </div>

                {/* Main Desktop Dashboard Preview Widget */}
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-signal-400" />
                      <span className="font-bold text-xs text-white">Residencial Alphaville — Bloco A</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      42% Concluído
                    </span>
                  </div>

                  {/* Multi-Tab Mockup */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono font-semibold text-slate-400 border-b border-white/10 pb-2">
                    <span className="px-2 py-1 rounded bg-signal-500 text-white font-bold">Visão Geral</span>
                    <span className="px-2 py-1 rounded hover:bg-white/5">Cronograma</span>
                    <span className="px-2 py-1 rounded hover:bg-white/5">Diário</span>
                    <span className="px-2 py-1 rounded hover:bg-white/5">Financeiro</span>
                    <span className="px-2 py-1 rounded hover:bg-white/5">Materiais</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">Orçamento Previsto</span>
                      <p className="font-bold font-mono text-white text-xs">R$ 540.000,00</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">Executado Real</span>
                      <p className="font-bold font-mono text-cyan-400 text-xs">R$ 226.800,00</p>
                    </div>
                  </div>

                  {/* Gantt Bar Mockup */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                      <span>Estrutura Laje L3</span>
                      <span className="text-amber-400 font-bold">75% (No prazo)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/10">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-[75%]" />
                    </div>
                  </div>
                </div>

                {/* Floating Accent Badge */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-signal-400" />
                    <span>Sincronização em Tempo Real com App de Campo</span>
                  </div>
                  <Link to="/painel" className="text-cyan-400 font-bold hover:underline">
                    Ver Ao Vivo →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESKTOP ADVANTAGES ===== */}
      <section className="relative z-10 py-16 bg-slate-900/60 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DESKTOP_HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-3 hover:border-white/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-signal-500/20 border border-signal-500/30 flex items-center justify-center text-signal-400 font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="recursos" className="relative z-10 py-24 bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              Recursos de Engenharia
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Tudo que seu canteiro e escritório precisam
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Substitua planilhas e e-mails por uma plataforma centralizada e de alta precisão.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.12 }}
                  className={`relative bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-7 transition-all duration-300 group shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer ${item.glowColor}`}
                >
                  {/* Real-time ambient glow background sphere on hover */}
                  <div
                    className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-2xl ${item.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="space-y-4 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PLANS SECTION ===== */}
      <section id="planos" className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <span className="px-3 py-1 rounded-full bg-signal-500/10 border border-signal-500/20 text-signal-400 font-mono text-xs font-bold uppercase tracking-wider">
              Planos & Acesso Web
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Acesse o portal no computador
            </h2>
            <p className="text-slate-400 text-base">
              Experimente no modo demonstração sem cadastro ou ative a versão profissional para sua construtora.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {PLANS.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative rounded-[32px] p-8 sm:p-10 flex flex-col justify-between transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-signal-500 shadow-2xl shadow-signal-500/10 backdrop-blur-2xl'
                    : 'bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-signal-500 to-orange-500 rounded-full text-white text-xs font-mono font-extrabold uppercase tracking-widest shadow-lg">
                    Recomendado para Construtoras
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-slate-400 text-sm">{plan.period}</span>
                  </div>

                  <hr className="border-white/10" />

                  <ul className="space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-200">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    to={plan.highlight ? '/premium' : '/painel'}
                    className={`w-full py-4 rounded-2xl font-extrabold text-center text-sm transition-all flex items-center justify-center gap-2 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-signal-500 to-orange-500 hover:from-signal-400 hover:to-orange-400 text-white shadow-xl shadow-signal-500/25'
                        : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION (ACCORDION) ===== */}
      <section id="faq" className="relative z-10 py-24 bg-slate-950/70 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-12">
          {/* FAQ Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Dúvidas Frequentes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Transição do Mobile para o Desktop
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Respostas claras sobre como o sistema opera integrando o canteiro de obras e o escritório.
            </p>
          </motion.div>

          {/* Accordion Container */}
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-signal-500/50 shadow-xl shadow-signal-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-signal-400 font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="group-hover:text-signal-300 transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isOpen
                          ? 'bg-signal-500 text-white border-signal-400 rotate-180'
                          : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 transition-transform" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4 ml-10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA FOOTER BANNER ===== */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-signal-500/20 via-slate-900 to-cyan-500/20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Abra o portal de engenharia no seu computador
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Sem instalações pesadas. Acesse o painel interativo direto do seu navegador e controle sua obra agora.
          </p>
          <div>
            <Link
              to="/painel"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-signal-500 hover:bg-signal-400 text-white font-extrabold text-base shadow-xl shadow-signal-500/30 transition-all"
            >
              <Monitor className="w-5 h-5" />
              <span>Abrir Sistema Desktop</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={phdLogo}
              alt="Logo PHD Gestões"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg border border-white/15"
            />
            <span className="font-bold text-white uppercase tracking-wider">PHD Gestões</span>
            <span className="text-slate-500">|</span>
            <span>Sistema Web Desktop para Engenharia Civil & Construtoras</span>
          </div>
          <p>© 2026 PHD Gestões. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
