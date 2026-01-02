import { Suspense } from 'react';
import { StudentsList } from '@/components/dashboard/students-list';

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Students List</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <StudentsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
