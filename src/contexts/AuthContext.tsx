import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type UserRole = 'super_admin' | 'admin' | 'manager' | 'engineer' | 'viewer';
type CompanyPlan = 'starter' | 'professional' | 'enterprise';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id: string;
  company: {
    id: string;
    name: string;
    plan: CompanyPlan;
    status: 'active' | 'suspended' | 'trial';
    cnpj?: string;
    address?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company: string;
  role: UserRole;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserData(session.user.id);
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (userData?.company) {
        const company = userData.company as Record<string, any>;

        setUser({
          id: userData.id,
          name: userData.name ?? userData.nome,
          email: userData.email,
          role: userData.role,
          company_id: userData.company_id,
          company: {
            id: company.id,
            name: company.name ?? company.nome,
            plan: company.plan ?? company.plano,
            status: company.status === 'ativa' ? 'active' : company.status === 'suspensa' ? 'suspended' : company.status,
            cnpj: company.cnpj,
            address: company.address ?? company.endereco,
            phone: company.phone ?? company.telefone,
          }
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id);
        setIsLoading(false);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);

      const authError = error as { message?: string; status?: number; code?: string };
      const isNetworkError = authError.message === 'Failed to fetch' || authError.status === 0;

      setIsLoading(false);

      if (isNetworkError) {
        const diagnostic = await checkSupabaseConnectivity();
        return {
          success: false,
          message: `Falha de conexão com o servidor de autenticação. ${diagnostic.message}`,
        };
      }

      return {
        success: false,
        message: authError.message || 'Verifique suas credenciais e tente novamente.',
      };
    }
    
    setIsLoading(false);
    return { success: false, message: 'Verifique suas credenciais e tente novamente.' };
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First create the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.company,
          plan: 'starter',
          status: 'trial'
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Then create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company_id: companyData.id,
            role: data.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user record
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role,
            company_id: companyData.id
          });

        if (userError) throw userError;

        await loadUserData(authData.user.id);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Register error:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};