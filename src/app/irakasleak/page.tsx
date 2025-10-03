'use client';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, PlusCircle, BarChart, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function IrakasleakPage() {
    const { role, isLoading } = useUserRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== 'admin') {
            router.push('/');
        }
    }, [role, isLoading, router]);

    if (isLoading || role !== 'admin') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="container py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Irakasleen atala</h1>
                    <p className="text-muted-foreground mt-2">
                        Hemen ikasleen aurrerapena kudeatu eta ikus dezakezu.
                    </p>
                </div>
            </div>
            
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Ikasleak</CardTitle>
                        <CardDescription>Ikusi zure ikasleen zerrenda eta haien estatistikak.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/irakasleak/ikasleak">
                                <Users className="mr-2 h-4 w-4" />
                                Ikusi ikasleak
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Edukia kudeatu</CardTitle>
                        <CardDescription>Gehitu irakurgai berriak ikasleentzat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/irakasleak/gehitu">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Gehitu dokumentua
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Estatistikak ikusi</CardTitle>
                        <CardDescription>Ikusi ikasleen emaitzak eta progresioa.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2">
                         <Button asChild variant="outline">
                            <Link href="/irakasleak/estatistikak">
                                <BarChart className="mr-2 h-4 w-4" />
                                Kalkulu Mentalaren estatistikak
                            </Link>
                        </Button>
                        {/* Aquí se podrían añadir más botones para otras estadísticas */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
