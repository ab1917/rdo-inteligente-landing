import type { ClassificacaoHH } from '@/types';
import { minuteOfDay, normalizeRole, periodRanges, validateMeasurementConfig, type MeasurementConfig, type WorkPeriod } from './measurementConfig';

export interface MeasuredHours extends ClassificacaoHH {
  hh_domingo_feriado: number;
  valor_hh_normais: number;
  valor_hh_extras_60: number;
  valor_hh_extras_100: number;
  valor_hh_noturnas: number;
  valor_hh_domingo_feriado: number;
  valor_total: number;
}
const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateMeasurement(config: MeasurementConfig, role: string, date: string, start: string, end: string, employeeId = '', actualPeriods?: WorkPeriod[]): MeasuredHours {
  validateMeasurementConfig(config);
  const tariff = config.tariffs.find(t => normalizeRole(t.role) === normalizeRole(role));
  if (!tariff || tariff.hourly <= 0) throw new Error(`Informe a tarifa de ${role}.`);
  const dateObj = new Date(`${date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(dateObj.getTime()) || dateObj.toISOString().slice(0, 10) !== date) throw new Error('Data inválida.');
  const schedule = config.schedule.days[dateObj.getUTCDay()];
  const normal = schedule.mode === 'normal' ? periodRanges(schedule.periods) : [];
  const breaks: [number, number][] = normal.slice(1).map((range, i) => [normal[i][1], range[0]]);
  const actual = periodRanges(actualPeriods ?? [{ start, end }]);
  if (!actual.length || actual.some(([a, b]) => b - a >= 1440) || actual[actual.length - 1][1] - actual[0][0] > 1440) throw new Error('Revise o período trabalhado.');
  const nightStart = minuteOfDay(config.nightStart), nightEnd = minuteOfDay(config.nightEnd);
  const minutes = { normal: 0, extra60: 0, extra100: 0, sunday: 0, night: 0 };
  let nightValue = 0;
  for (const [from, to] of actual) {
    for (let minute = from; minute < to; minute++) {
      // Explicit clock periods already exclude breaks; a single RDO span uses the selected schedule's breaks.
      if (!actualPeriods && breaks.some(([a, b]) => minute >= a && minute < b)) continue;
      const currentDate = new Date(dateObj.getTime() + Math.floor(minute / 1440) * 86400000);
      const holiday = config.holidays.includes(currentDate.toISOString().slice(0, 10));
      const sunday = currentDate.getUTCDay() === 0;
      const clock = minute % 1440;
      const night = nightStart > nightEnd ? clock >= nightStart || clock < nightEnd : clock >= nightStart && clock < nightEnd;
      let multiplier = 1;
      if (sunday || holiday) { minutes.sunday++; multiplier += config.overtime100 / 100; }
      else if (schedule.mode === 'normal' && normal.some(([a, b]) => minute >= a && minute < b)) minutes.normal++;
      else { minutes.extra60++; multiplier += config.overtime60 / 100; }
      if (night) { minutes.night++; nightValue += tariff.hourly * multiplier * config.nightPercent / 100 / 60; }
    }
  }
  const values = {
    valor_hh_normais: money(minutes.normal / 60 * tariff.hourly),
    valor_hh_extras_60: money(minutes.extra60 / 60 * tariff.hourly * (1 + config.overtime60 / 100)),
    valor_hh_extras_100: money(minutes.extra100 / 60 * tariff.hourly * (1 + config.overtime100 / 100)),
    valor_hh_domingo_feriado: money(minutes.sunday / 60 * tariff.hourly * (1 + config.overtime100 / 100)),
    valor_hh_noturnas: money(nightValue),
  };
  return {
    funcionario_id: employeeId, hora_inicio: start, hora_fim: end,
    total_horas: (minutes.normal + minutes.extra60 + minutes.extra100 + minutes.sunday) / 60,
    hh_normais: minutes.normal / 60, hh_extras_60: minutes.extra60 / 60, hh_extras_100: minutes.extra100 / 60,
    hh_noturnas: minutes.night / 60, hh_domingo_feriado: minutes.sunday / 60, eh_domingo_feriado: minutes.sunday > 0,
    ...values, valor_total: money(Object.values(values).reduce((sum, value) => sum + value, 0)),
  };
}