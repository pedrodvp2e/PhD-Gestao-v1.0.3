import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Building2,
  Wallet,
  TrendingUp,
  TrendingDown,
  ListChecks,
  BookOpen,
  Package,
  ShieldAlert,
  Users,
  FileText,
  MessageSquare,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import NavBar from '@/components/NavBar';
import { getProgressForecast } from '@/lib/progressForecast';
import { getBudgetForecast } from '@/lib/budgetForecast';
import { getMaterialDepletionForecast } from '@/lib/materialForecast';

// ==========================================
// TIPOS (espelham exatamente as tabelas do app mobile)
// ==========================================

type Project = {
  id: string;
  name: string;
  client_name: string | null;
  address: string | null;
  status: string;
  start_date: string | null;
  deadline: string | null;
  progress: number | null;
};

type Task = {
  id: string;
  title: string;
  category: string | null;
  status: string;
  progress: number;
  deadline: string | null;
};

type DiaryEntry = {
  id: string;
  entry_date: string;
  weather: string | null;
  workers_count: number | null;
  description: string;
  occurrences: string | null;
};

type MaterialRow = {
  id: string;
  name: string;
  unit: string;
  needed_quantity: number;
  acquired_quantity: number;
  notes: string | null;
};

type MaterialStockSnapshot = { material_id: string; snapshot_date: string; acquired_quantity: number };

type SafetyItem = { id: string; label: string; completed: boolean };

type Incident = {
  id: string;
  occurred_at: string;
  type: string;
  severity: string;
  description: string;
  injured_person: string | null;
  action_taken: string | null;
};

type MemberRow = {
  id: string;
  project_role: string;
  profiles: { full_name: string | null; phone: string | null; member_code: string | null } | null;
};

type ServiceOrder = {
  id: string;
  os_number: string;
  status: string;
  client_name: string;
  company_name: string;
  issued_at: string;
  deadline: string | null;
  labor_value: number;
};

type ChatMessage = {
  id: string;
  content: string | null;
  attachment_type: string | null;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

type BudgetItem = { id: string; category: string; planned_value: number; actual_value: number };
type CashFlowEntry = { id: string; entry_date: string; type: 'entrada' | 'saida'; description: string; amount: number };
type Payment = {
  id: string;
  payee_name: string;
  payee_type: string;
  amount: number;
  due_date: string | null;
  paid_date: string | null;
  status: string;
};

const TABS = [
  { id: 'visao', label: 'Visão geral', icon: Gauge, premium: false },
  { id: 'cronograma', label: 'Cronograma', icon: ListChecks, premium: false },
  { id: 'diario', label: 'Diário de obra', icon: BookOpen, premium: false },
  { id: 'materiais', label: 'Materiais', icon: Package, premium: false },
  { id: 'seguranca', label: 'Segurança', icon: ShieldAlert, premium: false },
  { id: 'equipe', label: 'Equipe', icon: Users, premium: false },
  { id: 'os', label: 'Ordens de serviço', icon: FileText, premium: false },
  { id: 'chat', label: 'Chat da obra', icon: MessageSquare, premium: false },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet, premium: true },
] as const;

type TabId = (typeof TABS)[number]['id'];

const weatherLabel: Record<string, string> = {
  sol: '☀️ Sol',
  nublado: '☁️ Nublado',
  chuva: '🌧️ Chuva',
  tempestade: '⛈️ Tempestade',
};

