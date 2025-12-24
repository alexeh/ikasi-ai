export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  lname?: string;
  role: 'teacher' | 'student';
  locale?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Signup failed';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
    // Also set as cookie for server-side middleware access
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    // First try localStorage
    const token = localStorage.getItem('access_token');
    if (token) return token;
    
    // Fallback to cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return value;
      }
    }
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    // Also remove the cookie
    document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
