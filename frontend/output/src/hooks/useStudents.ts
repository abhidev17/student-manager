import { useState, useEffect, useMemo, useCallback } from "react";
import type { Student } from "../types";
import { api } from "../services/api";
import { toast } from "../components/Toast";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStudents();
      setStudents(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load students";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = useCallback(async (data: Omit<Student, "id">) => {
    const student = await api.createStudent(data);
    setStudents((prev) => [student, ...prev]);
    toast.success("Student added successfully");
    return student;
  }, []);

  const updateStudent = useCallback(async (id: number, data: Partial<Student>) => {
    const updated = await api.updateStudent(id, data);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    toast.success("Student updated");
    return updated;
  }, []);

  const deleteStudent = useCallback(async (id: number) => {
    await api.deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast.success("Student removed");
  }, []);

  const stats = useMemo(() => {
    const total = students.length;
    const courses = new Set(students.map((s) => s.course)).size;
    const withGpa = students.filter((s) => typeof s.gpa === "number");
    const avgGpa =
      withGpa.length > 0
        ? withGpa.reduce((sum, s) => sum + (s.gpa ?? 0), 0) / withGpa.length
        : null;
    const courseBreakdown = Object.entries(
      students.reduce<Record<string, number>>((acc, s) => {
        acc[s.course] = (acc[s.course] ?? 0) + 1;
        return acc;
      }, {})
    ).sort(([, a], [, b]) => b - a);

    return { total, courses, avgGpa, courseBreakdown };
  }, [students]);

  return {
    students,
    loading,
    error,
    stats,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
