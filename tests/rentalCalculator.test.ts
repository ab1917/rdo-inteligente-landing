import { describe, it, expect } from 'bun:test';
import { calculateRentalCost, findRentalTariff, RENTAL_DAY_HOURS } from '../src/services/rentalCalculator';
import { rentalTariffs, createMeasurementConfig } from '../src/services/measurementConfig';

const byName = (name: string) => rentalTariffs.find(r => r.equipment === name)!;

describe('calculateRentalCost', () => {
  it('bills a partial day proportionally to hours (daily ÷ 8h)', () => {
    // Martelete: diária 100 → 4h = 50
    expect(calculateRentalCost(byName('Martelete rompedor'), 4).value).toBe(50);
  });
  it('bills a full day at the daily rate', () => {
    expect(calculateRentalCost(byName('Decibelímetro'), RENTAL_DAY_HOURS).value).toBe(40);
  });
  it('picks the weekly period when cheaper than daily accumulation', () => {
    // Airless: 7 dias = 7×70 = 490 > semanal 320
    const cost = calculateRentalCost(byName('Máquina de pintura airless'), 7 * RENTAL_DAY_HOURS);
    expect(cost.value).toBe(320);
    expect(cost.description).toContain('semanal');
  });
  it('combines month + proportional remainder for the cheapest total', () => {
    // Airless: 32 dias → mensal 1200 + 2×70 = 1340 (vs 2 quinzenais 1400 + …)
    const cost = calculateRentalCost(byName('Máquina de pintura airless'), 32 * RENTAL_DAY_HOURS);
    expect(cost.value).toBe(1340);
  });
  it('overbuys a larger period when it is cheaper than the exact combination', () => {
    // Detector multgás: 11 dias → 11×100 = 1100 > mensal 1000
    const cost = calculateRentalCost(byName('Detector multgás'), 11 * RENTAL_DAY_HOURS);
    expect(cost.value).toBe(1000);
    expect(cost.description).toContain('mensal');
  });
  it('uses the smallest quoted period proportionally when there is no daily rate', () => {
    // Rádio PX: sem diária; 1 dia = 100/7 ≈ 14,29
    expect(calculateRentalCost(byName('Rádio comunicador PX'), RENTAL_DAY_HOURS).value).toBe(14.29);
  });
  it('prefers monthly for long rentals without a daily rate', () => {
    // Rádio PX: 30 dias → mensal 220 (vs 4 semanais 400 + …)
    expect(calculateRentalCost(byName('Rádio comunicador PX'), 30 * RENTAL_DAY_HOURS).value).toBe(220);
  });
  it('returns zero for no usage', () => {
    expect(calculateRentalCost(byName('Oxímetro'), 0).value).toBe(0);
  });
  it('rejects a tariff with no quoted period', () => {
    expect(() => calculateRentalCost({ equipment: 'Sem tarifa' }, 8)).toThrow('Informe a tarifa de locação');
  });
});

describe('findRentalTariff', () => {
  it('matches equipment names ignoring accents and case', () => {
    expect(findRentalTariff(rentalTariffs, 'detector multgas')?.equipment).toBe('Detector multgás');
    expect(findRentalTariff(rentalTariffs, 'MÁQUINA DE PINTURA AIRLESS')?.daily).toBe(70);
  });
  it('returns undefined for unknown equipment', () => {
    expect(findRentalTariff(rentalTariffs, 'Betoneira')).toBeUndefined();
  });
});

describe('measurement config with rentals', () => {
  it('creates a valid default config including the supplied rental tariffs', () => {
    const config = createMeasurementConfig();
    expect(config.rentals).toHaveLength(8);
    expect(() => calculateRentalCost(config.rentals[0], 8)).not.toThrow();
  });
});
