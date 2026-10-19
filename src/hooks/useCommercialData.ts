import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { commercialRequest, emptyCommercial, listCommercial } from '@/services/neonCommercial';
export function useCommercialData() {
  const { user, isLoading } = useAuth();
  const client = useQueryClient();
  const key = ['neon-commercial', user?.company_id, user?.id];
  const query = useQuery({ queryKey: key, queryFn: listCommercial, enabled: !!user, retry: false, staleTime: 60000 });
  const mutate = async <T,>(body: unknown): Promise<T> => {
    const result = await commercialRequest<T>('neon-commercial', body);
    await client.invalidateQueries({ queryKey: key });
    return result;
  };
  return { ...(user ? query.data ?? emptyCommercial : emptyCommercial), loading: isLoading || (!!user && query.isPending), error: query.error?.message ?? '', reload: query.refetch, mutate };
}
