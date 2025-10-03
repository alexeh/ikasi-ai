'use client';

import * as React from 'react';
import Link from 'next/link';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, Calculator, Book, Languages } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formatIdToName = (id: string) => {
    // Replaces all underscores back to dots except the one for the @ symbol
    const email = id.replace(/_/g, '.').replace('aldapeta.eus', '@aldapeta.eus');
    const namePart = email.split('@')[0];
    return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
};

const subjects = [
    { title: 'Matematika', href: '#', icon: <Calculator className="h-6 w-6 text-primary" /> },
    { title: 'Euskera', href: '#', icon: <Book className="h-6 w-6 text-primary" /> },
    { title: 'Gaztelania', href: '#', icon: <Languages className="h-6 w-6 text-primary" /> },
];

export default function StudentStatisticsPage({ params }: { params: { studentId: string } }) {
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();
    
    // The studentId from the URL might be encoded. Let's decode it.
    const decodedStudentId = decodeURIComponent(params.studentId);
    const studentName = formatIdToName(decodedStudentId);

    React.useEffect(() => {
        // Only redirect if loading is finished and the role is explicitly not admin.
        if (!isRoleLoading && role !== 'admin') {
            router.push('/');
        }
    }, [role, isRoleLoading, router]);

    // Show a loading spinner while the role is being verified.
    // This prevents the premature redirect.
    if (isRoleLoading || role !== 'admin') {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-headline font-bold">
                {studentName} ikaslearen estatistikak
            </h1>
            <p className="mt-2 text-muted-foreground">
                Aukeratu irakasgai bat bere aurrerapena ikusteko.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                    <Link href={`${subject.href}/${params.studentId}`} key={subject.title}>
                        <Card className="flex h-full transform-gpu flex-col justify-between transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {subject.icon}
                                        <CardTitle>{subject.title}</CardTitle>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
