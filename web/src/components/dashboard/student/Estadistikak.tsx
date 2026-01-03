'use client';

import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Mock data for exercises completed vs total
const exerciseData = [
  { subject: 'Matematika', completed: 12, total: 15 },
  { subject: 'Euskara', completed: 8, total: 10 },
  { subject: 'Ingelesa', completed: 15, total: 18 },
  { subject: 'Ingurunea', completed: 10, total: 12 },
  { subject: 'Gaztelera', completed: 6, total: 8 },
];

// Mock data for category achievements (pie chart)
const categoryData = [
  { name: 'Oso Ondo', value: 45, color: '#10b981' },
  { name: 'Ondo', value: 30, color: '#3b82f6' },
  { name: 'Nahikoa', value: 15, color: '#f59e0b' },
  { name: 'Hobetu', value: 10, color: '#f43f5e' },
];

// Mock data for weekly performance
const performanceData = [
  { day: 'Al', score: 7.5 },
  { day: 'Ar', score: 8.0 },
  { day: 'Az', score: 7.8 },
  { day: 'Og', score: 8.5 },
  { day: 'Ol', score: 8.2 },
  { day: 'Lr', score: 9.0 },
  { day: 'Ig', score: 7.5 },
];

export function Estadistikak() {
  // Calculate total stats
  const totalCompleted = exerciseData.reduce((sum, item) => sum + item.completed, 0);
  const totalExercises = exerciseData.reduce((sum, item) => sum + item.total, 0);
  const completionRate = Math.round((totalCompleted / totalExercises) * 100);
  const averageScore = (performanceData.reduce((sum, item) => sum + item.score, 0) / performanceData.length).toFixed(1);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          Nire Estatistikak
        </h2>
        <p className="mt-1 text-sm text-slate-500">Zure jarraipena eta aurrerapena ikusi</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Ariketak Osatuta</span>
            <div className="rounded-lg bg-indigo-100 p-2">
              <Target className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">{totalCompleted}</span>
            <span className="mb-1 text-sm text-slate-500">/ {totalExercises}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Osatze Tasa</span>
            <div className="rounded-lg bg-emerald-100 p-2">
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">{completionRate}%</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {completionRate >= 80 ? 'Bikain!' : completionRate >= 60 ? 'Ondo zoaz!' : 'Jarraitu lanean!'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Batez Besteko Nota</span>
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">{averageScore}</span>
            <span className="mb-1 text-sm text-slate-500">/ 10</span>
          </div>
          <p className="mt-2 text-xs text-emerald-600">▲ 0.5 azken astean</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Sari Puntuak</span>
            <div className="rounded-lg bg-amber-100 p-2">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">250</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">+25 azken astean</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart - Exercises Completed vs Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Ariketak Ikasgaika
          </h3>
          <p className="mb-4 text-sm text-slate-500">Osatutako ariketak vs guztizko ariketak</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="subject" 
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#6366f1" name="Osatuta" radius={[8, 8, 0, 0]} />
                <Bar dataKey="total" fill="#cbd5e1" name="Guztira" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Category Achievements */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
            <Award className="h-5 w-5 text-emerald-600" />
            Emaitzen Banaketa
          </h3>
          <p className="mb-4 text-sm text-slate-500">Nola banatzen dira zure kalifikazioak</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart - Weekly Performance */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Asteko Jarduera
        </h3>
        <p className="mb-4 text-sm text-slate-500">Zure eguneko jarduera eta errendimendua</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                name="Nota"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
