/**
 * Student data model
 */
export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  gpa?: number;
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

/**
 * Store context types
 */
export interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: number, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
  fetchStudents: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Toast notification types
 */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

/**
 * Filter state
 */
export interface FilterState {
  searchTerm: string;
  course: string | null;
  ageGroup: 'all' | 'under-20' | '20-25' | '25-plus' | null;
}

/**
 * Table sorting
 */
export interface SortConfig {
  key: keyof Student;
  direction: 'asc' | 'desc';
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit' | null;
  data?: Student | null;
}

/**
 * Course statistics
 */
export interface CourseStats {
  course: string;
  count: number;
  percentage: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalStudents: number;
  averageGpa: number;
  coursesCount: number;
  courseDistribution: CourseStats[];
}
