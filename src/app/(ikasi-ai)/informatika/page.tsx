'use client';
import { useUserRole } from '@/hooks/useUserRole';
import Link from 'next/link';

export default function InformatikaPage() {
  const { role } = useUserRole();
  return (
    <div className="container py-8">
        <div className="flex items-center justify-between">
            <div>
                 <h1 className="text-3xl font-headline font-bold">Informatika</h1>
                <p className="text-muted-foreground mt-2">
                    Hemen Informatikako ariketak aurkituko dituzu.
                </p>
            </div>
        </div>
    </div>
  );
}
