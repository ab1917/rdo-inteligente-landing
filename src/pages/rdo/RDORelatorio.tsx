import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, BarChart3, Clock, Settings } from 'lucide-react';
import { useRDO } from '@/hooks/useRDO';
import { RDOOrcamentoIntegration } from '@/components/rdo/RDOOrcamentoIntegration';
import { RelatorioGerencial } from '@/components/rdo/RelatorioGerencial';
import { HHController } from '@/components/rdo/HHController';
import { StatusBadge } from '@/components/rdo/StatusBadge';

export function RDORelatorio() {
  const { id } = useParams();
  const { getRDOById } = useRDO();
  
  const rdo = id ? getRDOById(id) : undefined;

  if (!rdo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/rdo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para RDOs
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">RDO não encontrado.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock de orçamento para demonstração
  const mockOrcamento = {
    id: 'ORC-001',
    id_oportunidade: 'OPP-001',
    tipo: rdo.tipo,
    composicoes: [],
    hh_previsto_total: rdo.hh_previsto_dia * 30, // 30 dias de trabalho
    valor_hh_medio: 85.00,
    valor_total: rdo.hh_previsto_dia * 30 * 85.00,
    status: 'aprovado' as const,
    data_criacao: '2024-01-01'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/rdo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para RDOs
            </Link>
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">{rdo.obra}</h1>
            <p className="text-muted-foreground">
              Relatórios e Análises - {new Date(rdo.data).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={rdo.status} />
          <Badge variant="outline">
            {rdo.tipo === 'obra_civil' ? 'Obra Civil' : 'Manutenção Industrial'}
          </Badge>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações do RDO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Responsável:</span>
              <div className="font-medium">{rdo.responsavel}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Local:</span>
              <div className="font-medium">{rdo.local}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Cliente:</span>
              <div className="font-medium">{rdo.cliente}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Clima:</span>
              <div className="font-medium">{rdo.clima} - {rdo.temperatura}°C</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="integracao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integracao" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Integração
          </TabsTrigger>
          <TabsTrigger value="gerencial" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gerencial
          </TabsTrigger>
          <TabsTrigger value="hh-control" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Controle HH
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integracao">
          <RDOOrcamentoIntegration rdo={rdo} orcamento={mockOrcamento} />
        </TabsContent>

        <TabsContent value="gerencial">
          <RelatorioGerencial rdo={rdo} orcamento={mockOrcamento} />
        </TabsContent>

        <TabsContent value="hh-control">
          <HHController rdo={rdo} showDetails={true} />
        </TabsContent>

        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configurações avançadas de relatório serão implementadas na Fase 4.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Exportação Automática</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure relatórios automáticos por email
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Alertas Personalizados</h4>
                    <p className="text-sm text-muted-foreground">
                      Defina limites customizados para alertas
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Integração BI</h4>
                    <p className="text-sm text-muted-foreground">
                      Conecte com ferramentas de Business Intelligence
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Templates Personalizados</h4>
                    <p className="text-sm text-muted-foreground">
                      Crie modelos de relatório personalizados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}