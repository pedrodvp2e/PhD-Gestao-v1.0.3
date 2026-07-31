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
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  HardHat,
  CheckCircle2,
  Plus,
  X,
  Send,
  UserPlus,
  Search,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import NavBar from '@/components/NavBar';
import GlobalBackground from '@/components/GlobalBackground';
import phdLogo from '@/assets/images/phd_app_logo_1785469467323.jpg';
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

// ==========================================
// UI HELPERS (mesmo padrão visual do site: vidro fosco escuro)
// ==========================================

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-signal-500';
const labelClass = 'text-xs font-mono font-bold text-slate-300';

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-blueprint-900/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-extrabold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-xl bg-signal-500 hover:bg-signal-400 disabled:opacity-60 text-white font-extrabold text-sm shadow-xl shadow-signal-500/20 transition-all flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
    </button>
  );
}

const MATERIAL_UNITS = ['un', 'kg', 'm3', 'm2', 'lt', 'saco', 'm', 'mm'];

const TABS = [
  { id: 'visao', label: 'Visão Geral', icon: Gauge, premium: false },
  { id: 'cronograma', label: 'Cronograma', icon: ListChecks, premium: false },
  { id: 'diario', label: 'Diário de Obra', icon: BookOpen, premium: false },
  { id: 'materiais', label: 'Materiais', icon: Package, premium: false },
  { id: 'seguranca', label: 'Segurança', icon: ShieldAlert, premium: false },
  { id: 'equipe', label: 'Equipe', icon: Users, premium: false },
  { id: 'os', label: 'Ordens de Serviço', icon: FileText, premium: false },
  { id: 'chat', label: 'Chat da Obra', icon: MessageSquare, premium: false },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet, premium: true },
] as const;

type TabId = (typeof TABS)[number]['id'];

const weatherLabel: Record<string, string> = {
  sol: '☀️ Sol',
  nublado: '☁️ Nublado',
  chuva: '🌧️ Chuva',
  tempestade: '⛈️ Tempestade',
};

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Residencial Alphaville - Bloco A',
    client_name: 'Alphaville Urbanismo',
    address: 'Av. das Nações, 1500 - Barueri/SP',
    status: 'Em andamento',
    start_date: '2026-01-10',
    deadline: '2026-11-30',
    progress: 42,
  },
  {
    id: 'proj-2',
    name: 'Edifício Horizon Tower',
    client_name: 'Incorporadora Horizon',
    address: 'Rua Bela Cintra, 890 - São Paulo/SP',
    status: 'Em andamento',
    start_date: '2026-03-01',
    deadline: '2027-02-28',
    progress: 18,
  },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Concretagem da Laje do 3º Pavimento', category: 'Estrutura', status: 'Em andamento', progress: 75, deadline: '2026-08-05' },
  { id: 't2', title: 'Instalação da Tubulação Hidráulica Prumada', category: 'Instalações', status: 'Pendente', progress: 20, deadline: '2026-08-15' },
  { id: 't3', title: 'Alvenaria de Vedação 2º Pavimento', category: 'Alvenaria', status: 'Concluído', progress: 100, deadline: '2026-07-28' },
  { id: 't4', title: 'Chapisco e Emboço Fachada Leste', category: 'Acabamento', status: 'Em andamento', progress: 40, deadline: '2026-08-20' },
];

const MOCK_DIARY: DiaryEntry[] = [
  { id: 'd1', entry_date: '2026-07-30', weather: 'sol', workers_count: 24, description: 'Finalizada armação da laje L3. Recebimento de 12m³ de concreto USINADO.', occurrences: 'Caminhão betoneira chegou com 20 min de atraso, sem impacto na concretagem.' },
  { id: 'd2', entry_date: '2026-07-29', weather: 'nublado', workers_count: 22, description: 'Continuação da elevação de alvenaria e assentamento de blocos cerâmicos no 2º andar.', occurrences: null },
];

const MOCK_MATERIALS: MaterialRow[] = [
  { id: 'm1', name: 'Cimento CP II-Z 50kg', unit: 'sacos', needed_quantity: 500, acquired_quantity: 320, notes: 'Uso estrutural e acabamento' },
  { id: 'm2', name: 'Aço CA-50 10.0mm', unit: 'kg', needed_quantity: 2500, acquired_quantity: 2100, notes: 'Armação de vigas e pilares' },
  { id: 'm3', name: 'Areia Média Lavada', unit: 'm³', needed_quantity: 120, acquired_quantity: 45, notes: 'Estoque baixo - solicitar compra' },
  { id: 'm4', name: 'Bloco Cerâmico 14x19x29', unit: 'unid', needed_quantity: 8000, acquired_quantity: 7500, notes: 'Entregue pelo fornecedor Silva' },
];

const MOCK_SAFETY: SafetyItem[] = [
  { id: 's1', label: 'Uso obrigatório de EPI (Capacete, Bota e Óculos)', completed: true },
  { id: 's2', label: 'Cinto de Segurança tipo Paratuedas para Trabalho em Altura', completed: true },
  { id: 's3', label: 'Telas de Proteção e Guarda-Corpo nos Perímetros', completed: true },
  { id: 's4', label: 'Sinalização e Isolamento da Área do Guincho de Carga', completed: false },
];

const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', occurred_at: '2026-07-22', type: 'Aviso de Segurança', severity: 'Leve', description: 'Trabalhador sem luvas de raspa durante manuseio de vergalhões.', injured_person: null, action_taken: 'Orientação imediata pelo TST e fornecimento de novas luvas.' },
];

const MOCK_MEMBERS: MemberRow[] = [
  { id: 'mb1', project_role: 'Engenheiro Residente', profiles: { full_name: 'Pedro Danelon', phone: '(11) 98765-4321', member_code: 'ENG-001' } },
  { id: 'mb2', project_role: 'Mestre de Obras', profiles: { full_name: 'Antônio Carlos', phone: '(11) 97654-3210', member_code: 'MST-002' } },
  { id: 'mb3', project_role: 'Técnico de Segurança', profiles: { full_name: 'Mariana Lima', phone: '(11) 96543-2109', member_code: 'TST-003' } },
];

