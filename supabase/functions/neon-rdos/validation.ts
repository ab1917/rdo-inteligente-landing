import { z } from 'npm:zod@3';

const text = z.string().max(2000);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const number = z.number().finite();
const id = z.string().min(1).max(100);
export const rdoSchema = z.object({
  tipo: z.enum(['obra_civil', 'manutencao_industrial']),
  obra: text.min(1), cliente: text.min(1), local: text.min(1),
  setor: text.optional(), ativo: text.optional(), os_numero: text.optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, 'Data inválida'),
  responsavel: text.min(1), id_contrato: id.optional(),
  hh_executado_total: number.nonnegative(), hh_previsto_dia: number.nonnegative(),
  desvio_produtividade: number, custo_hh_realizado: number.nonnegative(),
  validacao_tecnica: z.object({ funcionario_certificado: z.boolean(), equipamento_calibrado: z.boolean(), conformidade_nr: z.array(text).max(100), alertas: z.array(text).max(100) }),
  clima: z.enum(['sol', 'chuva', 'nublado', 'vento']), temperatura: number.int().min(-10).max(50),
  status: z.enum(['rascunho', 'pendente', 'aprovado', 'alerta', 'em_execucao', 'finalizado']),
  atividades: z.array(z.object({ id, tipo: z.enum(['obra_civil','manutencao_eletrica','manutencao_mecanica','manutencao_civil','inspecao']), descricao: text.min(1), inicio: time, fim: time, percentual: number.min(0).max(100), responsavel: text.min(1), especialidade: text.optional(), ativo_relacionado: text.optional(), status: z.enum(['nao_iniciado','em_andamento','concluido','pausado','cancelado']), observacoes_tecnicas: text.optional() })).max(200),
  equipes: z.array(z.object({ id, funcionario: text.min(1), cargo: text, horaInicio: time, horaFim: time, horasTrabalhadas: number.min(0).max(24), observacoes: text.optional() })).max(200),
  fotos: z.array(z.object({ id, url: z.string().max(800000).refine(v => /^https:\/\//.test(v) || /^data:image\/(jpeg|png|webp);base64,/.test(v), 'Foto inválida ou temporária'), descricao: text, timestamp: z.string().datetime(), location: z.object({ lat: number.min(-90).max(90), lng: number.min(-180).max(180) }).optional() })).max(20),
  equipamentos: z.array(z.object({ id, nome: text, tipo: text, categoria: z.enum(['obra_civil','industrial','medicao','seguranca']), horaInicio: time, horaFim: time, horasUsadas: number.min(0).max(24), status: z.enum(['disponivel','em_uso','manutencao','calibracao']), certificacao: text.optional(), observacoes: text.optional() })).max(200).optional(),
  materiais: z.array(z.object({ id, nome: text, categoria: z.enum(['eletrico','mecanico','civil','seguranca','consumivel']), quantidade_usada: number.nonnegative(), unidade: text, codigo_interno: text.optional(), observacoes: text.optional() })).max(200).optional(),
  ocorrencias: z.array(z.object({ id, tipo: z.enum(['acidente','paralisacao','mudanca_projeto','clima_extremo','entrega','falha_tecnica','risco_eletrico','parada_emergencial']), categoria: z.enum(['seguranca','qualidade','prazo','tecnica','ambiental']), descricao: text, gravidade: z.enum(['baixa','media','alta','critica']), timestamp: z.string().datetime(), responsavel: text, ativo_afetado: text.optional(), acoes_tomadas: text.optional(), status_resolucao: z.enum(['aberta','em_tratamento','resolvida','cancelada']) })).max(200).optional(),
  checklists: z.array(z.object({ id, tipo: z.enum(['nr10','nr12','apr','pt','iso9001','custom']), nome: text, itens: z.array(z.object({ id, descricao: text, status: z.enum(['ok','nok','na','pendente']), observacoes: text.optional(), foto_evidencia: text.optional() })).max(200), responsavel: text, status: z.enum(['pendente','em_andamento','concluido','nao_conforme']), observacoes: text.optional() })).max(100).optional(),
  observacoes: z.string().max(20000).optional(), assinatura: z.string().max(800000).optional(),
});

export const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), id: z.string().uuid(), rdo: rdoSchema, author: z.object({ cpf: z.string().regex(/^\d{11}$/), cargo: text.min(1) }) }),
  z.object({ action: z.literal('update'), id: z.string().uuid(), rdo: rdoSchema }),
  z.object({ action: z.literal('delete'), id: z.string().uuid() }),
]);
