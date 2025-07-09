import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, User, FileText, TrendingUp, Eye, Edit } from "lucide-react";

const OportunidadesList = () => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  
  const etapas = [
    { id: "lead", nome: "Lead", cor: "bg-gray-500" },
    { id: "qualificado", nome: "Qualificado", cor: "bg-blue-500" },
    { id: "proposta", nome: "Proposta", cor: "bg-yellow-500" },
    { id: "negociacao", nome: "Negociação", cor: "bg-orange-500" },
    { id: "fechado", nome: "Fechado", cor: "bg-green-500" },
    { id: "perdido", nome: "Perdido", cor: "bg-red-500" }
  ];

  const oportunidades = [
    {
      id: 1,
      titulo: "Modernização Sistema de Ventilação",
      cliente: "Construtora Horizonte",
      valor: 500000,
      probabilidade: 80,
      etapa: "negociacao",
      responsavel: "João Silva",
      data_criacao: "2024-01-05",
      data_fechamento_prevista: "2024-02-15",
      observacoes: "Cliente muito interessado, aguardando aprovação orçamentária"
    },
    {
      id: 2,
      titulo: "Manutenção Preventiva Industrial",
      cliente: "Indústria ABC",
      valor: 750000,
      probabilidade: 60,
      etapa: "proposta",
      responsavel: "Maria Santos",
      data_criacao: "2024-01-03",
      data_fechamento_prevista: "2024-02-28",
      observacoes: "Proposta técnica enviada, aguardando retorno"
    },
    {
      id: 3,
      titulo: "Reforma Área Produção",
      cliente: "Fábrica XYZ",
      valor: 320000,
      probabilidade: 40,
      etapa: "qualificado",
      responsavel: "Pedro Costa",
      data_criacao: "2024-01-07",
      data_fechamento_prevista: "2024-03-15",
      observacoes: "Cliente em fase de definição de escopo"
    },
    {
      id: 4,
      titulo: "Instalação Sistema HVAC",
      cliente: "Escritório Central",
      valor: 180000,
      probabilidade: 90,
      etapa: "fechado",
      responsavel: "Ana Oliveira",
      data_criacao: "2023-12-15",
      data_fechamento_prevista: "2024-01-30",
      observacoes: "Contrato assinado, iniciando execução"
    }
  ];

  const getOportunidadesPorEtapa = (etapaId: string) => {
    return oportunidades.filter(opp => opp.etapa === etapaId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "text-green-600";
    if (prob >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline de Vendas</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as oportunidades em andamento
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: "kanban" | "list") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kanban">Kanban</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Métricas do Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pipeline Total</span>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(oportunidades.reduce((acc, opp) => acc + opp.valor, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Taxa Conversão</span>
            </div>
            <p className="text-2xl font-bold">68%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Ciclo Médio</span>
            </div>
            <p className="text-2xl font-bold">42 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Oportunidades</span>
            </div>
            <p className="text-2xl font-bold">{oportunidades.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 min-h-[600px]">
          {etapas.map((etapa) => {
            const oportunidadesEtapa = getOportunidadesPorEtapa(etapa.id);
            const valorTotal = oportunidadesEtapa.reduce((acc, opp) => acc + opp.valor, 0);
            
            return (
              <Card key={etapa.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${etapa.cor}`} />
                      <CardTitle className="text-sm">{etapa.nome}</CardTitle>
                    </div>
                    <Badge variant="outline">{oportunidadesEtapa.length}</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {formatCurrency(valorTotal)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 pt-0">
                  {oportunidadesEtapa.map((oportunidade) => (
                    <Card key={oportunidade.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {oportunidade.titulo}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {oportunidade.cliente}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold">
                              {formatCurrency(oportunidade.valor)}
                            </span>
                            <span className={`text-xs font-medium ${getProbabilityColor(oportunidade.probabilidade)}`}>
                              {oportunidade.probabilidade}%
                            </span>
                          </div>
                          <Progress value={oportunidade.probabilidade} className="h-1" />
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{oportunidade.responsavel}</span>
                            <span>{new Date(oportunidade.data_fechamento_prevista).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Oportunidades</CardTitle>
            <CardDescription>
              Todas as oportunidades em formato de tabela
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {oportunidades.map((oportunidade) => (
                <Card key={oportunidade.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{oportunidade.titulo}</h3>
                          <Badge variant="outline">
                            {etapas.find(e => e.id === oportunidade.etapa)?.nome}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Cliente:</span> {oportunidade.cliente}
                          </div>
                          <div>
                            <span className="font-medium">Responsável:</span> {oportunidade.responsavel}
                          </div>
                          <div>
                            <span className="font-medium">Valor:</span> {formatCurrency(oportunidade.valor)}
                          </div>
                          <div>
                            <span className="font-medium">Probabilidade:</span> 
                            <span className={getProbabilityColor(oportunidade.probabilidade)}>
                              {oportunidade.probabilidade}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Proposta
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OportunidadesList;