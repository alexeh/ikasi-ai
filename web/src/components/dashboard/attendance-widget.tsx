'use client';

import { useMemo, useState } from 'react';
import { Check, Clock, Users, X, ArrowDownAZ } from 'lucide-react';

import type { Student } from '@/types/dashboard';

interface AttendanceWidgetProps {
  students: Student[];
}

export function DashboardAttendanceWidget({ students: initialStudents }: AttendanceWidgetProps) {
  const sortBySurname = (students: Student[]) =>
    [...students].sort((a, b) => {
      const surnameA = a.name.split(' ').slice(-1)[0];
      const surnameB = b.name.split(' ').slice(-1)[0];
      return surnameA.localeCompare(surnameB);
    });

  const [studentStates, setStudentStates] = useState<Student[]>(() => sortBySurname(initialStudents));


  const updateStatus = (id: string, status: Student['status']) => {
    setStudentStates((prev) => prev.map((student) => (student.id === id ? { ...student, status } : student)));
  };

  const stats = useMemo(
    () => ({
      present: studentStates.filter((student) => student.status === 'present').length,
      absent: studentStates.filter((student) => student.status === 'absent').length,
      late: studentStates.filter((student) => student.status === 'late').length,
    }),
    [studentStates],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Users className="h-5 w-5 text-indigo-500" />
            Asistentzia
          </h2>
          <span className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <ArrowDownAZ className="h-3 w-3" />
            A-Z
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-center">
            <div className="text-lg font-bold text-emerald-700">{stats.present}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Bertan</div>
          </div>
          <div className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-center">
            <div className="text-lg font-bold text-rose-700">{stats.absent}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-rose-600">Falta</div>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-center">
            <div className="text-lg font-bold text-amber-700">{stats.late}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Berandu</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Ikaslea</th>
              <th className="px-4 py-3 text-right">Egoera</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studentStates.map((student) => (
              <tr key={student.id} className="group transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                      alt={student.name}
                      className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                    />
                    <span className="font-medium text-slate-700">{student.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => updateStatus(student.id, 'present')}
                      className={`rounded-md p-1.5 transition-all ${
                        student.status === 'present'
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200'
                          : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                      }`}
                      title="Bertan"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(student.id, 'late')}
                      className={`rounded-md p-1.5 transition-all ${
                        student.status === 'late'
                          ? 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200'
                          : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                      }`}
                      title="Berandu"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(student.id, 'absent')}
                      className={`rounded-md p-1.5 transition-all ${
                        student.status === 'absent'
                          ? 'bg-rose-100 text-rose-700 shadow-sm ring-1 ring-rose-200'
                          : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                      }`}
                      title="Falta"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}