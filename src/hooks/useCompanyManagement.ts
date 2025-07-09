import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { useToast } from '@/hooks/use-toast';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyWithMetrics = Company & {
  user_count: number;
  active_projects: number;
  storage_used: number;
};

export const useCompanyManagement = () => {
  const [companies, setCompanies] = useState<CompanyWithMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          users(count),
          projetos:rdo_entries(count)
        `);

      if (error) throw error;

      const companiesWithMetrics = data?.map(company => ({
        ...company,
        user_count: company.users?.[0]?.count || 0,
        active_projects: company.projetos?.[0]?.count || 0,
        storage_used: Math.floor(Math.random() * 50) + 10 // Mock storage for now
      })) || [];

      setCompanies(companiesWithMetrics);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanyPlan = async (companyId: string, plan: 'starter' | 'professional' | 'enterprise') => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Plano atualizado",
        description: "O plano da empresa foi alterado com sucesso."
      });

      await fetchCompanies();
    } catch (error) {
      console.error('Error updating company plan:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const updateCompanyStatus = async (companyId: string, status: 'active' | 'suspended' | 'trial') => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status da empresa foi alterado com sucesso."
      });

      await fetchCompanies();
    } catch (error) {
      console.error('Error updating company status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    isLoading,
    fetchCompanies,
    updateCompanyPlan,
    updateCompanyStatus
  };
};