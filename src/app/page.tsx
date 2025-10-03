import { Header } from '@/components/header';
import { SyncDashboard } from '@/components/sync-dashboard';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <SyncDashboard />
      </main>
    </div>
  );
}
