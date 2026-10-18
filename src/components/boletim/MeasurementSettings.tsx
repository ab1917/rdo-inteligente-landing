import { useState } from 'react';
import { Plus, Trash2, Clock, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { workSchedules, periodRanges, type MeasurementConfig, type ScheduleDay } from '@/services/measurementConfig';
import { calculateMeasurement } from '@/services/measurementCalculator';

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
interface Props { value: MeasurementConfig; onChange: (value: MeasurementConfig) => void }
export function MeasurementSettings({ value, onChange }: Props) {
  const [sample, setSample] = useState({ date: '2026-10-19', start: '07:00', end: '17:00', role: value.tariffs[0]?.role ?? '' });
  const [holiday, setHoliday] = useState('');
  const updateDay = (index: number, patch: Partial<ScheduleDay>) => onChange({ ...value, schedule: { ...value.schedule, days: value.schedule.days.map((day, i) => i === index ? { ...day, ...patch } : day) } });
  let result: ReturnType<typeof calculateMeasurement> | undefined;
  let error = '';
  try { result = calculateMeasurement(value, sample.role, sample.date, sample.start, sample.end); }
  catch (e) { error = e instanceof Error ? e.message : 'Revise os horários.'; }

  return <section className="space-y-5 border-t pt-6">
    <h2 className="text-xl font-semibold">Tarifas e jornadas</h2>
    <Alert><AlertDescription>Configuração deste boletim · ainda não salva para outras sessões.</AlertDescription></Alert>
    <Tabs defaultValue="jornada">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="jornada"><Clock className="mr-2 h-4 w-4" />Jornada</TabsTrigger>
        <TabsTrigger value="tarifas"><Coins className="mr-2 h-4 w-4" />Tarifas</TabsTrigger>
        <TabsTrigger value="simulacao">Simulação</TabsTrigger>
      </TabsList>
      <TabsContent value="jornada" className="space-y-5">
        <Label>Jornada de referência</Label>
        <Select value={value.schedule.id} onValueChange={id => { const selected = workSchedules.find(s => s.id === id); if (selected) onChange({ ...value, schedule: structuredClone(selected) }); }}>
          <SelectTrigger aria-label="Jornada de referência"><SelectValue /></SelectTrigger>
          <SelectContent>{workSchedules.map(s => <SelectItem value={s.id} key={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <div className="overflow-x-auto">
          <Table><TableHeader><TableRow><TableHead>Dia</TableHead><TableHead>Tipo</TableHead><TableHead>Entrada / saída</TableHead><TableHead>Entrada / saída</TableHead><TableHead>Entrada / saída</TableHead><TableHead>Horas</TableHead></TableRow></TableHeader>
            <TableBody>{value.schedule.days.map((day, index) => {
              let hours = '—';
              try { hours = (periodRanges(day.periods).reduce((sum, [a, b]) => sum + b - a, 0) / 60).toLocaleString('pt-BR', { maximumFractionDigits: 2 }); } catch { hours = '—'; }
              return <TableRow key={index}>
                <TableCell className="font-medium whitespace-nowrap">{dayNames[index]}</TableCell>
                <TableCell><Select value={day.mode} onValueChange={mode => updateDay(index, { mode: mode as ScheduleDay['mode'], periods: mode === 'normal' && !day.periods.length ? [{ start: '07:00', end: '12:00' }, { start: '13:00', end: '17:00' }] : day.periods })}><SelectTrigger aria-label={`Tipo ${dayNames[index]}`} className="w-28"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="extra">Extra</SelectItem><SelectItem value="folga">Folga</SelectItem></SelectContent></Select></TableCell>
                {[0, 1, 2].map(p => <TableCell key={p}>{day.mode === 'normal' && day.periods[p] ? <div className="flex items-center gap-1">
                  {(['start', 'end'] as const).map(field => <Input key={field} type="time" className="w-28" aria-label={`${field === 'start' ? 'Entrada' : 'Saída'} ${p + 1} ${dayNames[index]}`} value={day.periods[p][field]} onChange={e => updateDay(index, { periods: day.periods.map((period, i) => i === p ? { ...period, [field]: e.target.value } : period) })} />)}
                  <Button variant="ghost" size="icon" aria-label={`Remover período ${p + 1} ${dayNames[index]}`} onClick={() => updateDay(index, { periods: day.periods.filter((_, i) => i !== p) })}><Trash2 className="h-4 w-4" /></Button>
                </div> : day.mode === 'normal' && p === day.periods.length ? <Button size="icon" variant="outline" aria-label={`Adicionar período ${dayNames[index]}`} onClick={() => updateDay(index, { periods: [...day.periods, { start: '18:00', end: '20:00' }] })}><Plus className="h-4 w-4" /></Button> : '—'}</TableCell>)}
                <TableCell className="whitespace-nowrap">{day.mode === 'normal' ? `${hours} h` : '—'}</TableCell>
              </TableRow>;
            })}</TableBody>
          </Table>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {([{ key: 'overtime60', label: 'Extra dias úteis / sábado (%)' }, { key: 'overtime100', label: 'Domingo / feriado (%)' }, { key: 'nightPercent', label: 'Adicional noturno (%)' }] as const).map(field => <div className="space-y-2" key={field.key}><Label htmlFor={field.key}>{field.label}</Label><Input id={field.key} type="number" min="0" max="500" value={value[field.key]} onChange={e => onChange({ ...value, [field.key]: Number(e.target.value) })} /></div>)}
          <div className="space-y-2"><Label htmlFor="nightStart">Início noturno</Label><Input id="nightStart" type="time" value={value.nightStart} onChange={e => onChange({ ...value, nightStart: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="nightEnd">Fim noturno</Label><Input id="nightEnd" type="time" value={value.nightEnd} onChange={e => onChange({ ...value, nightEnd: e.target.value })} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="holiday">Feriados</Label><div className="flex gap-2"><Input id="holiday" type="date" value={holiday} onChange={e => setHoliday(e.target.value)} className="max-w-52" /><Button variant="outline" disabled={!holiday || value.holidays.includes(holiday)} onClick={() => { onChange({ ...value, holidays: [...value.holidays, holiday].sort() }); setHoliday(''); }}><Plus className="mr-2 h-4 w-4" />Adicionar</Button></div>
          {value.holidays.map(date => <div key={date} className="flex items-center gap-2 text-sm">{date.split('-').reverse().join('/')}<Button size="icon" variant="ghost" aria-label={`Remover feriado ${date}`} onClick={() => onChange({ ...value, holidays: value.holidays.filter(d => d !== date) })}><Trash2 className="h-4 w-4" /></Button></div>)}
        </div>
      </TabsContent>
      <TabsContent value="tarifas" className="space-y-4">
        <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Função</TableHead><TableHead>Normal (R$/h)</TableHead><TableHead>Extra {value.overtime60}%</TableHead><TableHead>Extra {value.overtime100}%</TableHead><TableHead>Noturna normal</TableHead></TableRow></TableHeader>
          <TableBody>{value.tariffs.map((tariff, index) => <TableRow key={index}>
            <TableCell><Input aria-label={`Função ${index + 1}`} className="min-w-52" value={tariff.role} onChange={e => onChange({ ...value, tariffs: value.tariffs.map((t, i) => i === index ? { ...t, role: e.target.value } : t) })} /></TableCell>
            <TableCell><Input className="w-28" aria-label={`Tarifa ${tariff.role}`} type="number" min="0" step="0.01" value={tariff.hourly || ''} onChange={e => onChange({ ...value, tariffs: value.tariffs.map((t, i) => i === index ? { ...t, hourly: Number(e.target.value) } : t) })} /></TableCell>
            <TableCell className="whitespace-nowrap">{currency(tariff.hourly * (1 + value.overtime60 / 100))}</TableCell><TableCell className="whitespace-nowrap">{currency(tariff.hourly * (1 + value.overtime100 / 100))}</TableCell><TableCell className="whitespace-nowrap">{currency(tariff.hourly * (1 + value.nightPercent / 100))}</TableCell>
          </TableRow>)}</TableBody></Table></div>
        <Button variant="outline" onClick={() => onChange({ ...value, tariffs: [...value.tariffs, { role: '', hourly: 0 }] })}><Plus className="mr-2 h-4 w-4" />Adicionar função</Button>
      </TabsContent>
      <TabsContent value="simulacao" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2"><Label>Função</Label><Select value={sample.role} onValueChange={role => setSample({ ...sample, role })}><SelectTrigger aria-label="Função da simulação"><SelectValue /></SelectTrigger><SelectContent>{value.tariffs.filter(t => t.role).map(t => <SelectItem key={t.role} value={t.role}>{t.role}</SelectItem>)}</SelectContent></Select></div>
          {([{ key: 'date', label: 'Data', type: 'date' }, { key: 'start', label: 'Entrada', type: 'time' }, { key: 'end', label: 'Saída', type: 'time' }] as const).map(field => <div className="space-y-2" key={field.key}><Label htmlFor={`sample-${field.key}`}>{field.label}</Label><Input id={`sample-${field.key}`} type={field.type} value={sample[field.key]} onChange={e => setSample({ ...sample, [field.key]: e.target.value })} /></div>)}
        </div>
        {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : result && <dl className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 lg:grid-cols-6">
          {[['Horas normais', `${result.hh_normais.toFixed(2)} h`], ['Extras dias úteis', `${result.hh_extras_60.toFixed(2)} h`], ['Domingo / feriado', `${result.hh_domingo_feriado.toFixed(2)} h`], ['Horas noturnas', `${result.hh_noturnas.toFixed(2)} h`], ['Adicional noturno', currency(result.valor_hh_noturnas)], ['Total', currency(result.valor_total)]].map(([label, text]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-lg font-semibold">{text}</dd></div>)}
        </dl>}
      </TabsContent>
    </Tabs>
  </section>;
}