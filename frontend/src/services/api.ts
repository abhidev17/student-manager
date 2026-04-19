import type { Student } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * API Service for Student Management
 */

class StudentAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all students
   */
  async getStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  /**
   * Fetch single student by ID
   */
  async getStudent(id: number): Promise<Student> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch student: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new student
   */
  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create student: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Update existing student
   */
  async updateStudent(id: number, updates: Partial<Student>): Promise<Student> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update student: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete student
   */
  async deleteStudent(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Bulk delete students
   */
  async bulkDeleteStudents(ids: number[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to bulk delete students: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error bulk deleting students:', error);
      // Don't throw - silently fail for bulk delete
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const studentAPI = new StudentAPI();
