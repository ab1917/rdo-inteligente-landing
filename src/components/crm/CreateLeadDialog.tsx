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
import { Badge } from "@/components/ui/badge";
import { Plus, Building, User, Phone, Mail, MapPin, DollarSign } from "lucide-react";
import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { useToast } from "@/hooks/use-toast";

const leadSchema = z.object({
  nome_cliente: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  empresa_cliente: z.string().min(2, "Empresa deve ter pelo menos 2 caracteres"),
  email_contato: z.string().email("Email inválido"),
  telefone_contato: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  origem_lead: z.enum(["site", "indicacao", "evento", "linkedin", "cold_call"]),
  interesse_servico: z.enum(["obra_civil", "manutencao_industrial", "consultoria"]),
  orcamento_estimado: z.string().min(1, "Orçamento é obrigatório"),
  endereco_obra: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  observacoes: z.string().optional(),
  responsavel_comercial: z.string().min(2, "Responsável deve ter pelo menos 2 caracteres")
});

type LeadFormData = z.infer<typeof leadSchema>;

const CreateLeadDialog = () => {
  const [open, setOpen] = useState(false);
  const { createLead } = useCRMIntegration();
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome_cliente: "",
      empresa_cliente: "",
      email_contato: "",
      telefone_contato: "",
      origem_lead: "site",
      interesse_servico: "obra_civil",
      orcamento_estimado: "",
      endereco_obra: "",
      observacoes: "",
      responsavel_comercial: "João Silva"
    }
  });

  const origemOptions = [
    { value: "site", label: "Website", icon: "🌐" },
    { value: "indicacao", label: "Indicação", icon: "👥" },
    { value: "evento", label: "Evento", icon: "🎪" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "cold_call", label: "Ligação Fria", icon: "📞" }
  ];

  const servicoOptions = [
    { value: "obra_civil", label: "Obra Civil", color: "bg-blue-100 text-blue-800" },
    { value: "manutencao_industrial", label: "Manutenção Industrial", color: "bg-green-100 text-green-800" },
    { value: "consultoria", label: "Consultoria", color: "bg-purple-100 text-purple-800" }
  ];

  const onSubmit = async (data: LeadFormData) => {
    try {
      const leadData = {
        nome_cliente: data.nome_cliente,
        empresa: data.empresa_cliente,
        email: data.email_contato,
        telefone: data.telefone_contato,
        origem: data.origem_lead,
        tipo_servico: data.interesse_servico,
        descricao_necessidade: data.observacoes || `Interesse em ${data.interesse_servico} - ${data.endereco_obra}`,
        valor_estimado: parseFloat(data.orcamento_estimado.replace(/[^\d,]/g, '').replace(',', '.')),
        responsavel_comercial: data.responsavel_comercial,
        data_contato: new Date().toISOString().split('T')[0],
        status: 'novo' as const,
        observacoes: `Endereço da obra: ${data.endereco_obra}`,
        convertido_oportunidade: false,
        id_oportunidade: undefined
      };

      createLead(leadData);
      
      toast({
        title: "Lead criado com sucesso!",
        description: `${data.nome_cliente} da ${data.empresa_cliente} foi adicionado ao pipeline.`,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao criar lead",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Criar Novo Lead
          </DialogTitle>
          <DialogDescription>
            Adicione um novo lead ao pipeline comercial. Todos os campos marcados são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Cliente */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Informações do Cliente
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="empresa_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Construções Ltda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email_contato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="joao@abcconstrucoes.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone_contato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informações do Projeto */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building className="h-4 w-4" />
                Informações do Projeto
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="interesse_servico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {servicoOptions.map((option) => (
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
                  name="orcamento_estimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento Estimado</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="R$ 100.000,00"
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

              <FormField
                control={form.control}
                name="endereco_obra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço da Obra</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          className="pl-9"
                          placeholder="Rua das Flores, 123 - Centro, São Paulo - SP"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Origem e Responsável */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                Origem e Responsável
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="origem_lead"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem do Lead</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Como chegou até nós?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {origemOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <span>{option.icon}</span>
                                {option.label}
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
              </div>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais sobre o lead ou projeto..."
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
                Criar Lead
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;