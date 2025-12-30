# Implementation Notes: Exercise List API Integration

## Overview
This implementation replaces the mock exercise data in the "Eskuragarri dauden Ariketak" (Available Exercises) section with real data fetched from the API.

## Changes Made

### 1. API Client Function (`/web/src/lib/exercises.ts`)
- **Added**: `listExercises(accessToken: string): Promise<Exercise[]>` function
- Fetches all exercises from `GET /exercises` endpoint
- Requires authentication token from NextAuth session
- Returns array of Exercise objects with proper error handling

### 2. Dashboard Component (`/web/src/components/dashboard/DashboardApp.tsx`)
- **Added**: Integration with NextAuth's `useSession()` hook for authentication
- **Added**: State management for exercises loading and error states:
  - `exercisesLoading`: boolean for loading state
  - `exercisesError`: string | null for error messages
- **Modified**: Exercises state initialization from mock data to empty array
- **Added**: `useEffect` hook to fetch exercises on component mount (when session is available)
- **Added**: `refetchExercises()` function to manually refresh the exercises list
- **Added**: Loading spinner and error display in the exercise list UI
- **Added**: Click handlers on exercise items to navigate to validation/detail view
- **Modified**: Exercise display to use API data mapped to UI format

### 3. Data Mapping
The API exercise structure is mapped to the UI format:
- `id`: Exercise UUID from API
- `title`: Exercise title (or 'Izenik gabeko ariketa' if empty)
- `description`: Shows question count (e.g., "5 galdera")
- `category`: Default to 'ulermena' (can be enhanced based on subject)
- `status`: 'published' for APPROVED, 'draft' for DRAFT
- `date`: Formatted creation date from API

## Features Implemented

### 1. List All Exercises
- Fetches all exercises from the API (no filtering by creator)
- Shows exercises regardless of who created them
- Displays key information: title, status, date, question count

### 2. Loading States
- Displays spinner while fetching exercises
- Shows user-friendly error messages if fetch fails
- Gracefully handles authentication requirements

### 3. Exercise Detail Navigation
- Click any exercise to view/edit details
- Opens existing ExerciseValidation component
- Properly passes exercise ID to validation view

### 4. Auto-refresh
- List refreshes after successful exercise validation
- List refreshes after navigating back from validation
- New exercises appear immediately after creation

## Testing Instructions

### Prerequisites
1. Ensure API is running on the configured URL (default: http://localhost:3000)
2. Ensure you are logged in with a valid teacher account
3. Database should have some exercises already created

### Manual Testing Steps

1. **View Exercise List**
   - Navigate to "Ikasgaiak" (Subjects) in the sidebar
   - Select any subject (e.g., "Euskara", "Matematika")
   - Select a category (e.g., "Ulermena")
   - Verify exercises appear in the right panel
   - Check that loading spinner appears briefly while fetching

2. **Verify Exercise Details**
   - Check that each exercise shows:
     - Title
     - Date
     - Status badge (draft/published)
     - Question count in description
   - Verify the list shows ALL exercises, not just your own

3. **Navigate to Exercise Detail**
   - Click "Ikusi" (View) button on any exercise
   - Verify you're taken to the validation view
   - Verify the exercise details load correctly
   - Click back arrow to return to list
   - Verify list refreshes with latest data

4. **Create New Exercise**
   - In a language subject's "Ulermena" category
   - Enter a title and upload a file
   - After successful upload, verify:
     - Redirected to validation view
     - Can see the generated questions
     - After validation, returning to list shows the new exercise

5. **Error Handling**
   - Disconnect from API/network
   - Refresh the page
   - Verify error message displays properly
   - Reconnect and verify data loads

6. **Empty State**
   - If database has no exercises:
     - Verify empty state message displays
   - After creating first exercise:
     - Verify it appears in the list

## Known Limitations

1. **Category Mapping**: Currently defaults all exercises to 'ulermena' category. Future enhancement could derive category from exercise metadata or subject information.

2. **Subject Information**: The API exercise doesn't directly include subject information in the response. This could be enhanced by including subject data in the API response or deriving it from the questions.

3. **Filtering**: The current implementation shows all exercises. Future enhancements could add:
   - Filter by subject
   - Filter by creator
   - Filter by status
   - Search functionality

## Security Considerations

- All API calls require authentication via Bearer token
- Token is automatically provided by NextAuth session
- Proper error handling prevents token leakage
- User must be logged in as TEACHER role to access exercises

## Performance Considerations

- Exercises are fetched once on component mount
- Manual refresh available via validation callback
- Consider implementing pagination for large exercise lists (future enhancement)
- Consider caching with React Query or SWR for better UX (future enhancement)

## Future Enhancements

1. **Pagination**: Add pagination for exercise lists with many items
2. **Filtering & Search**: Add UI controls to filter/search exercises
3. **Sorting**: Allow sorting by date, title, status
4. **Category Detection**: Automatically detect exercise category from content
5. **Subject Display**: Show subject name for each exercise
6. **Bulk Actions**: Select multiple exercises for batch operations
7. **Real-time Updates**: Use WebSocket or polling for live updates
8. **Optimistic Updates**: Update UI immediately before API confirmation
