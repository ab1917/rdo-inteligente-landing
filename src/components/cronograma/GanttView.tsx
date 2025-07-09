import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, Users, AlertTriangle, Plus } from 'lucide-react';
import { Project, Activity } from '@/types';

interface GanttViewProps {
  projects: Project[];
  activities: Activity[];
}

export function GanttView({ projects, activities }: GanttViewProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>('week');

  // Calcular escala de tempo
  const getTimeScale = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 90);

    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + (timeScale === 'day' ? 1 : timeScale === 'week' ? 7 : 30));
    }
    
    return days;
  };

  const timePoints = getTimeScale();

  const getActivityPosition = (activity: Activity) => {
    const start = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    const totalDays = timePoints.length * (timeScale === 'day' ? 1 : timeScale === 'week' ? 7 : 30);
    const activityStart = Math.max(0, (start.getTime() - timePoints[0].getTime()) / (1000 * 60 * 60 * 24));
    const activityDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    
    return {
      left: `${(activityStart / totalDays) * 100}%`,
      width: `${(activityDuration / totalDays) * 100}%`
    };
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planejado': 'bg-gray-400',
      'em-andamento': 'bg-blue-500',
      'atrasado': 'bg-red-500',
      'concluido': 'bg-green-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="space-y-4">
      {/* Controles da Visualização */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Cronograma Gantt</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={timeScale === 'day' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeScale('day')}
              >
                Dias
              </Button>
              <Button 
                variant={timeScale === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeScale('week')}
              >
                Semanas
              </Button>
              <Button 
                variant={timeScale === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeScale('month')}
              >
                Meses
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualização Gantt */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header da Timeline */}
              <div className="border-b bg-muted/50">
                <div className="flex">
                  <div className="w-80 p-4 border-r font-medium">Atividades</div>
                  <div className="flex-1 p-2">
                    <div className="flex">
                      {timePoints.map((date, index) => (
                        <div 
                          key={index} 
                          className="flex-1 text-center text-xs font-medium border-r last:border-r-0 p-2"
                        >
                          {timeScale === 'day' 
                            ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                            : timeScale === 'week'
                            ? `Sem ${Math.ceil(date.getDate() / 7)}`
                            : date.toLocaleDateString('pt-BR', { month: 'short' })
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Linhas do Gantt */}
              <ScrollArea className="h-[600px]">
                {projects.map((project) => {
                  const projectActivities = activities.filter(a => a.projectId === project.id);
                  
                  return (
                    <div key={project.id} className="border-b">
                      {/* Linha do Projeto */}
                      <div className="flex bg-muted/30">
                        <div className="w-80 p-3 border-r">
                          <div className="font-semibold text-sm">{project.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(project.startDate).toLocaleDateString('pt-BR')} - {new Date(project.endDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="flex-1 p-3 relative">
                          <div className="h-6 bg-muted rounded relative">
                            <div 
                              className={`h-full rounded ${getStatusColor(project.status)}`}
                              style={{ width: `${project.progress}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Linhas das Atividades */}
                      {projectActivities.map((activity) => (
                        <div key={activity.id} className="flex hover:bg-muted/50 cursor-pointer">
                          <div className="w-80 p-3 border-r">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{activity.name}</div>
                              <Badge variant="outline" className="text-xs">
                                {activity.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.duration}d
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {activity.assignedTeam}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-3 relative">
                            <div 
                              className={`h-4 rounded ${getStatusColor(activity.status)} opacity-80 hover:opacity-100`}
                              style={getActivityPosition(activity)}
                              onClick={() => setSelectedActivity(activity)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded" />
                <span>Planejado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Em Andamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Atrasado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Concluído</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova Atividade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}