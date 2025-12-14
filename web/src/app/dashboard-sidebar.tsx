'use client';

import { BookOpen, Calendar, GraduationCap, LayoutDashboard, LogOut, MessageSquare, Settings, Users } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Arbela', icon: LayoutDashboard },
  { id: 'subjects', label: 'Ikasgaiak', icon: BookOpen },
  { id: 'students', label: 'Ikasleak', icon: Users },
  { id: 'calendar', label: 'Egutegia', icon: Calendar },
  { id: 'meetings', label: 'Bilerak', icon: MessageSquare },
  { id: 'settings', label: 'Ezarpenak', icon: Settings },
];

export function DashboardSidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex-shrink-0 rounded-lg bg-indigo-600 p-1.5">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-800">IrakasleArbel</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 bg-slate-50/50 p-4">
        <button className="mb-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-rose-600">
          <LogOut className="h-4 w-4" />
          <span>Saioa itxi</span>
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-xs font-bold text-indigo-700 shadow-sm">
            IR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700">Irakaslea</p>
            <p className="truncate text-xs text-slate-500">irakaslea@eskola.eus</p>
          </div>
        </div>
      </div>
    </div>
  );
}