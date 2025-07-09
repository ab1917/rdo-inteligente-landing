import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import { useOrcamentoRDO } from '@/hooks/useOrcamentoRDO';
import { RDO, Orcamento } from '@/types';

interface RelatorioGerencialProps {
  rdo: RDO;
  orcamento?: Orcamento;
}

export function RelatorioGerencial({ rdo, orcamento }: RelatorioGerencialProps) {
  const { gerarRelatorioGerencial } = useOrcamentoRDO(rdo, orcamento);
  const relatorio = gerarRelatorioGerencial();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Satisfatório':
        return 'bg-green-100 text-green-700';
      case 'Requer Atenção':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getVariationIcon = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue > 5) {
      return <TrendingUp className="h-4 w-4 text-red-600" />;
    } else if (numValue < -5) {
      return <TrendingDown className="h-4 w-4 text-green-600" />;
    }
    return <Target className="h-4 w-4 text-blue-600" />;
  };

  const exportarRelatorio = () => {
    // Implementar exportação para PDF/Excel
    const dadosRelatorio = JSON.stringify(relatorio, null, 2);
    const blob = new Blob([dadosRelatorio], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-gerencial-${rdo.obra}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header do Relatório */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório Gerencial - {rdo.obra}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Gerado em {relatorio.resumo_executivo.data_relatorio} | Responsável: {relatorio.resumo_executivo.responsavel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(relatorio.resumo_executivo.status_geral)}>
                {relatorio.resumo_executivo.status_geral}
              </Badge>
              <Button onClick={exportarRelatorio} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiência Produtiva</p>
                <p className="text-2xl font-bold">{relatorio.indicadores_principais.eficiencia_produtividade}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Desvio Orçamentário</p>
                <p className="text-2xl font-bold">{relatorio.indicadores_principais.desvio_orcamentario}</p>
              </div>
              {getVariationIcon(relatorio.indicadores_principais.desvio_orcamentario)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Desvio Cronograma</p>
                <p className="text-2xl font-bold">{relatorio.indicadores_principais.desvio_cronograma}</p>
              </div>
              {getVariationIcon(relatorio.indicadores_principais.desvio_cronograma)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conformidade</p>
                <p className="text-xl font-bold">{relatorio.indicadores_principais.conformidade_tecnica}</p>
              </div>
              {relatorio.indicadores_principais.conformidade_tecnica === 'Conforme' ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projeções Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Projeções e Previsões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Conclusão Prevista</span>
              </div>
              <p className="text-2xl font-bold">{relatorio.projecoes.previsao_conclusao}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Baseado no ritmo atual de execução
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Custo Final Projetado</span>
              </div>
              <p className="text-2xl font-bold">
                R$ {relatorio.projecoes.custo_projetado.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Extrapolação baseada nos custos atuais
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Desvio Orçamentário</span>
              </div>
              <p className={`text-2xl font-bold ${relatorio.projecoes.desvio_orcamentario > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {relatorio.projecoes.desvio_orcamentario > 0 ? '+' : ''}{relatorio.projecoes.desvio_orcamentario.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Diferença entre custo projetado e orçado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-red-600">{relatorio.alertas_criticos}</div>
              <p className="text-sm text-muted-foreground">Requerem ação imediata</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Alertas de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-yellow-600">{relatorio.alertas_atencao}</div>
              <p className="text-sm text-muted-foreground">Necessitam monitoramento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações Estratégicas */}
      {relatorio.recomendacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recomendações Estratégicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relatorio.recomendacoes.map((recomendacao, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{recomendacao}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Implementar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análise de Equipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Análise de Desempenho da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rdo.equipes.map((membro, index) => {
              const eficienciaMembro = (8 / membro.horasTrabalhadas) * 100; // assumindo 8h como padrão
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{membro.funcionario}</p>
                    <p className="text-sm text-muted-foreground">{membro.cargo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{membro.horasTrabalhadas}h trabalhadas</p>
                    <p className="text-sm text-muted-foreground">
                      Eficiência: {eficienciaMembro.toFixed(1)}%
                    </p>
                  </div>
                  <Badge variant={eficienciaMembro >= 90 ? 'default' : eficienciaMembro >= 70 ? 'secondary' : 'destructive'}>
                    {eficienciaMembro >= 90 ? 'Excelente' : eficienciaMembro >= 70 ? 'Bom' : 'Atenção'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}