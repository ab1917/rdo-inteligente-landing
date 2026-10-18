import { describe, expect, test } from 'bun:test';
import { createMeasurementConfig, roleTariffs, workSchedules } from '../src/services/measurementConfig';
import { calculateMeasurement } from '../src/services/measurementCalculator';
import { buildConfiguredBoletim } from '../src/services/configuredBoletim';
import type { RDO } from '@/types';

describe('Supplied measurement rules', () => {
  test.each(roleTariffs)('$role hourly tariff', ({ role, hourly }) => {
    const config = createMeasurementConfig();
    expect(calculateMeasurement(config, role, '2026-10-19', '07:00', '08:00').valor_total).toBe(hourly);
  });
  test('Geral Monday excludes the lunch hour, Friday has eight hours', () => {
    const config = createMeasurementConfig();
    const monday = calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-19', '07:00', '17:00');
    expect(monday.hh_normais).toBe(9); expect(monday.valor_total).toBe(333);
    expect(calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-23', '07:00', '16:00').hh_normais).toBe(8);
  });
  test('Saturday extra 60%, Sunday 100% and weekday holiday 100%', () => {
    const config = createMeasurementConfig();
    expect(calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-24', '07:00', '08:00').valor_total).toBe(59.2);
    expect(calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-25', '07:00', '08:00').valor_total).toBe(74);
    config.holidays = ['2026-10-19'];
    expect(calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-19', '07:00', '08:00').valor_total).toBe(74);
  });
  test('Night premium accumulates on the overtime tariff', () => {
    const config = createMeasurementConfig();
    const result = calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-24', '22:00', '23:00');
    expect(result.valor_hh_extras_60).toBe(59.2); expect(result.valor_hh_noturnas).toBe(11.84); expect(result.valor_total).toBe(71.04);
  });
  test('Night schedule follows table and excludes 01:00–02:00', () => {
    const config = createMeasurementConfig(); config.schedule = structuredClone(workSchedules[6]);
    const result = calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-19', '19:00', '05:00');
    expect(result.hh_normais).toBe(9); expect(result.hh_noturnas).toBe(6); expect(result.valor_total).toBe(377.4);
    expect(calculateMeasurement(config, 'Ajudante de eletricista', '2026-10-23', '19:00', '04:00').hh_normais).toBe(8);
  });
  test('Actual minutes are billed without tolerance rounding', () => {
    const result = calculateMeasurement(createMeasurementConfig(), 'Ajudante de eletricista', '2026-10-19', '07:03', '08:00');
    expect(result.hh_normais).toBe(0.95); expect(result.valor_total).toBe(35.15);
  });
  test('Partial night hours and calendar rollover are exact', () => {
    const result = calculateMeasurement(createMeasurementConfig(), 'Ajudante de eletricista', '2026-10-24', '23:30', '00:30');
    expect(result.hh_extras_60).toBe(0.5); expect(result.hh_domingo_feriado).toBe(0.5); expect(result.hh_noturnas).toBe(1); expect(result.valor_total).toBe(79.92);
  });
  test('Intermittent Saturday has four normal hours', () => {
    const config = createMeasurementConfig(); config.schedule = structuredClone(workSchedules[2]);
    expect(calculateMeasurement(config, 'Pedreiro', '2026-10-24', '07:00', '11:00').hh_normais).toBe(4);
  });
  test('Missing tariffs block billing instead of silently using a mock price', () => {
    expect(() => calculateMeasurement(createMeasurementConfig(), 'Unknown', '2026-10-19', '07:00', '08:00')).toThrow('Informe a tarifa');
  });
  test('Consolidated and single RDO calculate the same employee amounts', () => {
    const rdo = { id: 'a', obra: 'Obra', data: '2026-10-19', equipes: [{ id: '1', funcionario: 'José', cargo: 'Pedreiro', horaInicio: '07:00', horaFim: '17:00', horasTrabalhadas: 10 }] } as RDO;
    const config = createMeasurementConfig();
    const one = buildConfiguredBoletim([rdo], config, 'Obra', rdo.data, rdo.data);
    const two = buildConfiguredBoletim([rdo, { ...rdo, id: 'b', data: '2026-10-20' }], config, 'Obra', rdo.data, '2026-10-20');
    expect(one.resumo_financeiro.total_funcionarios).toBe(351); expect(two.resumo_financeiro.total_funcionarios).toBe(702); expect(two.funcionarios[0].hh_normais).toBe(18);
    expect(one.configuracao_medicao?.nightPercent).toBe(20);
  });
});