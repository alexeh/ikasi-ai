// src/app/estadistikak/page.tsx
import type { Metadata } from "next";

// ---- Server: carga datasets ----
import attemptsData from "../data/attempts.json";
import topicsData from "../data/topics.json";
// opcional: si tienes students.json
// @ts-ignore
import studentsData from "../data/students.json";
import {DashboardClient} from "@/app/(ikasi-ai)/components/StatsDashboard";

function humanizeStudent(id: string, students: any[]) {
    const s = students.find((v) => v.id === id);
    return s?.name || s?.username || id;
}

// Tipos básicos
export type Attempt = {
    id: string;
    studentId: string;
    sessionId: string;
    exerciseId: string;
    topic: string;
    operation: string;
    difficulty: "easy" | "medium" | "hard" | string;
    attemptedAt: string; // ISO
    isCorrect: boolean;
    responseTimeMs: number;
};

export type TopicMeta = { id: string; label: string; color?: string; icon?: string };

export type Student = { id: string; name?: string; username?: string };

// Page metadata
export const metadata: Metadata = {
    title: "Estadistikak | Ikasi AI",
};

// Utiles
const fmtPerc = (v: number) => `${(v * 100).toFixed(0)}%`;
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

// ---- Server Component (recoge searchParams y pasa a cliente) ----
export default function EstadistikakPage({
                                             searchParams,
                                         }: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    function humanizeStudent(id: string, students: any[]) {
        const s = students.find((v) => v.id === id);
        return s?.name || s?.username || id;
    }

    const attempts = attemptsData as Attempt[];
    const topics = (topicsData as TopicMeta[]) ?? [];
    const students: Student[] = (studentsData as Student[]) ?? [];

    const selectedStudentId =
        (typeof searchParams?.student === "string" && searchParams?.student) || undefined;

    return (
        <div className="px-6 py-6 md:px-10 max-w-[1200px] mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Estadistikak</h1>
            <p className="text-sm text-neutral-500 mb-6">
                Vista general {selectedStudentId ? `· Alumno: ${humanizeStudent(selectedStudentId, students)}` : "· Global"}
            </p>

            <DashboardClient
                attempts={attempts}
                topics={topics}
                students={students}
                selectedStudentId={selectedStudentId}
            />
        </div>
    );
}

