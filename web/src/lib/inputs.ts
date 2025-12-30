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
 * @param subject - Optional subject code (e.g., 'euskara', 'matematika'). If provided, category is also required.
 * @param category - Optional category code (e.g., 'ulermena', 'kalkulu_mentala'). Required if subject is provided.
 * @throws Error if accessToken is not provided
 */
export async function uploadExerciseInput(
  file: File, 
  accessToken: string,
  subject?: string,
  category?: string
): Promise<InputUploadResponse> {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in to upload files.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Use subject-specific endpoint if both subject and category are provided
  const endpoint = subject && category 
    ? `${API_URL}/exercises/${subject}/${category}/input`
    : `${API_URL}/exercises/input`;

  const response = await fetch(endpoint, {
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