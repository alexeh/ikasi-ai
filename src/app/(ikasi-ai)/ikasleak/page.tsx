'use client';

import * as React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IkasleakPage() {
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();
    
    React.useEffect(() => {
        if (!isRoleLoading && role === 'admin') {
            router.replace('/irakasleak');
        }
    }, [isRoleLoading, role, router]);

    if (isRoleLoading || role === 'admin') {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    // Student view
    return (
        <div className="container flex flex-col h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <h1 className="text-2xl font-bold mt-4">Sarrera debekatua</h1>
            <p className="text-muted-foreground mt-2">
                Orri hau irakasleentzat bakarrik da.
            </p>
            <Button onClick={() => router.push('/')} variant="outline" className="mt-6">
                Itzuli hasierara
            </Button>
        </div>
    );
}
