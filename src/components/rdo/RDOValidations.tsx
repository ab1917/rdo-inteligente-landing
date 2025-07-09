import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { RDO, EquipeRDO } from '@/types';

interface ValidationResult {
  type: 'success' | 'warning' | 'error';
  message: string;
  field?: string;
}

interface RDOValidationsProps {
  formData: any;
  equipes: EquipeRDO[];
}

export function RDOValidations({ formData, equipes }: RDOValidationsProps) {
  const validations: ValidationResult[] = [];

  // Validação de horas excessivas
  equipes.forEach((equipe, index) => {
    if (equipe.horasTrabalhadas > 10) {
      validations.push({
        type: 'warning',
        message: `${equipe.funcionario} está com ${equipe.horasTrabalhadas}h trabalhadas (acima de 10h)`,
        field: `equipes.${index}.horasTrabalhadas`
      });
    }
    if (equipe.horasTrabalhadas > 12) {
      validations.push({
        type: 'error',
        message: `${equipe.funcionario} excedeu 12h de trabalho (limite legal)`,
        field: `equipes.${index}.horasTrabalhadas`
      });
    }
  });

  // Validação de temperatura extrema
  if (formData.temperatura && (formData.temperatura < 5 || formData.temperatura > 40)) {
    validations.push({
      type: 'warning',
      message: `Temperatura de ${formData.temperatura}°C pode afetar a produtividade`,
      field: 'temperatura'
    });
  }

  // Validação de clima vs temperatura
  if (formData.clima === 'chuva' && formData.temperatura && formData.temperatura > 30) {
    validations.push({
      type: 'warning',
      message: 'Temperatura alta para clima chuvoso - verifique os dados',
      field: 'clima'
    });
  }

  // Validação de conflitos de funcionário
  const funcionarioHoras: { [key: string]: number } = {};
  equipes.forEach(equipe => {
    if (funcionarioHoras[equipe.funcionario]) {
      validations.push({
        type: 'error',
        message: `${equipe.funcionario} está alocado em múltiplas equipes`,
        field: 'equipes'
      });
    }
    funcionarioHoras[equipe.funcionario] = equipe.horasTrabalhadas;
  });

  // Validação de atividades sem responsável
  if (formData.atividades) {
    formData.atividades.forEach((atividade, index) => {
      if (!atividade.responsavel) {
        validations.push({
          type: 'warning',
          message: `Atividade "${atividade.descricao}" sem responsável definido`,
          field: `atividades.${index}.responsavel`
        });
      }
    });
  }

  // Sucesso se não há erros
  if (validations.filter(v => v.type === 'error').length === 0 && validations.length === 0) {
    validations.push({
      type: 'success',
      message: 'Todas as validações passaram com sucesso'
    });
  }

  const getIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Clock;
    }
  };

  const getVariant = (type: ValidationResult['type']) => {
    switch (type) {
      case 'error': return 'destructive' as const;
      case 'warning': return 'default' as const;
      case 'success': return 'default' as const;
      default: return 'default' as const;
    }
  };

  if (validations.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Validações Inteligentes</h4>
      {validations.map((validation, index) => {
        const Icon = getIcon(validation.type);
        return (
          <Alert key={index} variant={getVariant(validation.type)}>
            <Icon className="h-4 w-4" />
            <AlertDescription>
              {validation.message}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}