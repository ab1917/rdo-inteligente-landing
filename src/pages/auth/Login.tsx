import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { checkSupabaseConnectivity, type ConnectivityResult } from '@/lib/supabase';
import { Loader2, Building2, Copy, Check, WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';

const DEMO_USERS = [
  { role: 'Admin', email: 'admin@construtorademo.com.br', password: '123456' },
  { role: 'Gestor', email: 'gestor@construtorademo.com.br', password: '123456' },
  { role: 'Engenheiro', email: 'engenheiro@construtorademo.com.br', password: '123456' },
];

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [connectivity, setConnectivity] = useState<ConnectivityResult | null>(null);
  const [checking, setChecking] = useState(true);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const runConnectivityCheck = useCallback(async () => {
    setChecking(true);
    const result = await checkSupabaseConnectivity();
    setConnectivity(result);
    setChecking(false);
    return result;
  }, []);

  useEffect(() => {
    runConnectivityCheck();
  }, [runConnectivityCheck]);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const fillCredentials = (u: typeof DEMO_USERS[number]) => {
    setEmail(u.email);
    setPassword(u.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para continuar.",
        variant: "destructive"
      });
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao RDO Inteligente"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro no login",
        description: result.message ?? "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">RDO Inteligente</CardTitle>
          <CardDescription>
            Acesse sua conta para gerenciar suas obras
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            
            <div className="w-full border-t pt-4 space-y-3">
              <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Contas de teste</p>
                <div className="space-y-1.5">
                  {DEMO_USERS.map((u) => (
                    <div
                      key={u.email}
                      className="flex items-center justify-between gap-2 rounded bg-background/60 px-2 py-1.5 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground">{u.role}</div>
                        <div className="truncate text-muted-foreground">{u.email}</div>
                        <div className="text-muted-foreground">Senha: {u.password}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => fillCredentials(u)}
                        >
                          Usar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(u.email, u.email)}
                          title="Copiar email"
                        >
                          {copied === u.email ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Execute <code>src/migrations/demo_users.sql</code> no Supabase caso ainda não tenha criado essas contas.
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Cadastre-se aqui
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};