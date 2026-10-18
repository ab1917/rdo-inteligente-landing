import { normalizeRole, type RentalTariff } from './measurementConfig';

export const RENTAL_DAY_HOURS = 8;
const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export interface RentalCost {
  value: number;
  description: string;
}

// Cheapest combination of quoted periods (month 30d, fortnight 15d, week 7d, day 1d);
// the uncovered remainder is billed proportionally to hours at the smallest quoted period's daily rate.
export function calculateRentalCost(tariff: RentalTariff, hours: number): RentalCost {
  if (!Number.isFinite(hours) || hours < 0) throw new Error('Horas de locação inválidas.');
  if (hours === 0) return { value: 0, description: 'Sem uso' };
  const units = ([
    { key: 'monthly' as const, label: 'mensal', days: 30 },
    { key: 'fortnightly' as const, label: 'quinzenal', days: 15 },
    { key: 'weekly' as const, label: 'semanal', days: 7 },
    { key: 'daily' as const, label: 'diária', days: 1 },
  ]).filter(unit => tariff[unit.key] !== undefined).map(unit => ({ ...unit, price: tariff[unit.key]! }));
  if (!units.length) throw new Error(`Informe a tarifa de locação de ${tariff.equipment}.`);
  const smallest = units[units.length - 1];
  const days = hours / RENTAL_DAY_HOURS;
  let best: { value: number; description: string } | undefined;
  const maxMonths = Math.ceil(days / 30) + 1;
  for (let months = 0; months <= maxMonths; months++) {
    for (let fortnights = 0; fortnights <= 2; fortnights++) {
      for (let weeks = 0; weeks <= 2; weeks++) {
        const parts: string[] = [];
        let value = 0;
        let covered = 0;
        const counts: [number, (typeof units)[number]][] = [[months, units.find(u => u.key === 'monthly')!], [fortnights, units.find(u => u.key === 'fortnightly')!], [weeks, units.find(u => u.key === 'weekly')!]];
        let skip = false;
        for (const [count, unit] of counts) {
          if (!count) continue;
          if (!unit) { skip = true; break; }
          value += count * unit.price;
          covered += count * unit.days;
          parts.push(`${count} ${unit.label}${count > 1 ? 's' : ''}`);
        }
        if (skip) continue;
        const remainder = Math.max(0, days - covered);
        if (remainder > 0) {
          value += remainder * smallest.price / smallest.days;
          parts.push(`${(remainder * RENTAL_DAY_HOURS).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} h proporcionais`);
        }
        if (covered === 0 && remainder === 0) continue;
        if (!best || value < best.value) best = { value, description: parts.join(' + ') };
      }
    }
  }
  return { value: money(best!.value), description: best!.description };
}

export function findRentalTariff(rentals: RentalTariff[], equipmentName: string): RentalTariff | undefined {
  return rentals.find(r => normalizeRole(r.equipment) === normalizeRole(equipmentName));
}
