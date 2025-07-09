import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, Clock, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { useFinanceiroIntegrado } from "@/hooks/useFinanceiroIntegrado";
import CreateLeadDialog from "@/components/crm/CreateLeadDialog";
import CreateOportunidadeDialog from "@/components/crm/CreateOportunidadeDialog";
import PipelineBoard from "@/components/crm/PipelineBoard";

const CRMDashboard = () => {
  const { dashboard, oportunidades, contratos, loading } = useCRMIntegration();
  const { consolidado, getIndicadoresGlobais } = useFinanceiroIntegrado();

  if (loading) {
    return <div className="flex items-center justify-center h-96">Carregando dados integrados...</div>;
  }

  const indicadores = getIndicadoresGlobais();

  const metrics = [
    {
      title: "Leads Ativos",
      value: dashboard.leads_ativos.toString(),
      change: `+${dashboard.leads_mes} este mês`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Taxa Conversão",
      value: `${dashboard.taxa_conversao_lead_oportunidade.toFixed(1)}%`,
      change: dashboard.taxa_conversao_lead_oportunidade > 60 ? "+Boa" : "Atenção",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Pipeline Total",
      value: `R$ ${(dashboard.valor_pipeline_total / 1000000).toFixed(1)}M`,
      change: `${dashboard.oportunidades_ativas} oportunidades`,
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Margem Atual",
      value: `${consolidado.margem_total_atual.toFixed(1)}%`,
      change: `${indicadores.contratos_criticos > 0 ? 'Atenção' : 'Saudável'}`,
      icon: TrendingUp,
      color: indicadores.contratos_criticos > 0 ? "text-orange-600" : "text-green-600"
    }
  ];

  const recentOpportunities = oportunidades
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Gestão comercial e relacionamento com clientes
          </p>
        </div>
        <div className="flex gap-2">
          <CreateLeadDialog />
          <CreateOportunidadeDialog />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metric.change}</span> vs mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Visual */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Vendas</CardTitle>
            <CardDescription>Oportunidades por etapa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  etapa: "Leads", 
                  count: dashboard.leads_ativos, 
                  valor: `R$ ${(dashboard.valor_pipeline_total * 0.2 / 1000).toFixed(0)}K`, 
                  color: "bg-gray-500" 
                },
                { 
                  etapa: "Qualificados", 
                  count: oportunidades.filter(o => o.status === 'negociacao').length, 
                  valor: `R$ ${(oportunidades.filter(o => o.status === 'negociacao').reduce((sum, o) => sum + o.valor_estimado, 0) / 1000).toFixed(0)}K`, 
                  color: "bg-blue-500" 
                },
                { 
                  etapa: "Proposta", 
                  count: oportunidades.filter(o => o.status === 'proposta_enviada').length, 
                  valor: `R$ ${(oportunidades.filter(o => o.status === 'proposta_enviada').reduce((sum, o) => sum + o.valor_estimado, 0) / 1000).toFixed(0)}K`, 
                  color: "bg-yellow-500" 
                },
                { 
                  etapa: "Negociação", 
                  count: oportunidades.filter(o => o.status === 'negociacao').length, 
                  valor: `R$ ${(oportunidades.filter(o => o.status === 'negociacao').reduce((sum, o) => sum + o.valor_estimado, 0) / 1000).toFixed(0)}K`, 
                  color: "bg-orange-500" 
                },
                { 
                  etapa: "Aprovados", 
                  count: contratos.filter(c => c.status === 'ativo').length, 
                  valor: `R$ ${(consolidado.valor_total_contratos / 1000000).toFixed(1)}M`, 
                  color: "bg-green-500" 
                }
              ].map((item) => (
                <div key={item.etapa} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.etapa}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                  <span className="text-sm font-medium">{item.valor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Oportunidades Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Oportunidades Recentes</CardTitle>
              <CardDescription>Últimas atualizações</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/oportunidades">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div>
                    <p className="font-medium">{opp.empresa_cliente}</p>
                    <p className="text-sm text-muted-foreground">{opp.responsavel_comercial}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {(opp.valor_estimado / 1000).toFixed(0)}K</p>
                    <Badge variant="outline" className="text-xs">
                      {opp.status === 'proposta_enviada' ? 'Proposta' : 
                       opp.status === 'negociacao' ? 'Negociação' :
                       opp.status === 'aprovada' ? 'Aprovada' : opp.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores Financeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Situação Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Contratos Saudáveis</span>
                <Badge variant="outline" className="text-green-600">
                  {indicadores.contratos_no_verde}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Requer Atenção</span>
                <Badge variant="outline" className="text-yellow-600">
                  {indicadores.contratos_atencao}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Críticos</span>
                <Badge variant="outline" className="text-red-600">
                  {indicadores.contratos_criticos}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Já Faturado</p>
                <p className="text-2xl font-bold">R$ {(consolidado.valor_total_faturado / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">A Faturar</p>
                <p className="text-xl font-semibold text-green-600">R$ {(consolidado.valor_total_a_faturar / 1000000).toFixed(1)}M</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">% Faturado</p>
                <p className="text-lg font-medium">{indicadores.percentual_faturado.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Margem Média</p>
                <p className="text-2xl font-bold">{consolidado.margem_total_atual.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-xl font-semibold">R$ {(dashboard.ticket_medio_contrato / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ciclo Comercial</p>
                <p className="text-lg font-medium">{dashboard.tempo_medio_ciclo_comercial} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visual Completo */}
      <PipelineBoard />
      
      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso direto às principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/leads">
                <Users className="h-6 w-6 mb-2" />
                Gerenciar Leads
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/oportunidades">
                <TrendingUp className="h-6 w-6 mb-2" />
                Pipeline
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/clientes">
                <Users className="h-6 w-6 mb-2" />
                Base de Clientes
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/orcamentos">
                <DollarSign className="h-6 w-6 mb-2" />
                Gerar Orçamento
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;