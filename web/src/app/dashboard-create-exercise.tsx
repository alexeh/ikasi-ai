'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';
import { InputUploadResponse, uploadExerciseInput } from "../lib/inputs";

// import { uploadExerciseInput, type InputUploadResponse } from '@/lib/inputs';

export function DashboardCreateExercise() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<InputUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Fitxategi bat aukeratu behar duzu.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadExerciseInput(selectedFile);
      setResult(uploadResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ezin izan da fitxategia bidali.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Ariketa berriak</p>
          <h1 className="text-2xl font-bold">Dokumentutik ariketa sortu</h1>
          <p className="text-sm text-indigo-100">
            Igo fitxategia eta bidali zuzenean input kontrolagailura galderak sortzeko oinarri gisa.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          <Upload className="h-4 w-4" />
          PDF, DOCX, MP3, MP4
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4">
              <div className="rounded-full bg-white p-2 shadow">
                <Upload className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Dokumentua igo</h2>
                <p className="text-sm text-slate-600">Igo dokumentua prozesamentua hasteko.</p>
              </div>
            </div>

            <label
              htmlFor="exercise-file"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <div className="rounded-full bg-white p-3 shadow-sm">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800">Sartu edo hautatu dokumentua</p>
                <p className="text-sm text-slate-500">Gehienez 25MB</p>
              </div>
              <input
                id="exercise-file"
                name="exercise-file"
                type="file"
                accept=".pdf,.doc,.docx,.mp3,.mp4"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
                  {selectedFile.name}
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              {isUploading ? 'Bidaltzen...' : 'Bidali'}
            </button>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {result && !error && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Fitxategia zuzen bidali da eta prozesatua izanda.</span>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Erantzuna</p>
                <h3 className="text-lg font-bold text-slate-900">Prebisualizazioa</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Live</span>
            </div>
            <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {result ? (
                <pre className="whitespace-pre-wrap break-words text-xs text-slate-800">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-500">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <p>Igo dokumentua eta hemen ikusiko duzu prebisualizazioa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}