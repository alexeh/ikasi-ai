'use client';

import { FileText, Calendar, Clock, CheckCircle } from 'lucide-react';

// Mock exercises data
const mockExercises = [
  {
    id: '1',
    title: 'Zatikiak: Eragiketak',
    subject: 'Matematika',
    dueDate: '2024-01-15',
    status: 'pending' as const,
    description: 'Zatikien batuketa eta kenketa',
  },
  {
    id: '2',
    title: 'Idatzizko Ulermena',
    subject: 'Euskara',
    dueDate: '2024-01-12',
    status: 'completed' as const,
    description: 'Testu baten ulermena ebaluatu',
  },
  {
    id: '3',
    title: 'Present Continuous',
    subject: 'Ingelesa',
    dueDate: '2024-01-18',
    status: 'pending' as const,
    description: 'Grammar exercises',
  },
  {
    id: '4',
    title: 'Lurraldearen Geografia',
    subject: 'Ingurunea',
    dueDate: '2024-01-10',
    status: 'completed' as const,
    description: 'Euskal Herriko mapak',
  },
  {
    id: '5',
    title: 'Aditzak: Orain Aldia',
    subject: 'Euskara',
    dueDate: '2024-01-20',
    status: 'pending' as const,
    description: 'NOR-NORK aditzak',
  },
];

export function Ariketak() {
  const pendingExercises = mockExercises.filter(ex => ex.status === 'pending');
  const completedExercises = mockExercises.filter(ex => ex.status === 'completed');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <FileText className="h-6 w-6 text-indigo-600" />
          Nire Ariketak
        </h2>
        <p className="mt-1 text-sm text-slate-500">Zure ariketak eta lanak</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Zain</span>
            <div className="rounded-lg bg-amber-100 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{pendingExercises.length}</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Osatuta</span>
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{completedExercises.length}</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Guztira</span>
            <div className="rounded-lg bg-indigo-100 p-2">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{mockExercises.length}</span>
        </div>
      </div>

      {/* Pending Exercises */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Clock className="h-5 w-5 text-amber-600" />
          Egiteko Ariketak
        </h3>
        <div className="space-y-4">
          {pendingExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                      {exercise.subject}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(exercise.dueDate).toLocaleDateString('eu-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                  <h4 className="mb-1 text-lg font-bold text-slate-800">{exercise.title}</h4>
                  <p className="text-sm text-slate-600">{exercise.description}</p>
                </div>
                <button className="ml-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700">
                  Hasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Exercises */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          Osatutako Ariketak
        </h3>
        <div className="space-y-4">
          {completedExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      {exercise.subject}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(exercise.dueDate).toLocaleDateString('eu-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      Osatuta
                    </span>
                  </div>
                  <h4 className="mb-1 text-lg font-bold text-slate-700">{exercise.title}</h4>
                  <p className="text-sm text-slate-600">{exercise.description}</p>
                </div>
                <button className="ml-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                  Ikusi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
