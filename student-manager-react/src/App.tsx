import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import type { Student } from "./types";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import Toast, { showToast } from "./components/Toast";

const API_URL = "http://localhost:5000/api/students";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdate = async (student: Student) => {
    try {
      const isEditing = student.id && students.some(s => s.id === student.id);

      if (isEditing) {
        // Update existing student
        const res = await fetch(`${API_URL}/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error("Failed to update student");
        const updatedStudent = await res.json();

        setStudents(prev =>
          prev.map(s => (s.id === student.id ? updatedStudent : s))
        );
        showToast("Student updated successfully", "success");
      } else {
        // Add new student
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error("Failed to add student");
        const newStudent = await res.json();

        setStudents(prev => [...prev, newStudent]);
        showToast("Student added successfully", "success");
      }

      setEditing(null);
    } catch (error) {
      console.error("Error saving student:", error);
      showToast(
        editing ? "Failed to update student" : "Failed to add student",
        "error"
      );
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete student");

      setStudents(prev => prev.filter(s => s.id !== id));
      showToast("Student deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting student:", error);
      showToast("Failed to delete student", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Manager</h1>
              <p className="text-slate-400 text-sm">Manage your student records efficiently</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <StudentForm addOrUpdate={addOrUpdate} editing={editing} />
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            ) : (
              <StudentList students={students} onDelete={deleteStudent} onEdit={setEditing} />
            )}
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <Toast />
    </div>
  );
}