'use client';

import { CalendarClock, MapPin } from 'lucide-react';

import type { ScheduleItem } from '@/types/dashboard';

interface ScheduleWidgetProps {
  schedule: ScheduleItem[];
}

export function DashboardScheduleWidget({ schedule }: ScheduleWidgetProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <CalendarClock className="h-5 w-5 text-indigo-500" />
          Gaurko Ordutegia
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-6">
            {schedule.map((item) => (
              <div key={item.id} className="group relative flex items-center">
                <div className="w-[5.5rem] pr-4 text-right">
                  <span className="block text-xs font-semibold text-slate-500">{item.time.split(' - ')[0]}</span>
                  <span className="block text-[10px] text-slate-400">{item.time.split(' - ')[1]}</span>
                </div>
                <div className="absolute left-[5.5rem] z-10 h-2.5 w-2.5 -translate-x-[5px] rounded-full border-2 border-indigo-400 bg-white transition-transform group-hover:scale-125" />
                <div className={`ml-4 flex-1 rounded-lg border border-transparent p-3 shadow-sm transition-all ${item.color} hover:shadow-md`}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold">{item.subject}</h3>
                    <div className="flex items-center gap-1 rounded bg-white/40 px-1.5 py-0.5 text-[10px] opacity-80">
                      <MapPin className="h-3 w-3" />
                      {item.room}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}