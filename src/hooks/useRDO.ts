import { useState, useEffect } from 'react';
import { RDO } from '@/types';
import { getStorageData, setStorageData } from '@/services/mockData';

export const useRDO = () => {
  const [rdos, setRDOs] = useState<RDO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const storedRDOs = getStorageData<RDO[]>('rdos', []);
      setRDOs(storedRDOs);
      setLoading(false);
    }, 500);
  }, []);

  const createRDO = async (rdo: Omit<RDO, 'id' | 'createdAt' | 'updatedAt'>): Promise<RDO> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRDO: RDO = {
          ...rdo,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const updatedRDOs = [...rdos, newRDO];
        setRDOs(updatedRDOs);
        setStorageData('rdos', updatedRDOs);
        setLoading(false);
        resolve(newRDO);
      }, 1000);
    });
  };

  const updateRDO = async (id: string, updates: Partial<RDO>): Promise<RDO | null> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedRDOs = rdos.map(rdo => 
          rdo.id === id 
            ? { ...rdo, ...updates, updatedAt: new Date().toISOString() }
            : rdo
        );
        
        setRDOs(updatedRDOs);
        setStorageData('rdos', updatedRDOs);
        
        const updatedRDO = updatedRDOs.find(rdo => rdo.id === id) || null;
        setLoading(false);
        resolve(updatedRDO);
      }, 800);
    });
  };

  const deleteRDO = async (id: string): Promise<void> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedRDOs = rdos.filter(rdo => rdo.id !== id);
        setRDOs(updatedRDOs);
        setStorageData('rdos', updatedRDOs);
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  const getRDOById = (id: string): RDO | undefined => {
    return rdos.find(rdo => rdo.id === id);
  };

  return {
    rdos,
    loading,
    createRDO,
    updateRDO,
    deleteRDO,
    getRDOById
  };
};