export default function Dashboard() {
  const { profile, isPremium } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>('visao');

  // dados por aba — carregados sob demanda quando a aba/obra muda
  const [tasks, setTasks] = useState<Task[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [stockSnapshots, setStockSnapshots] = useState<MaterialStockSnapshot[]>([]);
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, client_name, address, status, start_date, deadline, progress')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProjects(data as Project[]);
        if (data.length > 0) setSelectedId((data[0] as Project).id);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setTabLoading(true);
    (async () => {
      switch (tab) {
        case 'cronograma': {
          const { data } = await supabase
            .from('tasks')
            .select('id, title, category, status, progress, deadline')
            .eq('project_id', selectedId)
            .order('deadline', { ascending: true });
          setTasks((data as Task[]) || []);
          break;
        }
        case 'diario': {
          const { data } = await supabase
            .from('diary_entries')
            .select('id, entry_date, weather, workers_count, description, occurrences')
            .eq('project_id', selectedId)
            .order('entry_date', { ascending: false });
          setDiary((data as DiaryEntry[]) || []);
          break;
        }
        case 'materiais': {
          const [{ data: mats }, { data: snaps }] = await Promise.all([
            supabase
              .from('materials')
              .select('id, name, unit, needed_quantity, acquired_quantity, notes')
              .eq('project_id', selectedId),
            supabase
              .from('material_stock_snapshots')
              .select('material_id, snapshot_date, acquired_quantity')
              .eq('project_id', selectedId),
          ]);
          setMaterials((mats as MaterialRow[]) || []);
          setStockSnapshots((snaps as MaterialStockSnapshot[]) || []);
          break;
        }
        case 'seguranca': {
          const [{ data: items }, { data: incs }] = await Promise.all([
            supabase
              .from('safety_checklist_items')
              .select('id, label, completed')
              .eq('project_id', selectedId),
            supabase
              .from('incidents')
              .select('id, occurred_at, type, severity, description, injured_person, action_taken')
              .eq('project_id', selectedId)
              .order('occurred_at', { ascending: false }),
          ]);
          setSafetyItems((items as SafetyItem[]) || []);
          setIncidents((incs as Incident[]) || []);
          break;
        }
        case 'equipe': {
          const { data } = await supabase
            .from('project_members')
            .select('id, project_role, profiles ( full_name, phone, member_code )')
            .eq('project_id', selectedId);
          setMembers((data as unknown as MemberRow[]) || []);
          break;
        }
        case 'os': {
          const { data } = await supabase
            .from('service_orders')
            .select('id, os_number, status, client_name, company_name, issued_at, deadline, labor_value')
            .eq('project_id', selectedId)
            .order('issued_at', { ascending: false });
          setServiceOrders((data as ServiceOrder[]) || []);
          break;
        }
        case 'chat': {
          const { data } = await supabase
            .from('messages')
            .select('id, content, attachment_type, created_at, profiles ( full_name )')
            .eq('project_id', selectedId)
            .order('created_at', { ascending: false })
            .limit(50);
          setMessages((data as unknown as ChatMessage[]) || []);
          break;
        }
        case 'financeiro': {
          if (!isPremium) break;
          const [{ data: b }, { data: cf }, { data: pay }] = await Promise.all([
            supabase.from('budget_items').select('id, category, planned_value, actual_value').eq('project_id', selectedId),
            supabase
              .from('cash_flow')
              .select('id, entry_date, type, description, amount')
              .eq('project_id', selectedId)
              .order('entry_date', { ascending: false }),
            supabase
              .from('payments')
              .select('id, payee_name, payee_type, amount, due_date, paid_date, status')
              .eq('project_id', selectedId),
          ]);
          setBudget((b as BudgetItem[]) || []);
          setCashFlow((cf as CashFlowEntry[]) || []);
          setPayments((pay as Payment[]) || []);
          break;
        }
      }
      setTabLoading(false);
    })();
  }, [tab, selectedId, isPremium]);

  const selectedProject = projects.find((p) => p.id === selectedId) || null;
  const totalPlanned = budget.reduce((s, b) => s + (b.planned_value || 0), 0);
  const totalActual = budget.reduce((s, b) => s + (b.actual_value || 0), 0);
  const totalEntradas = cashFlow.filter((c) => c.type === 'entrada').reduce((s, c) => s + c.amount, 0);
  const totalSaidas = cashFlow.filter((c) => c.type === 'saida').reduce((s, c) => s + c.amount, 0);

  const progressForecast = selectedProject
    ? getProgressForecast(selectedProject.start_date, selectedProject.deadline, selectedProject.progress ?? 0)
    : null;

  const budgetForecast = getBudgetForecast(
    cashFlow.filter((c) => c.type === 'saida').map((c) => ({ entry_date: c.entry_date, amount: c.amount })),
    totalPlanned,
    totalActual
  );

  const currency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-concrete-100">
      <NavBar />

      <div className="max-w-6xl mx-auto px-5 py-10">
        <h1 className="font-heading font-bold uppercase text-3xl">
          Olá, {profile?.full_name?.split(' ')[0] || 'engenheiro'}
        </h1>
        <p className="text-sm text-concrete-700 mt-1">
          Essa é a versão web do PHD Gestões — todas as áreas do app, num só lugar.
        </p>

        {!isPremium && (
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap p-4 rounded-lg border border-signal-500/40 bg-signal-500/5">
            <p className="text-sm font-medium text-blueprint-950">
              Você está no plano Grátis — todas as áreas operacionais liberadas. O Financeiro completo é Premium.
            </p>
            <Link
              to="/premium"
              className="shrink-0 px-4 py-2 rounded-md bg-signal-500 text-white text-sm font-bold hover:bg-signal-400 transition-colors"
            >
              Liberar Premium
            </Link>
          </div>
        )}

        <div className="mt-10 grid md:grid-cols-[260px_1fr] gap-8">
          {/* Lista de obras */}
          <aside>
            <h2 className="text-xs font-bold uppercase tracking-widest text-concrete-700 mb-3">Suas obras</h2>
            {loading && <p className="text-sm text-concrete-400">Carregando…</p>}
            {!loading && projects.length === 0 && (
              <p className="text-sm text-concrete-400">
                Nenhuma obra ainda. Crie uma pelo app mobile e ela aparece aqui também.
              </p>
            )}
            <div className="space-y-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedId === p.id
                      ? 'border-signal-500 bg-white'
                      : 'border-concrete-200 bg-white/50 hover:border-concrete-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-signal-500 shrink-0" />
                    <span className="font-semibold text-sm truncate">{p.name}</span>
                  </div>
                  <span className="text-xs text-concrete-700">{p.client_name}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Conteúdo */}
          <main>
            {!selectedProject && !loading && (
              <p className="text-sm text-concrete-400">Selecione uma obra na lista ao lado.</p>
            )}

            {selectedProject && (
              <div className="space-y-6">
                {/* Abas */}
                <div className="flex flex-wrap gap-1.5 border-b border-concrete-200 pb-3">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const locked = t.premium && !isPremium;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
                          tab === t.id
                            ? 'bg-blueprint-950 text-white'
                            : 'bg-white border border-concrete-200 text-concrete-700 hover:border-concrete-400'
                        }`}
                      >
                        <Icon size={13} />
                        {t.label}
                        {locked && <Lock size={11} className="text-signal-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* VISÃO GERAL */}
                {tab === 'visao' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white space-y-4">
                    <h2 className="font-heading font-bold uppercase text-2xl">{selectedProject.name}</h2>
                    <p className="text-sm text-concrete-700">
                      {selectedProject.client_name} — {selectedProject.address}
                    </p>
                    <div>
                      <div className="h-2 rounded-full bg-concrete-200 overflow-hidden">
                        <div className="h-full bg-signal-500" style={{ width: `${selectedProject.progress ?? 0}%` }} />
                      </div>
                      <span className="text-xs font-mono text-concrete-700 mt-1.5 block">
                        {selectedProject.progress ?? 0}% concluído — status: {selectedProject.status}
                      </span>
                    </div>

                    {progressForecast && progressForecast.status !== 'sem_dados' && (
                      <div
                        className={`p-4 rounded-lg text-sm font-medium flex items-start gap-2 ${
                          progressForecast.status === 'atrasado'
                            ? 'bg-error/10 text-error'
                            : progressForecast.status === 'atencao'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <span>
                          No ritmo atual, a conclusão prevista é{' '}
                          {progressForecast.projectedDate?.toLocaleDateString('pt-BR')}
                          {progressForecast.delayDays !== null && progressForecast.delayDays > 0
                            ? ` — cerca de ${progressForecast.delayDays} dia(s) de atraso em relação ao prazo.`
                            : ' — dentro do prazo previsto.'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* CRONOGRAMA */}
                {tab === 'cronograma' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                    <h3 className="font-heading font-bold uppercase text-lg mb-4">Cronograma / Tarefas</h3>
                    {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                    {!tabLoading && tasks.length === 0 && <p className="text-sm text-concrete-400">Nenhuma tarefa cadastrada.</p>}
                    <div className="space-y-2">
                      {tasks.map((t) => (
                        <div key={t.id} className="p-3 rounded-lg bg-concrete-100 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-sm">{t.title}</p>
                            <p className="text-xs text-concrete-700">
                              {t.category || 'Sem categoria'} · {t.status} · {t.progress}%
                              {t.deadline ? ` · prazo ${new Date(t.deadline).toLocaleDateString('pt-BR')}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIÁRIO DE OBRA */}
                {tab === 'diario' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                    <h3 className="font-heading font-bold uppercase text-lg mb-4">Diário de obra</h3>
                    {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                    {!tabLoading && diary.length === 0 && <p className="text-sm text-concrete-400">Nenhum registro de diário ainda.</p>}
                    <div className="space-y-3">
                      {diary.map((d) => (
                        <div key={d.id} className="p-3 rounded-lg bg-concrete-100">
                          <div className="flex items-center justify-between text-xs text-concrete-700 font-mono">
                            <span>{new Date(d.entry_date).toLocaleDateString('pt-BR')}</span>
                            <span>
                              {weatherLabel[d.weather || ''] || ''} {d.workers_count ? `· ${d.workers_count} trabalhadores` : ''}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{d.description}</p>
                          {d.occurrences && <p className="text-xs text-signal-500 mt-1">Ocorrências: {d.occurrences}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATERIAIS */}
                {tab === 'materiais' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                    <h3 className="font-heading font-bold uppercase text-lg mb-4">Materiais e estoque</h3>
                    {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                    {!tabLoading && materials.length === 0 && <p className="text-sm text-concrete-400">Nenhum material cadastrado.</p>}
                    <div className="space-y-2">
                      {materials.map((m) => {
                        const forecast = getMaterialDepletionForecast(
                          stockSnapshots
                            .filter((s) => s.material_id === m.id)
                            .map((s) => ({ snapshot_date: s.snapshot_date, acquired_quantity: s.acquired_quantity }))
                        );
                        const low = m.acquired_quantity < m.needed_quantity;
                        return (
                          <div key={m.id} className="p-3 rounded-lg bg-concrete-100">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm">{m.name}</p>
                              <span className={`text-xs font-mono font-bold ${low ? 'text-error' : 'text-success'}`}>
                                {m.acquired_quantity} / {m.needed_quantity} {m.unit}
                              </span>
                            </div>
                            {forecast.status !== 'sem_dados' && forecast.daysToEmpty !== null && (
                              <p
                                className={`text-xs mt-1 ${
                                  forecast.status === 'critico' || forecast.status === 'esgotado' ? 'text-error' : 'text-warning'
                                }`}
                              >
                                Previsão de ruptura em {forecast.daysToEmpty} dia(s), no ritmo atual de consumo
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SEGURANÇA */}
                {tab === 'seguranca' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                      <h3 className="font-heading font-bold uppercase text-lg mb-4">Checklist de segurança</h3>
                      {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                      <div className="grid sm:grid-cols-2 gap-2">
                        {safetyItems.map((s) => (
                          <div key={s.id} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-concrete-100">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.completed ? 'bg-success' : 'bg-error'}`} />
                            {s.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                      <h3 className="font-heading font-bold uppercase text-lg mb-4">Acidentes e ocorrências</h3>
                      {!tabLoading && incidents.length === 0 && <p className="text-sm text-concrete-400">Nenhum incidente registrado.</p>}
                      <div className="space-y-2">
                        {incidents.map((i) => (
                          <div key={i.id} className="p-3 rounded-lg bg-concrete-100">
                            <div className="flex items-center justify-between text-xs font-mono text-concrete-700">
                              <span>{new Date(i.occurred_at).toLocaleDateString('pt-BR')}</span>
                              <span className="uppercase font-bold text-signal-500">
                                {i.type} · {i.severity}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{i.description}</p>
                            {i.injured_person && <p className="text-xs text-concrete-700 mt-1">Envolvido: {i.injured_person}</p>}
                            {i.action_taken && <p className="text-xs text-concrete-700">Ação tomada: {i.action_taken}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* EQUIPE */}
                {tab === 'equipe' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                    <h3 className="font-heading font-bold uppercase text-lg mb-4">Equipe da obra</h3>
                    {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                    {!tabLoading && members.length === 0 && <p className="text-sm text-concrete-400">Nenhum membro nessa obra.</p>}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {members.map((m) => (
                        <div key={m.id} className="p-3 rounded-lg bg-concrete-100">
                          <p className="font-semibold text-sm">{m.profiles?.full_name || 'Sem nome'}</p>
                          <p className="text-xs text-concrete-700 uppercase">{m.project_role}</p>
                          {m.profiles?.phone && <p className="text-xs text-concrete-700">{m.profiles.phone}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ORDENS DE SERVIÇO */}
                {tab === 'os' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                    <h3 className="font-heading font-bold uppercase text-lg mb-4">Ordens de serviço</h3>
                    {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                    {!tabLoading && serviceOrders.length === 0 && <p className="text-sm text-concrete-400">Nenhuma OS emitida.</p>}
                    <div className="space-y-2">
                      {serviceOrders.map((os) => (
                        <div key={os.id} className="p-3 rounded-lg bg-concrete-100 flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <p className="font-semibold text-sm">{os.os_number} — {os.client_name}</p>
                            <p className="text-xs text-concrete-700">
                              {os.company_name} · emitida em {new Date(os.issued_at).toLocaleDateString('pt-BR')}
                              {os.deadline ? ` · prazo ${new Date(os.deadline).toLocaleDateString('pt-BR')}` : ''}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold uppercase text-signal-500">{os.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CHAT */}
                {tab === 'chat' && (
                  <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                    <h3 className="font-heading font-bold uppercase text-lg mb-4">Chat da obra</h3>
                    <p className="text-xs text-concrete-700 mb-4">Últimas mensagens (somente leitura no painel web).</p>
                    {tabLoading && <p className="text-sm text-concrete-400">Carregando…</p>}
                    {!tabLoading && messages.length === 0 && <p className="text-sm text-concrete-400">Nenhuma mensagem ainda.</p>}
                    <div className="space-y-2 max-h-[28rem] overflow-y-auto">
                      {[...messages].reverse().map((m) => (
                        <div key={m.id} className="p-2.5 rounded-lg bg-concrete-100 text-sm">
                          <span className="font-bold">{m.profiles?.full_name || 'Alguém'}: </span>
                          {m.content ? m.content : m.attachment_type === 'audio' ? '🎤 áudio (ver no app)' : '📷 imagem (ver no app)'}
                          <span className="block text-[10px] font-mono text-concrete-700 mt-0.5">
                            {new Date(m.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FINANCEIRO — PREMIUM */}
                {tab === 'financeiro' && (
                  <div className="relative p-6 rounded-lg border border-concrete-200 bg-white space-y-6">
                    <h3 className="font-heading font-bold uppercase text-lg flex items-center gap-2">
                      <Wallet size={18} className="text-signal-500" /> Financeiro
                    </h3>

                    {!isPremium && (
                      <div className="absolute inset-0 rounded-lg bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center px-6 z-10">
                        <Lock size={22} className="text-blueprint-950" />
                        <p className="text-sm font-semibold text-blueprint-950 max-w-xs">
                          Orçamento, fluxo de caixa, pagamentos e previsão de estouro ficam disponíveis no plano Premium.
                        </p>
                        <Link
                          to="/premium"
                          className="px-4 py-2 rounded-md bg-signal-500 text-white text-sm font-bold hover:bg-signal-400 transition-colors"
                        >
                          Ver plano Premium
                        </Link>
                      </div>
                    )}

                    <div className={!isPremium ? 'opacity-30 select-none pointer-events-none space-y-6' : 'space-y-6'}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-concrete-100">
                          <span className="text-xs font-bold uppercase text-concrete-700 flex items-center gap-1">
                            <TrendingUp size={13} /> Orçado
                          </span>
                          <span className="block font-mono font-bold text-xl mt-1">{currency(totalPlanned)}</span>
                        </div>
                        <div className="p-4 rounded-lg bg-concrete-100">
                          <span className="text-xs font-bold uppercase text-concrete-700 flex items-center gap-1">
                            <TrendingDown size={13} /> Realizado
                          </span>
                          <span className="block font-mono font-bold text-xl mt-1">{currency(totalActual)}</span>
                        </div>
                      </div>

                      {budgetForecast.status !== 'sem_dados' && (
                        <div
                          className={`p-4 rounded-lg text-sm font-medium flex items-start gap-2 ${
                            budgetForecast.status === 'estourado' || budgetForecast.status === 'critico'
                              ? 'bg-error/10 text-error'
                              : budgetForecast.status === 'atencao'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                          <span>
                            {budgetForecast.status === 'estourado'
                              ? 'O orçamento planejado já foi ultrapassado.'
                              : budgetForecast.daysToRupture !== null
                              ? `No ritmo de gasto atual, o orçamento estoura em ~${budgetForecast.daysToRupture} dia(s).`
                              : 'Ritmo de gasto controlado.'}
                          </span>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-concrete-700 mb-2">Fluxo de caixa</h4>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="p-3 rounded-lg bg-concrete-100">
                            <span className="text-xs text-concrete-700">Entradas</span>
                            <span className="block font-mono font-bold text-success">{currency(totalEntradas)}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-concrete-100">
                            <span className="text-xs text-concrete-700">Saídas</span>
                            <span className="block font-mono font-bold text-error">{currency(totalSaidas)}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {cashFlow.map((c) => (
                            <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded bg-concrete-100">
                              <span>
                                {new Date(c.entry_date).toLocaleDateString('pt-BR')} — {c.description}
                              </span>
                              <span className={`font-mono font-bold ${c.type === 'entrada' ? 'text-success' : 'text-error'}`}>
                                {c.type === 'entrada' ? '+' : '-'}
                                {currency(c.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-concrete-700 mb-2">Pagamentos</h4>
                        {payments.length === 0 && <p className="text-xs text-concrete-400">Nenhum pagamento cadastrado.</p>}
                        <div className="space-y-1.5">
                          {payments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded bg-concrete-100">
                              <span>
                                {p.payee_name} ({p.payee_type})
                              </span>
                              <span className="font-mono font-bold">
                                {currency(p.amount)} · {p.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
