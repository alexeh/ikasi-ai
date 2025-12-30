# Exercise List API Integration - Visual Flow

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DashboardApp                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useSession() → Get Authentication Token             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useEffect(() => {                                   │  │
│  │    if (session?.user?.accessToken) {                 │  │
│  │      fetchExercises()                                │  │
│  │    }                                                 │  │
│  │  }, [session])                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  listExercises(accessToken)                          │  │
│  │    ↓                                                 │  │
│  │  GET /exercises                                      │  │
│  │    ↓                                                 │  │
│  │  Map API Response → UI Format                       │  │
│  │    ↓                                                 │  │
│  │  setExercises(mappedExercises)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Render Exercise List                       │  │
│  │                                                      │  │
│  │  • Loading: Show spinner                            │  │
│  │  • Error: Show error message                        │  │
│  │  • Success: Show exercises                          │  │
│  │  • Empty: Show empty state                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User clicks exercise                                │  │
│  │    ↓                                                 │  │
│  │  setValidatingExerciseId(exerciseId)                │  │
│  │    ↓                                                 │  │
│  │  handleNavigate('validate-exercise')                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│              ExerciseValidation Component                 │
│                                                           │
│  • View exercise details                                 │
│  • Edit questions                                        │
│  • Update status                                         │
│  • onBack() → refetchExercises() → back to list         │
│  • onSuccess() → refetchExercises() → back to list      │
└───────────────────────────────────────────────────────────┘
```

## Data Flow

```
API Response                    Mapped to UI
─────────────                   ────────────
{                              {
  id: "uuid",            →       id: "uuid",
  title: "Exercise",     →       title: "Exercise",
  status: "APPROVED",    →       status: "published",
  questions: [...],      →       description: "3 galdera",
  createdAt: "...",      →       date: "2023-12-30",
  updatedAt: "...",              category: "ulermena"
  createdBy: {...}             }
}
```

## State Management

```
┌─────────────────────────────────────────┐
│           Component State               │
├─────────────────────────────────────────┤
│ exercises: Exercise[]                   │
│   - Stores mapped exercise list         │
│   - Initially empty array               │
│   - Populated from API on mount         │
│                                         │
│ exercisesLoading: boolean               │
│   - true: Fetching from API             │
│   - false: Done fetching                │
│                                         │
│ exercisesError: string | null           │
│   - null: No error                      │
│   - string: Error message to display    │
│                                         │
│ validatingExerciseId: string | null     │
│   - null: Not validating any exercise   │
│   - string: ID of exercise being viewed │
└─────────────────────────────────────────┘
```

## UI States

```
┌──────────────────────────────────────────────────┐
│ State: LOADING                                   │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │           [Spinner Animation]             │  │
│  │        Ariketak kargatzen...              │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ State: ERROR                                     │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │            [Error Icon]                   │  │
│  │              Errorea                      │  │
│  │   [Error message from exception]          │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ State: EMPTY                                     │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │           [Document Icon]                 │  │
│  │   Ez dago ariketarik atal honetan...     │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ State: SUCCESS (with data)                       │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │ 2023-12-30            [draft badge]       │  │
│  │ Exercise Title                            │  │
│  │ 5 galdera                                 │  │
│  │ [Ikusi Button] ────────────────────────►  │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ 2023-12-29         [published badge]      │  │
│  │ Another Exercise                          │  │
│  │ 3 galdera                                 │  │
│  │ [Ikusi Button] ────────────────────────►  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## API Integration Flow

```
1. User Authentication
   ├─ User logs in
   ├─ NextAuth creates session
   └─ Session contains accessToken

2. Component Mount
   ├─ DashboardApp renders
   ├─ useSession() hook provides session data
   └─ useEffect triggers when session is available

3. Fetch Exercises
   ├─ setExercisesLoading(true)
   ├─ Call listExercises(accessToken)
   │   ├─ Fetch GET /exercises with Bearer token
   │   ├─ Parse JSON response
   │   └─ Return Exercise[]
   ├─ Map API exercises to UI format
   ├─ setExercises(mappedExercises)
   └─ setExercisesLoading(false)

4. Render List
   ├─ Filter exercises by category
   ├─ Render each exercise with details
   └─ Attach click handlers

5. User Interaction
   ├─ User clicks "Ikusi" button
   ├─ setValidatingExerciseId(exerciseId)
   └─ Navigate to validation view

6. Exercise Validation
   ├─ View/edit exercise details
   ├─ Save changes to API
   └─ onSuccess() callback

7. Refresh List
   ├─ refetchExercises()
   ├─ Fetch latest data from API
   └─ Update UI with new data
```

## Error Handling

```
┌───────────────────────────────────────┐
│         Error Scenarios               │
├───────────────────────────────────────┤
│                                       │
│ 1. No Session/Token                   │
│    → Skip fetch, show nothing         │
│                                       │
│ 2. Network Error                      │
│    → Catch error                      │
│    → Display: "Errorea ariketak..."  │
│                                       │
│ 3. API Returns 4xx/5xx                │
│    → Parse error message              │
│    → Display API error message        │
│                                       │
│ 4. Invalid Response Format            │
│    → Catch parsing error              │
│    → Display generic error            │
│                                       │
│ 5. Empty Response                     │
│    → Show empty state message         │
│                                       │
└───────────────────────────────────────┘
```

## Security Flow

```
┌────────────────────────────────────────────┐
│          Security Layers                   │
├────────────────────────────────────────────┤
│                                            │
│  1. NextAuth Session                       │
│     • User must be logged in               │
│     • Session contains accessToken         │
│                                            │
│  2. API Request Headers                    │
│     • Authorization: Bearer {token}        │
│     • Content-Type: application/json       │
│                                            │
│  3. API Route Guard                        │
│     • @UseGuards(RolesGuard)              │
│     • @Roles(UserRole.TEACHER)            │
│     • Validates token and role             │
│                                            │
│  4. Error Handling                         │
│     • Never expose token in errors         │
│     • Generic error messages to user       │
│     • Detailed logs in console only        │
│                                            │
└────────────────────────────────────────────┘
```