const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  { id: 'os1', os_number: 'OS-2026-014', status: 'Aprovada', client_name: 'Alphaville Urbanismo', company_name: 'PHD Construtora', issued_at: '2026-07-15', deadline: '2026-08-15', labor_value: 45000 },
  { id: 'os2', os_number: 'OS-2026-015', status: 'Em Execução', client_name: 'Alphaville Urbanismo', company_name: 'Elétrica S/A', issued_at: '2026-07-20', deadline: '2026-08-30', labor_value: 28000 },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'msg1', content: 'Bom dia pessoal! Concretagem da laje confirmada para as 08:00.', attachment_type: null, created_at: '2026-07-30T07:30:00Z', profiles: { full_name: 'Pedro Danelon' } },
  { id: 'msg2', content: 'Caminhões betoneira já estão posicionados no canteiro.', attachment_type: null, created_at: '2026-07-30T08:05:00Z', profiles: { full_name: 'Antônio Carlos' } },
  { id: 'msg3', content: 'Registro fotográfico da armação enviado pro relatório diário.', attachment_type: 'image', created_at: '2026-07-30T09:15:00Z', profiles: { full_name: 'Mariana Lima' } },
];

const MOCK_BUDGET: BudgetItem[] = [
  { id: 'b1', category: 'Estrutura & Fundação', planned_value: 350000, actual_value: 290000 },
  { id: 'b2', category: 'Alvenaria & Vedações', planned_value: 120000, actual_value: 95000 },
  { id: 'b3', category: 'Instalações Elétricas & Hidráulicas', planned_value: 180000, actual_value: 110000 },
  { id: 'b4', category: 'Acabamentos e Revestimentos', planned_value: 220000, actual_value: 45000 },
];

const MOCK_CASH_FLOW: CashFlowEntry[] = [
  { id: 'cf1', entry_date: '2026-07-28', type: 'entrada', description: 'Medição 3 - Construtora Alphaville', amount: 150000 },
  { id: 'cf2', entry_date: '2026-07-25', type: 'saida', description: 'Pagamento Concreto Usinado - Votorantim', amount: 38000 },
  { id: 'cf3', entry_date: '2026-07-20', type: 'saida', description: 'Folha de Pagamento Empreiteira de Armação', amount: 24500 },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', payee_name: 'Votorantim Cimentos', payee_type: 'Fornecedor', amount: 38000, due_date: '2026-07-25', paid_date: '2026-07-25', status: 'Pago' },
  { id: 'p2', payee_name: 'Gerdau Aços', payee_type: 'Fornecedor', amount: 42000, due_date: '2026-08-10', paid_date: null, status: 'Pendente' },
];

