import { Suspense } from 'react';
import { DashboardApp } from '@/components/dashboard/DashboardApp';

export default function Home() {
  return (
      <Suspense fallback={null}>
        <DashboardApp />
      </Suspense>
  );
}