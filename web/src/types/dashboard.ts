export interface Student {
  id: string;
  name: string;
  status: "present" | "absent" | "late";
  photoUrl?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  averageGrade: number;
  students: Student[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  room: string;
  color: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: "work" | "coordination" | "event";
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category:
    | "ulermena"
    | "idazmena"
    | "gramatika"
    | "lexikoa"
    | "kalkulu_mentala"
    | "aritmetika"
    | "buruketak";
  status: "draft" | "published";
  date: string;
}

export interface DashboardData {
  classes: ClassGroup[];
  schedule: ScheduleItem[];
  tasks: TaskItem[];
}

export interface StudentStats {
  subject: string;
  grade: number;
  avgTimeSpent: number;
  completedExercises: number;
}

export interface StudentDetail extends Student {
  evolution: { month: string; grade: number }[];
  weaknesses: string[];
  strengths: string[];
  statsBySubject: StudentStats[];
  teacherNotes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "exam" | "holiday" | "assignment" | "meeting";
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  type: "coordination" | "parents" | "department";
  participants: string[];
  summary?: string;
  status: "processing" | "completed" | "pending_upload";
}