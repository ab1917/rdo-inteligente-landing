import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Funcionario, Certificacao } from '@/types';

const funcionarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  cargo: z.string().min(2, 'Cargo é obrigatório'),
  salario: z.number().min(0, 'Salário deve ser positivo').optional(),
  dataAdmissao: z.date({ required_error: 'Data de admissão é obrigatória' }),
  status: z.enum(['ativo', 'inativo']),
  especialidades: z.array(z.string()).min(1, 'Pelo menos uma especialidade é obrigatória'),
  valor_hora: z.number().min(0, 'Valor/hora deve ser positivo').optional(),
});

type FuncionarioFormData = z.infer<typeof funcionarioSchema>;

interface FuncionarioFormProps {
  funcionario?: Funcionario;
  onSubmit: (data: FuncionarioFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const especialidadesDisponiveis = [
  'Soldador', 'Eletricista', 'Encanador', 'Pedreiro', 'Carpinteiro',
  'Pintor', 'Técnico em Segurança', 'Operador de Máquinas',
  'NR-10', 'NR-12', 'NR-13', 'NR-18', 'NR-33', 'NR-35'
];

const cargosDisponiveis = [
  'Engenheiro', 'Técnico', 'Encarregado', 'Oficial', 'Ajudante',
  'Operador', 'Supervisor', 'Coordenador', 'Gerente'
];

export function FuncionarioForm({ funcionario, onSubmit, onCancel, isLoading }: FuncionarioFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FuncionarioFormData>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: {
      nome: funcionario?.nome || '',
      cpf: funcionario?.cpf || '',
      email: funcionario?.email || '',
      telefone: funcionario?.telefone || '',
      cargo: funcionario?.cargo || '',
      salario: funcionario?.salario || undefined,
      dataAdmissao: funcionario?.dataAdmissao ? new Date(funcionario.dataAdmissao) : new Date(),
      status: funcionario?.status || 'ativo',
      especialidades: funcionario?.especialidades || [],
      valor_hora: funcionario?.valor_hora || undefined,
    },
  });

  const [novaEspecialidade, setNovaEspecialidade] = React.useState('');
  const especialidadesSelecionadas = form.watch('especialidades');

  const adicionarEspecialidade = (especialidade: string) => {
    const especialidades = form.getValues('especialidades');
    if (!especialidades.includes(especialidade)) {
      form.setValue('especialidades', [...especialidades, especialidade]);
    }
    setNovaEspecialidade('');
  };

  const removerEspecialidade = (especialidade: string) => {
    const especialidades = form.getValues('especialidades');
    form.setValue('especialidades', especialidades.filter(e => e !== especialidade));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  };

  const handleSubmit = (data: FuncionarioFormData) => {
    try {
      onSubmit(data);
      toast({
        title: funcionario ? 'Funcionário atualizado' : 'Funcionário cadastrado',
        description: `${data.nome} foi ${funcionario ? 'atualizado' : 'cadastrado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o funcionário.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000.000.000-00"
                        onChange={(e) => field.onChange(formatCPF(e.target.value))}
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@exemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(11) 99999-9999"
                        onChange={(e) => field.onChange(formatTelefone(e.target.value))}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dados Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cargosDisponiveis.map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>
                            {cargo}
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
                name="dataAdmissao"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Admissão</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0,00"
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor/Hora (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0,00"
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Especialidades */}
        <Card>
          <CardHeader>
            <CardTitle>Especialidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Select value={novaEspecialidade} onValueChange={setNovaEspecialidade}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesDisponiveis
                      .filter(esp => !especialidadesSelecionadas.includes(esp))
                      .map((especialidade) => (
                        <SelectItem key={especialidade} value={especialidade}>
                          {especialidade}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => novaEspecialidade && adicionarEspecialidade(novaEspecialidade)}
                  disabled={!novaEspecialidade}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {especialidadesSelecionadas.map((especialidade) => (
                  <Badge key={especialidade} variant="secondary" className="gap-1">
                    {especialidade}
                    <button
                      type="button"
                      onClick={() => removerEspecialidade(especialidade)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage>{form.formState.errors.especialidades?.message}</FormMessage>
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : funcionario ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}