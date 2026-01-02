'use client';

import { useState } from 'react';
import { StudentsList } from '@/components/dashboard/students-list';

export default function StudentsPage() {
  const [classId, setClassId] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students List Demo</h1>
          <p className="text-gray-600">
            This page demonstrates the StudentsList component fetching data from the backend API.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setClassId(undefined)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                classId === undefined
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Students
            </button>
            <input
              type="text"
              placeholder="Enter Class ID to filter"
              value={classId || ''}
              onChange={(e) => setClassId(e.target.value || undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {classId
              ? `Filtering students by class ID: ${classId}`
              : 'Showing all students (no filter applied)'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Students</h2>
          <StudentsList classId={classId} />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Integration Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• The component fetches students from GET /students endpoint</li>
            <li>• Optional classId parameter filters students by class</li>
            <li>• Requires authentication (uses NextAuth session token)</li>
            <li>• Displays student name, email, and class information</li>
            <li>• Handles loading and error states gracefully</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
