'use client';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';

export default function InformatikaPage() {
  return (
    <div className="container py-8">
        <div className="flex items-center justify-between">
            <div>
                 <h1 className="text-3xl font-headline font-bold">Informatika</h1>
                <p className="text-muted-foreground mt-2">
                    Hemen Informatikako ariketak aurkituko dituzu.
                </p>
            </div>
            <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Estatistikak
            </Button>
        </div>
    </div>
  );
}
