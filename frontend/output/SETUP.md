# Student Manager — Rebuilt UI

A complete frontend rebuild with a dark, premium aesthetic.  
All backend API calls and CRUD logic are preserved unchanged.

---

## File placement guide

Copy each file into your existing project at the paths shown:

```
your-project/
├── frontend/
│   ├── package.json                         ← REPLACE (adds framer-motion)
│   ├── tailwind.config.ts                   ← REPLACE
│   └── src/
│       ├── App.tsx                          ← REPLACE
│       ├── main.tsx                         ← unchanged (keep yours)
│       ├── index.css                        ← REPLACE
│       ├── types/
│       │   └── index.ts                     ← NEW (replaces root types.ts)
│       ├── services/
│       │   └── api.ts                       ← NEW
│       ├── hooks/
│       │   └── useStudents.ts               ← NEW
│       ├── pages/
│       │   └── StudentsPage.tsx             ← NEW
│       └── components/
│           ├── Toast.tsx                    ← REPLACE
│           ├── ConfirmDialog.tsx            ← REPLACE (was ConfirmModal.tsx)
│           ├── AddStudentModal.tsx          ← NEW
│           ├── StatCard.tsx                 ← NEW
│           ├── StudentCard.tsx              ← REPLACE
│           ├── SearchBar.tsx                ← NEW
│           ├── FilterChips.tsx              ← NEW
│           ├── EmptyState.tsx               ← NEW
│           ├── LoadingGrid.tsx              ← REPLACE (was LoadingSpinner.tsx)
│           └── CourseBar.tsx                ← NEW
```

### Files you can safely DELETE (no longer used)

```
src/components/StudentForm.tsx
src/components/StudentList.tsx
src/components/StatsPanel.tsx
src/components/StudentCard.tsx   (replaced by new version)
src/components/Footer.tsx
src/components/LoadingSpinner.tsx
src/types.ts                     (moved to src/types/index.ts)
src/constants/                   (constants now live in components)
```

---

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

This installs `framer-motion` which is the only new dependency.

### 2. Set your API URL

Make sure your `.env` file exists at `frontend/.env`:

```
VITE_API_URL=https://your-backend-url.com
```

### 3. Run

```bash
npm run dev
```

---

## What changed

| Area              | Before                         | After                               |
|-------------------|--------------------------------|-------------------------------------|
| Theme             | Light / Dark toggle            | Always dark, premium                |
| Layout            | Sidebar + nav sections         | Vertical flow, single page          |
| Student display   | Card grid (glassmorphism)      | Card grid with glow hover effects   |
| Add student       | Inline sidebar form            | Floating modal, scale+fade          |
| Animations        | CSS keyframes                  | Framer Motion throughout            |
| Loading state     | Simple spinner                 | Skeleton card grid                  |
| Empty state       | Basic message                  | Illustrated centered call-to-action |
| Toasts            | Top-right                      | Bottom-right, spring animation      |
| Delete confirm    | Modal                          | Modal (preserved, restyled)         |
| Types             | Root `types.ts`                | `src/types/index.ts`                |
| API calls         | Spread across App.tsx          | `src/services/api.ts`               |
| Data logic        | Inline in App.tsx              | `src/hooks/useStudents.ts`          |

---

## API contract (unchanged)

```
GET    /api/students          → Student[]
POST   /api/students          → Student
PUT    /api/students/:id      → Student
DELETE /api/students/:id      → void
```

The `Student` type is:
```ts
interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  gpa?: number;
}
```
