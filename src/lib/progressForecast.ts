export type ForecastStatus = 'sem_dados' | 'no_prazo' | 'atencao' | 'atrasado';

export interface ProgressForecast {
  status: ForecastStatus;
  /** Data estimada de conclusão, no ritmo atual */
  projectedDate: Date | null;
  /** Dias de atraso projetados em relação ao prazo (negativo = adiantado) */
  delayDays: number | null;
  /** % de progresso concluído por dia, no ritmo atual */
  dailyRatePercent: number | null;
}

/**
 * Estima se uma obra vai atrasar, com base no ritmo de progresso desde o
 * início até hoje, projetado até 100%, comparado com o prazo definido.
 */
export function getProgressForecast(
  startDate: string | null,
  deadline: string | null,
  progress: number
): ProgressForecast {
  if (!startDate || !deadline || progress <= 0) {
    return { status: 'sem_dados', projectedDate: null, delayDays: null, dailyRatePercent: null };
  }

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(deadline + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const elapsedDays = Math.max(1, Math.round((today.getTime() - start.getTime()) / 86400000));
  if (elapsedDays <= 0) {
    return { status: 'sem_dados', projectedDate: null, delayDays: null, dailyRatePercent: null };
  }

  const dailyRatePercent = progress / elapsedDays;
  if (dailyRatePercent <= 0) {
    return { status: 'sem_dados', projectedDate: null, delayDays: null, dailyRatePercent: null };
  }

  const remainingPercent = Math.max(0, 100 - progress);
  const daysToFinish = remainingPercent / dailyRatePercent;
  const projectedDate = new Date(today.getTime() + daysToFinish * 86400000);

  const delayDays = Math.round((projectedDate.getTime() - end.getTime()) / 86400000);

  let status: ForecastStatus = 'no_prazo';
  if (delayDays > 3) status = 'atrasado';
  else if (delayDays > 0) status = 'atencao';

  return { status, projectedDate, delayDays, dailyRatePercent };
}
