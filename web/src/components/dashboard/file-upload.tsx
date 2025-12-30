'use client';

import { useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';
import { uploadExerciseInput, type InputUploadResponse } from '@/lib/inputs';

interface FileUploadProps {
  subject?: string;
  category?: string;
  onUploadSuccess?: (result: InputUploadResponse) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({ subject, category, onUploadSuccess, onUploadError }: FileUploadProps) {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<InputUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      const errorMsg = 'Fitxategi bat aukeratu behar duzu.';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    if (!session?.user?.accessToken) {
      const errorMsg = 'Autentifikazioa beharrezkoa da. Mesedez, hasi saioa.';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadExerciseInput(
        selectedFile,
        session.user.accessToken,
        subject,
        category
      );
      setResult(uploadResult);
      onUploadSuccess?.(uploadResult);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ezin izan da fitxategia bidali.';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50'
        }`}
      >
        <div className="rounded-full bg-white p-3 shadow-sm">
          <Upload className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            {isDragging ? 'Jaregin fitxategia hemen' : 'Klikatu edo arrastatu fitxategia'}
          </p>
          <p className="mt-1 text-xs text-slate-400">PDF, DOCX, MP3, MP4</p>
        </div>
        <input
          id="file-upload"
          name="file-upload"
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
        type="button"
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}
