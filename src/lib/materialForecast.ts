export type MaterialForecastStatus = 'sem_dados' | 'estavel' | 'atencao' | 'critico' | 'esgotado';

export interface MaterialDepletionForecast {
  status: MaterialForecastStatus;
  /** Dias até o estoque zerar, no ritmo de consumo atual */
  daysToEmpty: number | null;
  /** Data estimada em que o estoque acaba, no ritmo atual */
  projectedEmptyDate: Date | null;
  /** Consumo médio por dia, considerando o ritmo recente (últimos 14 dias) */
  dailyConsumptionRate: number | null;
}

/**
 * Estima quando o estoque de um material vai acabar, com base no histórico
 * de quantidade em estoque (um ponto por dia) dos últimos 14 dias.
 * Precisa de pelo menos 2 pontos em dias diferentes pra calcular o ritmo.
 */
export function getMaterialDepletionForecast(
  snapshots: { snapshot_date: string; acquired_quantity: number }[]
): MaterialDepletionForecast {
  const sorted = [...snapshots].sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date));

  if (sorted.length === 0) {
    return { status: 'sem_dados', daysToEmpty: null, projectedEmptyDate: null, dailyConsumptionRate: null };
  }

  const latest = sorted[sorted.length - 1];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (latest.acquired_quantity <= 0) {
    return { status: 'esgotado', daysToEmpty: 0, projectedEmptyDate: today, dailyConsumptionRate: null };
  }

  if (sorted.length < 2) {
    return { status: 'sem_dados', daysToEmpty: null, projectedEmptyDate: null, dailyConsumptionRate: null };
  }

  // Ritmo recente: considera o histórico dos últimos 14 dias (ou desde o
  // primeiro ponto registrado, se o histórico for mais curto que isso)
  const windowStart = new Date(today.getTime() - 14 * 86400000);
  const periodStart = sorted.find(s => new Date(s.snapshot_date + 'T00:00:00') >= windowStart) || sorted[0];

  const latestDate = new Date(latest.snapshot_date + 'T00:00:00');
  const periodStartDate = new Date(periodStart.snapshot_date + 'T00:00:00');
  const elapsedDays = Math.round((latestDate.getTime() - periodStartDate.getTime()) / 86400000);

  if (elapsedDays <= 0) {
    return { status: 'sem_dados', daysToEmpty: null, projectedEmptyDate: null, dailyConsumptionRate: null };
  }

  const consumed = periodStart.acquired_quantity - latest.acquired_quantity;
  const dailyConsumptionRate = consumed / elapsedDays;

  if (dailyConsumptionRate <= 0) {
    return { status: 'estavel', daysToEmpty: null, projectedEmptyDate: null, dailyConsumptionRate: 0 };
  }

  const daysToEmpty = Math.max(0, Math.round(latest.acquired_quantity / dailyConsumptionRate));
  const projectedEmptyDate = new Date(today.getTime() + daysToEmpty * 86400000);

  let status: MaterialForecastStatus = 'estavel';
  if (daysToEmpty <= 3) status = 'critico';
  else if (daysToEmpty <= 7) status = 'atencao';

  return { status, daysToEmpty, projectedEmptyDate, dailyConsumptionRate };
}
