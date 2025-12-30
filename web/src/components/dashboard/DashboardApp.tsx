'use client';

import {
  Activity,
  ArrowLeft,
  AlertCircle,
  Book,
  BookOpen,
  BookType,
  Bot,
  Calculator,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Ear,
  FileAudio,
  FileText,
  Filter,
  GraduationCap,
  GraduationCap as GradeIcon,
  HelpCircle,
  Languages,
  Layout,
  Layers,
  Library,
  List,
  Globe,
  MessageSquare,
  Mic,
  MoreVertical,
  Network,
  PenLine,
  PenTool,
  PieChart as PieChartIcon,
  Plus,
  Save,
  Send,
  Settings,
  Sigma,
  Sparkles,
  Table,
  TrendingUp,
  Trash2,
  Upload,
  Users,
  WholeWord,
  X,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, FormEvent, JSX } from 'react';
import { useSession } from 'next-auth/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  DashboardAgendaWidget,
} from './agenda-widget';
import { DashboardAttendanceWidget } from './attendance-widget';
import { DashboardCreateExercise } from './create-exercise';
import { DashboardHeader } from './header';
import { ExerciseValidation } from './exercise-validation';
import { FileUpload } from './file-upload';
import {
  INITIAL_TASKS,
  MOCK_CLASSES,
  MOCK_EVENTS,
  MOCK_MEETINGS,
  MOCK_STUDENT_STATS,
  TODAY_SCHEDULE,
} from '@/mocks/dashboard-data';
import { DashboardScheduleWidget } from './schedule-widget';
import { DashboardSidebar } from './sidebar';
import { DashboardStatsCard } from './stats-card';
import type { Exercise, Meeting, Student } from '@/types/dashboard';
import { listExercises, Exercise as ApiExercise, ExerciseStatus } from '@/lib/exercises';

interface Assignment {
  id: string;
  title: string;
  date: string;
  maxScore: number;
}

interface BankExercise {
  id: string;
  subject: string;
  area: string;
  topic: string;
  title: string;
  difficulty: 'Erraza' | 'Ertaina' | 'Zaila';
}

type StudentViewMode = 'general' | 'subjects' | 'sociogram';

const SUBJECT_HIERARCHY: Record<string, Record<string, string[]>> = {
  Matematika: {
    Aritmetika: ['Zatikiak', 'Zenbaki Hamartarrak', 'Eragiketak'],
    Geometria: ['Angeluak', 'Poligonoak', 'Perimetroa'],
    Neurriak: ['Luzera', 'Pisua', 'Edukiera'],
  },
  Euskara: {
    Ulermena: ['Idatzizko Ulermena', 'Entzumena'],
    Gramatika: ['Aditzak', 'Deklinabidea', 'Sintaxia'],
    Idazmena: ['Deskribapena', 'Iritzi Testua'],
  },
  Ingelesa: {
    Writing: ['Description', 'Letter', 'Story'],
    Grammar: ['Present Simple', 'Past Continuous'],
    Vocabulary: ['Animals', 'House', 'School'],
  },
};

const BANK_EXERCISES: BankExercise[] = [
  { id: 'b1', subject: 'Matematika', area: 'Aritmetika', topic: 'Zatikiak', title: 'Zatiki baliokideak bilatu', difficulty: 'Erraza' },
  { id: 'b2', subject: 'Matematika', area: 'Aritmetika', topic: 'Zatikiak', title: 'Zatikien batuketak', difficulty: 'Ertaina' },
  { id: 'b3', subject: 'Euskara', area: 'Ulermena', topic: 'Idatzizko Ulermena', title: 'Testuaren ideia nagusia', difficulty: 'Ertaina' },
  { id: 'b4', subject: 'Ingelesa', area: 'Writing', topic: 'Description', title: 'Describe your best friend', difficulty: 'Erraza' },
  { id: 'b5', subject: 'Matematika', area: 'Geometria', topic: 'Angeluak', title: 'Angelu motak sailkatu', difficulty: 'Erraza' },
  { id: 'b6', subject: 'Euskara', area: 'Gramatika', topic: 'Aditzak', title: 'NOR-NORI orainaldian', difficulty: 'Zaila' },
];

const LANGUAGE_SUBJECTS = ['Euskara', 'Gaztelera', 'Ingelesa'];

type IconComponent = ComponentType<{ className?: string }>;

const SUBJECT_CATEGORIES: Record<string, Array<{ id: string; label: string; icon: IconComponent; color: string }>> = {
  Matematika: [
    { id: 'kalkulu_mentala', label: 'Kalkulu Mentala', icon: Sparkles, color: 'text-pink-600 bg-pink-50' },
    { id: 'aritmetika', label: 'Aritmetika', icon: Sigma, color: 'text-blue-600 bg-blue-50' },
    { id: 'buruketak', label: 'Buruketak', icon: HelpCircle, color: 'text-amber-600 bg-amber-50' },
  ],
  default: [
    { id: 'ulermena', label: 'Ulermena', icon: Ear, color: 'text-blue-600 bg-blue-50' },
    { id: 'idazmena', label: 'Idazmena', icon: PenTool, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'gramatika', label: 'Gramatika', icon: BookType, color: 'text-amber-600 bg-amber-50' },
    { id: 'lexikoa', label: 'Lexikoa', icon: WholeWord, color: 'text-purple-600 bg-purple-50' },
  ],
};

