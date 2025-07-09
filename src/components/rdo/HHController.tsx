import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Target
} from 'lucide-react';
import { useHHControl } from '@/hooks/useHHControl';
import { RDO } from '@/types';

interface HHControllerProps {
  rdo: RDO;
  showDetails?: boolean;
}

export function HHController({ rdo, showDetails = true }: HHControllerProps) {
  const { hhData, gerarRelatorioProdutividade } = useHHControl();
  
  React.useEffect(() => {
    const { atualizarHHControl } = useHHControl();
    atualizarHHControl(rdo);
  }, [rdo]);

  const relatorio = gerarRelatorioProdutividade();
  const eficienciaColor = relatorio.eficiencia >= 90 ? 'text-green-600' : 
                         relatorio.eficiencia >= 70 ? 'text-yellow-600' : 'text-red-600';

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    );
  };

  const getDesvioIcon = () => {
    if (hhData.desvio_produtividade > 0.05) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (hhData.desvio_produtividade < -0.05) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Target className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">HH Executado</p>
                <p className="text-2xl font-bold">{hhData.hh_executado_total}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">HH Previsto</p>
                <p className="text-2xl font-bold">{hhData.hh_previsto_dia}h</p>
              </div>
              <Target className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiência</p>
                <p className={`text-2xl font-bold ${eficienciaColor}`}>
                  {relatorio.eficiencia.toFixed(1)}%
                </p>
              </div>
              {getDesvioIcon()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custo HH</p>
                <p className="text-2xl font-bold">
                  R$ {relatorio.custo_por_hora.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar de Eficiência */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progresso de Eficiência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Meta: 100%</span>
              <span className={eficienciaColor}>
                Atual: {relatorio.eficiencia.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(relatorio.eficiencia, 100)} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <>
          {/* Validações de Conformidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Validações de Conformidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Funcionários Certificados</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(hhData.validacao.funcionario_certificado)}
                  <Badge 
                    variant={hhData.validacao.funcionario_certificado ? 'default' : 'destructive'}
                  >
                    {hhData.validacao.funcionario_certificado ? 'Conforme' : 'Não Conforme'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Horas Dentro do Limite</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(hhData.validacao.hh_dentro_limite)}
                  <Badge 
                    variant={hhData.validacao.hh_dentro_limite ? 'default' : 'destructive'}
                  >
                    {hhData.validacao.hh_dentro_limite ? 'Conforme' : 'Não Conforme'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Custo Dentro do Orçamento</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(hhData.validacao.custo_dentro_orcamento)}
                  <Badge 
                    variant={hhData.validacao.custo_dentro_orcamento ? 'default' : 'destructive'}
                  >
                    {hhData.validacao.custo_dentro_orcamento ? 'Conforme' : 'Não Conforme'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          {hhData.validacao.alertas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas e Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hhData.validacao.alertas.map((alerta, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{alerta}</AlertDescription>
                  </Alert>
                ))}
                
                {relatorio.recomendacoes.map((rec, index) => (
                  <Alert key={`rec-${index}`} className="border-blue-200">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">{rec}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Detalhamento por Funcionário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detalhamento por Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rdo.equipes.map((membro, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{membro.funcionario}</p>
                      <p className="text-sm text-muted-foreground">{membro.cargo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{membro.horasTrabalhadas}h</p>
                      <p className="text-sm text-muted-foreground">
                        {membro.horaInicio} - {membro.horaFim}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}