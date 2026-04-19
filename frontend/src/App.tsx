import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './layout/AppLayout';
import { Sidebar } from './layout/Sidebar';
import StudentModal from './components/StudentModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import BulkImportModal from './components/BulkImportModal';
import StudentReportModal from './components/StudentReportModal';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { useStudent } from './store/StudentContext';
import { useModal, useToast, useConfirm } from './hooks';
import type { Student } from './types';

function App() {
  const { students, loading, error, fetchStudents, addStudent, updateStudent, deleteStudent } =
    useStudent();
  const { toasts, addToast, removeToast } = useToast();
  const addModal = useModal();
  const editModal = useModal();
  const deleteConfirm = useConfirm();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'students' | 'analytics'>(
    'dashboard'
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [error, addToast]);

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      await addStudent(studentData);
      addToast('Student added successfully!', 'success');
      addModal.close();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add student';
      addToast(message, 'error');
    }
  };

  const handleUpdateStudent = async (studentData: Omit<Student, 'id'>) => {
    if (!editModal.data) return;
    try {
      await updateStudent(editModal.data.id, studentData);
      addToast('Student updated successfully!', 'success');
      editModal.close();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update student';
      addToast(message, 'error');
    }
  };

  const handleDeleteClick = (student: Student) => {
    deleteConfirm.confirm(
      `Delete ${student.name}?`,
      'This action cannot be undone. The record will be permanently removed.',
      () => handleConfirmDelete(student.id, student.name)
    );
  };

  const handleConfirmDelete = async (id: number, name: string) => {
    try {
      await deleteStudent(id);
      addToast(`${name} deleted successfully!`, 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete student';
      addToast(message, 'error');
    }
  };

  const handleBulkImport = async (studentsToImport: Omit<Student, 'id'>[]) => {
    try {
      for (const student of studentsToImport) {
        await addStudent(student);
      }
      addToast(`${studentsToImport.length} students imported successfully!`, 'success');
      await fetchStudents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import students';
      addToast(message, 'error');
      throw err;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email === 'demo@example.com' && password === 'demo123') {
      setIsLoggedIn(true);
      addToast('Welcome back!', 'success');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
    addToast('Logged out successfully', 'success');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppLayout
      sidebar={
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />
      }
    >
      {activeSection === 'dashboard' && (
        <Dashboard
          students={students}
          onAddStudent={addModal.open}
          onOpenImport={() => setImportModalOpen(true)}
          onOpenReport={() => setReportModalOpen(true)}
        />
      )}

      {activeSection === 'students' && (
        <Students
          students={students}
          loading={loading}
          onAddStudent={addModal.open}
          onEditStudent={(student) => editModal.open(student)}
          onDeleteStudent={handleDeleteClick}
        />
      )}

      {activeSection === 'analytics' && <Analytics students={students} />}

      {/* Modals & Notifications */}
      <Toaster position="top-right" />

      <StudentModal
        isOpen={addModal.isOpen && !editModal.data}
        editingStudent={null}
        onClose={addModal.close}
        onSubmit={handleAddStudent}
        isLoading={loading}
      />

      <StudentModal
        isOpen={editModal.isOpen}
        editingStudent={editModal.data}
        onClose={editModal.close}
        onSubmit={handleUpdateStudent}
        isLoading={loading}
      />

      <ConfirmDeleteModal
        isOpen={deleteConfirm.isOpen}
        itemName="student"
        isLoading={deleteConfirm.isLoading}
        onConfirm={deleteConfirm.proceed}
        onCancel={deleteConfirm.cancel}
      />

      <BulkImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleBulkImport}
        isLoading={loading}
      />

      <StudentReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        students={students}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppLayout>
  );
}

export default App;
