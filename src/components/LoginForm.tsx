'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const users = [
  'jarambarri@aldapeta.eus',
  'alejandro.hernandez@aldapeta.eus',
  'alma.ruizdearcaute@aldapeta.eus',
  'amets.olaizola@aldapeta.eus',
  'daniel.irazusta@aldapeta.eus',
  'diego.valcarce@aldapeta.eus',
  'elia.virto@aldapeta.eus',
  'julen.povieda@aldapeta.eus',
  'lola.altolaguirre@aldapeta.eus',
  'lucia.benali@aldapeta.eus',
  'lucia.manzano@aldapeta.eus',
  'luis.oliveira@aldapeta.eus',
  'lukas.usarraga@aldapeta.eus',
  'manuela.demora@aldapeta.eus',
  'marina.ortuzar@aldapeta.eus',
  'martin.aizpurua@aldapeta.eus',
  'martin.ceceaga@aldapeta.eus',
  'martin.contreras@aldapeta.eus',
  'martin.cuenca@aldapeta.eus',
  'martin.garcia@aldapeta.eus',
  'martin.iturralde@aldapeta.eus',
  'oto.fermin@aldapeta.eus',
  'sara.padilla@aldapeta.eus',
  'simon.fernandez@aldapeta.eus',
];

export function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Mesedez, aukeratu erabiltzaile bat.",
        });
        return;
    }
    setIsLoading(true);
    try {
      // We simulate a login by creating a session tied to the selected email.
      // In a real app, you would use a proper auth method.
      localStorage.setItem('simulated_user', selectedUser);
      await signInAnonymously(auth);
      router.push('/euskera');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Errore bat gertatu da saioa hastean',
        description: 'Saiatu berriro, mesedez.',
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
            Aukeratu zure izena zerrendan sartzeko.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-select">Erabiltzailea</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser} disabled={isLoading}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Aukeratu zure erabiltzailea" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !selectedUser}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Sartu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
