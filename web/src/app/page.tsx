import { Suspense } from 'react';
import { DashboardApp } from '@/components/dashboard/DashboardApp';
import { StudentDashboardApp } from '@/components/dashboard/student/StudentDashboardApp';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Render appropriate dashboard based on user role
  if (user.role === 'student') {
    return (
      <Suspense fallback={null}>
        <StudentDashboardApp />
      </Suspense>
    );
  }

  // Default to teacher dashboard for teachers and admins
  return (
    <Suspense fallback={null}>
      <DashboardApp />
    </Suspense>
  );
}