import {
  CalendarEvent,
  ClassGroup,
  Meeting,
  ScheduleItem,
  StudentDetail,
  TaskItem,
} from "@/types/dashboard";

export const MOCK_CLASSES: ClassGroup[] = [
  {
    id: "lh5a",
    name: "LH 5.A - Matematika",
    averageGrade: 7.8,
    students: [
      { id: "1", name: "Mikel Agirre", status: "present", photoUrl: "https://i.pravatar.cc/150?u=1" },
      { id: "2", name: "Ane Etxebarria", status: "present", photoUrl: "https://i.pravatar.cc/150?u=2" },
      { id: "3", name: "Jon Zabaleta", status: "present", photoUrl: "https://i.pravatar.cc/150?u=3" },
      { id: "4", name: "Maite Ibarra", status: "present", photoUrl: "https://i.pravatar.cc/150?u=4" },
      { id: "5", name: "Unai Goikoetxea", status: "present", photoUrl: "https://i.pravatar.cc/150?u=5" },
      { id: "6", name: "Irati Otegi", status: "present", photoUrl: "https://i.pravatar.cc/150?u=6" },
      { id: "7", name: "Oier Mendizabal", status: "present", photoUrl: "https://i.pravatar.cc/150?u=7" },
      { id: "8", name: "Uxue Arriola", status: "present", photoUrl: "https://i.pravatar.cc/150?u=8" },
    ],
  },
  {
    id: "lh5b",
    name: "LH 5.B - Euskara",
    averageGrade: 6.9,
    students: [
      { id: "11", name: "Iker Larrañaga", status: "present", photoUrl: "https://i.pravatar.cc/150?u=11" },
      { id: "12", name: "Nerea Azurmendi", status: "present", photoUrl: "https://i.pravatar.cc/150?u=12" },
      { id: "13", name: "Aitor Egiguren", status: "present", photoUrl: "https://i.pravatar.cc/150?u=13" },
      { id: "14", name: "Leire Garmendia", status: "present", photoUrl: "https://i.pravatar.cc/150?u=14" },
    ],
  },
  {
    id: "lh6a",
    name: "LH 6.A - Tutoretza",
    averageGrade: 8.2,
    students: [
      { id: "21", name: "Eneko Urrutia", status: "present", photoUrl: "https://i.pravatar.cc/150?u=21" },
      { id: "22", name: "Haizea Bilbao", status: "present", photoUrl: "https://i.pravatar.cc/150?u=22" },
      { id: "23", name: "Julen Elorza", status: "present", photoUrl: "https://i.pravatar.cc/150?u=23" },
      { id: "24", name: "Amaia Uriarte", status: "present", photoUrl: "https://i.pravatar.cc/150?u=24" },
      { id: "25", name: "Markel Zubizarreta", status: "present", photoUrl: "https://i.pravatar.cc/150?u=25" },
    ],
  },
];

export const TODAY_SCHEDULE: ScheduleItem[] = [
  { id: "s1", time: "09:00 - 10:00", subject: "Matematika", room: "201 Gela", color: "bg-blue-100 text-blue-800" },
  { id: "s2", time: "10:00 - 11:00", subject: "Euskara", room: "201 Gela", color: "bg-emerald-100 text-emerald-800" },
  { id: "s3", time: "11:30 - 12:30", subject: "Ingelesa", room: "Laborategia", color: "bg-indigo-100 text-indigo-800" },
  { id: "s4", time: "14:30 - 15:30", subject: "Gizarte", room: "201 Gela", color: "bg-amber-100 text-amber-800" },
  { id: "s5", time: "15:30 - 16:30", subject: "Tutoretza", room: "Bulegoa", color: "bg-slate-100 text-slate-800" },
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: "t1", text: "Etxeko lanak zuzendu (Zatikiak)", completed: false, category: "work" },
  { id: "t2", text: "Koordinazio bilera (12:30)", completed: true, category: "coordination" },
  { id: "t3", text: "Gabonetako dantza entsegua prestatu", completed: false, category: "event" },
  { id: "t4", text: "Kilo kanpainako oharra bidali gurasoei", completed: false, category: "event" },
  { id: "t5", text: "Mikel-en gurasoekin hitzordua", completed: false, category: "coordination" },
];

export const MOCK_STUDENT_STATS: StudentDetail = {
  id: "1",
  name: "Mikel Agirre",
  status: "present",
  photoUrl: "https://i.pravatar.cc/150?u=1",
  evolution: [
    { month: "Ira", grade: 6.5 },
    { month: "Urr", grade: 7.0 },
    { month: "Aza", grade: 6.8 },
    { month: "Abe", grade: 7.5 },
    { month: "Urt", grade: 7.2 },
    { month: "Ots", grade: 8.0 },
  ],
  weaknesses: [
    "Zatikiak (Matematika)",
    "Aditz trinkoak (Euskara)",
    "Ahoskera (Ingelesa)",
  ],
  strengths: ["Geometria", "Ahozko ulermena", "Talde lana"],
  statsBySubject: [
    { subject: "Matematika", grade: 7.5, avgTimeSpent: 45, completedExercises: 12 },
    { subject: "Euskara", grade: 8.2, avgTimeSpent: 30, completedExercises: 15 },
    { subject: "Ingelesa", grade: 6.8, avgTimeSpent: 25, completedExercises: 8 },
    { subject: "Ingurunea", grade: 7.9, avgTimeSpent: 20, completedExercises: 10 },
  ],
  teacherNotes:
    "Mikel oso ikasle langilea da, baina matematikako buruketekin laguntza behar du. Arreta mantentzea kostatzen zaio arratsaldeetan.",
};

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Matematika Azterketa", date: `${currentYear}-${monthStr}-15`, type: "exam" },
  { id: "e2", title: "Jai Eguna (Zubia)", date: `${currentYear}-${monthStr}-12`, type: "holiday" },
  { id: "e3", title: "Muralaren Aurkezpena", date: `${currentYear}-${monthStr}-22`, type: "assignment" },
  { id: "e4", title: "Guraso Bilera", date: `${currentYear}-${monthStr}-05`, type: "meeting" },
  { id: "e5", title: "Euskara Eguna", date: `${currentYear}-${monthStr}-03`, type: "holiday" },
  { id: "e6", title: "Ingeleseko Proiektua", date: `${currentYear}-${monthStr}-28`, type: "assignment" },
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: "m1",
    title: "Zikloko Koordinazioa",
    date: "2023-10-24",
    type: "coordination",
    participants: ["Ana", "Jon", "Mikel"],
    status: "completed",
    summary:
      "Datorren asteko txangoa antolatu dugu. Autobusa 9:00etan aterako da. Gurasoen baimenak ostiralerako jaso behar dira.",
  },
  {
    id: "m2",
    title: "Guraso Bilera - 5. Maila",
    date: "2023-10-20",
    type: "parents",
    participants: ["Guraso Ordezkariak"],
    status: "completed",
    summary:
      "Jantokiko arautegiaren inguruko kezkak azaldu dituzte. Gabonetako jaialdirako laguntza eskatu dute.",
  },
];