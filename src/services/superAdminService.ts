import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Company = Database['public']['Tables']['companies']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export interface GlobalMetrics {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
  planDistribution: {
    starter: number;
    professional: number;
    enterprise: number;
  };
}

export interface CompanyActivity {
  id: string;
  name: string;
  plan: string;
  lastActivity: string;
  activeUsers: number;
  monthlyRevenue: number;
}

export const superAdminService = {
  async getGlobalMetrics(): Promise<GlobalMetrics> {
    try {
      // Get companies data
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) throw companiesError;

      // Get users data
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      const totalCompanies = companies?.length || 0;
      const activeCompanies = companies?.filter(c => c.status === 'active').length || 0;
      const totalUsers = users?.length || 0;

      // Calculate plan distribution
      const planDistribution = companies?.reduce((acc, company) => {
        acc[company.plan as keyof typeof acc] = (acc[company.plan as keyof typeof acc] || 0) + 1;
        return acc;
      }, { starter: 0, professional: 0, enterprise: 0 }) || { starter: 0, professional: 0, enterprise: 0 };

      // Mock revenue calculation (in a real app, this would come from subscriptions table)
      const planPrices = { starter: 297, professional: 597, enterprise: 1297 };
      const totalRevenue = companies?.reduce((acc, company) => {
        return acc + planPrices[company.plan as keyof typeof planPrices];
      }, 0) || 0;

      return {
        totalCompanies,
        activeCompanies,
        totalUsers,
        totalRevenue,
        revenueGrowth: 12.5, // Mock growth
        userGrowth: 8.3, // Mock growth
        planDistribution
      };
    } catch (error) {
      console.error('Error fetching global metrics:', error);
      throw error;
    }
  },

  async getCompanyActivities(): Promise<CompanyActivity[]> {
    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          plan,
          updated_at,
          users(count)
        `)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const planPrices = { starter: 297, professional: 597, enterprise: 1297 };

      return companies?.map(company => ({
        id: company.id,
        name: company.name,
        plan: company.plan,
        lastActivity: company.updated_at,
        activeUsers: (company.users as any)?.[0]?.count || 0,
        monthlyRevenue: planPrices[company.plan as keyof typeof planPrices]
      })) || [];
    } catch (error) {
      console.error('Error fetching company activities:', error);
      throw error;
    }
  },

  async getSystemHealth() {
    try {
      // Mock system health metrics (in a real app, these would come from monitoring)
      return {
        apiResponseTime: Math.floor(Math.random() * 100) + 50,
        uptime: 99.9,
        errorRate: 0.01,
        activeConnections: Math.floor(Math.random() * 500) + 100,
        databaseConnections: Math.floor(Math.random() * 50) + 10,
        storageUsed: Math.floor(Math.random() * 40) + 30
      };
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }
};