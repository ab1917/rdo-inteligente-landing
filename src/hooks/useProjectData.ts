import { useState, useEffect } from 'react';
import { Project, Activity } from '@/types';

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Reforma do Galpão Industrial',
          description: 'Modernização do sistema de ventilação e estrutura do galpão principal',
          type: 'obra-civil',
          status: 'em-andamento',
          startDate: '2024-01-15',
          endDate: '2024-03-30',
          duration: 75,
          progress: 65,
          priority: 'alta',
          client: 'Indústria ABC Ltda',
          responsible: 'Eng. João Silva',
          budget: 150000
        },
        {
          id: '2',
          name: 'Manutenção Preventiva - Linha 3',
          description: 'Manutenção completa dos equipamentos da linha de produção 3',
          type: 'manutencao',
          status: 'planejado',
          startDate: '2024-02-01',
          endDate: '2024-02-15',
          duration: 14,
          progress: 0,
          priority: 'media',
          client: 'Fábrica XYZ S.A.',
          responsible: 'Téc. Carlos Oliveira',
          budget: 45000
        },
        {
          id: '3',
          name: 'Instalação de Sistema de Automação',
          description: 'Implementação de sistema de automação para controle de processo',
          type: 'instalacao',
          status: 'atrasado',
          startDate: '2023-12-01',
          endDate: '2024-01-31',
          duration: 60,
          progress: 45,
          priority: 'urgente',
          client: 'Metalúrgica DEF',
          responsible: 'Eng. Maria Santos',
          budget: 200000
        },
        {
          id: '4',
          name: 'Consultoria em Eficiência Energética',
          description: 'Análise e otimização do sistema elétrico da planta industrial',
          type: 'consultoria',
          status: 'concluido',
          startDate: '2023-11-01',
          endDate: '2023-12-15',
          duration: 45,
          progress: 100,
          priority: 'media',
          client: 'Química GHI Ltda',
          responsible: 'Coord. Ana Costa',
          budget: 80000
        }
      ]);

      setActivities([
        // Projeto 1 - Reforma do Galpão
        {
          id: 'a1',
          projectId: '1',
          name: 'Demolição da estrutura antiga',
          description: 'Remoção segura da estrutura de ventilação antiga',
          status: 'concluido',
          startDate: '2024-01-15',
          endDate: '2024-01-25',
          duration: 10,
          progress: 100,
          assignedTeam: 'Equipe A',
          dependencies: [],
          critical: false
        },
        {
          id: 'a2',
          projectId: '1',
          name: 'Instalação nova estrutura',
          description: 'Montagem da nova estrutura de ventilação',
          status: 'em-andamento',
          startDate: '2024-01-26',
          endDate: '2024-02-15',
          duration: 20,
          progress: 70,
          assignedTeam: 'Equipe B',
          dependencies: ['a1'],
          critical: true
        },
        {
          id: 'a3',
          projectId: '1',
          name: 'Testes e comissionamento',
          description: 'Testes finais e entrega do sistema',
          status: 'planejado',
          startDate: '2024-02-16',
          endDate: '2024-03-30',
          duration: 35,
          progress: 0,
          assignedTeam: 'Equipe C',
          dependencies: ['a2'],
          critical: true
        },
        
        // Projeto 2 - Manutenção Preventiva
        {
          id: 'a4',
          projectId: '2',
          name: 'Parada programada de equipamentos',
          description: 'Desligamento seguro da linha para manutenção',
          status: 'planejado',
          startDate: '2024-02-01',
          endDate: '2024-02-02',
          duration: 1,
          progress: 0,
          assignedTeam: 'Equipe Manutenção',
          dependencies: [],
          critical: true
        },
        {
          id: 'a5',
          projectId: '2',
          name: 'Inspeção e substituição de peças',
          description: 'Verificação e troca de componentes desgastados',
          status: 'planejado',
          startDate: '2024-02-03',
          endDate: '2024-02-12',
          duration: 10,
          progress: 0,
          assignedTeam: 'Equipe Técnica',
          dependencies: ['a4'],
          critical: false
        },
        
        // Projeto 3 - Sistema de Automação
        {
          id: 'a6',
          projectId: '3',
          name: 'Análise de requisitos',
          description: 'Levantamento detalhado dos requisitos do sistema',
          status: 'concluido',
          startDate: '2023-12-01',
          endDate: '2023-12-10',
          duration: 10,
          progress: 100,
          assignedTeam: 'Equipe Análise',
          dependencies: [],
          critical: false
        },
        {
          id: 'a7',
          projectId: '3',
          name: 'Desenvolvimento do sistema',
          description: 'Programação e configuração do sistema de automação',
          status: 'atrasado',
          startDate: '2023-12-11',
          endDate: '2024-01-20',
          duration: 40,
          progress: 60,
          assignedTeam: 'Equipe Dev',
          dependencies: ['a6'],
          critical: true
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  return {
    projects,
    activities,
    loading,
    setProjects,
    setActivities
  };
};