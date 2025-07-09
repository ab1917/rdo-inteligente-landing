import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, DollarSign, CheckCircle, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { BoletimMedicao } from '@/types';
import { getStorageData } from '@/services/mockData';
import { BoletimFilters } from '@/components/boletim/BoletimFilters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BoletimList = () => {
  const navigate = useNavigate();
  const [boletins, setBoletins] = useState<BoletimMedicao[]>([]);
  const [filteredBoletins, setFilteredBoletins] = useState<BoletimMedicao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boletinsData = getStorageData<BoletimMedicao[]>('boletins_medicao', []);
    setBoletins(boletinsData);
    setFilteredBoletins(boletinsData);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      'rascunho': 'secondary',
      'aprovado': 'default',
      'faturado': 'outline'
    } as const;

    const colors = {
      'rascunho': 'text-yellow-600',
      'aprovado': 'text-green-600', 
      'faturado': 'text-blue-600'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} 
             className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalGeral = filteredBoletins.reduce((sum, b) => sum + (b.resumo_financeiro?.total_geral || 0), 0);
  const totalAprovados = filteredBoletins.filter(b => b.status === 'aprovado').length;
  const totalPendentes = filteredBoletins.filter(b => b.status === 'rascunho').length;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Boletins de Medição</h1>
          <p className="text-muted-foreground">
            Gerencie e controle os boletins de medição por obra e período
          </p>
        </div>
        <Button onClick={() => navigate('/boletim/criar')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Boletim
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalGeral)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Boletins</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBoletins.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAprovados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalPendentes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <BoletimFilters 
        boletins={boletins}
        onFilter={setFilteredBoletins}
      />

      {/* Lista de Boletins */}
      <div className="space-y-4">
        {filteredBoletins.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum boletim encontrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie seu primeiro boletim de medição para começar
              </p>
              <Button onClick={() => navigate('/boletim/criar')}>
                Criar Primeiro Boletim
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBoletins.map((boletim) => (
            <Card key={boletim.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Boletim #{boletim.id}
                      {getStatusBadge(boletim.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(boletim.data), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        RDO: {boletim.rdo_id}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(boletim.resumo_financeiro?.total_geral || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {boletim.funcionarios?.length || 0} funcionários
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Funcionários:</span>
                    <div className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(boletim.resumo_financeiro?.total_funcionarios || 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Equipamentos:</span>
                    <div className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(boletim.resumo_financeiro?.total_equipamentos || 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Materiais:</span>
                    <div className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(boletim.resumo_financeiro?.total_materiais || 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BoletimList;