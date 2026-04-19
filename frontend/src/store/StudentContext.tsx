import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Student, StudentContextType } from '../types';
import { mockAPI } from '../services/mock-api';

interface State {
  students: Student[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: { id: number; updates: Partial<Student> } }
  | { type: 'DELETE_STUDENT'; payload: number };

const initialState: State = {
  students: [],
  loading: false,
  error: null,
};

const studentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_STUDENTS':
      return { ...state, students: action.payload, error: null };
    case 'ADD_STUDENT':
      return { ...state, students: [action.payload, ...state.students] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(s => s.id !== action.payload),
      };
    default:
      return state;
  }
};

export const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  const fetchStudents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const students = await mockAPI.getStudents();
      dispatch({ type: 'SET_STUDENTS', payload: students });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch students';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addStudent = useCallback(async (student: Omit<Student, 'id'>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const newStudent = await mockAPI.createStudent(student);
      dispatch({ type: 'ADD_STUDENT', payload: newStudent });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add student';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    }
  }, []);

  const updateStudent = useCallback(async (id: number, updates: Partial<Student>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      await mockAPI.updateStudent(id, updates);
      dispatch({ type: 'UPDATE_STUDENT', payload: { id, updates } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update student';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    }
  }, []);

  const deleteStudent = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      await mockAPI.deleteStudent(id);
      dispatch({ type: 'DELETE_STUDENT', payload: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete student';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    }
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value: StudentContextType = {
    students: state.students,
    loading: state.loading,
    error: state.error,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchStudents,
    setError,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudent = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
};
