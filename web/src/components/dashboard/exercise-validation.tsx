'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  BookCheck,
  HelpCircle,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { 
  getExercise, 
  updateExercise, 
  Exercise, 
  ExerciseStatus,
  QuestionType,
} from '@/lib/exercises';

interface ExerciseValidationProps {
  exerciseId: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export function ExerciseValidation({ exerciseId, onBack, onSuccess }: ExerciseValidationProps) {
  const { data: session } = useSession();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    async function loadExercise() {
      if (!session?.user?.accessToken) {
        setError('Autentifikazioa beharrezkoa da. Mesedez, hasi saioa.');
        setLoading(false);
        return;
      }

      try {
        const data = await getExercise(exerciseId, session.user.accessToken);
        setExercise(data);
        
        // Initialize selected answers with current correct answers
        const initialAnswers: Record<number, number> = {};
        data.questions.forEach((question) => {
          if (question.correctAnswerIndex !== undefined && question.correctAnswerIndex !== null) {
            initialAnswers[question.id] = question.correctAnswerIndex;
          }
        });
        setSelectedAnswers(initialAnswers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ezin izan da ariketa kargatu.');
      } finally {
        setLoading(false);
      }
    }

    loadExercise();
  }, [exerciseId, session]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleReview = async () => {
    if (!session?.user?.accessToken) {
      setError('Autentifikazioa beharrezkoa da. Mesedez, hasi saioa.');
      return;
    }

    if (!exercise) {
      setError('Ez dago ariketarik kargaturik.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const questionUpdates = Object.entries(selectedAnswers).map(([questionId, answerIndex]) => ({
        id: parseInt(questionId),
        correctAnswerIndex: answerIndex,
      }));

      await updateExercise(
        exerciseId,
        {
          status: ExerciseStatus.APPROVED,
          questions: questionUpdates,
        },
        session.user.accessToken
      );

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ezin izan da ariketa gorde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-slate-600">Ariketa kargatzen...</p>
        </div>
      </div>
    );
  }

  if (error && !exercise) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-rose-600" />
          <div>
            <h3 className="font-bold text-rose-900">Errorea</h3>
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-rose-700 hover:text-rose-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Atzera
          </button>
        )}
      </div>
    );
  }

  if (!exercise) {
    return null;
  }

  const hasAllAnswers = exercise.questions
    .filter(q => q.type === QuestionType.SINGLE_CHOICE)
    .every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Balioztatu Ariketa</p>
          <h1 className="text-2xl font-bold">{exercise.title || 'Ariketa'}</h1>
          <p className="text-sm text-indigo-100">
            Berrikusi AI-ak sortutako galderak eta egiaztatu erantzun zuzenak.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          <BookCheck className="h-4 w-4" />
          {exercise.questions.length} Galdera
        </div>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Atzera
        </button>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {exercise.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{question.prompt}</h3>
                {question.explanation && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {question.type === QuestionType.SINGLE_CHOICE && question.options && (
              <div className="space-y-2 pl-11">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[question.id] === optionIndex;
                  const wasOriginal = question.correctAnswerIndex === optionIndex;
                  
                  return (
                    <label
                      key={optionIndex}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, optionIndex)}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <span className={`flex-1 ${isSelected ? 'font-semibold text-indigo-900' : 'text-slate-700'}`}>
                        {option}
                      </span>
                      {wasOriginal && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                          AI-k gomendatua
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {question.type === QuestionType.OPEN && (
              <div className="pl-11">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="italic">Erantzun irekia - Ez da balioztapenik behar</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {hasAllAnswers ? (
              <span className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Galdera guztiak erantzunda
              </span>
            ) : (
              <span className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Mesedez, aukeratu erantzun zuzena galdera guztietan
              </span>
            )}
          </div>
          
          <button
            onClick={handleReview}
            disabled={!hasAllAnswers || saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Gordetzen...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Berrikusi eta Onartu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
