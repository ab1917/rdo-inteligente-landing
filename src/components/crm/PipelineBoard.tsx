import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  User, 
  Calendar,
  MoreVertical,
  Phone,
  Mail,
  Building
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { OportunidadeExpandida } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CreateOportunidadeDialog from "./CreateOportunidadeDialog";

const PipelineBoard = () => {
  const { oportunidades, dashboard } = useCRMIntegration();
  const [localOportunidades, setLocalOportunidades] = useState(oportunidades);

  const colunas = [
    { 
      id: "qualificacao", 
      title: "Qualificação", 
      color: "border-blue-200 bg-blue-50",
      headerColor: "bg-blue-100 text-blue-800"
    },
    { 
      id: "proposta_enviada", 
      title: "Proposta Enviada", 
      color: "border-yellow-200 bg-yellow-50",
      headerColor: "bg-yellow-100 text-yellow-800"
    },
    { 
      id: "negociacao", 
      title: "Negociação", 
      color: "border-orange-200 bg-orange-50",
      headerColor: "bg-orange-100 text-orange-800"
    },
    { 
      id: "aprovada", 
      title: "Aprovada", 
      color: "border-green-200 bg-green-50",
      headerColor: "bg-green-100 text-green-800"
    }
  ];

  const getOportunidadesPorStatus = (status: string) => {
    return localOportunidades.filter(opp => opp.status === status);
  };

  const getTotalValorPorStatus = (status: string) => {
    return getOportunidadesPorStatus(status).reduce((total, opp) => total + opp.valor_estimado, 0);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const oportunidadeId = draggableId;
    const novoStatus = destination.droppableId;

    setLocalOportunidades(prev =>
      prev.map(opp =>
        opp.id === oportunidadeId
          ? { 
              ...opp, 
              status: novoStatus as any,
              // Atualizar probabilidade baseada no status
              probabilidade_fechamento: 
                novoStatus === "qualificacao" ? 30 :
                novoStatus === "proposta_enviada" ? 50 :
                novoStatus === "negociacao" ? 70 :
                novoStatus === "aprovada" ? 95 : opp.probabilidade_fechamento
            }
          : opp
      )
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDaysUntilClose = (date: string) => {
    const closeDate = new Date(date);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const OportunidadeCard = ({ oportunidade, index }: { oportunidade: OportunidadeExpandida; index: number }) => {
    const daysUntilClose = getDaysUntilClose(oportunidade.data_prevista_fechamento);
    const isOverdue = daysUntilClose < 0;
    const isUrgent = daysUntilClose <= 7 && daysUntilClose >= 0;

    return (
      <Draggable draggableId={oportunidade.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 cursor-move transition-all ${
              snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {oportunidade.descricao_escopo || `Oportunidade ${oportunidade.empresa_cliente}`}
                  </CardTitle>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Building className="h-3 w-3" />
                    {oportunidade.empresa_cliente}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Reunião
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              {/* Valor */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {formatCurrency(oportunidade.valor_estimado)}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {oportunidade.probabilidade_fechamento}%
                </Badge>
              </div>

              {/* Data de fechamento */}
              <div className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                <span className={
                  isOverdue ? "text-red-600 font-medium" :
                  isUrgent ? "text-orange-600 font-medium" :
                  "text-muted-foreground"
                }>
                  {isOverdue ? `${Math.abs(daysUntilClose)} dias atrasado` :
                   daysUntilClose === 0 ? "Fecha hoje" :
                   daysUntilClose === 1 ? "Fecha amanhã" :
                   `${daysUntilClose} dias para fechar`
                  }
                </span>
              </div>

              {/* Responsável */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(oportunidade.responsavel_comercial)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {oportunidade.responsavel_comercial}
                  </span>
                </div>
                
                {/* Indicador de urgência */}
                {(isOverdue || isUrgent) && (
                  <div className={`w-2 h-2 rounded-full ${
                    isOverdue ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com métricas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
          <p className="text-muted-foreground">
            {dashboard.oportunidades_ativas} oportunidades ativas • {formatCurrency(dashboard.valor_pipeline_total)} em pipeline
          </p>
        </div>
        <CreateOportunidadeDialog />
      </div>

      {/* Board de Pipeline */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {colunas.map((coluna) => {
            const oportunidades = getOportunidadesPorStatus(coluna.id);
            const valorTotal = getTotalValorPorStatus(coluna.id);

            return (
              <div key={coluna.id} className={`rounded-lg border-2 ${coluna.color} min-h-[600px]`}>
                {/* Header da coluna */}
                <div className={`p-4 rounded-t-lg ${coluna.headerColor}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{coluna.title}</h3>
                    <Badge variant="secondary" className="bg-white/50">
                      {oportunidades.length}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 font-medium">
                    {formatCurrency(valorTotal)}
                  </p>
                </div>

                {/* Cards das oportunidades */}
                <Droppable droppableId={coluna.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 min-h-[500px] ${
                        snapshot.isDraggingOver ? 'bg-white/50' : ''
                      }`}
                    >
                      {oportunidades.map((oportunidade, index) => (
                        <OportunidadeCard
                          key={oportunidade.id}
                          oportunidade={oportunidade}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                      
                      {oportunidades.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma oportunidade</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default PipelineBoard;