const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface StudentUser {
  id: string;
  name: string;
  lname?: string;
  email: string;
}

export interface StudentClass {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  userId: string;
  user: StudentUser;
  studentClass?: StudentClass;
}

/**
 * Fetch all students, optionally filtered by class
 * @param accessToken - The user's access token from NextAuth session (required)
 * @param classId - Optional class ID to filter students by
 * @throws Error if accessToken is not provided
 */
export async function listStudents(
  accessToken: string,
  classId?: string
): Promise<Student[]> {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in.');
  }

  const url = new URL(`${API_URL}/students`);
  if (classId) {
    url.searchParams.append('classId', classId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch students';
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
