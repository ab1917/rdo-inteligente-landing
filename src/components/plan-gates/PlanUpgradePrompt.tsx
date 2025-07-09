import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, Lock, TrendingUp } from 'lucide-react';

interface PlanUpgradePromptProps {
  feature: string;
  currentLimit: number;
  requiredPlan: 'professional' | 'enterprise';
}

const planFeatures = {
  professional: {
    name: 'Professional',
    price: 'R$ 597/mês',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    features: [
      'Obras ilimitadas',
      'Até 50 usuários',
      '100GB de armazenamento',
      'CRM integrado',
      'Relatórios avançados'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 'R$ 1.297/mês',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    features: [
      'Recursos ilimitados',
      'Usuários ilimitados',
      'Armazenamento ilimitado',
      'White-label',
      'API completa',
      'Suporte prioritário'
    ]
  }
};

export const PlanUpgradePrompt: React.FC<PlanUpgradePromptProps> = ({
  feature,
  currentLimit,
  requiredPlan
}) => {
  const { user } = useAuth();
  const plan = planFeatures[requiredPlan];

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardHeader className="text-center">
        <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Recurso Bloqueado</CardTitle>
        <CardDescription>
          Você atingiu o limite de {currentLimit} para "{feature}". 
          Faça upgrade para continuar utilizando este recurso.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge className={plan.color}>
            <TrendingUp className="mr-1 h-3 w-3" />
            Upgrade para {plan.name}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            A partir de {plan.price}
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">O que você ganha:</h4>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">
            Ver Todos os Planos
          </Button>
          <Button className="flex-1">
            <Zap className="mr-2 h-4 w-4" />
            Fazer Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};