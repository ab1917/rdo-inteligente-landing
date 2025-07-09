import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { Project } from '@/types';

interface ProjectMetricsProps {
  projects: Project[];
}

export function ProjectMetrics({ projects }: ProjectMetricsProps) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'concluido').length;
  const inProgressProjects = projects.filter(p => p.status === 'em-andamento').length;
  const delayedProjects = projects.filter(p => p.status === 'atrasado').length;
  const plannedProjects = projects.filter(p => p.status === 'planejado').length;

  const averageProgress = totalProjects > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
    : 0;

  const completionRate = totalProjects > 0 
    ? Math.round((completedProjects / totalProjects) * 100)
    : 0;

  const onTimeProjects = projects.filter(p => {
    const today = new Date();
    const endDate = new Date(p.endDate);
    return p.status === 'concluido' || (p.status !== 'atrasado' && endDate >= today);
  }).length;

  const onTimeRate = totalProjects > 0 
    ? Math.round((onTimeProjects / totalProjects) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Projetos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600">{completedProjects} concluídos</span> • 
            <span className="text-blue-600 ml-1">{inProgressProjects} em andamento</span>
          </div>
        </CardContent>
      </Card>

      {/* Progresso Médio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProgress}%</div>
          <Progress value={averageProgress} className="mt-2 h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Média de todos os projetos ativos
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Conclusão */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            +2.3% vs mês anterior
          </div>
        </CardContent>
      </Card>

      {/* Projetos no Prazo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onTimeRate}%</div>
          <div className="flex items-center text-xs mt-1">
            {delayedProjects > 0 ? (
              <>
                <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-600">{delayedProjects} atrasados</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-600">Todos no prazo</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}