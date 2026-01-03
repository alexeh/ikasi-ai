'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentSidebar } from './StudentSidebar';
import { Estadistikak } from './Estadistikak';
import { Ariketak } from './Ariketak';
import { Ikasgaiak } from './Ikasgaiak';
import { Settings } from 'lucide-react';

const VALID_VIEWS = new Set(['estadistikak', 'ariketak', 'ikasgaiak', 'settings']);

export function StudentDashboardApp() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState(() => {
    const paramView = searchParams.get('view');
    // Default to estadistikak for students
    return paramView && VALID_VIEWS.has(paramView) ? paramView : 'estadistikak';
  });

  const handleNavigate = (view: string) => {
    const targetView = VALID_VIEWS.has(view) ? view : 'estadistikak';
    setCurrentView(targetView);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (targetView === 'estadistikak') {
        params.delete('view');
      } else {
        params.set('view', targetView);
      }
      const query = params.toString();
      const newUrl = query ? `/?${query}` : '/';
      window.history.replaceState({}, '', newUrl);
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'estadistikak':
        return 'Estadistikak';
      case 'ariketak':
        return 'Ariketak';
      case 'ikasgaiak':
        return 'Ikasgaiak';
      case 'settings':
        return 'Ezarpenak';
      default:
        return 'Estadistikak';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <StudentSidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="ml-64 flex h-full flex-1 flex-col transition-all duration-300">
        {/* Simple Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-bold text-slate-800">{getViewTitle()}</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentView === 'estadistikak' && <Estadistikak />}
          {currentView === 'ariketak' && <Ariketak />}
          {currentView === 'ikasgaiak' && <Ikasgaiak />}
          {currentView === 'settings' && (
            <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400">
              <Settings className="mb-4 h-16 w-16 opacity-20" />
              <h3 className="text-xl font-bold text-slate-500">Ezarpenak</h3>
              <p className="text-sm">Atal hau garatzen ari da...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
