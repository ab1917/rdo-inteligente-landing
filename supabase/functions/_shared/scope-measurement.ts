export function calculateScopeMeasurement(contractValue: number, previous: number, current: number) {
  if (!Number.isFinite(contractValue) || contractValue <= 0) throw new Error('Valor do contrato deve ser positivo.');
  if (![previous, current].every(p => Number.isFinite(p) && p >= 0 && p <= 100)) throw new Error('Avanço deve estar entre 0 e 100%.');
  if (current <= previous) throw new Error('Avanço acumulado deve superar o percentual já medido.');
  const round = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
  const accumulated = round(contractValue * current / 100);
  const priorValue = round(contractValue * previous / 100);
  return { valor_contrato: contractValue, percentual_anterior: previous, percentual_acumulado: current,
    percentual_periodo: round(current - previous), valor_anterior: priorValue,
    valor_periodo: round(accumulated - priorValue), valor_acumulado: accumulated, saldo_contrato: round(contractValue - accumulated) };
}
