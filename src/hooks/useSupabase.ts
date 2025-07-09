import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { toast } from 'sonner';

type Tables = Database['public']['Tables'];

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic CRUD operations
  const create = async <T extends keyof Tables>(
    table: T,
    data: Tables[T]['Insert']
  ): Promise<Tables[T]['Row'] | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Registro criado com sucesso!');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast.error(`Erro ao criar registro: ${message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const read = async <T extends keyof Tables>(
    table: T,
    filters?: Record<string, any>
  ): Promise<Tables[T]['Row'][]> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select('*');

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast.error(`Erro ao buscar dados: ${message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const update = async <T extends keyof Tables>(
    table: T,
    id: string,
    data: Tables[T]['Update']
  ): Promise<Tables[T]['Row'] | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Registro atualizado com sucesso!');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast.error(`Erro ao atualizar registro: ${message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async <T extends keyof Tables>(
    table: T,
    id: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Registro removido com sucesso!');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast.error(`Erro ao remover registro: ${message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Test connection
  const testConnection = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('funcionarios').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  };

  return {
    create,
    read,
    update,
    remove,
    testConnection,
    loading,
    error,
    setError
  };
};