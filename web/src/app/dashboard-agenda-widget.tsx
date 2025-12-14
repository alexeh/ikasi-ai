'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ListTodo, Plus } from 'lucide-react';

import type { TaskItem } from './dashboard-types';

interface AgendaWidgetProps {
  tasks: TaskItem[];
}

const CATEGORY_STYLES: Record<TaskItem['category'], string> = {
  event: 'border-purple-200 bg-purple-100 text-purple-700',
  coordination: 'border-amber-200 bg-amber-100 text-amber-700',
  work: 'border-blue-200 bg-blue-100 text-blue-700',
};

const CATEGORY_LABELS: Record<TaskItem['category'], string> = {
  event: 'Ekitaldia',
  coordination: 'Kudeaketa',
  work: 'Lana',
};

export function DashboardAgendaWidget({ tasks: initialTasks }: AgendaWidgetProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const completion = useMemo(() => {
    const total = tasks.length;
    if (total === 0) return 0;
    const done = tasks.filter((task) => task.completed).length;
    return Math.round((done / total) * 100);
  }, [tasks]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <ListTodo className="h-5 w-5 text-indigo-500" />
          Agenda eta Egitekoak
        </h2>
        <button className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {tasks.map((task) => (
            <button
              type="button"
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition-all ${
                task.completed ? 'bg-slate-50 opacity-60' : 'hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm'
              }`}
            >
              <span className="mt-0.5 flex-shrink-0 text-slate-400 transition-colors group-hover:text-indigo-500">
                {task.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium transition-all ${
                    task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'
                  }`}
                >
                  {task.text}
                </p>
                <span
                  className={`mt-1.5 inline-block rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    CATEGORY_STYLES[task.category]
                  }`}
                >
                  {CATEGORY_LABELS[task.category]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 p-4">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500">
          <span>Aurrerapena</span>
          <span>{completion}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${completion}%` }} />
        </div>
      </div>
    </div>
  );
}