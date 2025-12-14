'use client';

import { TrendingUp, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';

interface StatsCardProps {
  grade: number;
}

export function DashboardStatsCard({ grade }: StatsCardProps) {
  const data = [
    { name: 'Aste 1', value: 6.5 },
    { name: 'Aste 2', value: 7.2 },
    { name: 'Aste 3', value: 6.8 },
    { name: 'Aste 4', value: grade },
  ];

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-50 opacity-50" />
      <div className="relative z-10 mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Klaseko Batez Bestekoa</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{grade.toFixed(1)}</span>
            <span className="flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.4
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
          <Award className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-auto h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="value" fill="#6366f1" barSize={20} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}