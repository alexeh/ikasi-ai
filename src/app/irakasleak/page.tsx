'use client';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function IrakasleakPage() {
    const { role, isLoading } = useUserRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== 'admin') {
            router.push('/euskera');
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
                        Hemen irakurgaiak kudeatu ahal izango dituzu.
                    </p>
                </div>
                 <Button asChild>
                    <Link href="/irakasleak/gehitu">
                        <PlusCircle />
                        Gehitu dokumentua
                    </Link>
                </Button>
            </div>
            {/* Aquí iría la lista de documentos existentes para editarlos o borrarlos */}
        </div>
    );
}
