const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface InputUploadResponse {
  id: string;
  s3UploadData: unknown;
  llmUploadData: unknown;
  createDate?: string;
}

/**
 * Upload an exercise input file
 * @param file - The file to upload
 * @param accessToken - The user's access token from NextAuth session (required)
 * @throws Error if accessToken is not provided
 */
export async function uploadExerciseInput(file: File, accessToken: string): Promise<InputUploadResponse> {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in to upload files.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(`${API_URL}/exercises/input`, {
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