import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRDO } from '@/hooks/useRDO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Upload,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { encodeRDOPhoto } from '@/services/rdoPhotos';
import { RDO, Equipamento, Ocorrencia } from '@/types';
import { PhotoUpload } from '@/components/rdo/PhotoUpload';
import { RDOValidations } from '@/components/rdo/RDOValidations';
import { BoletimMedicaoCompleto } from '@/components/boletim/BoletimMedicaoCompleto';
import { useBoletimMedicao } from '@/hooks/useBoletimMedicao';
import { StatusBadge } from '@/components/rdo/StatusBadge';

const rdoSchema = z.object({
  obra: z.string().min(1, 'Selecione uma obra'),
  cliente: z.string().min(1, 'Informe o cliente'),
  local: z.string().min(1, 'Informe o local'),
  data: z.string().min(1, 'Data é obrigatória'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  cpfResponsavel: z.string().regex(/^\d{11}$/, 'Informe o CPF com 11 números'),
  cargoResponsavel: z.string().min(1, 'Informe a função do responsável'),
  clima: z.enum(['sol', 'chuva', 'nublado', 'vento']),
  temperatura: z.number().min(-10).max(50),
  observacoes: z.string().optional(),
  atividades: z.array(z.object({
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    inicio: z.string().min(1, 'Hora de início é obrigatória'),
    fim: z.string().min(1, 'Hora de fim é obrigatória'),
    percentual: z.number().min(0).max(100),
    responsavel: z.string().min(1, 'Responsável é obrigatório')
  })).min(1, 'Adicione pelo menos uma atividade'),
  equipes: z.array(z.object({
    funcionario: z.string().min(1, 'Selecione um funcionário'),
    cargo: z.string().min(1, 'Informe a função'),
    horaInicio: z.string().min(1, 'Hora de início é obrigatória'),
    horaFim: z.string().min(1, 'Hora de fim é obrigatória')
  })).min(1, 'Adicione pelo menos um membro da equipe'),
  equipamentos: z.array(z.object({
    nome: z.string().min(1, 'Nome do equipamento é obrigatório'),
    tipo: z.string().min(1, 'Tipo é obrigatório'),
    horaInicio: z.string().min(1, 'Hora de início é obrigatória'),
    horaFim: z.string().min(1, 'Hora de fim é obrigatória')
  })).optional(),
  ocorrencias: z.array(z.object({
    tipo: z.enum(['acidente', 'paralisacao', 'mudanca_projeto', 'clima_extremo', 'entrega']),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    gravidade: z.enum(['baixa', 'media', 'alta', 'critica']),
    responsavel: z.string().min(1, 'Responsável é obrigatório'),
    acoes_tomadas: z.string().optional()
  })).optional()
});

type RDOFormData = z.infer<typeof rdoSchema>;

const climaOptions = [
  { value: 'sol', label: 'Sol', icon: Sun },
  { value: 'nublado', label: 'Nublado', icon: Cloud },
  { value: 'chuva', label: 'Chuva', icon: CloudRain },
  { value: 'vento', label: 'Vento', icon: Wind }
];

export function CreateRDO() {
  const navigate = useNavigate();
  const { createRDO, loading } = useRDO();
  const { gerarBoletimDeRDO, aprovarBoletim, loading: loadingBoletim } = useBoletimMedicao();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [rdoStatus, setRdoStatus] = useState<RDO['status']>('rascunho');
  const [boletimGerado, setBoletimGerado] = useState(null);
  const [activeTab, setActiveTab] = useState('basico');
  const [saving, setSaving] = useState(false);

  const form = useForm<RDOFormData>({
    resolver: zodResolver(rdoSchema),
    defaultValues: {
      obra: '',
      cliente: '',
      local: '',
      data: new Date().toISOString().split('T')[0],
      responsavel: '',
      cpfResponsavel: '',
      cargoResponsavel: '',
      clima: 'sol',
      temperatura: 25,
      observacoes: '',
      atividades: [{
        descricao: '',
        inicio: '07:00',
        fim: '17:00',
        percentual: 0,
        responsavel: ''
      }],
      equipes: [{
        funcionario: '',
        cargo: '',
        horaInicio: '07:00',
        horaFim: '17:00'
      }],
      equipamentos: [],
      ocorrencias: []
    }
  });

  const { fields: atividadeFields, append: appendAtividade, remove: removeAtividade } = useFieldArray({
    control: form.control,
    name: 'atividades'
  });

  const { fields: equipeFields, append: appendEquipe, remove: removeEquipe } = useFieldArray({
    control: form.control,
    name: 'equipes'
  });

  const { fields: equipamentoFields, append: appendEquipamento, remove: removeEquipamento } = useFieldArray({
    control: form.control,
    name: 'equipamentos'
  });

  const { fields: ocorrenciaFields, append: appendOcorrencia, remove: removeOcorrencia } = useFieldArray({
    control: form.control,
    name: 'ocorrencias'
  });

  const calcularHoras = (inicio: string, fim: string): number => {
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFim, minutoFim] = fim.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minutoInicio;
    const fimMinutos = horaFim * 60 + minutoFim;
    
    return Math.max(0, (fimMinutos - inicioMinutos) / 60);
  };

  const handleGerarBoletim = async () => {
    const formData = form.getValues();
    if (!formData.equipes.length) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um funcionário para gerar o boletim.",
        variant: "destructive",
      });
      return;
    }

    try {
      const rdoTemp = {
        id: 'temp-' + Date.now(),
        tipo: 'obra_civil' as const,
        obra: formData.obra,
        cliente: formData.cliente,
        local: formData.local,
        data: formData.data,
        responsavel: formData.responsavel,
        clima: formData.clima,
        temperatura: formData.temperatura,
        status: 'rascunho' as const,
        hh_executado_total: 0,
        hh_previsto_dia: 8,
        desvio_produtividade: 0,
        custo_hh_realizado: 0,
        validacao_tecnica: {
          funcionario_certificado: true,
          equipamento_calibrado: true,
          conformidade_nr: [],
          alertas: []
        },
        atividades: [],
        equipes: formData.equipes.map((eq, i) => ({
          id: (i + 1).toString(),
          funcionario: eq.funcionario,
          cargo: eq.cargo,
          horaInicio: eq.horaInicio,
          horaFim: eq.horaFim,
          horasTrabalhadas: calcularHoras(eq.horaInicio, eq.horaFim)
        })),
        fotos: [],
        equipamentos: formData.equipamentos?.map((eq, i) => ({
          id: (i + 1).toString(),
          nome: eq.nome,
          tipo: eq.tipo,
          categoria: 'obra_civil' as const,
          horaInicio: eq.horaInicio,
          horaFim: eq.horaFim,
          horasUsadas: calcularHoras(eq.horaInicio, eq.horaFim),
          status: 'em_uso' as const
        })) || [],
        materiais: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const boletim = await gerarBoletimDeRDO(rdoTemp);
      setBoletimGerado(boletim);
      setActiveTab('boletim');
      
      toast({
        title: "Boletim gerado!",
        description: "Confira os valores calculados automaticamente.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar boletim",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: RDOFormData) => {
    if (saving) return;
    setSaving(true);
    try {
      const rdoData: Omit<RDO, 'id' | 'createdAt' | 'updatedAt'> = {
        tipo: 'obra_civil' as const,
        obra: data.obra,
        cliente: data.cliente,
        local: data.local,
        data: data.data,
        responsavel: data.responsavel,
        // Dados de HH e controle - valores padrão para novo RDO
        hh_executado_total: 0,
        hh_previsto_dia: 8,
        desvio_produtividade: 0,
        custo_hh_realizado: 0,
        validacao_tecnica: {
          funcionario_certificado: false,
          equipamento_calibrado: false,
          conformidade_nr: [],
          alertas: ['RDO em elaboração - validações pendentes']
        },
        clima: data.clima,
        temperatura: data.temperatura,
        observacoes: data.observacoes,
        status: 'rascunho' as const,
        atividades: data.atividades.map((ativ, index) => ({
          id: (index + 1).toString(),
          tipo: 'obra_civil' as const,
          descricao: ativ.descricao,
          inicio: ativ.inicio,
          fim: ativ.fim,
          percentual: ativ.percentual,
          responsavel: ativ.responsavel,
          status: 'nao_iniciado' as const
        })),
        equipes: data.equipes.map((equipe, index) => ({
          id: (index + 1).toString(),
          funcionario: equipe.funcionario,
          horaInicio: equipe.horaInicio,
          horaFim: equipe.horaFim,
          cargo: equipe.cargo,
          horasTrabalhadas: calcularHoras(equipe.horaInicio, equipe.horaFim)
        })),
        equipamentos: (data.equipamentos ?? []).map((eq, index) => ({ nome: eq.nome, tipo: eq.tipo, horaInicio: eq.horaInicio, horaFim: eq.horaFim, id: String(index + 1), categoria: 'obra_civil', status: 'em_uso', horasUsadas: calcularHoras(eq.horaInicio, eq.horaFim) })),
        ocorrencias: (data.ocorrencias ?? []).map((oc, index) => ({ tipo: oc.tipo, descricao: oc.descricao, gravidade: oc.gravidade, responsavel: oc.responsavel, acoes_tomadas: oc.acoes_tomadas, id: String(index + 1), categoria: 'seguranca', timestamp: new Date().toISOString(), status_resolucao: 'aberta' })),
        fotos: await Promise.all(photos.map(async (photo, index) => ({
          id: (index + 1).toString(),
          url: await encodeRDOPhoto(photo),
          descricao: `Foto ${index + 1}`,
          timestamp: new Date().toISOString()
        })))
      };

      await createRDO(rdoData, { cpf: data.cpfResponsavel, cargo: data.cargoResponsavel });
      
      toast({
        title: 'RDO criado com sucesso!',
        description: 'O relatório foi salvo como rascunho.'
      });
      
      navigate('/rdo');
    } catch (error) {
      toast({
        title: 'Erro ao criar RDO',
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rdo')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo RDO</h1>
          <p className="text-muted-foreground">
            Crie um novo Relatório Diário de Obra
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="obra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obra</FormLabel>
                      <FormControl><Input placeholder="Nome da obra" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="cliente" render={({ field }) => <FormItem><FormLabel>Cliente</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="local" render={({ field }) => <FormItem><FormLabel>Local da obra</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="cpfResponsavel" render={({ field }) => <FormItem><FormLabel>CPF do responsável</FormLabel><FormControl><Input maxLength={11} inputMode="numeric" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="cargoResponsavel" render={({ field }) => <FormItem><FormLabel>Função do responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clima"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clima</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {climaOptions.map((clima) => {
                              const Icon = clima.icon;
                              return (
                                <SelectItem key={clima.value} value={clima.value}>
                                  <div className="flex items-center">
                                    <Icon className="mr-2 h-4 w-4" />
                                    {clima.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperatura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperatura (°C)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              className="pl-9"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividades */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Atividades Realizadas</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendAtividade({
                    descricao: '',
                    inicio: '07:00',
                    fim: '17:00',
                    percentual: 0,
                    responsavel: ''
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {atividadeFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Atividade {index + 1}</h4>
                    {atividadeFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAtividade(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`atividades.${index}.descricao`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Descreva a atividade..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`atividades.${index}.inicio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora Início</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`atividades.${index}.fim`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora Fim</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`atividades.${index}.percentual`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Percentual (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`atividades.${index}.responsavel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do responsável" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Equipe */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Equipe do Dia</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendEquipe({
                    funcionario: '',
                    cargo: '',
                    horaInicio: '07:00',
                    horaFim: '17:00'
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipeFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`equipes.${index}.funcionario`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário</FormLabel>
                        <FormControl><Input {...field} placeholder="Nome do funcionário" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`equipes.${index}.horaInicio`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entrada</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`equipes.${index}.horaFim`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saída</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    {equipeFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEquipe(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Equipamentos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Equipamentos Utilizados
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendEquipamento({
                    nome: '',
                    tipo: '',
                    horaInicio: '07:00',
                    horaFim: '17:00'
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipamentoFields.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum equipamento adicionado
                </p>
              ) : (
                equipamentoFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`equipamentos.${index}.nome`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Betoneira" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`equipamentos.${index}.tipo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="escavadeira">Escavadeira</SelectItem>
                              <SelectItem value="betoneira">Betoneira</SelectItem>
                              <SelectItem value="guindaste">Guindaste</SelectItem>
                              <SelectItem value="retroescavadeira">Retroescavadeira</SelectItem>
                              <SelectItem value="compactador">Compactador</SelectItem>
                              <SelectItem value="andaime">Andaime</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`equipamentos.${index}.horaInicio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Início</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`equipamentos.${index}.horaFim`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fim</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEquipamento(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Ocorrências */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Ocorrências e Eventos
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendOcorrencia({
                    tipo: 'entrega',
                    descricao: '',
                    gravidade: 'baixa',
                    responsavel: '',
                    acoes_tomadas: ''
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ocorrenciaFields.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma ocorrência registrada
                </p>
              ) : (
                ocorrenciaFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Ocorrência {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOcorrencia(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`ocorrencias.${index}.tipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="acidente">Acidente</SelectItem>
                                <SelectItem value="paralisacao">Paralização</SelectItem>
                                <SelectItem value="mudanca_projeto">Mudança no Projeto</SelectItem>
                                <SelectItem value="clima_extremo">Clima Extremo</SelectItem>
                                <SelectItem value="entrega">Entrega de Material</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ocorrencias.${index}.gravidade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gravidade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="baixa">🟢 Baixa</SelectItem>
                                <SelectItem value="media">🟡 Média</SelectItem>
                                <SelectItem value="alta">🟠 Alta</SelectItem>
                                <SelectItem value="critica">🔴 Crítica</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ocorrencias.${index}.responsavel`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Responsável</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`ocorrencias.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva a ocorrência..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ocorrencias.${index}.acoes_tomadas`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ações Tomadas (opcional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva as ações tomadas..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Fotos e Evidências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Fotos e Evidências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload 
                photos={photos} 
                onPhotosChange={setPhotos}
                maxFiles={20}
              />
            </CardContent>
          </Card>

          {/* Validações Inteligentes */}
          <Card>
            <CardHeader>
              <CardTitle>Validações Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RDOValidations 
                formData={form.watch()}
                equipes={form.watch('equipes').map((equipe, index) => ({
                  id: (index + 1).toString(),
                  funcionario: equipe.funcionario,
                  cargo: equipe.cargo,
                  horaInicio: equipe.horaInicio,
                  horaFim: equipe.horaFim,
                  horasTrabalhadas: calcularHoras(equipe.horaInicio, equipe.horaFim)
                }))}
              />
            </CardContent>
          </Card>

          {/* Status e Observações */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Status e Observações</CardTitle>
                <StatusBadge status={rdoStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Gerais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações gerais sobre o dia de trabalho..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Boletim de Medição */}
          {boletimGerado && (
            <Card>
              <CardHeader>
                <CardTitle>Boletim de Medição Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                <BoletimMedicaoCompleto boletim={boletimGerado} readOnly />
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/rdo')}>
              Cancelar
            </Button>
            {!boletimGerado && form.watch('equipes').length > 0 && (
              <Button 
                type="button" 
                variant="secondary"
                onClick={handleGerarBoletim}
                disabled={loadingBoletim}
              >
                {loadingBoletim ? 'Gerando...' : 'Gerar Boletim'}
              </Button>
            )}
            <Button type="submit" disabled={loading || saving}>
              {saving ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar RDO
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}