import type { BoletimMedicao, RDO, FuncionarioBoletim, EquipamentoBoletim, MaterialBoletim, ResumoFinanceiro } from '@/types';
import { calculateMeasurement } from './measurementCalculator';
import { validateMeasurementConfig, normalizeRole, type MeasurementConfig } from './measurementConfig';

export function buildConfiguredBoletim(rdos: RDO[], config: MeasurementConfig, obra: string, inicio: string, fim: string): BoletimMedicao {
  validateMeasurementConfig(config);
  const employees = new Map<string, FuncionarioBoletim>();
  const equipment = new Map<string, EquipamentoBoletim>();
  const materials = new Map<string, MaterialBoletim>();
  const sumFields = ['hh_normais', 'hh_extras_60', 'hh_extras_100', 'hh_noturnas', 'hh_domingo_feriado', 'valor_hh_normais', 'valor_hh_extras_60', 'valor_hh_extras_100', 'valor_hh_noturnas', 'valor_hh_domingo_feriado', 'valor_total'] as const;
  for (const rdo of rdos) {
    for (const entry of rdo.equipes) {
      const key = `${normalizeRole(entry.funcionario)}:${normalizeRole(entry.cargo)}`;
      const hours = calculateMeasurement(config, entry.cargo, rdo.data, entry.horaInicio, entry.horaFim, entry.id);
      const existing = employees.get(key);
      if (existing) { for (const field of sumFields) existing[field] += hours[field]; }
      else {
        const tariff = config.tariffs.find(t => normalizeRole(t.role) === normalizeRole(entry.cargo));
        employees.set(key, {
          ...hours, funcionario_id: entry.id, funcionario_nome: entry.funcionario, cargo: entry.cargo,
          valor_hora_normal: tariff?.hourly ?? 0, hh_extras_semana_atual: 0, limite_he_atingido: false,
        });
      }
    }
    // Preserve existing equipment/material pricing; rental tariffs require a separate billing unit decision.
    for (const item of rdo.equipamentos ?? []) {
      const previous = equipment.get(item.id);
      if (previous) { previous.horas_utilizadas += item.horasUsadas; previous.valor_total += item.horasUsadas * 25; }
      else equipment.set(item.id, { equipamento_id: item.id, equipamento_nome: item.nome, categoria: item.categoria, horas_utilizadas: item.horasUsadas, valor_hora: 25, valor_total: item.horasUsadas * 25, responsavel: 'N/A' });
    }
    for (const item of rdo.materiais ?? []) {
      const previous = materials.get(item.id);
      if (previous) { previous.quantidade_utilizada += item.quantidade_usada; previous.valor_total += item.quantidade_usada * 10; }
      else materials.set(item.id, { material_id: item.id, material_nome: item.nome, categoria: item.categoria, quantidade_utilizada: item.quantidade_usada, unidade: item.unidade, valor_unitario: 10, valor_total: item.quantidade_usada * 10 });
    }
  }
  const funcionarios = [...employees.values()], equipamentos = [...equipment.values()], materiais = [...materials.values()];
  const total = (field: typeof sumFields[number]) => Math.round(funcionarios.reduce((sum, f) => sum + f[field], 0) * 100) / 100;
  const total_funcionarios = total('valor_total');
  const total_equipamentos = equipamentos.reduce((sum, item) => sum + item.valor_total, 0);
  const total_materiais = materiais.reduce((sum, item) => sum + item.valor_total, 0);
  const resumo_financeiro: ResumoFinanceiro = {
    total_funcionarios, total_equipamentos, total_materiais, total_geral: Math.round((total_funcionarios + total_equipamentos + total_materiais) * 100) / 100,
    total_hh_normais: total('valor_hh_normais'), total_hh_extras_60: total('valor_hh_extras_60'),
    total_hh_extras_100: total('valor_hh_extras_100'), total_hh_noturnas: total('valor_hh_noturnas'), total_hh_domingo_feriado: total('valor_hh_domingo_feriado'),
  };
  return { id: crypto.randomUUID(), rdo_id: rdos.map(r => r.id).join(','), obra_nome: obra, data_inicio: inicio, data_fim: fim, data: inicio, periodo_dias: new Set(rdos.map(r => r.data)).size,
    funcionarios, equipamentos, materiais, resumo_financeiro, status: 'rascunho', criado_em: new Date().toISOString(), configuracao_medicao: structuredClone(config) };
}