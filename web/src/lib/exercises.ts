const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  OPEN = 'open',
}

export interface Question {
  id: number;
  type: QuestionType;
  prompt: string;
  explanation?: string;
  options?: string[];
  correctAnswerIndex?: number;
}

export interface Exercise {
  id: string;
  title?: string;
  status: ExerciseStatus;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateQuestionDto {
  id: number;
  correctAnswerIndex?: number;
}

export interface UpdateExerciseDto {
  title?: string;
  status?: ExerciseStatus;
  questions?: UpdateQuestionDto[];
}

/**
 * Fetch an exercise by ID
 * @param id - Exercise ID
 * @param accessToken - The user's access token from NextAuth session (required)
 * @throws Error if accessToken is not provided
 */
export async function getExercise(
  id: string,
  accessToken: string
): Promise<Exercise> {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  console.log('QUERY HECHA')

  if (!response.ok) {
    let errorMessage = 'Failed to fetch exercise';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // keep default
    }
    throw new Error(errorMessage);
  }
  const res = await response.json();
  console.log('EXERCISES', res)
  return res
}

/**
 * Fetch all exercises
 * @param accessToken - The user's access token from NextAuth session (required)
 * @throws Error if accessToken is not provided
 */
export async function listExercises(
  accessToken: string
): Promise<Exercise[]> {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_URL}/exercises`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch exercises';
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

/**
 * Update an exercise
 * @param id - Exercise ID
 * @param data - Update data
 * @param accessToken - The user's access token from NextAuth session (required)
 * @throws Error if accessToken is not provided
 */
export async function updateExercise(
  id: string,
  data: UpdateExerciseDto,
  accessToken: string
): Promise<Exercise> {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update exercise';
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
