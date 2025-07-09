import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Target,
  BarChart3,
  Clock,
  Calendar,
  Activity
} from 'lucide-react';
import { RDO, Orcamento } from '@/types';
import { useOrcamentoRDO } from '@/hooks/useOrcamentoRDO';

interface RDOOrcamentoIntegrationProps {
  rdo: RDO;
  orcamento?: Orcamento;
}

export function RDOOrcamentoIntegration({ rdo, orcamento }: RDOOrcamentoIntegrationProps) {
  const { analise, relatorioAvanco, alertas } = useOrcamentoRDO(rdo, orcamento);

  const getStatusIcon = (status: 'ok' | 'warning' | 'danger') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 5) {
      return <TrendingUp className="h-4 w-4 text-red-600" />;
    } else if (variation < -5) {
      return <TrendingDown className="h-4 w-4 text-green-600" />;
    }
    return <Target className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Header com informações do orçamento */}
      {orcamento && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Integração Orçamento vs Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Orçamento ID:</span>
                <div className="font-medium">{orcamento.id}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Valor Total:</span>
                <div className="font-medium">
                  R$ {orcamento.valor_total.toLocaleString('pt-BR')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">HH Previsto:</span>
                <div className="font-medium">{orcamento.hh_previsto_total}h</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas de Comparação */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">HH Previsto</p>
                <p className="text-2xl font-bold">{rdo.hh_previsto_dia}h</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">HH Executado</p>
                <p className="text-2xl font-bold">{rdo.hh_executado_total}h</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Variação</p>
                <p className={`text-2xl font-bold ${analise.variacao_hh > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {analise.variacao_hh > 0 ? '+' : ''}{analise.variacao_hh.toFixed(1)}%
                </p>
              </div>
              {getVariationIcon(analise.variacao_hh)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custo Real</p>
                <p className="text-2xl font-bold">
                  R$ {rdo.custo_hh_realizado.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso de Execução */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Avanço de Execução
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Avanço Físico</span>
              <span className="text-sm font-medium">{relatorioAvanco.avanco_fisico.toFixed(1)}%</span>
            </div>
            <Progress value={relatorioAvanco.avanco_fisico} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Avanço Financeiro</span>
              <span className="text-sm font-medium">{relatorioAvanco.avanco_financeiro.toFixed(1)}%</span>
            </div>
            <Progress value={relatorioAvanco.avanco_financeiro} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Cronograma</span>
              <span className="text-sm font-medium">{relatorioAvanco.avanco_cronograma.toFixed(1)}%</span>
            </div>
            <Progress value={relatorioAvanco.avanco_cronograma} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Status de Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Status de Conformidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Dentro do Orçamento</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(analise.status_orcamento)}
              <Badge variant={analise.status_orcamento === 'ok' ? 'default' : 'destructive'}>
                {analise.status_orcamento === 'ok' ? 'Conforme' : 'Divergente'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Prazo de Execução</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(analise.status_prazo)}
              <Badge variant={analise.status_prazo === 'ok' ? 'default' : 'destructive'}>
                {analise.status_prazo === 'ok' ? 'No Prazo' : 'Atrasado'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Produtividade</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(analise.status_produtividade)}
              <Badge variant={analise.status_produtividade === 'ok' ? 'default' : 'secondary'}>
                {analise.eficiencia_geral.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Recomendações */}
      {alertas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Alertas e Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertas.map((alerta, index) => (
              <Alert key={index} className={alerta.tipo === 'warning' ? 'border-yellow-200' : 'border-red-200'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{alerta.categoria}:</strong> {alerta.mensagem}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Projeções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Projeções Baseadas na Execução Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 border rounded-lg">
              <span className="text-muted-foreground">Previsão de Conclusão:</span>
              <div className="font-medium text-lg">
                {relatorioAvanco.previsao_conclusao}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <span className="text-muted-foreground">Custo Final Projetado:</span>
              <div className="font-medium text-lg">
                R$ {relatorioAvanco.custo_projetado.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <span className="text-muted-foreground">Desvio Orçamentário:</span>
              <div className={`font-medium text-lg ${relatorioAvanco.desvio_orcamentario > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {relatorioAvanco.desvio_orcamentario > 0 ? '+' : ''}{relatorioAvanco.desvio_orcamentario.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Recomendadas */}
      {analise.acoes_recomendadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Recomendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analise.acoes_recomendadas.map((acao, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{acao}</span>
                  <Button size="sm" variant="outline">
                    Aplicar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}