import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Building2, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import NavBar from '@/components/NavBar';

type Project = {
  id: string;
  name: string;
  client_name: string | null;
  status: string;
  progress: number | null;
};

type BudgetItem = { id: string; category: string; planned_value: number; actual_value: number };

export default function Dashboard() {
  const { profile, isPremium } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, client_name, status, progress')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProjects(data as Project[]);
        if (data.length > 0) setSelectedId((data[0] as Project).id);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedId || !isPremium) return;
    (async () => {
      const { data, error } = await supabase
        .from('budget_items')
        .select('id, category, planned_value, actual_value')
        .eq('project_id', selectedId);
      if (!error && data) setBudget(data as BudgetItem[]);
    })();
  }, [selectedId, isPremium]);

  const selectedProject = projects.find((p) => p.id === selectedId) || null;
  const totalPlanned = budget.reduce((s, b) => s + (b.planned_value || 0), 0);
  const totalActual = budget.reduce((s, b) => s + (b.actual_value || 0), 0);

  return (
    <div className="min-h-screen bg-concrete-100">
      <NavBar />

      <div className="max-w-6xl mx-auto px-5 py-10">
        <h1 className="font-heading font-bold uppercase text-3xl">
          Olá, {profile?.full_name?.split(' ')[0] || 'engenheiro'}
        </h1>
        <p className="text-sm text-concrete-700 mt-1">
          Essa é a versão web do PHD Gestões — visão gerencial das suas obras.
        </p>

        {!isPremium && (
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap p-4 rounded-lg border border-signal-500/40 bg-signal-500/5">
            <p className="text-sm font-medium text-blueprint-950">
              Você está no plano Grátis — cronograma e diário liberados. O Financeiro completo é Premium.
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

          {/* Detalhe da obra selecionada */}
          <main>
            {selectedProject ? (
              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-concrete-200 bg-white">
                  <h2 className="font-heading font-bold uppercase text-2xl">{selectedProject.name}</h2>
                  <p className="text-sm text-concrete-700">{selectedProject.client_name}</p>
                  <div className="mt-4 h-2 rounded-full bg-concrete-200 overflow-hidden">
                    <div
                      className="h-full bg-signal-500"
                      style={{ width: `${selectedProject.progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-concrete-700 mt-1.5 block">
                    {selectedProject.progress ?? 0}% concluído
                  </span>
                </div>

                <div className="relative p-6 rounded-lg border border-concrete-200 bg-white">
                  <h3 className="font-heading font-bold uppercase text-lg flex items-center gap-2">
                    <Wallet size={18} className="text-signal-500" /> Financeiro
                  </h3>

                  {!isPremium && (
                    <div className="absolute inset-0 rounded-lg bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center px-6">
                      <Lock size={22} className="text-blueprint-950" />
                      <p className="text-sm font-semibold text-blueprint-950 max-w-xs">
                        Orçamento, fluxo de caixa e curva S ficam disponíveis no plano Premium.
                      </p>
                      <Link
                        to="/premium"
                        className="px-4 py-2 rounded-md bg-signal-500 text-white text-sm font-bold hover:bg-signal-400 transition-colors"
                      >
                        Ver plano Premium
                      </Link>
                    </div>
                  )}

                  <div className={!isPremium ? 'opacity-30 select-none pointer-events-none mt-4' : 'mt-4'}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-concrete-100">
                        <span className="text-xs font-bold uppercase text-concrete-700 flex items-center gap-1">
                          <TrendingUp size={13} /> Orçado
                        </span>
                        <span className="block font-mono font-bold text-xl mt-1">
                          {totalPlanned.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                      <div className="p-4 rounded-lg bg-concrete-100">
                        <span className="text-xs font-bold uppercase text-concrete-700 flex items-center gap-1">
                          <TrendingDown size={13} /> Realizado
                        </span>
                        <span className="block font-mono font-bold text-xl mt-1">
                          {totalActual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !loading && <p className="text-sm text-concrete-400">Selecione uma obra na lista ao lado.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