const SUBJECT_LIST = [
  { name: 'Euskara', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700', students: 24, avg: 7.2 },
  { name: 'Gaztelera', icon: Book, color: 'bg-orange-100 text-orange-700', students: 24, avg: 6.8 },
  { name: 'Inguru', icon: Globe, color: 'bg-blue-100 text-blue-700', students: 24, avg: 7.5 },
  { name: 'Matematika', icon: Calculator, color: 'bg-indigo-100 text-indigo-700', students: 24, avg: 6.4 },
  { name: 'Ingelesa', icon: Languages, color: 'bg-purple-100 text-purple-700', students: 24, avg: 8.1 },
];

const STUDENT_SUBJECTS = ['Matematika', 'Euskara', 'Ingelesa', 'Ingurunea', 'Gaztelera'];

const STRENGTH_COLORS = {
  strengths: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  weaknesses: 'border-rose-100 bg-rose-50 text-rose-700',
};

const VALID_VIEWS = new Set(['dashboard', 'subjects', 'students', 'calendar', 'meetings', 'settings', 'create-exercise', 'validate-exercise']);

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: '1. Ebaluazioa', date: '2023-10-15', maxScore: 10 },
  { id: 'a2', title: 'Zatikiak', date: '2023-10-22', maxScore: 10 },
  { id: 'a3', title: 'Problemak', date: '2023-10-29', maxScore: 10 },
  { id: 'a4', title: 'Kalkulua', date: '2023-11-05', maxScore: 10 },
];

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', title: 'Ipuinaren ulermena: "Basoko Misterioa"', description: 'Fitxategia aztertuta - 5 Galdera', category: 'ulermena', status: 'published', date: '2023-10-24' },
  { id: '2', title: 'Aditz laguntzailea: NOR-NORI-NORK', description: 'Bete hutsuneak taulan.', category: 'gramatika', status: 'published', date: '2023-10-22' },
  { id: '3', title: 'Sinonimoak eta Antonimoak', description: 'Lotu hitzak bere bikotearekin.', category: 'lexikoa', status: 'draft', date: '2023-10-25' },
  { id: '4', title: 'Biderketa taulak errepasatzen', description: '3, 4 eta 6ko taulak', category: 'aritmetika', status: 'published', date: '2023-10-26' },
];

const BANK_LABELS = {
  createTitle: 'Ariketa Sortzailea',
  subtitle: 'Igo fitxategia galdetegia automatikoki sortzeko.',
  upload: 'Klikatu edo arrastatu fitxategia',
  titleLabel: 'Izenburua',
  qCount: 'Galderak',
  qType: 'Galdetegi mota',
  types: { multiple: 'Aukera anitzekoa', boolean: 'Egia / Gezurra', open: 'Erantzun irekia' },
  createBtn: 'Sortu Galdetegia',
  exerciseTitlePlaceholder: 'Ariketaren Izenburua',
  listTitle: 'Eskuragarri dauden Ariketak',
  emptyState: 'Ez dago ariketarik atal honetan oraindik.',
  viewBtn: 'Ikusi',
  draft: 'Zirriborroa',
  published: 'Bidalita',
};

