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
import { mockObras, mockFuncionarios } from '@/services/mockData';
import { RDO, Equipamento, Ocorrencia } from '@/types';
import { PhotoUpload } from '@/components/rdo/PhotoUpload';
import { RDOValidations } from '@/components/rdo/RDOValidations';
import { StatusBadge } from '@/components/rdo/StatusBadge';

const rdoSchema = z.object({
  obra: z.string().min(1, 'Selecione uma obra'),
  data: z.string().min(1, 'Data é obrigatória'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
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
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [rdoStatus, setRdoStatus] = useState<RDO['status']>('rascunho');

  const form = useForm<RDOFormData>({
    resolver: zodResolver(rdoSchema),
    defaultValues: {
      obra: '',
      data: new Date().toISOString().split('T')[0],
      responsavel: '',
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

  const onSubmit = async (data: RDOFormData) => {
    try {
      const rdoData: Omit<RDO, 'id' | 'createdAt' | 'updatedAt'> = {
        tipo: 'obra_civil' as const,
        obra: data.obra,
        cliente: mockObras.find(o => o.nome === data.obra)?.cliente || 'Cliente Padrão',
        local: mockObras.find(o => o.nome === data.obra)?.endereco || 'Local Padrão',
        data: data.data,
        responsavel: data.responsavel,
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
          cargo: mockFuncionarios.find(f => f.nome === equipe.funcionario)?.cargo || '',
          horasTrabalhadas: calcularHoras(equipe.horaInicio, equipe.horaFim)
        })),
        fotos: photos.map((photo, index) => ({
          id: (index + 1).toString(),
          url: URL.createObjectURL(photo),
          descricao: `Foto ${index + 1}`,
          timestamp: new Date().toISOString()
        }))
      };

      await createRDO(rdoData);
      
      toast({
        title: 'RDO criado com sucesso!',
        description: 'O relatório foi salvo como rascunho.'
      });
      
      navigate('/rdo');
    } catch (error) {
      toast({
        title: 'Erro ao criar RDO',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    }
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma obra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockObras.map((obra) => (
                            <SelectItem key={obra.id} value={obra.nome}>
                              {obra.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockFuncionarios.map((funcionario) => (
                              <SelectItem key={funcionario.id} value={funcionario.nome}>
                                {funcionario.nome} - {funcionario.cargo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                  cargo: mockFuncionarios.find(f => f.nome === equipe.funcionario)?.cargo || '',
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

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/rdo')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
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