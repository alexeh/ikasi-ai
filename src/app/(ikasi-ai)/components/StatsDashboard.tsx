// ----- Client Component: interacción, filtros y gráficas SVG -----
"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import {Attempt, Student, TopicMeta} from "../estadistikak/page";

const fmtPerc = (v: number) => `${(v * 100).toFixed(0)}%`;
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

export function DashboardClient({
                             attempts,
                             topics,
                             students,
                             selectedStudentId,
                         }: {
    attempts: any[];
    topics: any[];
    students: any[];
    selectedStudentId?: string;
}) {
    const router = useRouter();
    const sp = useSearchParams();
    const [, startTransition] = useTransition();

    // Filtrado por alumno (si hay selección)
    const filtered = useMemo(() => {
        return selectedStudentId
            ? attempts.filter((a) => a.studentId === selectedStudentId)
            : attempts;
    }, [attempts, selectedStudentId]);

    // KPIs
    const kpis = useMemo(() => {
        const total = filtered.length;
        const correct = filtered.filter((a) => a.isCorrect).length;
        const acc = total ? correct / total : 0;
        const art = avg(filtered.map((a) => a.responseTimeMs));
        return { total, correct, wrong: total - correct, accuracy: acc, avgResponseTimeMs: art };
    }, [filtered]);

    // Series por día (accuracy over time)
    const byDay = useMemo(() => {
        const bucket = new Map<
            string,
            { total: number; correct: number; avgRt: number; sumRt: number }
        >();
        for (const a of filtered) {
            const day = a.attemptedAt.slice(0, 10); // YYYY-MM-DD
            const row = bucket.get(day) ?? { total: 0, correct: 0, avgRt: 0, sumRt: 0 };
            row.total += 1;
            row.correct += a.isCorrect ? 1 : 0;
            row.sumRt += a.responseTimeMs;
            bucket.set(day, row);
        }
        return Array.from(bucket.entries())
            .map(([day, { total, correct, sumRt }]) => ({
                day,
                accuracy: total ? correct / total : 0,
                avgRt: total ? sumRt / total : 0,
            }))
            .sort((a, b) => (a.day < b.day ? -1 : 1));
    }, [filtered]);

    // Barras por temática (accuracy y media de tiempo)
    const byTopic = useMemo(() => {
        const bucket = new Map<
            string,
            { total: number; correct: number; sumRt: number }
        >();
        for (const a of filtered) {
            const key = a.topic;
            const row = bucket.get(key) ?? { total: 0, correct: 0, sumRt: 0 };
            row.total += 1;
            row.correct += a.isCorrect ? 1 : 0;
            row.sumRt += a.responseTimeMs;
            bucket.set(key, row);
        }
        const rows = Array.from(bucket.entries()).map(([topic, { total, correct, sumRt }]) => ({
            topic,
            label: topics.find((t) => t.id === topic)?.label ?? topic,
            color: topics.find((t) => t.id === topic)?.color,
            accuracy: total ? correct / total : 0,
            avgRt: total ? sumRt / total : 0,
            total,
        }));
        // orden por volumen
        rows.sort((a, b) => b.total - a.total);
        return rows;
    }, [filtered, topics]);

    const onSelectStudent = (studentId?: string) => {
        const params = new URLSearchParams(sp?.toString());
        if (!studentId) params.delete("student");
        else params.set("student", studentId);
        startTransition(() => router.push(`/estadistikak?${params.toString()}`));
    };

    return (
        <>
            {/* Selector de alumno */}
            <div className="mb-6 flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => onSelectStudent(undefined)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                        !selectedStudentId
                            ? "bg-black text-white border-black"
                            : "bg-white hover:bg-neutral-50 border-neutral-300"
                    }`}
                >
                    Global
                </button>
                {students.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => onSelectStudent(s.id)}
                        className={`px-3 py-1.5 rounded-full text-sm border ${
                            selectedStudentId === s.id
                                ? "bg-black text-white border-black"
                                : "bg-white hover:bg-neutral-50 border-neutral-300"
                        }`}
                        title={s.username || s.name || s.id}
                    >
                        {s.name || s.username || s.id}
                    </button>
                ))}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <KpiCard title="Intentos" value={kpis.total.toLocaleString()} />
                <KpiCard title="Accuracy" value={fmtPerc(kpis.accuracy)} />
                <KpiCard title="Correctos" value={kpis.correct.toLocaleString()} />
                <KpiCard title="Tiempo medio" value={`${Math.round(kpis.avgResponseTimeMs)} ms`} />
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Accuracy por día">
                    <LineChart
                        width={560}
                        height={220}
                        data={byDay.map((d) => ({ x: d.day, y: d.accuracy }))}
                        yMax={1}
                        formatY={(y) => `${Math.round(y * 100)}%`}
                    />
                </ChartCard>
                <ChartCard title="Tiempo medio por día (ms)">
                    <LineChart
                        width={560}
                        height={220}
                        data={byDay.map((d) => ({ x: d.day, y: d.avgRt }))}
                        formatY={(y) => `${Math.round(y)} ms`}
                    />
                </ChartCard>

                <ChartCard title="Accuracy por temática">
                    <BarChart
                        width={560}
                        height={240}
                        data={byTopic.map((d) => ({ x: d.label, y: d.accuracy, color: d.color }))}
                        yMax={1}
                        formatY={(y) => `${Math.round(y * 100)}%`}
                    />
                </ChartCard>
                <ChartCard title="Tiempo medio por temática (ms)">
                    <BarChart
                        width={560}
                        height={240}
                        data={byTopic.map((d) => ({ x: d.label, y: d.avgRt, color: d.color }))}
                        formatY={(y) => `${Math.round(y)} ms`}
                    />
                </ChartCard>
            </div>

            {/* Tabla rápida de intentos */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Últimos intentos</h3>
                <AttemptsTable attempts={filtered.slice(-15).reverse()} topics={topics} />
            </div>
        </>
    );
}

// ---- UI components ----
function KpiCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-neutral-500">{title}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            {children}
        </div>
    );
}

// ---- Lightweight SVG charts (sin librerías externas) ----
type XY = { x: string; y: number; color?: string };

function LineChart({
                       data,
                       width,
                       height,
                       yMax,
                       formatY,
                   }: {
    data: XY[];
    width: number;
    height: number;
    yMax?: number;
    formatY?: (y: number) => string;
}) {
    const pad = 28;
    const W = width;
    const H = height;
    const maxY = yMax ?? Math.max(1, ...data.map((d) => d.y));
    const minY = 0;
    const innerW = W - pad * 2;
    const innerH = H - pad * 2;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

    const points = data.map((d, i) => {
        const x = pad + i * stepX;
        const y = pad + innerH - ((d.y - minY) / (maxY - minY || 1)) * innerH;
        return `${x},${y}`;
    });

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxY);

    return (
        <svg width={W} height={H} className="w-full">
            {/* grid + axes */}
            {yTicks.map((t, i) => {
                const y = pad + innerH - ((t - minY) / (maxY - minY || 1)) * innerH;
                return (
                    <g key={i}>
                        <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#eee" />
                        <text x={6} y={y + 4} fontSize="10" fill="#666">
                            {formatY ? formatY(t) : Math.round(t)}
                        </text>
                    </g>
                );
            })}
            {/* polyline */}
            <polyline
                fill="none"
                stroke="black"
                strokeWidth="2"
                points={points.join(" ")}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {/* dots */}
            {data.map((d, i) => {
                const x = pad + i * stepX;
                const y = pad + innerH - ((d.y - minY) / (maxY - minY || 1)) * innerH;
                return <circle key={i} cx={x} cy={y} r="3" fill="black" />;
            })}
            {/* x labels */}
            {data.map((d, i) => {
                const x = pad + i * stepX;
                return (
                    <text key={i} x={x} y={H - 6} fontSize="10" fill="#666" textAnchor="middle">
                        {d.x.slice(5)}{/* MM-DD */}
                    </text>
                );
            })}
        </svg>
    );
}

function BarChart({
                      data,
                      width,
                      height,
                      yMax,
                      formatY,
                  }: {
    data: XY[];
    width: number;
    height: number;
    yMax?: number;
    formatY?: (y: number) => string;
}) {
    const pad = 28;
    const W = width;
    const H = height;
    const maxY = yMax ?? Math.max(1, ...data.map((d) => d.y));
    const innerW = W - pad * 2;
    const innerH = H - pad * 2;
    const barW = innerW / (data.length || 1) * 0.7;
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxY);

    return (
        <svg width={W} height={H} className="w-full">
            {/* grid + y labels */}
            {yTicks.map((t, i) => {
                const y = pad + innerH - (t / (maxY || 1)) * innerH;
                return (
                    <g key={i}>
                        <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#eee" />
                        <text x={6} y={y + 4} fontSize="10" fill="#666">
                            {formatY ? formatY(t) : Math.round(t)}
                        </text>
                    </g>
                );
            })}
            {/* bars */}
            {data.map((d, i) => {
                const x = pad + i * (innerW / (data.length || 1)) + (innerW / (data.length || 1) - barW) / 2;
                const h = (d.y / (maxY || 1)) * innerH;
                const y = pad + innerH - h;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={h} fill={d.color || "black"} rx="4" />
                        <text x={x + barW / 2} y={H - 6} fontSize="10" fill="#666" textAnchor="middle">
                            {d.x}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function AttemptsTable({ attempts, topics }: { attempts: any[]; topics: any[] }) {
    const topicMap = new Map(topics.map((t) => [t.id, t]));
    return (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                    <th className="text-left px-3 py-2">Fecha</th>
                    <th className="text-left px-3 py-2">Tema</th>
                    <th className="text-left px-3 py-2">Tipo</th>
                    <th className="text-left px-3 py-2">Dificultad</th>
                    <th className="text-right px-3 py-2">Tiempo (ms)</th>
                    <th className="text-center px-3 py-2">Resultado</th>
                </tr>
                </thead>
                <tbody>
                {attempts.map((a) => {
                    const t = topicMap.get(a.topic);
                    return (
                        <tr key={a.id} className="border-t">
                            <td className="px-3 py-2">{a.attemptedAt.replace("T", " ").replace("Z", "")}</td>
                            <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-1">
                    <span>{t?.icon}</span>
                    <span>{t?.label ?? a.topic}</span>
                  </span>
                            </td>
                            <td className="px-3 py-2 capitalize">{a.operation}</td>
                            <td className="px-3 py-2 capitalize">{a.difficulty}</td>
                            <td className="px-3 py-2 text-right">{a.responseTimeMs}</td>
                            <td className="px-3 py-2 text-center">
                                {a.isCorrect ? (
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                      Correcto
                    </span>
                                ) : (
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                      Incorrecto
                    </span>
                                )}
                            </td>
                        </tr>
                    );
                })}
                {!attempts.length && (
                    <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-neutral-500">
                            No hay intentos con los filtros actuales.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

// ---- helpers ----
function humanizeStudent(id: string, students: any[]) {
    const s = students.find((v) => v.id === id);
    return s?.name || s?.username || id;
}