'use client';

import { BookOpen, Book, Calculator, Languages, Globe } from 'lucide-react';

type Subject = {
  name: string;
  icon: typeof BookOpen;
  color: string;
  description: string;
  progress: number;
  topics: number;
};

const subjects: Subject[] = [
  {
    name: 'Matematika',
    icon: Calculator,
    color: 'bg-indigo-100 text-indigo-700',
    description: 'Aritmetika, Geometria, Neurriak',
    progress: 75,
    topics: 12,
  },
  {
    name: 'Euskara',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700',
    description: 'Ulermena, Gramatika, Idazmena',
    progress: 82,
    topics: 10,
  },
  {
    name: 'Ingelesa',
    icon: Languages,
    color: 'bg-purple-100 text-purple-700',
    description: 'Grammar, Writing, Vocabulary',
    progress: 88,
    topics: 9,
  },
  {
    name: 'Ingurunea',
    icon: Globe,
    color: 'bg-blue-100 text-blue-700',
    description: 'Geografia, Historia, Zientziak',
    progress: 70,
    topics: 15,
  },
  {
    name: 'Gaztelera',
    icon: Book,
    color: 'bg-orange-100 text-orange-700',
    description: 'Comprensión, Gramática, Redacción',
    progress: 65,
    topics: 8,
  },
];

export function Ikasgaiak() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          Nire Ikasgaiak
        </h2>
        <p className="mt-1 text-sm text-slate-500">Zure irakasgaiak eta baliabideak</p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <button
              key={subject.name}
              className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg p-3 transition-transform group-hover:scale-110 ${subject.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {subject.topics} gaiak
                </span>
              </div>
              
              <h3 className="mb-2 text-xl font-bold text-slate-800">{subject.name}</h3>
              <p className="mb-4 text-sm text-slate-600">{subject.description}</p>
              
              <div className="mt-auto">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">Aurrerakuntza</span>
                  <span className="font-bold text-slate-800">{subject.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Resources Section */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Book className="h-5 w-5 text-indigo-600" />
          Baliabide Osagarriak
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Book className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Liburutegia</h4>
                <p className="text-sm text-slate-500">Irakurgaiak eta material osagarria</p>
              </div>
            </div>
            <span className="text-sm font-medium text-indigo-600">Ireki →</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Online Baliabideak</h4>
                <p className="text-sm text-slate-500">Web orriak eta bideoak</p>
              </div>
            </div>
            <span className="text-sm font-medium text-indigo-600">Ireki →</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Praktika Ariketak</h4>
                <p className="text-sm text-slate-500">Ariketak gehigarriak</p>
              </div>
            </div>
            <span className="text-sm font-medium text-indigo-600">Ireki →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
