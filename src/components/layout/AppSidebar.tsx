import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Calculator, 
  Users, 
  BarChart3,
  Settings,
  Building2,
  HardHat,
  Truck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    group: 'main'
  },
  {
    title: 'RDO',
    url: '/rdo',
    icon: FileText,
    group: 'obras'
  },
  {
    title: 'Cronograma',
    url: '/cronograma',
    icon: Calendar,
    group: 'obras'
  },
  {
    title: 'Equipes',
    url: '/equipes',
    icon: HardHat,
    group: 'obras'
  },
  {
    title: 'Funcionários',
    url: '/funcionarios',
    icon: Users,
    group: 'obras'
  },
  {
    title: 'Equipamentos',
    url: '/equipamentos',
    icon: Truck,
    group: 'obras'
  },
  {
    title: 'Orçamentos',
    url: '/orcamentos',
    icon: Calculator,
    group: 'gestao'
  },
  {
    title: 'Boletim de Medição',
    url: '/boletim',
    icon: FileText,
    group: 'obras'
  },
  {
    title: 'CRM',
    url: '/crm',
    icon: Building2,
    group: 'gestao'
  },
  {
    title: 'Financeiro',
    url: '/financeiro',
    icon: BarChart3,
    group: 'gestao'
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
    group: 'gestao'
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
    group: 'sistema'
  }
];

const groupLabels = {
  main: 'Principal',
  obras: 'Gestão de Obras',
  gestao: 'Gestão Empresarial',
  sistema: 'Sistema'
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isCollapsed = state === 'collapsed';

  const getNavClass = (isActive: boolean) => 
    isActive 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50";

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">RDO Inteligente</span>
              <span className="text-xs text-muted-foreground">{user?.company}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {groupLabels[groupKey as keyof typeof groupLabels]}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={getNavClass(isActive)}
                        >
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}