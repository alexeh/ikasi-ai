'use client';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
            <h1 className="text-3xl font-headline font-bold">Irakasleen atala</h1>
            <p className="text-muted-foreground mt-2">
                Hemen irakurgaiak kudeatu ahal izango dituzu.
            </p>
        </div>
    );
}
