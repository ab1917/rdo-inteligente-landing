import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RDO } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { listNeonRDOs, rdoRequest } from '@/services/neonRDO';

export const useRDO = () => {
  const { user, isLoading } = useAuth();
  const client = useQueryClient();
  const queryKey = ['neon-rdos', user?.company_id, user?.id];
  const query = useQuery({ queryKey, queryFn: listNeonRDOs, enabled: !!user, staleTime: 60000, retry: false });
  const rdos = user ? query.data ?? [] : [];

  const createRDO = async (rdo: Omit<RDO, 'id' | 'createdAt' | 'updatedAt'>, author: { cpf: string; cargo: string }): Promise<RDO> => {
    const result = await rdoRequest<{ rdo: RDO }>({ method: 'POST', body: { action: 'create', id: crypto.randomUUID(), rdo, author } });
    await client.invalidateQueries({ queryKey });
    return result.rdo;
  };

  const updateRDO = async (id: string, updates: Partial<RDO>): Promise<RDO | null> => {
    const current = rdos.find(rdo => rdo.id === id);
    if (!current) return null;
    const result = await rdoRequest<{ rdo: RDO }>({ method: 'POST', body: { action: 'update', id, rdo: { ...current, ...updates } } });
    await client.invalidateQueries({ queryKey });
    return result.rdo;
  };

  const deleteRDO = async (id: string): Promise<void> => {
    await rdoRequest({ method: 'POST', body: { action: 'delete', id } });
    await client.invalidateQueries({ queryKey });
  };

  const getRDOById = (id: string): RDO | undefined => {
    return rdos.find(rdo => rdo.id === id);
  };

  return {
    rdos,
    loading: isLoading || (!!user && query.isPending),
    error: query.error?.message ?? '',
    reload: query.refetch,
    createRDO,
    updateRDO,
    deleteRDO,
    getRDOById
  };
};