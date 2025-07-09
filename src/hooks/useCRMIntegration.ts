import { useState, useEffect } from 'react';
import { Cliente, DashboardIntegrado } from '@/types';
import { getStorageData, mockDashboardIntegrado } from '@/services/mockData';
import { useLeads } from './crm/useLeads';
import { useOportunidades } from './crm/useOportunidades';
import { useOrcamentos } from './crm/useOrcamentos';
import { useContratos } from './crm/useContratos';
import { calculateDashboard } from '@/services/crm/dashboardCalculator';
import { getRelatedData as getRelatedDataService } from '@/services/crm/relatedDataService';

export const useCRMIntegration = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dashboard, setDashboard] = useState<DashboardIntegrado>(mockDashboardIntegrado);
  const [loading, setLoading] = useState(true);

  // Use specialized hooks
  const { leads, loadLeads, createLead, updateLead } = useLeads();
  const { oportunidades, loadOportunidades, createOportunidade, updateOportunidade, convertLeadToOportunidade } = useOportunidades();
  const { orcamentos, loadOrcamentos, createOrcamento, updateOrcamento, approveOrcamento } = useOrcamentos();
  const { contratos, loadContratos, createContrato, updateContrato } = useContratos();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      loadLeads();
      setClientes(getStorageData('clientes', []));
      loadOportunidades();
      loadOrcamentos();
      loadContratos();
      calculateDashboardData();
    } catch (error) {
      console.error('Erro ao carregar dados CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardData = () => {
    const dashboardData = calculateDashboard(leads, oportunidades, orcamentos, contratos);
    setDashboard(dashboardData);
  };

  // Enhanced functions with dashboard recalculation
  const enhancedCreateLead = (leadData: any) => {
    const result = createLead(leadData);
    calculateDashboardData();
    return result;
  };

  const enhancedUpdateLead = (id: string, leadData: any) => {
    updateLead(id, leadData);
    calculateDashboardData();
  };

  const enhancedConvertLeadToOportunidade = (leadId: string, oportunidadeData: any) => {
    const result = convertLeadToOportunidade(leadId, oportunidadeData);
    // Also update the lead
    enhancedUpdateLead(leadId, { 
      convertido_oportunidade: true, 
      id_oportunidade: result?.id 
    });
    return result;
  };

  const enhancedCreateOrcamento = (orcamentoData: any) => {
    const result = createOrcamento(orcamentoData);
    calculateDashboardData();
    return result;
  };

  const enhancedApproveOrcamento = (orcamentoId: string) => {
    approveOrcamento(orcamentoId);
    calculateDashboardData();
  };

  const enhancedCreateContrato = (orcamentoId: string, contratoData: any) => {
    const result = createContrato(orcamentoId, contratoData);
    // Also update the orcamento
    updateOrcamento(orcamentoId, { 
      virou_contrato: true, 
      id_contrato: result?.id 
    });
    calculateDashboardData();
    return result;
  };

  const getRelatedData = (entityId: string, entityType: 'lead' | 'oportunidade' | 'orcamento' | 'contrato') => {
    return getRelatedDataService(entityId, entityType, leads, oportunidades, orcamentos, contratos);
  };

  return {
    // Estados
    leads,
    clientes,
    oportunidades,
    orcamentos,
    contratos,
    dashboard,
    loading,
    
    // Funções
    loadData,
    createLead: enhancedCreateLead,
    updateLead: enhancedUpdateLead,
    convertLeadToOportunidade: enhancedConvertLeadToOportunidade,
    createOrcamento: enhancedCreateOrcamento,
    approveOrcamento: enhancedApproveOrcamento,
    createContrato: enhancedCreateContrato,
    getRelatedData,
    calculateDashboard: calculateDashboardData
  };
};