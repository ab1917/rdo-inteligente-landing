import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CRMDashboard = () => {
  const metrics = [
    {
      title: "Leads Ativos",
      value: "23",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Taxa Conversão",
      value: "68%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Pipeline Total",
      value: "R$ 2.4M",
      change: "+18%",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Ciclo Médio",
      value: "42 dias",
      change: "-3 dias",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  const recentOpportunities = [
    {
      id: 1,
      cliente: "Construtora ABC",
      valor: "R$ 450.000",
      status: "Proposta",
      responsavel: "João Silva",
      prazo: "2024-01-15"
    },
    {
      id: 2,
      cliente: "Indústria XYZ",
      valor: "R$ 280.000", 
      status: "Negociação",
      responsavel: "Maria Santos",
      prazo: "2024-01-20"
    },
    {
      id: 3,
      cliente: "Fábrica 123",
      valor: "R$ 180.000",
      status: "Qualificado",
      responsavel: "Pedro Costa",
      prazo: "2024-01-25"
    }
  ];

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
          <Button asChild>
            <Link to="/leads/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Link>
          </Button>
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
                { etapa: "Lead", count: 15, valor: "R$ 890K", color: "bg-gray-500" },
                { etapa: "Qualificado", count: 8, valor: "R$ 650K", color: "bg-blue-500" },
                { etapa: "Proposta", count: 5, valor: "R$ 520K", color: "bg-yellow-500" },
                { etapa: "Negociação", count: 3, valor: "R$ 380K", color: "bg-orange-500" },
                { etapa: "Fechado", count: 2, valor: "R$ 280K", color: "bg-green-500" }
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
                    <p className="font-medium">{opp.cliente}</p>
                    <p className="text-sm text-muted-foreground">{opp.responsavel}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{opp.valor}</p>
                    <Badge variant="outline" className="text-xs">
                      {opp.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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