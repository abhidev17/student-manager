/**
 * Mock API Service for Development/Testing
 * Simulates backend responses using localStorage
 */

import type { Student } from '../types';

class MockAPI {
  private storageKey = 'students_data';
  private nextId = 100;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      const mockStudents: Student[] = [
        { id: 1, name: 'Aarav Patel', age: 20, course: 'Computer Science', gpa: 3.8 },
        { id: 2, name: 'Priya Sharma', age: 21, course: 'Data Science', gpa: 3.9 },
        { id: 3, name: 'Rohan Kumar', age: 19, course: 'Engineering', gpa: 3.5 },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(mockStudents));
      this.nextId = 4;
    } else {
      const students = JSON.parse(stored) as Student[];
      this.nextId = Math.max(...students.map(s => s.id)) + 1;
    }
  }

  async getStudents(): Promise<Student[]> {
    await this.delay(200);
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  async getStudent(id: number): Promise<Student> {
    await this.delay(150);
    const students = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Student[];
    const student = students.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  }

  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    await this.delay(300);
    const students = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Student[];
    const newStudent = { ...student, id: this.nextId++ };
    students.push(newStudent);
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return newStudent;
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<Student> {
    await this.delay(300);
    const students = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Student[];
    const index = students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    students[index] = { ...students[index], ...updates, id };
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return students[index];
  }

  async deleteStudent(id: number): Promise<void> {
    await this.delay(250);
    const students = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Student[];
    const filtered = students.filter(s => s.id !== id);
    if (filtered.length === students.length) throw new Error('Student not found');
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  async healthCheck(): Promise<{ status: 'ok' }> {
    await this.delay(100);
    return { status: 'ok' };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockAPI = new MockAPI();
