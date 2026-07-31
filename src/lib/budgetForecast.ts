export type BudgetForecastStatus = 'sem_dados' | 'controlado' | 'atencao' | 'critico' | 'estourado';

export interface BudgetForecast {
  status: BudgetForecastStatus;
  /** Dias até o orçamento estourar, no ritmo de gasto atual */
  daysToRupture: number | null;
  /** Data estimada em que o orçamento estoura, no ritmo atual */
  projectedRuptureDate: Date | null;
  /** Gasto médio por dia, considerando o ritmo recente (últimos 30 dias) */
  dailyBurnRate: number | null;
  /** Quanto ainda resta do orçamento (pode ser negativo se já estourou) */
  remainingBudget: number;
}

/**
 * Estima se o orçamento de uma obra vai estourar, com base no ritmo de
 * gasto (saídas de caixa) dos últimos 30 dias, projetado contra o quanto
 * ainda resta do orçamento total planejado.
 */
export function getBudgetForecast(
  cashFlowSaidas: { entry_date: string; amount: number }[],
  totalPlanned: number,
  totalSpent: number
): BudgetForecast {
  const remainingBudget = totalPlanned - totalSpent;

  if (totalPlanned <= 0) {
    return { status: 'sem_dados', daysToRupture: null, projectedRuptureDate: null, dailyBurnRate: null, remainingBudget };
  }

  if (remainingBudget <= 0) {
    return { status: 'estourado', daysToRupture: 0, projectedRuptureDate: new Date(), dailyBurnRate: null, remainingBudget };
  }

  if (cashFlowSaidas.length === 0) {
    return { status: 'sem_dados', daysToRupture: null, projectedRuptureDate: null, dailyBurnRate: null, remainingBudget };
  }

  const sorted = [...cashFlowSaidas].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ritmo recente: considera as saídas dos últimos 30 dias (ou desde o
  // primeiro lançamento, se o histórico da obra for mais curto que isso)
  const windowStart = new Date(today.getTime() - 30 * 86400000);
  const firstEntryDate = new Date(sorted[0].entry_date + 'T00:00:00');
  const periodStart = firstEntryDate > windowStart ? firstEntryDate : windowStart;

  const recentSaidas = sorted.filter(c => new Date(c.entry_date + 'T00:00:00') >= periodStart);
  const totalRecente = recentSaidas.reduce((sum, c) => sum + c.amount, 0);
  const elapsedDays = Math.max(1, Math.round((today.getTime() - periodStart.getTime()) / 86400000));
  const dailyBurnRate = totalRecente / elapsedDays;

  if (dailyBurnRate <= 0) {
    return { status: 'controlado', daysToRupture: null, projectedRuptureDate: null, dailyBurnRate: 0, remainingBudget };
  }

  const daysToRupture = Math.max(0, Math.round(remainingBudget / dailyBurnRate));
  const projectedRuptureDate = new Date(today.getTime() + daysToRupture * 86400000);

  let status: BudgetForecastStatus = 'controlado';
  if (daysToRupture <= 7) status = 'critico';
  else if (daysToRupture <= 30) status = 'atencao';

  return { status, daysToRupture, projectedRuptureDate, dailyBurnRate, remainingBudget };
}
