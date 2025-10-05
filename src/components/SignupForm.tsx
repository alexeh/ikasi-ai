// src/components/SignupForm.tsx
'use client';

import { useState } from 'react';
// useRouter no longer needed since we perform full page reload on signup
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SignupForm() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [school, setSchool] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name) {
            toast({ variant: 'destructive', title: 'Datuak falta dira', description: 'Bete derrigorrezko eremuak.' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/students/signup', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    class: studentClass,
                    school: school || undefined,
                    age: age === '' ? undefined : Number(age),
                }),
                credentials: 'include'
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || 'Errorea erregistratzean');
            }

            toast({ title: 'Ongi etorri!', description: 'Erregistroa ondo egin da.' });
            // Force full reload to ensure authentication cookie is applied
            window.location.href = '/euskera';
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Errorea', description: err.message ?? 'Saiatu berriro.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Erregistroa</CardTitle>
                <CardDescription>Zure kontua sortu platforman sartzeko.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Izena</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Pasahitza</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="class">Klasea</Label>
                        <Input id="class" value={studentClass} onChange={e => setStudentClass(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="school">Ikastetxea (aukerakoa)</Label>
                        <Input id="school" value={school} onChange={e => setSchool(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="age">Adina (aukerakoa)</Label>
                        <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))} disabled={isLoading} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Erregistratu'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}