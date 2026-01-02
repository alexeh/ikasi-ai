'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { listStudents, Student } from '@/lib/students';

interface StudentsListProps {
  classId?: string;
}

export function StudentsList({ classId }: StudentsListProps) {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      if (!session?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await listStudents(session.accessToken, classId);
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [session?.accessToken, classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!session?.accessToken) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Please log in to view students</div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No students found</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {getInitials(student.user)}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {student.user.name}
              {student.user.lname && ` ${student.user.lname}`}
            </div>
            <div className="text-sm text-gray-500">{student.user.email}</div>
          </div>
          {student.studentClass && (
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {student.studentClass.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getInitials(user: { name: string; lname?: string }): string {
  const firstInitial = user.name.charAt(0).toUpperCase();
  const lastInitial = user.lname?.charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
}
