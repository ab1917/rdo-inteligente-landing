import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { Database } from '@/lib/database.types';

type Company = Database['public']['Tables']['companies']['Row'];
type PlanLimits = Company['limites'];

interface PlanLimitCheck {
  canAdd: boolean;
  limitReached: boolean;
  current: number;
  limit: number;
  message?: string;
}

export const usePlanLimits = () => {
  const { read } = useSupabase();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const companies = await read('companies');
      if (companies.length > 0) {
        setCompany(companies[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkObraLimit = async (): Promise<PlanLimitCheck> => {
    if (!company) return { canAdd: false, limitReached: true, current: 0, limit: 0 };

    const obras = await read('obras', { status: 'em_andamento' });
    const current = obras.length;
    const limit = company.limites.obras;

    if (limit === -1) {
      return { canAdd: true, limitReached: false, current, limit: -1 };
    }

    const canAdd = current < limit;
    return {
      canAdd,
      limitReached: !canAdd,
      current,
      limit,
      message: canAdd ? undefined : `Limite de ${limit} obras ativas atingido. Considere fazer upgrade do seu plano.`
    };
  };

  const checkUserLimit = async (): Promise<PlanLimitCheck> => {
    if (!company) return { canAdd: false, limitReached: true, current: 0, limit: 0 };

    const users = await read('users', { company_id: company.id, status: 'ativo' });
    const current = users.length;
    const limit = company.limites.usuarios;

    if (limit === -1) {
      return { canAdd: true, limitReached: false, current, limit: -1 };
    }

    const canAdd = current < limit;
    return {
      canAdd,
      limitReached: !canAdd,
      current,
      limit,
      message: canAdd ? undefined : `Limite de ${limit} usuários atingido. Considere fazer upgrade do seu plano.`
    };
  };

  const checkStorageLimit = (): PlanLimitCheck => {
    if (!company) return { canAdd: false, limitReached: true, current: 0, limit: 0 };

    // Aqui você implementaria a verificação real de armazenamento
    const current = 0; // Implementar cálculo real
    const limit = company.limites.armazenamento_gb;

    if (limit === -1) {
      return { canAdd: true, limitReached: false, current, limit: -1 };
    }

    const canAdd = current < limit;
    return {
      canAdd,
      limitReached: !canAdd,
      current,
      limit,
      message: canAdd ? undefined : `Limite de ${limit}GB de armazenamento atingido. Considere fazer upgrade do seu plano.`
    };
  };

  const isPlanFeatureEnabled = (feature: string): boolean => {
    if (!company) return false;

    const planFeatures = {
      starter: ['rdo_basico', 'relatorios_basicos'],
      professional: ['rdo_basico', 'relatorios_basicos', 'crm_basico', 'api_limitada'],
      enterprise: ['rdo_basico', 'relatorios_basicos', 'crm_basico', 'api_limitada', 'white_label', 'api_completa', 'suporte_prioritario']
    };

    return planFeatures[company.plano]?.includes(feature) || false;
  };

  const getPlanInfo = () => {
    if (!company) return null;

    const planInfo = {
      starter: {
        nome: 'Starter',
        preco: 297,
        recursos: [
          'Até 3 obras ativas',
          'Até 10 usuários',
          '10GB de armazenamento',
          'RDO básico',
          'Relatórios básicos'
        ]
      },
      professional: {
        nome: 'Professional',
        preco: 597,
        recursos: [
          'Obras ilimitadas',
          'Até 50 usuários',
          '100GB de armazenamento',
          'Todos os recursos principais',
          'CRM básico integrado',
          'API limitada'
        ]
      },
      enterprise: {
        nome: 'Enterprise',
        preco: 1297,
        recursos: [
          'Recursos ilimitados',
          'Usuários ilimitados',
          'Armazenamento ilimitado',
          'White-label',
          'API completa',
          'Suporte prioritário'
        ]
      }
    };

    return planInfo[company.plano];
  };

  return {
    company,
    loading,
    checkObraLimit,
    checkUserLimit,
    checkStorageLimit,
    isPlanFeatureEnabled,
    getPlanInfo,
    refreshCompanyData: loadCompanyData
  };
};