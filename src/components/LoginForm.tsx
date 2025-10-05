'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Mesedez, idatzi zure helbide elektronikoa eta pasahitza.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/students/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Helbide edo pasahitza okerra.');
      }

      toast({ title: 'Ongi etorri!', description: 'Saioa ondo hasi da.' });
      window.location.href = '/euskera';
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Errorea saioa hastean',
        description: error?.message ?? 'Saiatu berriro, mesedez.',
      });
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
            <CardTitle className="text-2xl">Sarrera</CardTitle>
            <CardDescription>
              Idatzi zure helbide elektronikoa eta pasahitza sartzeko.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Helbide elektronikoa</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="zure.izena@aldapeta.eus"
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
              </div>

              <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !email || !password}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sartu'}
              </Button>

              <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => router.push('/signup')}
              >
                Ez daukazu konturik? Erregistratu
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}