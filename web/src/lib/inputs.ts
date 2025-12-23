import { API_URL, getToken } from './auth';

export interface InputUploadResponse {
  id: string;
  s3UploadData: unknown;
  llmUploadData: unknown;
  createDate?: string;
}

export async function uploadExerciseInput(file: File): Promise<InputUploadResponse> {
  const token = getToken();

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/inputs/pdf`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = 'Ezin izan da fitxategia igo';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // keep default
    }
    throw new Error(errorMessage);
  }

  return response.json();
}