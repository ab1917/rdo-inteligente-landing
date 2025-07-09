import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { Database } from '@/lib/database.types';
import { toast } from 'sonner';

type Company = Database['public']['Tables']['companies']['Row'];
type User = Database['public']['Tables']['users']['Row'];
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface SuperAdminMetrics {
  totalCompanies: number;
  activeCompanies: number;
  trialCompanies: number;
  totalUsers: number;
  monthlyRevenue: number;
  growthRate: number;
}

export const useSuperAdmin = () => {
  const { read, update, create } = useSupabase();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [metrics, setMetrics] = useState<SuperAdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuperAdminData();
  }, []);

  const loadSuperAdminData = async () => {
    try {
      setLoading(true);
      
      // Carregar empresas
      const companiesData = await read('companies');
      setCompanies(companiesData);

      // Carregar usuários
      const usersData = await read('users');

      // Calcular métricas
      const totalCompanies = companiesData.length;
      const activeCompanies = companiesData.filter(c => c.status === 'ativa').length;
      const trialCompanies = companiesData.filter(c => c.status === 'trial').length;
      const totalUsers = usersData.length;

      // Calcular receita (simplificado)
      const planPrices = { starter: 297, professional: 597, enterprise: 1297 };
      const monthlyRevenue = companiesData
        .filter(c => c.status === 'ativa')
        .reduce((sum, c) => sum + (planPrices[c.plano] || 0), 0);

      setMetrics({
        totalCompanies,
        activeCompanies,
        trialCompanies,
        totalUsers,
        monthlyRevenue,
        growthRate: 15.2 // Implementar cálculo real
      });

    } catch (error) {
      console.error('Erro ao carregar dados do super admin:', error);
      toast.error('Erro ao carregar dados administrativos');
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyPlan = async (companyId: string, newPlan: Company['plano']) => {
    try {
      const planLimits = {
        starter: { obras: 3, usuarios: 10, armazenamento_gb: 10 },
        professional: { obras: -1, usuarios: 50, armazenamento_gb: 100 },
        enterprise: { obras: -1, usuarios: -1, armazenamento_gb: -1 }
      };

      await update('companies', companyId, {
        plano: newPlan,
        limites: planLimits[newPlan]
      });

      // Atualizar estado local
      setCompanies(prev => 
        prev.map(c => 
          c.id === companyId 
            ? { ...c, plano: newPlan, limites: planLimits[newPlan] }
            : c
        )
      );

      toast.success('Plano da empresa atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast.error('Erro ao atualizar plano da empresa');
    }
  };

  const suspendCompany = async (companyId: string) => {
    try {
      await update('companies', companyId, { status: 'suspensa' });
      
      setCompanies(prev => 
        prev.map(c => 
          c.id === companyId ? { ...c, status: 'suspensa' as const } : c
        )
      );

      toast.success('Empresa suspensa com sucesso');
    } catch (error) {
      console.error('Erro ao suspender empresa:', error);
      toast.error('Erro ao suspender empresa');
    }
  };

  const activateCompany = async (companyId: string) => {
    try {
      await update('companies', companyId, { status: 'ativa' });
      
      setCompanies(prev => 
        prev.map(c => 
          c.id === companyId ? { ...c, status: 'ativa' as const } : c
        )
      );

      toast.success('Empresa ativada com sucesso');
    } catch (error) {
      console.error('Erro ao ativar empresa:', error);
      toast.error('Erro ao ativar empresa');
    }
  };

  const extendTrial = async (companyId: string, days: number) => {
    try {
      const newExpirationDate = new Date();
      newExpirationDate.setDate(newExpirationDate.getDate() + days);

      await update('companies', companyId, {
        data_expiracao: newExpirationDate.toISOString().split('T')[0]
      });

      setCompanies(prev => 
        prev.map(c => 
          c.id === companyId 
            ? { ...c, data_expiracao: newExpirationDate.toISOString().split('T')[0] }
            : c
        )
      );

      toast.success(`Trial estendido por ${days} dias`);
    } catch (error) {
      console.error('Erro ao estender trial:', error);
      toast.error('Erro ao estender trial');
    }
  };

  const getCompanyAnalytics = (companyId: string) => {
    // Implementar analytics específicos da empresa
    return {
      totalUsers: 0,
      activeProjects: 0,
      storageUsed: 0,
      lastActivity: null
    };
  };

  return {
    companies,
    metrics,
    loading,
    updateCompanyPlan,
    suspendCompany,
    activateCompany,
    extendTrial,
    getCompanyAnalytics,
    refreshData: loadSuperAdminData
  };
};