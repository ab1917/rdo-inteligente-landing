import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'RDOs Hoje',
      value: '8',
      change: '+2',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Obras Ativas',
      value: '12',
      change: '+1',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Funcionários',
      value: '156',
      change: '+5',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Eficiência',
      value: '87%',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const recentRDOs = [
    { id: 1, obra: 'Edifício Solar', status: 'Aprovado', data: '2024-01-09' },
    { id: 2, obra: 'Residencial Verde', status: 'Pendente', data: '2024-01-09' },
    { id: 3, obra: 'Shopping Center', status: 'Rascunho', data: '2024-01-08' },
    { id: 4, obra: 'Conjunto Habitacional', status: 'Aprovado', data: '2024-01-08' }
  ];

  const obras = [
    { nome: 'Edifício Solar', progresso: 65, prazo: '15 dias', status: 'no-prazo' },
    { nome: 'Residencial Verde', progresso: 89, prazo: '8 dias', status: 'adiantado' },
    { nome: 'Shopping Center', progresso: 45, prazo: '2 dias', status: 'atrasado' },
    { nome: 'Conjunto Habitacional', progresso: 78, prazo: '22 dias', status: 'no-prazo' }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'Aprovado': 'bg-green-100 text-green-800',
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Rascunho': 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'no-prazo': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'adiantado': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'atrasado': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.name}! Aqui está o resumo das suas obras.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo RDO
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> desde ontem
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent RDOs */}
        <Card>
          <CardHeader>
            <CardTitle>RDOs Recentes</CardTitle>
            <CardDescription>
              Últimos relatórios diários registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRDOs.map((rdo) => (
                <div key={rdo.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{rdo.obra}</p>
                    <p className="text-xs text-muted-foreground">{rdo.data}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(rdo.status)}>
                      {rdo.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Obras Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso das Obras</CardTitle>
            <CardDescription>
              Andamento atual dos projetos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {obras.map((obra, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(obra.status)}
                      <span className="font-medium text-sm">{obra.nome}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {obra.progresso}%
                    </span>
                  </div>
                  <Progress value={obra.progresso} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Restam {obra.prazo} para conclusão
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Criar RDO
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Ver Cronograma
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Gerenciar Equipes
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};