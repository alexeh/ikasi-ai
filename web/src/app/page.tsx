import { Suspense } from 'react';
import { DashboardApp } from './DashboardApp';

export default function Home() {
  return (
      <Suspense fallback={null}>
        <DashboardApp />
      </Suspense>
  );
}