export default function Dashboard() {
  const { profile, isPremium, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<TabId>('visao');
  const [tabLoading, setTabLoading] = useState(false);

  // Estados dos dados da obra selecionada
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

  // Dispara um novo carregamento dos dados da aba atual
  const [refreshTick, setRefreshTick] = useState(0);
  const refresh = () => setRefreshTick((v) => v + 1);

  // Modais de criação/edição (uma função pra cada, igual ao app mobile)
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewDiary, setShowNewDiary] = useState(false);
  const [showNewMaterial, setShowNewMaterial] = useState(false);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showNewOS, setShowNewOS] = useState(false);
  const [showNewBudgetItem, setShowNewBudgetItem] = useState(false);
  const [showNewCashFlow, setShowNewCashFlow] = useState(false);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [projectForm, setProjectForm] = useState({ name: '', client_name: '', address: '', deadline: '' });
  const [taskForm, setTaskForm] = useState({ title: '', category: '', deadline: '' });
  const [diaryForm, setDiaryForm] = useState({
    entry_date: new Date().toISOString().slice(0, 10),
    weather: 'sol',
    workers_count: '',
    description: '',
    occurrences: '',
  });
  const [materialForm, setMaterialForm] = useState({ name: '', unit: 'un', needed_quantity: '', acquired_quantity: '', notes: '' });
  const [incidentForm, setIncidentForm] = useState({
    occurred_at: new Date().toISOString().slice(0, 10),
    type: 'ocorrencia',
    severity: 'leve',
    description: '',
    injured_person: '',
    action_taken: '',
  });
  const [memberSearch, setMemberSearch] = useState('');
  const [foundMember, setFoundMember] = useState<{ id: string; full_name: string; role: string; member_code: string } | null>(null);
  const [memberSearchError, setMemberSearchError] = useState('');
  const [osForm, setOsForm] = useState({
    company_name: '',
    client_name: '',
    client_phone: '',
    deadline: '',
    problem_description: '',
    execution_description: '',
    labor_value: '',
  });
  const [budgetItemForm, setBudgetItemForm] = useState({ category: '', planned_value: '', actual_value: '' });
  const [cashFlowForm, setCashFlowForm] = useState({
    type: 'saida' as 'entrada' | 'saida',
    entry_date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: '',
  });
  const [paymentForm, setPaymentForm] = useState({ payee_name: '', payee_type: 'Fornecedor', amount: '', due_date: '' });
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    (async () => {
      let loadedProjects: Project[] = [];
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, client_name, address, status, start_date, deadline, progress')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          loadedProjects = data as Project[];
        }
      } catch {
        // Fallback para mock
      }

      if (loadedProjects.length === 0) {
        loadedProjects = MOCK_PROJECTS;
      }

      setProjects(loadedProjects);
      if (loadedProjects.length > 0) setSelectedId(loadedProjects[0].id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setTabLoading(true);
    (async () => {
      switch (tab) {
        case 'cronograma': {
          let list: Task[] = [];
          try {
            const { data } = await supabase
              .from('tasks')
              .select('id, title, category, status, progress, deadline')
              .eq('project_id', selectedId)
              .order('deadline', { ascending: true });
            if (data && data.length > 0) list = data as Task[];
          } catch {}
          setTasks(list.length > 0 ? list : MOCK_TASKS);
          break;
        }
        case 'diario': {
          let list: DiaryEntry[] = [];
          try {
            const { data } = await supabase
              .from('diary_entries')
              .select('id, entry_date, weather, workers_count, description, occurrences')
              .eq('project_id', selectedId)
              .order('entry_date', { ascending: false });
            if (data && data.length > 0) list = data as DiaryEntry[];
          } catch {}
          setDiary(list.length > 0 ? list : MOCK_DIARY);
          break;
        }
        case 'materiais': {
          let mats: MaterialRow[] = [];
          let snaps: MaterialStockSnapshot[] = [];
          try {
            const [{ data: mRes }, { data: sRes }] = await Promise.all([
              supabase
                .from('materials')
                .select('id, name, unit, needed_quantity, acquired_quantity, notes')
                .eq('project_id', selectedId),
              supabase
                .from('material_stock_snapshots')
                .select('material_id, snapshot_date, acquired_quantity')
                .eq('project_id', selectedId),
            ]);
            if (mRes && mRes.length > 0) mats = mRes as MaterialRow[];
            if (sRes && sRes.length > 0) snaps = sRes as MaterialStockSnapshot[];
          } catch {}
          setMaterials(mats.length > 0 ? mats : MOCK_MATERIALS);
          setStockSnapshots(snaps);
          break;
        }
        case 'seguranca': {
          let items: SafetyItem[] = [];
          let incs: Incident[] = [];
          try {
            const [{ data: itemRes }, { data: incRes }] = await Promise.all([
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
            if (itemRes && itemRes.length > 0) items = itemRes as SafetyItem[];
            if (incRes && incRes.length > 0) incs = incRes as Incident[];
          } catch {}
          setSafetyItems(items.length > 0 ? items : MOCK_SAFETY);
          setIncidents(incs.length > 0 ? incs : MOCK_INCIDENTS);
          break;
        }
        case 'equipe': {
          let list: MemberRow[] = [];
          try {
            const { data } = await supabase
              .from('project_members')
              .select('id, project_role, profiles ( full_name, phone, member_code )')
              .eq('project_id', selectedId);
            if (data && data.length > 0) list = data as unknown as MemberRow[];
          } catch {}
          setMembers(list.length > 0 ? list : MOCK_MEMBERS);
          break;
        }
        case 'os': {
          let list: ServiceOrder[] = [];
          try {
            const { data } = await supabase
              .from('service_orders')
              .select('id, os_number, status, client_name, company_name, issued_at, deadline, labor_value')
              .eq('project_id', selectedId)
              .order('issued_at', { ascending: false });
            if (data && data.length > 0) list = data as ServiceOrder[];
          } catch {}
          setServiceOrders(list.length > 0 ? list : MOCK_SERVICE_ORDERS);
          break;
        }
        case 'chat': {
          let list: ChatMessage[] = [];
          try {
            const { data } = await supabase
              .from('messages')
              .select('id, content, attachment_type, created_at, profiles ( full_name )')
              .eq('project_id', selectedId)
              .order('created_at', { ascending: false })
              .limit(50);
            if (data && data.length > 0) list = data as unknown as ChatMessage[];
          } catch {}
          setMessages(list.length > 0 ? list : MOCK_MESSAGES);
          break;
        }
        case 'financeiro': {
          let bList: BudgetItem[] = [];
          let cfList: CashFlowEntry[] = [];
          let payList: Payment[] = [];
          try {
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
            if (b && b.length > 0) bList = b as BudgetItem[];
            if (cf && cf.length > 0) cfList = cf as CashFlowEntry[];
            if (pay && pay.length > 0) payList = pay as Payment[];
          } catch {}
          setBudget(bList.length > 0 ? bList : MOCK_BUDGET);
          setCashFlow(cfList.length > 0 ? cfList : MOCK_CASH_FLOW);
          setPayments(payList.length > 0 ? payList : MOCK_PAYMENTS);
          break;
        }
      }
      setTabLoading(false);
    })();
  }, [tab, selectedId, isPremium, refreshTick]);

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

  // ==========================================
  // HANDLERS: CRIAÇÃO / EDIÇÃO (espelham o app mobile)
  // ==========================================

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !profile) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { data: inserted, error } = await supabase
        .from('projects')
        .insert({
          name: projectForm.name.trim(),
          client_name: projectForm.client_name.trim() || null,
          address: projectForm.address.trim() || null,
          status: 'planejamento',
          start_date: new Date().toISOString().split('T')[0],
          deadline: projectForm.deadline || null,
          progress: 0,
          created_by: profile.id,
        })
        .select()
        .single();
      if (error || !inserted) throw new Error(error?.message || 'Não foi possível criar a obra.');

      const { error: memberError } = await supabase
        .from('project_members')
        .insert({ project_id: inserted.id, user_id: profile.id, project_role: profile.role });
      if (memberError) throw new Error(memberError.message);

      setProjects((prev) => [inserted as Project, ...prev]);
      setSelectedId(inserted.id);
      setProjectForm({ name: '', client_name: '', address: '', deadline: '' });
      setShowNewProject(false);
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao criar a obra.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('tasks').insert({
        project_id: selectedId,
        title: taskForm.title.trim(),
        category: taskForm.category.trim() || 'Serviço',
        status: 'pendente',
        progress: 0,
        start_date: new Date().toISOString().split('T')[0],
        deadline: taskForm.deadline || null,
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setTaskForm({ title: '', category: '', deadline: '' });
      setShowNewTask(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao criar a tarefa.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    await supabase.from('tasks').update(patch).eq('id', id);
  };

  const handleCreateDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryForm.description.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('diary_entries').insert({
        project_id: selectedId,
        entry_date: diaryForm.entry_date,
        weather: diaryForm.weather,
        workers_count: Number(diaryForm.workers_count) || null,
        description: diaryForm.description.trim(),
        occurrences: diaryForm.occurrences.trim() || null,
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setDiaryForm({ entry_date: new Date().toISOString().slice(0, 10), weather: 'sol', workers_count: '', description: '', occurrences: '' });
      setShowNewDiary(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao registrar o diário.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.name.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('materials').insert({
        project_id: selectedId,
        name: materialForm.name.trim(),
        unit: materialForm.unit,
        needed_quantity: Number(materialForm.needed_quantity) || 1,
        acquired_quantity: Number(materialForm.acquired_quantity) || 0,
        notes: materialForm.notes.trim() || null,
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setMaterialForm({ name: '', unit: 'un', needed_quantity: '', acquired_quantity: '', notes: '' });
      setShowNewMaterial(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao criar o suprimento.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRestockMaterial = async (m: MaterialRow, delta: number) => {
    const nextQty = Math.max(0, m.acquired_quantity + delta);
    setMaterials((prev) => prev.map((mat) => (mat.id === m.id ? { ...mat, acquired_quantity: nextQty } : mat)));
    await supabase.from('materials').update({ acquired_quantity: nextQty }).eq('id', m.id);
  };

  const handleToggleSafetyItem = async (item: SafetyItem) => {
    const next = !item.completed;
    setSafetyItems((prev) => prev.map((s) => (s.id === item.id ? { ...s, completed: next } : s)));
    await supabase
      .from('safety_checklist_items')
      .update({ completed: next, checked_by: profile?.id || null, checked_at: next ? new Date().toISOString() : null })
      .eq('id', item.id);
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.description.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('incidents').insert({
        project_id: selectedId,
        occurred_at: incidentForm.occurred_at,
        type: incidentForm.type,
        severity: incidentForm.severity,
        description: incidentForm.description.trim(),
        injured_person: incidentForm.injured_person.trim() || null,
        action_taken: incidentForm.action_taken.trim() || null,
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setIncidentForm({ occurred_at: new Date().toISOString().slice(0, 10), type: 'ocorrencia', severity: 'leve', description: '', injured_person: '', action_taken: '' });
      setShowNewIncident(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao registrar a ocorrência.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSearchMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberSearchError('');
    setFoundMember(null);
    if (!memberSearch.trim()) return;
    setFormLoading(true);
    try {
      const { data, error } = await supabase.rpc('find_profile_by_code_or_phone', { p_search: memberSearch.trim() });
      if (error) throw new Error(error.message);
      if (data && data.length > 0) setFoundMember(data[0]);
      else setMemberSearchError('Nenhuma conta encontrada com esse código ou telefone.');
    } catch (err: any) {
      setMemberSearchError(err?.message || 'Não foi possível buscar.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!foundMember || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { data: existing } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', selectedId)
        .eq('user_id', foundMember.id)
        .maybeSingle();
      if (existing) throw new Error('Este colaborador já faz parte da equipe desta obra.');

      const { error } = await supabase
        .from('project_members')
        .insert({ project_id: selectedId, user_id: foundMember.id, project_role: foundMember.role || 'funcionario' });
      if (error) throw new Error(error.message);

      setMemberSearch('');
      setFoundMember(null);
      setShowInviteMember(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao adicionar colaborador.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateServiceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!osForm.client_name.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const year = new Date().getFullYear();
      const existingThisYear = serviceOrders.filter((o) => o.os_number.includes(`-${year}-`));
      const osNumber = `OS-${year}-${String(existingThisYear.length + 1).padStart(4, '0')}`;

      const { error } = await supabase.from('service_orders').insert({
        project_id: selectedId,
        os_number: osNumber,
        issued_at: new Date().toISOString(),
        deadline: osForm.deadline || null,
        company_name: osForm.company_name.trim(),
        client_name: osForm.client_name.trim(),
        client_phone: osForm.client_phone.trim() || null,
        problem_description: osForm.problem_description.trim() || null,
        execution_description: osForm.execution_description.trim() || null,
        labor_value: Number(osForm.labor_value) || 0,
        status: 'aberta',
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setOsForm({ company_name: '', client_name: '', client_phone: '', deadline: '', problem_description: '', execution_description: '', labor_value: '' });
      setShowNewOS(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao criar a OS.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedId || !user) return;
    const content = chatInput.trim();
    setChatInput('');
    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`,
      content,
      attachment_type: null,
      created_at: new Date().toISOString(),
      profiles: { full_name: profile?.full_name || 'Você' },
    };
    setMessages((prev) => [optimistic, ...prev]);
    await supabase.from('messages').insert({ project_id: selectedId, user_id: user.id, content });
  };

  const handleCreateBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetItemForm.category.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('budget_items').insert({
        project_id: selectedId,
        category: budgetItemForm.category.trim(),
        planned_value: Number(budgetItemForm.planned_value) || 0,
        actual_value: Number(budgetItemForm.actual_value) || 0,
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setBudgetItemForm({ category: '', planned_value: '', actual_value: '' });
      setShowNewBudgetItem(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao salvar a categoria.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateCashFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashFlowForm.description.trim() || !cashFlowForm.amount || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('cash_flow').insert({
        project_id: selectedId,
        entry_date: cashFlowForm.entry_date,
        type: cashFlowForm.type,
        description: cashFlowForm.description.trim(),
        amount: Number(cashFlowForm.amount) || 0,
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setCashFlowForm({ type: 'saida', entry_date: new Date().toISOString().slice(0, 10), description: '', amount: '' });
      setShowNewCashFlow(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao salvar o lançamento.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.payee_name.trim() || !selectedId) return;
    setFormLoading(true);
    setFormError('');
    try {
      const { error } = await supabase.from('payments').insert({
        project_id: selectedId,
        payee_name: paymentForm.payee_name.trim(),
        payee_type: paymentForm.payee_type,
        amount: Number(paymentForm.amount) || 0,
        due_date: paymentForm.due_date || null,
        status: 'Pendente',
        created_by: profile?.id || null,
      });
      if (error) throw new Error(error.message);
      setPaymentForm({ payee_name: '', payee_type: 'Fornecedor', amount: '', due_date: '' });
      setShowNewPayment(false);
      refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao registrar o pagamento.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans relative overflow-hidden flex flex-col">
      <GlobalBackground />

      <NavBar dark />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 w-full relative z-10 flex-1">
        {/* Header User Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <img
              src={phdLogo}
              alt="Logo PHD Gestões"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20 object-cover shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Painel de Engenharia — {profile?.full_name?.split(' ')[0] || 'Engenheiro'}
                </h1>
              </div>
              <p className="text-sm text-slate-400">
                Acompanhamento integrado de cronograma, diario de obra, materiais, segurança e equipe.
              </p>
            </div>
          </div>

          {!isPremium && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-signal-500/20 to-amber-500/10 border border-signal-500/30 p-3.5 rounded-2xl shrink-0">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Modo Gratuito Ativo</p>
                <p className="text-[11px] text-slate-300">Libere o financeiro completo e obras ilimitadas.</p>
              </div>
              <Link
                to="/premium"
                className="px-4 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold shadow-lg shadow-signal-500/20 transition-all shrink-0"
              >
                Ativar Premium
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Aside: Selected Projects */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1 gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Obras Cadastradas ({projects.length})
              </span>
              <button
                onClick={() => setShowNewProject(true)}
                title="Cadastrar nova obra"
                className="shrink-0 p-1.5 rounded-lg bg-signal-500/20 border border-signal-500/30 text-signal-400 hover:bg-signal-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400">
                Carregando obras…
              </div>
            )}

            <div className="space-y-2.5">
              {projects.map((p) => {
                const isSelected = selectedId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-signal-500/20 to-orange-500/10 border-signal-500/60 text-white shadow-lg shadow-signal-500/10'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-signal-400' : 'text-slate-400'}`} />
                        <span className="font-bold text-sm truncate">{p.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate pl-6">{p.client_name}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-signal-400 translate-x-1' : 'text-slate-600 group-hover:translate-x-1'}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Pane */}
          <main className="lg:col-span-9 space-y-6">
            {selectedProject && (
              <div className="space-y-6">
                {/* Tabs Navigation Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.id;
                    const locked = t.premium && !isPremium;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                          isActive
                            ? 'bg-gradient-to-r from-signal-500 to-orange-500 text-white border-signal-400 shadow-md shadow-signal-500/20'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{t.label}</span>
                        {locked && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* TAB CONTENT: VISÃO GERAL */}
                {tab === 'visao' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                          <h2 className="text-2xl font-extrabold text-white">{selectedProject.name}</h2>
                          <p className="text-sm text-slate-400 mt-1">
                            {selectedProject.client_name} — {selectedProject.address}
                          </p>
                        </div>
                        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase">
                          {selectedProject.status}
                        </span>
                      </div>

                      {/* Progress widget */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Avanço Físico Geral</span>
                          <span className="text-cyan-400 font-mono">{selectedProject.progress ?? 0}% Concluído</span>
                        </div>
                        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${selectedProject.progress ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Timeline Forecast Alert */}
                      {progressForecast && progressForecast.status !== 'sem_dados' && (
                        <div
                          className={`p-4 rounded-2xl border text-sm font-medium flex items-start gap-3 ${
                            progressForecast.status === 'atrasado'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                              : progressForecast.status === 'atencao'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Previsão Inteligente de Cronograma</span>
                            <span>
                              No ritmo atual de execução, a conclusão está projetada para{' '}
                              <strong className="underline">
                                {progressForecast.projectedDate?.toLocaleDateString('pt-BR')}
                              </strong>
                              {progressForecast.delayDays !== null && progressForecast.delayDays > 0
                                ? ` (~${progressForecast.delayDays} dias de atraso em relação ao prazo original).`
                                : ' (dentro do prazo contratual previsto).'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: CRONOGRAMA */}
                {tab === 'cronograma' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Cronograma Físico de Tarefas</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">{tasks.length} Tarefas</span>
                        <button
                          onClick={() => setShowNewTask(true)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Nova Tarefa</span>
                        </button>
                      </div>
                    </div>

                    {tabLoading && <p className="text-sm text-slate-400">Carregando tarefas…</p>}
                    {!tabLoading && tasks.length === 0 && <p className="text-sm text-slate-400">Nenhuma tarefa cadastrada.</p>}

                    <div className="space-y-3 pt-2">
                      {tasks.map((t) => (
                        <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="font-bold text-white text-sm">{t.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono">
                                {t.category || 'Geral'}
                              </span>
                              <select
                                value={t.status}
                                onChange={(e) => handleUpdateTask(t.id, { status: e.target.value })}
                                className="px-2.5 py-0.5 rounded-full bg-signal-500/20 text-signal-300 border border-signal-500/30 text-[10px] font-mono font-bold uppercase focus:outline-none"
                              >
                                <option value="pendente">Pendente</option>
                                <option value="em_andamento">Em andamento</option>
                                <option value="concluido">Concluído</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-white/10">
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${t.progress}%` }} />
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={t.progress}
                              onChange={(e) => handleUpdateTask(t.id, { progress: Number(e.target.value) })}
                              className="w-24 accent-signal-500"
                            />
                            <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right">{t.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: DIÁRIO DE OBRA */}
                {tab === 'diario' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Diário de Obra Digital</h3>
                      <button
                        onClick={() => setShowNewDiary(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Registro</span>
                      </button>
                    </div>
                    {tabLoading && <p className="text-sm text-slate-400">Carregando diários…</p>}
                    {!tabLoading && diary.length === 0 && <p className="text-sm text-slate-400">Nenhum registro de diário cadastrado.</p>}

                    <div className="space-y-4 pt-2">
                      {diary.map((d) => (
                        <div key={d.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                            <span className="font-bold text-cyan-300">{new Date(d.entry_date).toLocaleDateString('pt-BR')}</span>
                            <div className="flex items-center gap-3 text-slate-300">
                              <span>{weatherLabel[d.weather || ''] || ''}</span>
                              {d.workers_count && <span>· {d.workers_count} Trabalhadores</span>}
                            </div>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed">{d.description}</p>
                          {d.occurrences && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                              <strong>Ocorrência:</strong> {d.occurrences}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: MATERIAIS */}
                {tab === 'materiais' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Estoque de Materiais & Insumos</h3>
                      <button
                        onClick={() => setShowNewMaterial(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Suprimento</span>
                      </button>
                    </div>
                    {tabLoading && <p className="text-sm text-slate-400">Carregando materiais…</p>}
                    <div className="space-y-3 pt-2">
                      {materials.map((m) => {
                        const low = m.acquired_quantity < m.needed_quantity;
                        return (
                          <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-white text-sm">{m.name}</p>
                              {m.notes && <p className="text-xs text-slate-400">{m.notes}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-bold font-mono ${low ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {m.acquired_quantity} / {m.needed_quantity} {m.unit}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleRestockMaterial(m, -1)}
                                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-bold"
                                >
                                  −
                                </button>
                                <button
                                  onClick={() => handleRestockMaterial(m, 1)}
                                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: SEGURANÇA */}
                {tab === 'seguranca' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                      <h3 className="text-xl font-bold text-white">Checklist de Segurança do Trabalho</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {safetyItems.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleToggleSafetyItem(s)}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center gap-3 text-sm text-left transition-all"
                          >
                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${s.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className={s.completed ? 'text-slate-200' : 'text-slate-400'}>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Ocorrências & Registro de Segurança</h3>
                        <button
                          onClick={() => setShowNewIncident(true)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Nova Ocorrência</span>
                        </button>
                      </div>
                      {incidents.length === 0 && <p className="text-sm text-slate-400">Nenhuma ocorrência registrada.</p>}
                      <div className="space-y-3 pt-2">
                        {incidents.map((i) => (
                          <div key={i.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-cyan-300 font-bold">{new Date(i.occurred_at).toLocaleDateString('pt-BR')} · {i.type}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full border font-bold uppercase ${
                                  i.severity === 'grave'
                                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                                    : i.severity === 'moderada'
                                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                                    : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                                }`}
                              >
                                {i.severity}
                              </span>
                            </div>
                            <p className="text-sm text-slate-200">{i.description}</p>
                            {i.action_taken && <p className="text-xs text-slate-400">Ação tomada: {i.action_taken}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: EQUIPE */}
                {tab === 'equipe' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Equipe Alocada na Obra</h3>
                      <button
                        onClick={() => setShowInviteMember(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Adicionar Colaborador</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {members.map((m) => (
                        <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <p className="font-bold text-white text-sm">{m.profiles?.full_name || 'Sem nome'}</p>
                          <p className="text-xs text-signal-400 font-mono font-semibold uppercase">{m.project_role}</p>
                          {m.profiles?.phone && <p className="text-xs text-slate-400">{m.profiles.phone}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: ORDENS DE SERVIÇO */}
                {tab === 'os' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Ordens de Serviço (OS)</h3>
                      <button
                        onClick={() => setShowNewOS(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nova OS</span>
                      </button>
                    </div>
                    <div className="space-y-3 pt-2">
                      {serviceOrders.map((os) => (
                        <div key={os.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-white text-sm">{os.os_number} — {os.client_name}</p>
                            <p className="text-xs text-slate-400">
                              {os.company_name} · Valor M.O.: {currency(os.labor_value)}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-signal-500/20 border border-signal-500/30 text-signal-300 text-xs font-mono font-bold uppercase self-start sm:self-auto">
                            {os.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: CHAT DA OBRA */}
                {tab === 'chat' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <h3 className="text-xl font-bold text-white">Chat da Obra</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {[...messages].reverse().map((m) => (
                        <div key={m.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-bold text-signal-400">{m.profiles?.full_name || 'Usuário'}</span>
                            <span className="font-mono text-[10px]">{new Date(m.created_at).toLocaleTimeString('pt-BR')}</span>
                          </div>
                          <p className="text-slate-200">{m.content || (m.attachment_type === 'audio' ? '🎤 Mensagem de áudio' : '📷 Foto enviada')}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <input
                        type="text"
                        placeholder="Escreva uma mensagem para a equipe da obra…"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className={inputClass}
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="shrink-0 p-3 rounded-xl bg-signal-500 hover:bg-signal-400 disabled:opacity-50 text-white transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB CONTENT: FINANCEIRO (PREMIUM) */}
                {tab === 'financeiro' && (
                  <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-signal-400" />
                        <span>Módulo Financeiro da Obra</span>
                      </h3>
                      {isPremium && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button onClick={() => setShowNewBudgetItem(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all">
                            <Plus className="w-3.5 h-3.5" /><span>Categoria</span>
                          </button>
                          <button onClick={() => setShowNewCashFlow(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all">
                            <Plus className="w-3.5 h-3.5" /><span>Lançamento</span>
                          </button>
                          <button onClick={() => setShowNewPayment(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all">
                            <Plus className="w-3.5 h-3.5" /><span>Pagamento</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isPremium && budgetForecast.status !== 'sem_dados' && (
                      <div
                        className={`p-4 rounded-2xl border text-sm font-medium flex items-start gap-3 ${
                          budgetForecast.status === 'estourado' || budgetForecast.status === 'critico'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                            : budgetForecast.status === 'atencao'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Previsão de Ruptura de Orçamento</span>
                          <span>
                            {budgetForecast.status === 'estourado'
                              ? 'O orçamento planejado já foi ultrapassado.'
                              : budgetForecast.daysToRupture !== null
                              ? `No ritmo de gasto atual, o orçamento se esgota em ~${budgetForecast.daysToRupture} dias (${budgetForecast.projectedRuptureDate?.toLocaleDateString('pt-BR')}).`
                              : 'Orçamento sob controle no ritmo de gasto atual.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {!isPremium && (
                      <div className="absolute inset-0 rounded-3xl bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-signal-500/20 border border-signal-500/30 flex items-center justify-center text-signal-400">
                          <Lock className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold text-white">Recurso Exclusivo Premium</h4>
                        <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                          Acompanhe orçamentos previstos x realizados, fluxo de caixa em tempo real e previsão inteligente de estouro financeiro.
                        </p>
                        <Link
                          to="/premium"
                          className="px-6 py-3 rounded-xl bg-signal-500 hover:bg-signal-400 text-white font-extrabold text-sm shadow-xl shadow-signal-500/25 transition-all"
                        >
                          Conhecer Plano Premium
                        </Link>
                      </div>
                    )}

                    <div className={!isPremium ? 'opacity-20 pointer-events-none space-y-6' : 'space-y-6'}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-xs text-slate-400 font-mono">Orçamento Planejado</span>
                          <span className="block text-2xl font-extrabold text-white font-mono">{currency(totalPlanned)}</span>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-xs text-slate-400 font-mono">Orçamento Executado</span>
                          <span className="block text-2xl font-extrabold text-cyan-400 font-mono">{currency(totalActual)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Fluxo de Caixa Recente</h4>
                        <div className="space-y-2">
                          {cashFlow.map((c) => (
                            <div key={c.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                              <span>{c.description}</span>
                              <span className={`font-bold ${c.type === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {c.type === 'entrada' ? '+' : '-'} {currency(c.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Pagamentos a Fornecedores & Equipe</h4>
                        <div className="space-y-2">
                          {payments.map((p) => (
                            <div key={p.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white">{p.payee_name}</span>
                                <span className="text-slate-400 font-mono"> · {p.payee_type}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="font-bold">{currency(p.amount)}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full border font-bold uppercase ${
                                    p.status === 'Pago'
                                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                                      : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </div>
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

      {/* ===== MODAIS DE CRIAÇÃO/EDIÇÃO ===== */}

      {showNewProject && (
        <Modal title="Cadastrar Nova Obra" onClose={() => setShowNewProject(false)}>
          <form onSubmit={handleCreateProject} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="space-y-1">
              <label className={labelClass}>Nome da Obra</label>
              <input required value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} className={inputClass} placeholder="Residencial Alphaville - Bloco A" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Cliente</label>
              <input value={projectForm.client_name} onChange={(e) => setProjectForm({ ...projectForm, client_name: e.target.value })} className={inputClass} placeholder="Nome do cliente / incorporadora" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Endereço</label>
              <input value={projectForm.address} onChange={(e) => setProjectForm({ ...projectForm, address: e.target.value })} className={inputClass} placeholder="Rua, número - Cidade/UF" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Prazo Final</label>
              <input type="date" value={projectForm.deadline} onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })} className={inputClass} />
            </div>
            <SubmitButton loading={formLoading}>Criar Obra</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewTask && (
        <Modal title="Nova Tarefa do Cronograma" onClose={() => setShowNewTask(false)}>
          <form onSubmit={handleCreateTask} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="space-y-1">
              <label className={labelClass}>Título do Serviço</label>
              <input required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className={inputClass} placeholder="Concretagem da Laje do 3º Pavimento" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Categoria</label>
              <input value={taskForm.category} onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })} className={inputClass} placeholder="Estrutura, Alvenaria, Acabamento…" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Prazo</label>
              <input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} className={inputClass} />
            </div>
            <SubmitButton loading={formLoading}>Criar Tarefa</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewDiary && (
        <Modal title="Novo Registro de Diário" onClose={() => setShowNewDiary(false)}>
          <form onSubmit={handleCreateDiary} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Data</label>
                <input type="date" value={diaryForm.entry_date} onChange={(e) => setDiaryForm({ ...diaryForm, entry_date: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Clima</label>
                <select value={diaryForm.weather} onChange={(e) => setDiaryForm({ ...diaryForm, weather: e.target.value })} className={inputClass}>
                  <option value="sol">☀️ Sol</option>
                  <option value="nublado">☁️ Nublado</option>
                  <option value="chuva">🌧️ Chuva</option>
                  <option value="tempestade">⛈️ Tempestade</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Trabalhadores em Obra</label>
              <input type="number" min={0} value={diaryForm.workers_count} onChange={(e) => setDiaryForm({ ...diaryForm, workers_count: e.target.value })} className={inputClass} placeholder="24" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Descrição do Dia</label>
              <textarea required rows={3} value={diaryForm.description} onChange={(e) => setDiaryForm({ ...diaryForm, description: e.target.value })} className={inputClass} placeholder="Atividades executadas hoje…" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Ocorrências (opcional)</label>
              <textarea rows={2} value={diaryForm.occurrences} onChange={(e) => setDiaryForm({ ...diaryForm, occurrences: e.target.value })} className={inputClass} placeholder="Atrasos, imprevistos…" />
            </div>
            <SubmitButton loading={formLoading}>Registrar Diário</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewMaterial && (
        <Modal title="Novo Suprimento / Material" onClose={() => setShowNewMaterial(false)}>
          <form onSubmit={handleCreateMaterial} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="space-y-1">
              <label className={labelClass}>Nome do Material</label>
              <input required value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} className={inputClass} placeholder="Cimento CP II-Z 50kg" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Unidade</label>
                <select value={materialForm.unit} onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })} className={inputClass}>
                  {MATERIAL_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Necessário</label>
                <input type="number" min={0} value={materialForm.needed_quantity} onChange={(e) => setMaterialForm({ ...materialForm, needed_quantity: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Adquirido</label>
                <input type="number" min={0} value={materialForm.acquired_quantity} onChange={(e) => setMaterialForm({ ...materialForm, acquired_quantity: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Observações</label>
              <input value={materialForm.notes} onChange={(e) => setMaterialForm({ ...materialForm, notes: e.target.value })} className={inputClass} placeholder="Fornecedor, uso previsto…" />
            </div>
            <SubmitButton loading={formLoading}>Cadastrar Material</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewIncident && (
        <Modal title="Registrar Ocorrência de Segurança" onClose={() => setShowNewIncident(false)}>
          <form onSubmit={handleCreateIncident} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Data</label>
                <input type="date" value={incidentForm.occurred_at} onChange={(e) => setIncidentForm({ ...incidentForm, occurred_at: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Tipo</label>
                <select value={incidentForm.type} onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })} className={inputClass}>
                  <option value="ocorrencia">Ocorrência</option>
                  <option value="quase_acidente">Quase Acidente</option>
                  <option value="acidente">Acidente</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Gravidade</label>
              <select value={incidentForm.severity} onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })} className={inputClass}>
                <option value="leve">Leve</option>
                <option value="moderada">Moderada</option>
                <option value="grave">Grave</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Descrição</label>
              <textarea required rows={3} value={incidentForm.description} onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Pessoa Envolvida (opcional)</label>
              <input value={incidentForm.injured_person} onChange={(e) => setIncidentForm({ ...incidentForm, injured_person: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Ação Tomada</label>
              <input value={incidentForm.action_taken} onChange={(e) => setIncidentForm({ ...incidentForm, action_taken: e.target.value })} className={inputClass} />
            </div>
            <SubmitButton loading={formLoading}>Registrar Ocorrência</SubmitButton>
          </form>
        </Modal>
      )}

      {showInviteMember && (
        <Modal
          title="Adicionar Colaborador"
          onClose={() => {
            setShowInviteMember(false);
            setFoundMember(null);
            setMemberSearch('');
            setMemberSearchError('');
          }}
        >
          <div className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <form onSubmit={handleSearchMember} className="flex items-center gap-2">
              <input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className={inputClass}
                placeholder="Código do colaborador ou telefone"
              />
              <button type="submit" disabled={formLoading} className="shrink-0 p-3 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all">
                <Search className="w-4 h-4" />
              </button>
            </form>
            {memberSearchError && <p className="text-xs text-rose-300">{memberSearchError}</p>}
            {foundMember && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white text-sm">{foundMember.full_name}</p>
                  <p className="text-xs text-slate-400 font-mono">{foundMember.role} · {foundMember.member_code}</p>
                </div>
                <button
                  onClick={handleInviteMember}
                  disabled={formLoading}
                  className="px-4 py-2 rounded-xl bg-signal-500 hover:bg-signal-400 text-white text-xs font-extrabold transition-all"
                >
                  Adicionar à Obra
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showNewOS && (
        <Modal title="Nova Ordem de Serviço" onClose={() => setShowNewOS(false)}>
          <form onSubmit={handleCreateServiceOrder} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="space-y-1">
              <label className={labelClass}>Empresa Executora</label>
              <input required value={osForm.company_name} onChange={(e) => setOsForm({ ...osForm, company_name: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Cliente</label>
              <input required value={osForm.client_name} onChange={(e) => setOsForm({ ...osForm, client_name: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Telefone do Cliente</label>
                <input value={osForm.client_phone} onChange={(e) => setOsForm({ ...osForm, client_phone: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Prazo</label>
                <input type="date" value={osForm.deadline} onChange={(e) => setOsForm({ ...osForm, deadline: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Descrição do Problema</label>
              <textarea rows={2} value={osForm.problem_description} onChange={(e) => setOsForm({ ...osForm, problem_description: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Descrição da Execução</label>
              <textarea rows={2} value={osForm.execution_description} onChange={(e) => setOsForm({ ...osForm, execution_description: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Valor da Mão de Obra (R$)</label>
              <input type="number" min={0} value={osForm.labor_value} onChange={(e) => setOsForm({ ...osForm, labor_value: e.target.value })} className={inputClass} />
            </div>
            <SubmitButton loading={formLoading}>Criar Ordem de Serviço</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewBudgetItem && (
        <Modal title="Nova Categoria de Orçamento" onClose={() => setShowNewBudgetItem(false)}>
          <form onSubmit={handleCreateBudgetItem} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="space-y-1">
              <label className={labelClass}>Categoria</label>
              <input required value={budgetItemForm.category} onChange={(e) => setBudgetItemForm({ ...budgetItemForm, category: e.target.value })} className={inputClass} placeholder="Estrutura & Fundação" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Valor Planejado (R$)</label>
                <input type="number" min={0} value={budgetItemForm.planned_value} onChange={(e) => setBudgetItemForm({ ...budgetItemForm, planned_value: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Valor Executado (R$)</label>
                <input type="number" min={0} value={budgetItemForm.actual_value} onChange={(e) => setBudgetItemForm({ ...budgetItemForm, actual_value: e.target.value })} className={inputClass} />
              </div>
            </div>
            <SubmitButton loading={formLoading}>Salvar Categoria</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewCashFlow && (
        <Modal title="Novo Lançamento de Caixa" onClose={() => setShowNewCashFlow(false)}>
          <form onSubmit={handleCreateCashFlow} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Tipo</label>
                <select value={cashFlowForm.type} onChange={(e) => setCashFlowForm({ ...cashFlowForm, type: e.target.value as 'entrada' | 'saida' })} className={inputClass}>
                  <option value="saida">Saída</option>
                  <option value="entrada">Entrada</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Data</label>
                <input type="date" value={cashFlowForm.entry_date} onChange={(e) => setCashFlowForm({ ...cashFlowForm, entry_date: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Descrição</label>
              <input required value={cashFlowForm.description} onChange={(e) => setCashFlowForm({ ...cashFlowForm, description: e.target.value })} className={inputClass} placeholder="Medição 3 - Cliente" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Valor (R$)</label>
              <input required type="number" min={0} value={cashFlowForm.amount} onChange={(e) => setCashFlowForm({ ...cashFlowForm, amount: e.target.value })} className={inputClass} />
            </div>
            <SubmitButton loading={formLoading}>Salvar Lançamento</SubmitButton>
          </form>
        </Modal>
      )}

      {showNewPayment && (
        <Modal title="Novo Pagamento" onClose={() => setShowNewPayment(false)}>
          <form onSubmit={handleCreatePayment} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{formError}</div>}
            <div className="space-y-1">
              <label className={labelClass}>Beneficiário</label>
              <input required value={paymentForm.payee_name} onChange={(e) => setPaymentForm({ ...paymentForm, payee_name: e.target.value })} className={inputClass} placeholder="Votorantim Cimentos" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Tipo</label>
                <select value={paymentForm.payee_type} onChange={(e) => setPaymentForm({ ...paymentForm, payee_type: e.target.value })} className={inputClass}>
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Funcionário">Funcionário</option>
                  <option value="Prestador">Prestador de Serviço</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Vencimento</label>
                <input type="date" value={paymentForm.due_date} onChange={(e) => setPaymentForm({ ...paymentForm, due_date: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Valor (R$)</label>
              <input required type="number" min={0} value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} className={inputClass} />
            </div>
            <SubmitButton loading={formLoading}>Registrar Pagamento</SubmitButton>
          </form>
        </Modal>
      )}
    </div>
  );
}
