import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

export const SuperAdminDashboard = () => {
  const { metrics, companies, loading } = useSuperAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ativa: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      trial: { variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      suspensa: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' }
    };

    const config = variants[status as keyof typeof variants] || variants.suspensa;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Painel de controle administrativo do sistema
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.activeCompanies || 0} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Todos os usuários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics?.monthlyRevenue.toLocaleString('pt-BR') || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado nos planos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics?.growthRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companies.slice(0, 10).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{company.nome}</h4>
                    {getStatusBadge(company.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{company.email}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Plano: {company.plano}</span>
                    <span>CNPJ: {company.cnpj}</span>
                    {company.data_expiracao && (
                      <span>Expira: {new Date(company.data_expiracao).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {company.plano}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Gerenciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};