export function DashboardApp() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [selectedClassId, setSelectedClassId] = useState(() => MOCK_CLASSES[0]?.id ?? '');
  const [currentView, setCurrentView] = useState(() => {
    const paramView = searchParams.get('view');
    return paramView && VALID_VIEWS.has(paramView) ? paramView : 'dashboard';
  });
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('ulermena');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('LH 5. Maila');
  const [openEvalModal, setOpenEvalModal] = useState<number | null>(null);
  const [curriculumData, setCurriculumData] = useState<Record<string, string>>({
    'LH 5. Maila-1': 'Zenbaki arruntak: irakurketa eta idazketa.\nEragiketak: Batuketak, kenketak eta biderketak.\nBuruketak ebazteko estrategiak.',
    'LH 5. Maila-2': 'Zatikiak: kontzeptua eta eragiketa errazak.\nZenbaki hamartarrak eguneroko bizitzan.\nGeometria: Angeluak eta poligonoak.',
    'LH 5. Maila-3': 'Neurriak: Luzera, masa eta edukiera.\nEstatistika eta probabilitatea.\nIkasturteko errepaso orokorra.',
    'LH 4. Maila-1': 'Zenbakiak 1.000.000 arte.',
  });
  const [builderSubject, setBuilderSubject] = useState('');
  const [builderArea, setBuilderArea] = useState('');
  const [builderTopic, setBuilderTopic] = useState('');
  const [selectedBankExercises, setSelectedBankExercises] = useState<BankExercise[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentViewMode, setStudentViewMode] = useState<StudentViewMode>('general');
  const [selectedStudentSubject, setSelectedStudentSubject] = useState('Matematika');
  const [teacherNote, setTeacherNote] = useState(MOCK_STUDENT_STATS.teacherNotes);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [newMeetingSummary, setNewMeetingSummary] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);
  const [validatingExerciseId, setValidatingExerciseId] = useState<string | null>(null);
  const exerciseTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const paramView = searchParams.get('view');
    if (paramView && VALID_VIEWS.has(paramView)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentView(paramView);
    }
  }, [searchParams]);

  // Fetch exercises from API
  useEffect(() => {
    async function fetchExercises() {
      if (!session?.user?.accessToken) {
        // User not authenticated yet, skip fetching
        return;
      }

      setExercisesLoading(true);
      setExercisesError(null);
      
      try {
        const apiExercises = await listExercises(session.user.accessToken);
        
        // Map API exercises to UI format
        const mappedExercises: Exercise[] = apiExercises.map((apiEx: ApiExercise) => {
          // Determine category based on subject if available
          // For now, use a default category or derive from questions
          const category = 'ulermena' as Exercise['category']; // Default category
          
          // Map status
          const status = apiEx.status === ExerciseStatus.APPROVED ? 'published' : 'draft';
          
          // Format date
          const date = new Date(apiEx.createdAt).toISOString().split('T')[0];
          
          return {
            id: apiEx.id,
            title: apiEx.title || 'Izenik gabeko ariketa',
            description: `${apiEx.questions.length} galdera`,
            category,
            status: status as Exercise['status'],
            date,
          };
        });
        
        setExercises(mappedExercises);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setExercisesError(error instanceof Error ? error.message : 'Errorea ariketak kargatzerakoan');
      } finally {
        setExercisesLoading(false);
      }
    }

    fetchExercises();
  }, [session]);

  // Function to manually refetch exercises
  const refetchExercises = async () => {
    if (!session?.user?.accessToken) {
      return;
    }

    setExercisesLoading(true);
    setExercisesError(null);
    
    try {
      const apiExercises = await listExercises(session.user.accessToken);
      
      // Map API exercises to UI format
      const mappedExercises: Exercise[] = apiExercises.map((apiEx: ApiExercise) => {
        const category = 'ulermena' as Exercise['category'];
        const status = apiEx.status === ExerciseStatus.APPROVED ? 'published' : 'draft';
        const date = new Date(apiEx.createdAt).toISOString().split('T')[0];
        
        return {
          id: apiEx.id,
          title: apiEx.title || 'Izenik gabeko ariketa',
          description: `${apiEx.questions.length} galdera`,
          category,
          status: status as Exercise['status'],
          date,
        };
      });
      
      setExercises(mappedExercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercisesError(error instanceof Error ? error.message : 'Errorea ariketak kargatzerakoan');
    } finally {
      setExercisesLoading(false);
    }
  };

  const handleNavigate = (view: string) => {
    const targetView = VALID_VIEWS.has(view) ? view : 'dashboard';
    setCurrentView(targetView);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (targetView === 'dashboard') {
        params.delete('view');
      } else {
        params.set('view', targetView);
      }
      const query = params.toString();
      const newUrl = query ? `/?${query}` : '/';
      window.history.replaceState({}, '', newUrl);
    }
  };

  const selectedClass = useMemo(() => MOCK_CLASSES.find((c) => c.id === selectedClassId) ?? MOCK_CLASSES[0], [selectedClassId]);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Arbela';
      case 'subjects':
        return selectedSubject ?? 'Ikasgaiak';
      case 'students':
        return 'Ikasleen Jarraipena';
      case 'calendar':
        return 'Egutegia';
      case 'meetings':
        return 'Bilerak eta Aktak';
      case 'create-exercise':
        return 'Ariketa sortzailea';
      case 'validate-exercise':
        return 'Ariketa balioztatu';
      case 'settings':
        return 'Ezarpenak';
      default:
        return 'Arbela';
    }
  };

  const generateReport = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const name = selectedClass.students.find((student) => student.id === selectedStudentId)?.name ?? 'Ikaslea';
      const subject = selectedStudentSubject;
      const aiText = `${name}k bilakaera positiboa erakutsi du hiruhileko honetan. ${subject}n bereziki ondo moldatzen da, nahiz eta arreta mantentzea kostatzen zaion batzuetan. Etxeko lanak orokorrean garaiz entregatzen ditu eta jarrera egokia du gelan. Gomendagarria litzateke irakurketan errefortzu txiki bat egitea etxean.`;
      setTeacherNote(aiText);
      setIsAiGenerating(false);
    }, 2000);
  };

  const generateMeetingSummary = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setNewMeetingSummary(
        `BILERA LABURPENA\n\n1. Gai nagusia: Datorren asteko ebaluazioa.\n2. Erabakiak:\n   - Azterketa eguna aldatu (Ostegunera).\n   - Gurasoei oharra bidali.\n3. Hurrengo urratsak:\n   - Materiala prestatu astelehenerako.\n   - Zuzendaritzarekin hitz egin gelako proiektorearen inguruan.`,
      );
      setIsTranscribing(false);
    }, 2500);
  };

  const handleCreateMeeting = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: (formData.get('title') as string) ?? '',
      date: (formData.get('date') as string) ?? new Date().toISOString().split('T')[0],
      type: 'coordination',
      participants: ['Irakasleak'],
      status: 'completed',
      summary: newMeetingSummary,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setShowMeetingModal(false);
    setNewMeetingSummary('');
  };

  const handleAddAssignment = () => {
    const newId = `a${assignments.length + 1}`;
    const newAssignment: Assignment = {
      id: newId,
      title: `Ariketa ${assignments.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      maxScore: 10,
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const handleCreateExercise = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isLanguageSubject = LANGUAGE_SUBJECTS.includes(selectedSubject ?? '');
    const isUlermena = activeCategory === 'ulermena' && isLanguageSubject;
    const newExercise: Exercise = {
      id: Date.now().toString(),
      title: (formData.get('title') as string) ?? '',
      description: isUlermena
        ? `Analitika Automatik - ${formData.get('questionCount')} Qs`
        : ((formData.get('description') as string) ?? ''),
      category: activeCategory as Exercise['category'],
      status: 'published',
      date: new Date().toISOString().split('T')[0],
    };
    setExercises((prev) => [newExercise, ...prev]);
    setShowCreateModal(false);
  };

  const handleAddBankExercise = (exercise: BankExercise) => {
    setSelectedBankExercises((prev) =>
      prev.find((item) => item.id === exercise.id) ? prev : [...prev, exercise],
    );
  };

  const handleRemoveBankExercise = (id: string) => {
    setSelectedBankExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const filteredExercises = useMemo(
    () => exercises.filter((exercise) => exercise.category === activeCategory),
    [exercises, activeCategory],
  );

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalDays = lastDay.getDate();
    const days = [] as JSX.Element[];

    for (let index = 0; index < startingDay; index += 1) {
      days.push(<div key={`empty-${index}`} className="h-32 border border-slate-100/50 bg-slate-50" />);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = MOCK_EVENTS.filter((event) => event.date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div
          key={dateStr}
          className={`group relative h-32 border border-slate-100 p-2 transition-colors ${isToday ? 'bg-indigo-50/30' : 'bg-white'}`}
        >
          <div className="flex items-start justify-between">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
              }`}
            >
              {day}
            </span>
            <button className="opacity-0 transition-opacity group-hover:opacity-100">
              <Plus className="h-4 w-4 text-slate-300 hover:text-indigo-600" />
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`truncate rounded px-1.5 py-1 text-[10px] font-medium ${
                  event.type === 'exam'
                    ? 'bg-rose-100 text-rose-700'
                    : event.type === 'holiday'
                      ? 'bg-emerald-100 text-emerald-700'
                      : event.type === 'meeting'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      );
    }

    return days;
  };

  const renderCalendarView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'];

    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold capitalize text-slate-800">
              {monthNames[month]} {year}
            </h2>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="rounded p-1 text-slate-600 transition-colors hover:bg-slate-100">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="rounded p-1 text-slate-600 transition-colors hover:bg-slate-100">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Gertaera Berria
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['Al', 'Ar', 'Az', 'Og', 'Ol', 'Lr', 'Ig'].map((day) => (
              <div key={day} className="py-3 text-center text-sm font-bold text-slate-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">{renderCalendarDays()}</div>
        </div>
      </div>
    );
  };

  const renderMeetingsView = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            Bilerak eta Aktak
          </h2>
          <p className="mt-1 text-sm text-slate-500">Grabatu audioa edo igo aktak laburpenak automatikoki sortzeko.</p>
        </div>
        <button
          onClick={() => setShowMeetingModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Bilera Berria
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <span
                className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  meeting.type === 'coordination'
                    ? 'bg-blue-100 text-blue-700'
                    : meeting.type === 'parents'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-purple-100 text-purple-700'
                }`}
              >
                {meeting.type === 'coordination' ? 'Koordinazioa' : meeting.type === 'parents' ? 'Gurasoak' : 'Saila'}
              </span>
              <span className="text-xs font-medium text-slate-400">{meeting.date}</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-800 transition-colors group-hover:text-indigo-600">{meeting.title}</h3>
            <p className="mb-4 flex-1 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 line-clamp-4">
              {meeting.summary ?? 'Laburpenik gabe...'}
            </p>
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex -space-x-2">
                {meeting.participants.map((participant) => (
                  <div
                    key={participant}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[8px] font-bold text-slate-600"
                  >
                    {participant.charAt(0)}
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:underline">
                Ikusi Akta
                <ArrowLeft className="h-3 w-3 rotate-180" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowMeetingModal(true)}
          className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-slate-400 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600"
        >
          <div className="mb-3 rounded-full bg-slate-50 p-4 transition-transform group-hover:scale-110">
            <Mic className="h-8 w-8" />
          </div>
          <span className="text-sm font-bold">Hasi Grabaketa edo Igo Audioa</span>
          <span className="mt-1 text-xs opacity-70">AI Laburpena sortzeko</span>
        </button>
      </div>
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Bilera Berria Erregistratu</h3>
                <p className="text-sm text-slate-500">Igo audioa edo idatzi oharrak.</p>
              </div>
              <button onClick={() => setShowMeetingModal(false)} className="text-slate-400 transition-colors hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
                  Bileraren Izenburua
                  <input
                    name="title"
                    required
                    type="text"
                    placeholder="Adib: Ebaluazio Batzordea"
                    className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
                  Data
                  <input
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Bot className="h-4 w-4 text-purple-600" />
                  Sortu Akta Automatikoki
                </label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={generateMeetingSummary}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white p-6 transition-colors hover:bg-purple-50"
                  >
                    <Mic className={`mb-2 h-8 w-8 text-purple-500 ${isTranscribing ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-bold text-purple-700">Audioa Grabatu</span>
                    <span className="text-xs text-slate-400">Mikrofonoa erabili</span>
                  </button>
                  <button
                    type="button"
                    onClick={generateMeetingSummary}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-200 bg-white p-6 transition-colors hover:bg-indigo-50"
                  >
                    <FileAudio className="mb-2 h-8 w-8 text-indigo-500" />
                    <span className="text-sm font-bold text-indigo-700">Igo Artxiboa</span>
                    <span className="text-xs text-slate-400">MP3, WAV, M4A</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {isTranscribing ? 'AI Laburpena sortzen...' : 'Bileraren Laburpena / Akta'}
                </label>
                <textarea
                  value={newMeetingSummary}
                  onChange={(event) => setNewMeetingSummary(event.target.value)}
                  rows={8}
                  className={`w-full rounded-lg border p-4 text-sm leading-relaxed outline-none transition-all ${
                    isTranscribing ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-slate-300 bg-white text-slate-700'
                  }`}
                  placeholder="Hemen agertuko da sortutako laburpena edo eskuz idatzi dezakezu..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowMeetingModal(false)} className="rounded-lg px-5 py-2 text-slate-600 transition-colors hover:bg-slate-100">
                  Utzi
                </button>
                <button type="submit" className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700">
                  <CheckCircle className="h-4 w-4" />
                  Gorde Bilera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderExerciseBankBuilder = () => {
    const availableAreas = builderSubject ? Object.keys(SUBJECT_HIERARCHY[builderSubject] ?? {}) : [];
    const availableTopics = builderSubject && builderArea ? SUBJECT_HIERARCHY[builderSubject]?.[builderArea] ?? [] : [];
    const filteredBankExercises = BANK_EXERCISES.filter((exercise) => {
      if (builderSubject && exercise.subject !== builderSubject) return false;
      if (builderArea && exercise.area !== builderArea) return false;
      if (builderTopic && exercise.topic !== builderTopic) return false;
      return true;
    });

    return (
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Sortu zure ariketa / Datu Bankua</h3>
            <p className="text-sm text-slate-500">Bilatu ariketak ikasgai, alor eta gaiaren arabera.</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="space-y-5 lg:w-1/3">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Book className="h-4 w-4 text-slate-400" />
                1. Aukeratu Ikasgaia
              </label>
              <select
                value={builderSubject}
                onChange={(event) => {
                  setBuilderSubject(event.target.value);
                  setBuilderArea('');
                  setBuilderTopic('');
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Aukeratu ikasgaia...</option>
                {Object.keys(SUBJECT_HIERARCHY).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`mb-2 flex items-center gap-2 text-sm font-bold ${builderSubject ? 'text-slate-700' : 'text-slate-400'}`}>
                <Layers className="h-4 w-4" />
                2. Aukeratu Alorra
              </label>
              <select
                value={builderArea}
                onChange={(event) => {
                  setBuilderArea(event.target.value);
                  setBuilderTopic('');
                }}
                disabled={!builderSubject}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="">Aukeratu alorra...</option>
                {availableAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`mb-2 flex items-center gap-2 text-sm font-bold ${builderArea ? 'text-slate-700' : 'text-slate-400'}`}>
                <Filter className="h-4 w-4" />
                3. Aukeratu Gaia
              </label>
              <select
                value={builderTopic}
                onChange={(event) => setBuilderTopic(event.target.value)}
                disabled={!builderArea}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="">Aukeratu gaia...</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <h4 className="mb-3 text-sm font-bold text-slate-800">Emaitzak ({filteredBankExercises.length})</h4>
              <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                {filteredBankExercises.length === 0 ? (
                  <p className="text-xs italic text-slate-400">Ez da ariketarik aurkitu irizpide hauekin.</p>
                ) : (
                  filteredBankExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="group flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="mr-2 min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-700">{exercise.title}</p>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] ${
                            exercise.difficulty === 'Erraza'
                              ? 'bg-emerald-100 text-emerald-700'
                              : exercise.difficulty === 'Ertaina'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddBankExercise(exercise)}
                        className="rounded-md bg-indigo-50 p-1.5 text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 lg:w-2/3">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-slate-800">
                <Library className="h-5 w-5 text-indigo-600" />
                Zure Ariketa Sorta ({selectedBankExercises.length})
              </h4>
              <button
                onClick={() => setSelectedBankExercises([])}
                disabled={selectedBankExercises.length === 0}
                className="text-xs font-medium text-rose-600 transition-opacity hover:text-rose-800 disabled:opacity-0"
              >
                Garbitu zerrenda
              </button>
            </div>
            <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
              {selectedBankExercises.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <Layers className="mb-3 h-12 w-12 opacity-20" />
                  <p className="text-sm">Zure saskia hutsik dago.</p>
                  <p className="mt-1 text-xs">Aukeratu ariketak ezkerreko menuan.</p>
                </div>
              ) : (
                selectedBankExercises.map((exercise, index) => (
                  <div
                    key={`${exercise.id}-${index}`}
                    className="group relative flex items-start gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded px-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">{exercise.subject}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] text-slate-500">
                          {exercise.area} / {exercise.topic}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-800">{exercise.title}</h5>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBankExercise(exercise.id)}
                      className="rounded p-2 text-slate-300 transition-colors hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end border-t border-slate-200 pt-4">
              <button
                type="button"
                disabled={selectedBankExercises.length === 0}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Gorde eta Sortu PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSubjectsSection = () => {
    if (selectedSubject) {
      const categories = SUBJECT_CATEGORIES[selectedSubject] ?? SUBJECT_CATEGORIES.default;
      const isLanguageSubject = LANGUAGE_SUBJECTS.includes(selectedSubject);
      const showInlineForm = isLanguageSubject && activeCategory === 'ulermena';

      const handleSaveCurriculum = (event: FormEvent) => {
        event.preventDefault();
        setOpenEvalModal(null);
      };

      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex items-center gap-4">
            <button onClick={() => setSelectedSubject(null)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-800">{selectedSubject}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="group relative">
                  <select
                    value={selectedGradeLevel}
                    onChange={(event) => setSelectedGradeLevel(event.target.value)}
                    className="peer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-bold text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <option key={level}>{`LH ${level}. Maila`}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((evaluation) => (
                    <button
                      key={evaluation}
                      onClick={() => setOpenEvalModal(evaluation)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <PenLine className="h-3 w-3" />
                      {evaluation}. Ebaluazioa
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {!showInlineForm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Ariketa Sortu
              </button>
            )}
          </div>
          <div className={`mb-8 grid grid-cols-2 gap-4 md:grid-cols-${categories.length}`}>
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    isActive ? 'border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`rounded-lg p-2 ${category.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`font-semibold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{category.label}</span>
                </button>
              );
            })}
          </div>
          {showInlineForm ? (
            <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:flex-row">
              <div className="border-b border-slate-100 p-8 lg:w-7/12 lg:border-b-0 lg:border-r">
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    {BANK_LABELS.createTitle}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{BANK_LABELS.subtitle}</p>
                </div>
                <div className="space-y-6">
                  <label className="block text-sm font-semibold text-slate-700">
                    {BANK_LABELS.titleLabel}
                    <input
                      ref={exerciseTitleInputRef}
                      name="title"
                      required
                      type="text"
                      placeholder={BANK_LABELS.exerciseTitlePlaceholder}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                  <FileUpload 
                    subject={selectedSubject.toLowerCase()}
                    category={activeCategory}
                    onUploadSuccess={(result) => {
                      // Create exercise entry after successful upload
                      const newExercise: Exercise = {
                        id: result.id,
                        title: exerciseTitleInputRef.current?.value || 'Ariketa berria',
                        description: `Analitika Automatik - Prozesatuta`,
                        category: activeCategory as Exercise['category'],
                        status: 'draft',
                        date: new Date().toISOString().split('T')[0],
                      };
                      setExercises((prev) => [newExercise, ...prev]);
                      // Clear the title input
                      if (exerciseTitleInputRef.current) {
                        exerciseTitleInputRef.current.value = '';
                      }
                      // Navigate to validation
                      setValidatingExerciseId(result.id);
                      handleNavigate('validate-exercise');
                    }}
                  />
                </div>
              </div>
              <div className="flex h-full flex-col bg-slate-50/50 lg:w-5/12 lg:min-h-[700px]">
                <div className="border-b border-slate-100 bg-slate-50 p-5">
                  <h4 className="flex items-center gap-2 font-bold text-slate-700">
                    <List className="h-4 w-4 text-slate-500" />
                    {BANK_LABELS.listTitle}
                  </h4>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {exercisesLoading ? (
                    <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400">
                      <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                      <p>Ariketak kargatzen...</p>
                    </div>
                  ) : exercisesError ? (
                    <div className="flex h-64 flex-col items-center justify-center text-center text-rose-500">
                      <AlertCircle className="mb-3 h-12 w-12 opacity-50" />
                      <p className="font-semibold">Errorea</p>
                      <p className="text-xs mt-1">{exercisesError}</p>
                    </div>
                  ) : filteredExercises.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400">
                      <FileText className="mb-3 h-12 w-12 opacity-20" />
                      <p>{BANK_LABELS.emptyState}</p>
                    </div>
                  ) : (
                    filteredExercises.map((exercise) => (
                      <div key={exercise.id} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{exercise.date}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              exercise.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {exercise.status === 'published' ? BANK_LABELS.published : BANK_LABELS.draft}
                          </span>
                        </div>
                        <h5 className="mb-1 text-sm font-bold text-slate-800">{exercise.title}</h5>
                        <p className="mb-4 text-xs text-slate-500 line-clamp-2">{exercise.description}</p>
                        <button 
                          onClick={() => {
                            setValidatingExerciseId(exercise.id);
                            handleNavigate('validate-exercise');
                          }}
                          className="w-full rounded-lg bg-indigo-50 py-2 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
                        >
                          {BANK_LABELS.viewBtn}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
                <h3 className="flex items-center gap-2 font-bold text-slate-700">
                  <FileText className="h-4 w-4 text-slate-400" />
                  {(categories.find((cat) => cat.id === activeCategory)?.label ?? 'Ariketak') + ' - ' + BANK_LABELS.listTitle}
                </h3>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600">{filteredExercises.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {exercisesLoading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
                    <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                    <p>Ariketak kargatzen...</p>
                  </div>
                ) : exercisesError ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-rose-500">
                    <AlertCircle className="mb-3 h-12 w-12 opacity-50" />
                    <p className="font-semibold">Errorea</p>
                    <p className="text-xs mt-1">{exercisesError}</p>
                  </div>
                ) : filteredExercises.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <p>{BANK_LABELS.emptyState}</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-2 text-sm font-medium text-indigo-600 transition-colors hover:underline"
                    >
                      Sortu lehenengoa
                    </button>
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      className="group flex items-center justify-between p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setValidatingExerciseId(exercise.id);
                        handleNavigate('validate-exercise');
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 rounded bg-slate-100 p-2 text-slate-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{exercise.title}</h4>
                          <p className="mb-1 text-sm text-slate-500">{exercise.description}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-400">{exercise.date}</span>
                            {exercise.status === 'published' ? (
                              <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                                <Send className="h-3 w-3" /> {BANK_LABELS.published}
                              </span>
                            ) : (
                              <span className="rounded bg-amber-50 px-2 py-0.5 font-medium text-amber-600">{BANK_LABELS.draft}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="rounded-full p-2 text-slate-300 opacity-0 transition-colors group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800">Ariketa Berria Sortu</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-slate-400 transition-colors hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateExercise} className="space-y-4 p-6">
                  <label className="block text-sm font-medium text-slate-700">
                    Ariketaren Izenburua
                    <input
                      name="title"
                      required
                      type="text"
                      placeholder="Adib: Zatikiak batzen"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Kategoria
                    <select
                      value={activeCategory}
                      onChange={(event) => setActiveCategory(event.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Deskribapena / Argibideak
                    <textarea
                      name="description"
                      rows={3}
                      required
                      placeholder="Zer egin behar dute ikasleek?"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      Utzi
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      Sortu eta Bidali
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {openEvalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                      <GradeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{openEvalModal}. Ebaluazioaren Edukia</h3>
                      <p className="text-sm text-slate-500">
                        {selectedSubject} - {selectedGradeLevel}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setOpenEvalModal(null)} className="text-slate-400 transition-colors hover:text-slate-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleSaveCurriculum} className="flex flex-1 flex-col space-y-6 overflow-y-auto p-6">
                  <label className="flex flex-1 flex-col gap-2 text-sm font-bold text-slate-700">
                    Zer landuko da ebaluazio honetan?
                    <textarea
                      rows={12}
                      value={curriculumData[`${selectedGradeLevel}-${openEvalModal}`] ?? ''}
                      onChange={(event) =>
                        setCurriculumData((prev) => ({
                          ...prev,
                          [`${selectedGradeLevel}-${openEvalModal}`]: event.target.value,
                        }))
                      }
                      className="h-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="Idatzi hemen gaiak, estandarrak eta helburuak..."
                    />
                  </label>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setOpenEvalModal(null)} className="rounded-lg px-5 py-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                      Utzi
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      <Save className="h-4 w-4" />
                      Gorde Aldaketak
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-500 pb-10">
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Nire Ikasgaiak
          </h2>
          <p className="mt-1 text-sm text-slate-500">Aukeratu kudeatu nahi duzun irakasgaia.</p>
        </div>
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SUBJECT_LIST.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.name}
                onClick={() => {
                  setSelectedSubject(subject.name);
                  if (subject.name === 'Matematika') setActiveCategory('kalkulu_mentala');
                  else setActiveCategory('ulermena');
                }}
                className="group relative flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-lg p-3 transition-transform group-hover:scale-110 ${subject.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">LH 5. Maila</span>
                </div>
                <h4 className="mb-1 text-lg font-bold text-slate-800">{subject.name}</h4>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>{subject.students} ikasle</span>
                  <span>
                    B.B: <strong className="text-slate-700">{subject.avg}</strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {renderExerciseBankBuilder()}
      </div>
    );
  };

  const renderStudentsView = () => {
    if (selectedStudentId) {
      const student = selectedClass.students.find((item) => item.id === selectedStudentId);
      if (!student) return null;

      const performanceData = [
        { name: '1. Eb', classAvg: 6.5, target: 7 },
        { name: 'Zatikiak', classAvg: 7.2, target: 7 },
        { name: 'Problemak', classAvg: 5.8, target: 7 },
        { name: 'Kalkulua', classAvg: 8.1, target: 7 },
        { name: 'Geometria', classAvg: 7.5, target: 7 },
      ];
      const distributionData = [
        { name: '0-4', value: 3, color: '#f43f5e' },
        { name: '5-6', value: 8, color: '#f59e0b' },
        { name: '7-8', value: 10, color: '#3b82f6' },
        { name: '9-10', value: 4, color: '#10b981' },
      ];
      const skillsData = [
        { name: 'Arrazoiketa', score: 65 },
        { name: 'Kalkulua', score: 85 },
        { name: 'Kontzeptuak', score: 70 },
        { name: 'Jarrera', score: 90 },
      ];
      const sociogramData = [
        { date: 'Iraila', score: 6.5 },
        { date: 'Urria', score: 7.0 },
        { date: 'Azaroa', score: 7.8 },
        { date: 'Abendua', score: 8.2 },
        { date: 'Urtarrila', score: 8.0 },
      ];

      return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <button
            onClick={() => {
              setSelectedStudentId(null);
              setStudentViewMode('general');
            }}
            className="mb-6 flex items-center gap-2 font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Ikasleen zerrendara itzuli
          </button>
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <img src={student.photoUrl} alt={student.name} className="h-20 w-20 rounded-full border-4 border-slate-50 object-cover shadow-sm" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                <div className="mt-2 flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> LH 5. Maila
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> Taldea: A
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {(
                [
                  { key: 'general', label: 'Orokorra', icon: Layout },
                  { key: 'subjects', label: 'Kalifikazioak', icon: Table },
                  { key: 'sociogram', label: 'Soziograma', icon: Network },
                ] as Array<{ key: StudentViewMode; label: string; icon: IconComponent }>
              ).map((option) => {
                const Icon = option.icon;
                const isActive = studentViewMode === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => setStudentViewMode(option.key)}
                    className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          {studentViewMode === 'general' && (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Irakasle Laguntzailea
                  </h3>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <textarea
                      value={teacherNote}
                      onChange={(event) => setTeacherNote(event.target.value)}
                      className="h-32 w-full resize-none bg-transparent text-sm leading-relaxed text-slate-600 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={generateReport}
                    disabled={isAiGenerating}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-70"
                  >
                    <Sparkles className={`h-4 w-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
                    Txostena Sortu
                  </button>
                </div>
              </div>
              <div className="space-y-6 xl:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Bilakaera Akademikoa</h3>
                    <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm">
                      <option>Ikasturte osoa</option>
                      <option>1. Hiruhilekoa</option>
                    </select>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_STUDENT_STATS.evolution}>
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tick={{ fill: '#94a3b8' }} tickLine={false} />
                        <YAxis domain={[0, 10]} axisLine={false} tick={{ fill: '#94a3b8' }} tickLine={false} />
                        <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="grade" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, strokeWidth: 0, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      Indarguneak
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_STUDENT_STATS.strengths.map((item) => (
                        <span key={item} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${STRENGTH_COLORS.strengths}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                      Hobetzekoak
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_STUDENT_STATS.weaknesses.map((item) => (
                        <span key={item} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${STRENGTH_COLORS.weaknesses}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {studentViewMode === 'sociogram' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Network className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Integrazio Soziala</h3>
                    <p className="text-sm text-slate-500">Soziogramen emaitzen bilakaera ikasturtean zehar.</p>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sociogramData}>
                      <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
                      <YAxis domain={[0, 10]} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
                      <Tooltip
                        contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Integrazioa"
                        stroke="#9333ea"
                        strokeWidth={4}
                        dot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#9333ea' }}
                        activeDot={{ r: 8, fill: '#9333ea', strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
                  <Activity className="mt-0.5 h-5 w-5 text-purple-600" />
                  <p>
                    <strong>Analisi Laburra:</strong> Ikaslearen integrazio maila nabarmen hobetu da azken hiruhilekoan. Talde dinamiketan parte hartze aktiboagoa erakusten du eta ikaskideekiko harremanak sendotu ditu.
                  </p>
                </div>
              </div>
            </div>
          )}
          {studentViewMode === 'subjects' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {STUDENT_SUBJECTS.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedStudentSubject(subject)}
                    className={`rounded-xl border px-3 py-3 text-center text-sm transition-all ${
                      selectedStudentSubject === subject
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-500">Gelako Batez Bestekoa</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-indigo-600">7.8</span>
                    <span className="mb-1 rounded bg-emerald-50 px-1 text-sm font-medium text-emerald-600">▲ 0.3</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-500">Onartuen Tasa</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-emerald-600">88%</span>
                    <span className="mb-1 text-xs text-slate-400">21/24 Ikasle</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-500">Zailtasun Handiena</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-rose-600">Problemak</span>
                    <span className="mb-1 text-xs text-slate-400">BB: 5.8</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-500">Hurrengo Froga</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-slate-700">Ostirala</span>
                    <span className="mb-1 text-xs text-slate-400">Geometria</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    Emaitzen Eboluzioa (Gela vs Helburua)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorAvg" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                        <YAxis axisLine={false} domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                        <Tooltip contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="classAvg" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" name="Gela BB" />
                        <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Helburua" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                      <PieChartIcon className="h-5 w-5 text-indigo-500" />
                      Nota Banaketa
                    </h3>
                    <div className="flex h-40 items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={distributionData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-slate-800">Gaitasunen Garapena</h3>
                    <div className="space-y-3">
                      {skillsData.map((skill) => (
                        <div key={skill.name}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-medium text-slate-600">{skill.name}</span>
                            <span className="font-bold text-slate-800">{skill.score}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${skill.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <Table className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-slate-800">{selectedStudentSubject} - Kalifikazio Liburua</h3>
                      <p className="text-xs text-slate-500">Ikasle guztien notak</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
                      Esportatu CSV
                    </button>
                    <button
                      onClick={handleAddAssignment}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      <Plus className="h-3 w-3" />
                      Gehitu Zutabea
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-20 bg-slate-50 text-xs uppercase text-slate-700 shadow-sm">
                      <tr>
                        <th className="sticky left-0 min-w-[200px] border-b border-r border-slate-200 bg-slate-50 px-6 py-4">Ikaslea</th>
                        {assignments.map((assignment) => (
                          <th key={assignment.id} className="min-w-[120px] border-b border-slate-200 px-4 py-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold">{assignment.title}</span>
                              <span className="text-[10px] font-normal text-slate-400">{assignment.date}</span>
                            </div>
                          </th>
                        ))}
                        <th className="sticky right-0 border-b border-l border-indigo-100 bg-indigo-50 px-6 py-4 text-center text-indigo-700">
                          Batez Bestekoa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedClass.students.map((studentRow) => {
                        const mockGrades = assignments.map((assignment, index) => {
                          const seed = studentRow.name.length + assignment.title.length + index;
                          const base = (seed % 5) + 5;
                          return Math.min(10, Math.max(4, base + Math.random()));
                        });
                        const average = mockGrades.reduce((total, grade) => total + grade, 0) / mockGrades.length;
                        const isSelected = studentRow.id === selectedStudentId;
                        return (
                          <tr key={studentRow.id} className={isSelected ? 'bg-amber-50' : 'hover:bg-slate-50'}>
                            <td className={`sticky left-0 flex items-center gap-3 border-r border-slate-100 px-6 py-3 font-medium text-slate-900 ${isSelected ? 'bg-amber-50' : 'bg-white'}`}>
                              <div className={`h-8 w-1 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-transparent'}`} />
                              <img
                                src={studentRow.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(studentRow.name)}`}
                                alt={studentRow.name}
                                className="h-8 w-8 rounded-full border border-slate-200"
                              />
                              {studentRow.name}
                            </td>
                            {mockGrades.map((grade, index) => (
                              <td key={index} className="border-r border-slate-50 px-4 py-3 text-center">
                                <input
                                  type="number"
                                  defaultValue={grade.toFixed(1)}
                                  max={10}
                                  min={0}
                                  className={`w-14 rounded-lg border px-1 py-1.5 text-center text-xs font-bold outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 ${
                                    grade < 5 ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-700'
                                  }`}
                                />
                              </td>
                            ))}
                            <td className={`sticky right-0 border-l border-indigo-100 px-6 py-3 text-center ${isSelected ? 'bg-amber-50' : 'bg-indigo-50/30'}`}>
                              <span
                                className={`rounded-lg px-3 py-1 text-xs font-bold ${average >= 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                              >
                                {average.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Users className="h-6 w-6 text-indigo-600" />
            Ikasleen Zerrenda
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => alert('Soziograma bidalia ikasle guztiei!')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <Network className="h-4 w-4" />
              Soziograma Berria
            </button>
            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600">
              <Layout className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600">
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {selectedClass.students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className="group relative flex cursor-pointer flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="absolute right-4 top-4">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    student.status === 'present' ? 'bg-emerald-500' : student.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                />
              </div>
              <img
                src={student.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`}
                alt={student.name}
                className="mb-4 h-24 w-24 rounded-full border-4 border-slate-50 object-cover transition-transform group-hover:scale-105"
              />
              <h3 className="mb-1 text-lg font-bold text-slate-800">{student.name}</h3>
              <p className="mb-4 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">LH 5. Maila</p>
              <div className="mt-auto grid w-full grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 p-2">
                  <span className="block text-xs uppercase text-slate-400">Nota</span>
                  <span className="font-bold text-indigo-600">7.5</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <span className="block text-xs uppercase text-slate-400">Ariketak</span>
                  <span className="font-bold text-indigo-600">85%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <DashboardSidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="ml-64 flex h-full flex-1 flex-col transition-all duration-300">
        <DashboardHeader
          classes={MOCK_CLASSES}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          title={getViewTitle()}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentView === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6 pb-8">
              <div className="col-span-12 space-y-6 xl:col-span-8">
                <div className="grid h-auto grid-cols-1 gap-6 md:h-40 md:grid-cols-3">
                  <div className="col-span-1 h-40">
                    <DashboardStatsCard grade={selectedClass.averageGrade} />
                  </div>
                  <div className="col-span-1 h-40 md:col-span-2">
                    <DashboardScheduleWidget schedule={TODAY_SCHEDULE} />
                  </div>
                </div>
                <div className="h-[500px]">
                  <DashboardAttendanceWidget key={selectedClass.id} students={selectedClass.students as Student[]} />
                </div>
              </div>
              <div className="col-span-12 min-h-[500px] xl:col-span-4">
                <DashboardAgendaWidget tasks={INITIAL_TASKS} />
              </div>
            </div>
          )}
          {currentView === 'subjects' && renderSubjectsSection()}
          {currentView === 'create-exercise' && <DashboardCreateExercise />}
          {currentView === 'validate-exercise' && validatingExerciseId && (
            <ExerciseValidation
              exerciseId={validatingExerciseId}
              onBack={() => {
                setValidatingExerciseId(null);
                refetchExercises();
                handleNavigate('subjects');
              }}
              onSuccess={() => {
                setValidatingExerciseId(null);
                refetchExercises();
                handleNavigate('subjects');
              }}
            />
          )}
          {currentView === 'calendar' && renderCalendarView()}
          {currentView === 'meetings' && renderMeetingsView()}
          {currentView === 'students' && renderStudentsView()}
          {currentView === 'settings' && (
            <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400">
              <Settings className="mb-4 h-16 w-16 opacity-20" />
              <h3 className="text-xl font-bold text-slate-500">Ezarpenak</h3>
              <p className="text-sm">Atal hau garatzen ari da...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}