import React from 'react';
import { AlertTriangle, Lock, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlanGateProps {
  children: React.ReactNode;
  feature?: string;
  requiredPlan?: 'professional' | 'enterprise';
  limitReached?: boolean;
  limitMessage?: string;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
  onUpgrade?: () => void;
}

export const PlanGate: React.FC<PlanGateProps> = ({
  children,
  feature,
  requiredPlan,
  limitReached = false,
  limitMessage,
  fallback,
  showUpgrade = true,
  onUpgrade
}) => {
  // Aqui você integraria com o hook usePlanLimits
  // Por simplicidade, vou mostrar a estrutura
  const hasAccess = !limitReached; // Implementar lógica real

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>{limitMessage || 'Limite do plano atingido'}</span>
          {requiredPlan && (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              Requer {requiredPlan}
            </Badge>
          )}
        </div>
        {showUpgrade && (
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Zap className="h-3 w-3 mr-1" />
            Fazer Upgrade
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Componente para bloquear botões
export const PlanGateButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  limitMessage?: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, disabled, limitMessage, onClick, className }) => {
  return (
    <div className="relative">
      <Button 
        disabled={disabled}
        onClick={onClick}
        className={className}
        title={disabled ? limitMessage : undefined}
      >
        {children}
        {disabled && <Lock className="h-3 w-3 ml-1" />}
      </Button>
    </div>
  );
};