export interface WorkPeriod { start: string; end: string }
export interface ScheduleDay { mode: 'normal' | 'extra' | 'folga'; periods: WorkPeriod[] }
export interface WorkSchedule { id: string; name: string; days: ScheduleDay[] }
export interface RoleTariff { role: string; hourly: number }
export interface MeasurementConfig {
  schedule: WorkSchedule;
  tariffs: RoleTariff[];
  overtime60: number;
  overtime100: number;
  nightPercent: number;
  nightStart: string;
  nightEnd: string;
  holidays: string[];
}

export const roleTariffs: RoleTariff[] = [
  ['Ajudante de eletricista', 37], ['Ajudante de mecânico', 30.5], ['Ajudante de pintor', 30.5],
  ['Caldeireiro', 45], ['Eletricista FC', 55], ['Eletricista montador', 48],
  ['Enc. mecânica/pintura/líder', 52.5], ['Mecânico ajustador', 43], ['Mecânico manutenção', 41],
  ['Mecânico montador', 41], ['Pedreiro', 39], ['Pintor industrial', 36], ['Pintor jatista', 41],
  ['Soldador/maçarico', 41], ['Administrativo', 41.5], ['Almoxarifado', 33],
  ['Aux. administrativo', 32], ['Supervisor', 110], ['Téc. de seg. do trabalho', 41.5],
  ['Técnico de planejamento', 41.5],
].map(([role, hourly]) => ({ role: String(role), hourly: Number(hourly) }));

const day = (start: string, end: string, breakStart = '12:00', breakEnd = '13:00'): ScheduleDay => ({
  mode: 'normal', periods: [{ start, end: breakStart }, { start: breakEnd, end }],
});
const extra = (): ScheduleDay => ({ mode: 'extra', periods: [] });
function schedule(id: string, name: string, weekday: ScheduleDay, friday: ScheduleDay = weekday, saturday: ScheduleDay = extra()): WorkSchedule {
  return { id, name, days: [extra(), weekday, weekday, weekday, weekday, friday, saturday].map(d => structuredClone(d)) };
}
export const workSchedules: WorkSchedule[] = [
  schedule('1', '1 · Geral — 07:00 às 17:00', day('07:00', '17:00'), day('07:00', '16:00')),
  schedule('10', '10 · Feriado na semana', day('07:00', '17:00')),
  schedule('11', '11 · Intermitente', day('07:00', '16:00'), day('07:00', '16:00'), { mode: 'normal', periods: [{ start: '07:00', end: '11:00' }] }),
  schedule('12', '12 · Feriado no sábado', day('07:00', '16:00')),
  schedule('13', '13 · 07:30 às 17:30', day('07:30', '17:30'), day('07:30', '16:30')),
  schedule('14', '14 · Estágio — 07:00 às 13:00', { mode: 'normal', periods: [{ start: '07:00', end: '13:00' }] }, undefined, { mode: 'folga', periods: [] }),
  schedule('15', '15 · Noturno — 19:00 às 05:00', day('19:00', '05:00', '01:00', '02:00'), day('19:00', '04:00', '01:00', '02:00')),
];
workSchedules[5].days[0] = { mode: 'folga', periods: [] };

export const normalizeRole = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
export function createMeasurementConfig(): MeasurementConfig {
  return { schedule: structuredClone(workSchedules[0]), tariffs: structuredClone(roleTariffs), overtime60: 60, overtime100: 100, nightPercent: 20, nightStart: '22:00', nightEnd: '05:00', holidays: [] };
}

export const minuteOfDay = (time: string) => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Horário inválido.');
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
export function periodRanges(periods: WorkPeriod[]): [number, number][] {
  let previous = -1;
  return periods.map(period => {
    let start = minuteOfDay(period.start);
    while (start < previous) start += 1440;
    let end = minuteOfDay(period.end);
    while (end <= start) end += 1440;
    previous = end;
    return [start, end];
  });
}

export function validateMeasurementConfig(config: MeasurementConfig): void {
  if (config.schedule.days.length !== 7) throw new Error('Informe os sete dias da jornada.');
  for (const day of config.schedule.days) {
    if (day.mode !== 'normal') continue;
    if (!day.periods.length) throw new Error('Informe a entrada e a saída dos dias normais.');
    const ranges = periodRanges(day.periods);
    if (ranges.some(([start, end]) => end - start >= 1440) || ranges[ranges.length - 1][1] - ranges[0][0] > 1440) throw new Error('Revise os intervalos da jornada; há sobreposição ou duração superior a 24 horas.');
  }
  for (const value of [config.overtime60, config.overtime100, config.nightPercent]) {
    if (!Number.isFinite(value) || value < 0 || value > 500) throw new Error('Informe adicionais entre 0% e 500%.');
  }
  minuteOfDay(config.nightStart); minuteOfDay(config.nightEnd);
  if (config.nightStart === config.nightEnd) throw new Error('O período noturno precisa de início e fim diferentes.');
  if (config.tariffs.some(t => !t.role.trim() || !Number.isFinite(t.hourly) || t.hourly < 0)) throw new Error('Revise as tarifas por função.');
}