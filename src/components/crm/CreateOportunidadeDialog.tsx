import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Calendar as CalendarIcon, DollarSign, Target, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { useToast } from "@/hooks/use-toast";

const oportunidadeSchema = z.object({
  empresa_cliente: z.string().min(2, "Empresa deve ter pelo menos 2 caracteres"),
  nome_projeto: z.string().min(2, "Nome do projeto deve ter pelo menos 2 caracteres"),
  valor_estimado: z.string().min(1, "Valor é obrigatório"),
  probabilidade_fechamento: z.number().min(1).max(100),
  data_prevista_fechamento: z.date({
    required_error: "Data prevista é obrigatória"
  }),
  status: z.enum(["proposta_enviada", "negociacao", "aprovada", "perdida"]),
  responsavel_comercial: z.string().min(2, "Responsável deve ter pelo menos 2 caracteres"),
  concorrentes: z.string().optional(),
  observacoes_comerciais: z.string().optional(),
  urgencia: z.enum(["baixa", "media", "alta", "critica"])
});

type OportunidadeFormData = z.infer<typeof oportunidadeSchema>;

interface CreateOportunidadeDialogProps {
  leadId?: string;
  leadData?: {
    empresa_cliente: string;
    nome_cliente: string;
    interesse_servico: string;
    orcamento_estimado: number;
  };
}

const CreateOportunidadeDialog = ({ leadId, leadData }: CreateOportunidadeDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createOrcamento, convertLeadToOportunidade } = useCRMIntegration();
  const { toast } = useToast();

  const form = useForm<OportunidadeFormData>({
    resolver: zodResolver(oportunidadeSchema),
    defaultValues: {
      empresa_cliente: leadData?.empresa_cliente || "",
      nome_projeto: leadData ? `Projeto ${leadData.interesse_servico} - ${leadData.empresa_cliente}` : "",
      valor_estimado: leadData?.orcamento_estimado?.toString() || "",
      probabilidade_fechamento: 30,
      status: "proposta_enviada",
      responsavel_comercial: "João Silva",
      urgencia: "media"
    }
  });

  const statusOptions = [
    { value: "proposta_enviada", label: "Proposta Enviada", color: "bg-yellow-100 text-yellow-800", probability: 50 },
    { value: "negociacao", label: "Negociação", color: "bg-orange-100 text-orange-800", probability: 70 },
    { value: "aprovada", label: "Aprovada", color: "bg-green-100 text-green-800", probability: 95 },
    { value: "perdida", label: "Perdida", color: "bg-red-100 text-red-800", probability: 0 }
  ];

  const urgenciaOptions = [
    { value: "baixa", label: "Baixa", color: "bg-gray-100 text-gray-800", icon: "⏳" },
    { value: "media", label: "Média", color: "bg-blue-100 text-blue-800", icon: "📅" },
    { value: "alta", label: "Alta", color: "bg-orange-100 text-orange-800", icon: "⚡" },
    { value: "critica", label: "Crítica", color: "bg-red-100 text-red-800", icon: "🚨" }
  ];

  const onSubmit = async (data: OportunidadeFormData) => {
    try {
      const oportunidadeData = {
        id_cliente: leadData ? leadId || "cliente-temp" : "cliente-temp",
        nome_cliente: leadData?.nome_cliente || "Cliente",
        empresa_cliente: data.empresa_cliente,
        tipo_servico: (leadData?.interesse_servico as "obra_civil" | "manutencao_industrial" | "consultoria") || "obra_civil",
        valor_estimado: parseFloat(data.valor_estimado.replace(/[^\d,]/g, '').replace(',', '.')),
        probabilidade_fechamento: data.probabilidade_fechamento,
        data_prevista_fechamento: data.data_prevista_fechamento.toISOString().split('T')[0],
        status: data.status,
        responsavel_comercial: data.responsavel_comercial,
        concorrentes: data.concorrentes || "",
        observacoes_comerciais: data.observacoes_comerciais || "",
        urgencia: data.urgencia,
        prazo_execucao_dias: 90,
        tem_orcamento: false,
        descricao_escopo: `Projeto de ${data.nome_projeto} - ${data.observacoes_comerciais || 'Sem descrição adicional'}`
      };

      let oportunidade;
      if (leadId) {
        // Convertendo lead em oportunidade
        oportunidade = convertLeadToOportunidade(leadId, oportunidadeData);
      } else {
        // Criar oportunidade direta (sem lead)
        // Aqui precisaríamos de uma função createOportunidade no hook
        toast({
          title: "Funcionalidade em desenvolvimento",
          description: "Por enquanto, só é possível converter leads em oportunidades.",
          variant: "destructive"
        });
        return;
      }

      if (oportunidade) {
        toast({
          title: "Oportunidade criada com sucesso!",
          description: `${data.nome_projeto} foi adicionada ao pipeline com ${data.probabilidade_fechamento}% de chance.`,
        });

        form.reset();
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Erro ao criar oportunidade",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(numbers) / 100);
    return formatted;
  };

  const handleStatusChange = (status: string) => {
    const selectedStatus = statusOptions.find(opt => opt.value === status);
    if (selectedStatus) {
      form.setValue('probabilidade_fechamento', selectedStatus.probability);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          {leadId ? "Converter em Oportunidade" : "Nova Oportunidade"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {leadId ? "Converter Lead em Oportunidade" : "Criar Nova Oportunidade"}
          </DialogTitle>
          <DialogDescription>
            {leadId 
              ? "Promova este lead qualificado para o pipeline de vendas."
              : "Adicione uma nova oportunidade de negócio ao pipeline."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Projeto */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Target className="h-4 w-4" />
                Informações do Projeto
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="empresa_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Construções Ltda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nome_projeto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Projeto</FormLabel>
                      <FormControl>
                        <Input placeholder="Construção Galpão Industrial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="valor_estimado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Estimado</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          className="pl-9"
                          placeholder="R$ 500.000,00"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCurrency(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status e Probabilidade */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Status e Probabilidade
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Atual</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        handleStatusChange(value);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={option.color}>
                                  {option.label}
                                </Badge>
                              </div>
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
                  name="probabilidade_fechamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probabilidade (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            min="0" 
                            max="100"
                            placeholder="70"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            value={field.value || ""}
                          />
                          <span className="absolute right-3 top-3 text-muted-foreground">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgência</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a urgência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {urgenciaOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <span>{option.icon}</span>
                                <Badge variant="outline" className={option.color}>
                                  {option.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="data_prevista_fechamento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Prevista de Fechamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Informações Adicionais
              </div>

              <FormField
                control={form.control}
                name="responsavel_comercial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável Comercial</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concorrentes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concorrentes (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Empresa X, Empresa Y..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes_comerciais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Comerciais</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações importantes sobre a negociação, próximos passos..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {leadId ? "Converter Lead" : "Criar Oportunidade"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOportunidadeDialog;