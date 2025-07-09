import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { RDOList, CreateRDO } from "./pages/rdo";
import { BudgetList } from "./pages/budgets";
import { EquipeList, FuncionarioList, EquipamentoList } from "./pages/equipes";
import { CRMDashboard, LeadsList, OportunidadesList, ClientesList } from "./pages/crm";
import { CronogramaList } from "./pages/cronograma";
import { BoletimList, CreateBoletim, BoletimDetail } from "./pages/boletim";
import { FinanceiroDashboard } from "./pages/financeiro";
import { SuperAdminDashboard } from "./pages/super-admin/Dashboard";
import { SuperAdminCompanies } from "./pages/super-admin/Companies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/rdo" element={
              <ProtectedRoute>
                <AppLayout>
                  <RDOList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/rdo/criar" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateRDO />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/orcamentos" element={
              <ProtectedRoute>
                <AppLayout>
                  <BudgetList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/equipes" element={
              <ProtectedRoute>
                <AppLayout>
                  <EquipeList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/funcionarios" element={
              <ProtectedRoute>
                <AppLayout>
                  <FuncionarioList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/equipamentos" element={
              <ProtectedRoute>
                <AppLayout>
                  <EquipamentoList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/crm" element={
              <ProtectedRoute>
                <AppLayout>
                  <CRMDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads" element={
              <ProtectedRoute>
                <AppLayout>
                  <LeadsList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/oportunidades" element={
              <ProtectedRoute>
                <AppLayout>
                  <OportunidadesList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/clientes" element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientesList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/cronograma" element={
              <ProtectedRoute>
                <AppLayout>
                  <CronogramaList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/boletim" element={
              <ProtectedRoute>
                <AppLayout>
                  <BoletimList />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/boletim/criar" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateBoletim />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/boletim/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <BoletimDetail />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/financeiro" element={
              <ProtectedRoute>
                <AppLayout>
                  <FinanceiroDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/super-admin" element={
              <ProtectedRoute>
                <AppLayout>
                  <SuperAdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/super-admin/companies" element={
              <ProtectedRoute>
                <AppLayout>
                  <SuperAdminCompanies />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
