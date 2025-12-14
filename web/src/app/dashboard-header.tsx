'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Dices,
  Pause,
  Play,
  RefreshCw,
  Search,
  Timer,
  Users,
  Wrench,
  X,
} from 'lucide-react';

import type { ClassGroup, Student } from './dashboard-types';

interface HeaderProps {
  classes: ClassGroup[];
  selectedClassId: string;
  onSelectClass: (id: string) => void;
  title?: string;
}

type Tool = 'menu' | 'timer' | 'random' | 'groups';

export function DashboardHeader({ classes, selectedClassId, onSelectClass, title = 'Arbela' }: HeaderProps) {
  const currentClass = classes.find((c) => c.id === selectedClassId) ?? classes[0];
  const [showTools, setShowTools] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('menu');
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [randomStudent, setRandomStudent] = useState<Student | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [groups, setGroups] = useState<Student[][]>([]);
  const [groupSize, setGroupSize] = useState(3);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowTools(false);
        setActiveTool('menu');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isTimerRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimerSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pickRandomStudent = () => {
    setIsRandomizing(true);
    setRandomStudent(null);
    let count = 0;

    const interval = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * currentClass.students.length);
      setRandomStudent(currentClass.students[randomIndex]);
      count += 1;

      if (count > 10) {
        window.clearInterval(interval);
        setIsRandomizing(false);
      }
    }, 100);
  };

  const makeGroups = () => {
    const shuffled = [...currentClass.students].sort(() => 0.5 - Math.random());
    const newGroups: Student[][] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push(shuffled.slice(i, i + groupSize));
    }
    setGroups(newGroups);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'timer':
        return (
          <div className="p-4 text-center">
            <h3 className="mb-4 font-bold text-slate-700">Kronometroa</h3>
            <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 py-4 text-4xl font-bold text-indigo-600">
              {formatTime(timerSeconds)}
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning((value) => !value)}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-all active:scale-95 ${
                  isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(300);
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2">
              {[60, 180, 300, 600].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setTimerSeconds(sec);
                    setIsTimerRunning(false);
                  }}
                  className="rounded bg-slate-100 py-1 text-xs transition-colors hover:bg-slate-200"
                >
                  {sec / 60}m
                </button>
              ))}
            </div>
          </div>
        );
      case 'random':
        return (
          <div className="p-4 text-center">
            <h3 className="mb-4 font-bold text-slate-700">Ausazko Ikaslea</h3>
            <div className="mb-4 flex h-32 items-center justify-center">
              {randomStudent ? (
                <div className={`transition-all duration-300 ${isRandomizing ? 'scale-90 opacity-70' : 'scale-110 opacity-100'}`}>
                  <img
                    src={
                      randomStudent.photoUrl ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(randomStudent.name)}&background=random`
                    }
                    alt={randomStudent.name}
                    className="mx-auto mb-3 h-20 w-20 rounded-full border-4 border-indigo-100 object-cover shadow-sm"
                  />
                  <p className="text-lg font-bold text-slate-800">{randomStudent.name}</p>
                </div>
              ) : (
                <p className="text-slate-400">Sakatu botoia ikasle bat aukeratzeko</p>
              )}
            </div>
            <button
              onClick={pickRandomStudent}
              disabled={isRandomizing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              <Dices className="h-5 w-5" />
              Aukeratu
            </button>
          </div>
        );
      case 'groups':
        return (
          <div className="p-4">
            <h3 className="mb-4 text-center font-bold text-slate-700">Talde Sortzailea</h3>
            {groups.length === 0 ? (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setGroupSize((value) => Math.max(2, value - 1))}
                    className="h-8 w-8 rounded-full bg-slate-100 font-bold transition-colors hover:bg-slate-200"
                  >
                    -
                  </button>
                  <div>
                    <span className="block text-2xl font-bold text-indigo-600">{groupSize}</span>
                    <span className="text-xs text-slate-500">ikasle taldeko</span>
                  </div>
                  <button
                    onClick={() => setGroupSize((value) => Math.min(10, value + 1))}
                    className="h-8 w-8 rounded-full bg-slate-100 font-bold transition-colors hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={makeGroups}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  <Users className="h-5 w-5" />
                  Taldeak Sortu
                </button>
              </div>
            ) : (
              <div className="max-h-60 space-y-3 overflow-y-auto">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {groups.length} Talde sortuta
                  </span>
                  <button onClick={() => setGroups([])} className="text-xs text-indigo-600 hover:underline">
                    Berregin
                  </button>
                </div>
                {groups.map((group, index) => (
                  <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                    <span className="mb-1 block font-bold text-indigo-600">Taldea {index + 1}</span>
                    {group.map((student) => student.name).join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 gap-1 p-2">
            <button
              onClick={() => setActiveTool('timer')}
              className="group flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50"
            >
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600 transition-transform group-hover:scale-110">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-700">Kronometroa</p>
                <p className="text-xs text-slate-500">Atzerako kontua</p>
              </div>
            </button>
            <button
              onClick={() => setActiveTool('random')}
              className="group flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50"
            >
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600 transition-transform group-hover:scale-110">
                <Dices className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-700">Ausazkoa</p>
                <p className="text-xs text-slate-500">Ikasle bat aukeratu</p>
              </div>
            </button>
            <button
              onClick={() => setActiveTool('groups')}
              className="group flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50"
            >
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-transform group-hover:scale-110">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-700">Taldeak</p>
                <p className="text-xs text-slate-500">Sortu taldeak azkar</p>
              </div>
            </button>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex h-full items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden items-center md:flex">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Bilatu..."
              className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="mx-1 h-6 w-px bg-slate-200" />
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => {
                setShowTools((value) => !value);
                setActiveTool('menu');
              }}
              className={`flex items-center gap-2 rounded-full border p-2 transition-colors ${
                showTools
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                  : 'border-transparent bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Wrench className="h-5 w-5" />
            </button>
            {showTools && (
              <div className="animate-in fade-in zoom-in-95 absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl">
                {activeTool !== 'menu' && (
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
                    <button onClick={() => setActiveTool('menu')} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                      ← Atzera
                    </button>
                    <button onClick={() => setShowTools(false)} className="text-slate-400 transition-colors hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {renderToolContent()}
              </div>
            )}
          </div>
          <div className="group relative">
            <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 transition-all hover:border-indigo-300 hover:shadow-sm">
              <span className="min-w-[140px] text-sm font-medium text-slate-700">{currentClass.name}</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
            <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-full mt-1 hidden w-64 rounded-lg border border-slate-100 bg-white shadow-xl group-hover:block">
              <div className="py-1">
                {classes.map((current) => (
                  <button
                    key={current.id}
                    onClick={() => onSelectClass(current.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                      selectedClassId === current.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'
                    }`}
                  >
                    {current.name}
                    {selectedClassId === current.id && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}