'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const auth = useAuth();
  const [email, setEmail] = useState('jarambarri@aldapeta.eus');
  const [password, setPassword] = useState('ykakb907d3513PWA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The redirect is handled by the page component
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: "El usuario o la contraseña no son correctos.",
      })
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="mb-8 text-center">
         <GraduationCap className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Ongi etorri Ikasgelara!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Hasi saioa zure lana ikusteko.
        </p>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Saioa hasi</CardTitle>
          <CardDescription>
            Sartu zure helbide elektronikoa eta pasahitza.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Pasahitza</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Sartu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
