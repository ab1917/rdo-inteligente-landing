import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Filter, BarChart3 } from 'lucide-react';
import { GanttView } from '@/components/cronograma/GanttView';
import { CreateProjectDialog } from '@/components/cronograma/CreateProjectDialog';
import { ProjectMetrics } from '@/components/cronograma/ProjectMetrics';
import { useProjectData } from '@/hooks/useProjectData';

export function CronogramaList() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'gantt' | 'list'>('gantt');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { projects, activities, loading } = useProjectData();

  const getStatusBadge = (status: string) => {
    const variants = {
      'planejado': 'secondary',
      'em-andamento': 'default',
      'atrasado': 'destructive',
      'concluido': 'success'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const filteredProjects = selectedProject === 'all' 
    ? projects 
    : projects.filter(p => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cronograma de Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie cronogramas, atividades e marcos dos projetos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <ProjectMetrics projects={projects} />

      {/* Filtros e Controles */}
      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecionar projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Projetos</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="ml-auto">
          <TabsList>
            <TabsTrigger value="gantt">
              <BarChart3 className="w-4 h-4 mr-2" />
              Gantt
            </TabsTrigger>
            <TabsTrigger value="list">
              <Calendar className="w-4 h-4 mr-2" />
              Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-6">
        {viewMode === 'gantt' ? (
          <GanttView projects={filteredProjects} activities={activities} />
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {project.name}
                        {getStatusBadge(project.status)}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.startDate).toLocaleDateString('pt-BR')} - {new Date(project.endDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {project.duration} dias
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progresso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{activities.filter(a => a.projectId === project.id && a.status === 'concluido').length} Concluídas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{activities.filter(a => a.projectId === project.id && a.status === 'em-andamento').length} Em Andamento</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span>{activities.filter(a => a.projectId === project.id && a.status === 'atrasado').length} Atrasadas</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}