import { describe, expect, test } from 'bun:test';
import { calculateScopeMeasurement } from '../src/services/scopeMeasurement';
describe('closed scope percentage delivery', () => {
  test('initial delivery measures a fraction of agreed value', () => { expect(calculateScopeMeasurement(100000, 0, 25).valor_periodo).toBe(25000); });
  test('next period bills only new progress, not accumulated progress again', () => { const v = calculateScopeMeasurement(100000, 25, 40); expect(v.valor_periodo).toBe(15000); expect(v.valor_acumulado).toBe(40000); });
  test('100% closes the remaining contract balance', () => { const v = calculateScopeMeasurement(100000, 40, 100); expect(v.valor_periodo).toBe(60000); expect(v.saldo_contrato).toBe(0); });
  test('cannot exceed full delivery', () => { expect(() => calculateScopeMeasurement(100000, 0, 101)).toThrow(); });
  test('cannot bill repeated or regressive delivery', () => { expect(() => calculateScopeMeasurement(100000, 25, 25)).toThrow(); expect(() => calculateScopeMeasurement(100000, 25, 20)).toThrow(); });
  test('rounded period amounts reconcile with contract cents', () => { const a = calculateScopeMeasurement(100.01, 0, 33.33), b = calculateScopeMeasurement(100.01, 33.33, 100); expect(a.valor_periodo + b.valor_periodo).toBe(100.01); });
});
