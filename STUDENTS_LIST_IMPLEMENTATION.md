# Students List Feature - Implementation Guide

## Overview
This implementation adds a complete students list feature with backend API endpoint and React component for the frontend.

## Backend Implementation

### Files Added/Modified

1. **api/src/modules/students/students.controller.ts** (NEW)
   - Implements GET /students endpoint
   - Supports optional `classId` query parameter
   - Protected by RolesGuard (TEACHER role required)

2. **api/src/modules/students/students.service.ts** (MODIFIED)
   - Added `findAll(classId?: string)` method
   - Returns students with user and class relations
   - Filters by classId when provided

3. **api/src/modules/students/students.module.ts** (MODIFIED)
   - Exports StudentsController

### API Endpoint Usage

```bash
# Get all students
GET /students
Authorization: Bearer <token>

# Get students filtered by class
GET /students?classId=<uuid>
Authorization: Bearer <token>
```

### Response Format

```json
[
  {
    "id": "student-uuid",
    "userId": "user-uuid",
    "user": {
      "id": "user-uuid",
      "name": "John",
      "lname": "Doe",
      "email": "john.doe@example.com"
    },
    "studentClass": {
      "id": "class-uuid",
      "name": "Class 5A"
    }
  }
]
```

## Frontend Implementation

### Files Added

1. **web/src/lib/students.ts** (NEW)
   - API client for students endpoint
   - `listStudents(accessToken, classId?)` function
   - TypeScript interfaces for Student, StudentUser, StudentClass

2. **web/src/components/dashboard/students-list.tsx** (NEW)
   - React component to display students
   - Fetches data from API using NextAuth session
   - Handles loading and error states
   - Supports optional classId filtering

3. **web/src/app/students/page.tsx** (NEW)
   - Demo page showing StudentsList component usage
   - Interactive filter controls

### Component Usage

#### Basic Usage (All Students)

```tsx
import { StudentsList } from '@/components/dashboard/students-list';

export function MyComponent() {
  return <StudentsList />;
}
```

#### With Class Filter

```tsx
import { StudentsList } from '@/components/dashboard/students-list';

export function MyComponent() {
  const classId = "class-uuid-here";
  return <StudentsList classId={classId} />;
}
```

#### Integration Example in Dashboard

Here's how to replace mock data with real data in the dashboard:

```tsx
// Before (with mock data)
import { MOCK_CLASSES } from '@/mocks/dashboard-data';

const students = MOCK_CLASSES[0]?.students || [];

// After (with real data)
import { StudentsList } from '@/components/dashboard/students-list';

// In your component JSX:
<StudentsList classId={selectedClassId} />
```

## Testing

### Backend Tests

#### Unit Tests
- `api/src/modules/students/students.controller.spec.ts` - Controller tests
- `api/src/modules/students/students.service.spec.ts` - Service tests
- All 9 unit tests passing ✓

#### E2E Tests
- `api/test/students.e2e-spec.ts` - Integration tests
- Tests authentication, filtering, and data retrieval
- Requires database configuration to run

### Running Tests

```bash
# Run unit tests
cd api
pnpm test students

# Run all tests
pnpm test

# Run e2e tests (requires database)
pnpm test:e2e
```

## Authentication & Authorization

- **Backend**: Protected by JWT authentication + RolesGuard
- **Frontend**: Uses NextAuth session token
- **Required Role**: TEACHER

## Features

✅ Fetch all students  
✅ Filter students by class  
✅ Display student information (name, email, class)  
✅ Loading states  
✅ Error handling  
✅ Authentication integration  
✅ Type-safe API client  
✅ Comprehensive tests  

## Demo

Visit `/students` page to see the StudentsList component in action with:
- All students view
- Class-filtered view
- Interactive filter controls
- Integration notes

## Next Steps for Integration

1. **Replace Mock Data in Dashboard**
   - Find where `MOCK_CLASSES[0].students` is used
   - Replace with `<StudentsList classId={selectedClassId} />`

2. **Add to Attendance Widget**
   ```tsx
   // In attendance-widget.tsx
   import { StudentsList } from './students-list';
   
   // Replace the hardcoded student list with:
   <StudentsList classId={selectedClass?.id} />
   ```

3. **Styling Adjustments**
   - The StudentsList component uses basic styling
   - Adjust classes to match your dashboard theme
   - Consider adding avatar images if available

4. **Loading State Customization**
   - Current loading state is simple text
   - Can be enhanced with skeleton loaders to match dashboard

5. **Error Handling**
   - Current error display is basic
   - Consider adding retry buttons or better error messages

## Code Quality

- ✅ ESLint compliant
- ✅ TypeScript strict mode
- ✅ Follows project conventions
- ✅ Consistent with existing code patterns
