/**
 * Bulk Operations Service
 * Handles bulk import, export, and delete operations
 */

import type { Student } from '../types';

export class BulkOperationsService {
  /**
   * Parse CSV data and convert to Student array
   */
  static parseCSV(csvText: string): Omit<Student, 'id'>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least 1 header row and 1 data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIdx = headers.indexOf('name');
    const ageIdx = headers.indexOf('age');
    const courseIdx = headers.indexOf('course');
    const gpaIdx = headers.indexOf('gpa');

    if (nameIdx === -1 || ageIdx === -1 || courseIdx === -1) {
      throw new Error('CSV must contain: name, age, course columns');
    }

    const students: Omit<Student, 'id'>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.filter(v => v).length === 0) continue; // Skip empty rows

      const student: Omit<Student, 'id'> = {
        name: values[nameIdx] || '',
        age: parseInt(values[ageIdx]) || 18,
        course: values[courseIdx] || '',
        gpa: gpaIdx >= 0 ? parseFloat(values[gpaIdx]) : undefined,
      };

      if (!student.name || !student.course) {
        throw new Error(`Row ${i + 1}: name and course are required`);
      }

      students.push(student);
    }

    return students;
  }

  /**
   * Export students to CSV format
   */
  static exportToCSV(students: Student[], filename = 'students'): void {
    const headers = ['ID', 'Name', 'Age', 'Course', 'GPA'];
    const rows = students.map(s => [
      s.id,
      `"${s.name}"`,
      s.age,
      `"${s.course}"`,
      s.gpa ?? '—',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Generate student report (JSON format)
   */
  static generateReport(students: Student[]): {
    totalStudents: number;
    averageGPA: number;
    highestGPA: Student | null;
    lowestGPA: Student | null;
    courseDistribution: Record<string, number>;
    ageDistribution: Record<string, number>;
    gpaDistribution: Record<string, number>;
  } {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageGPA: 0,
        highestGPA: null,
        lowestGPA: null,
        courseDistribution: {},
        ageDistribution: {},
        gpaDistribution: {},
      };
    }

    const withGPA = students.filter(s => s.gpa !== undefined && s.gpa !== null);
    const avgGPA = withGPA.length > 0 ? withGPA.reduce((sum, s) => sum + (s.gpa || 0), 0) / withGPA.length : 0;
    const highest = withGPA.length > 0 ? withGPA.reduce((max, s) => (s.gpa || 0) > (max.gpa || 0) ? s : max) : null;
    const lowest = withGPA.length > 0 ? withGPA.reduce((min, s) => (s.gpa || 0) < (min.gpa || 0) ? s : min) : null;

    const courseDistribution: Record<string, number> = {};
    const ageDistribution: Record<string, number> = {};
    const gpaDistribution: Record<string, number> = {};

    students.forEach(s => {
      courseDistribution[s.course] = (courseDistribution[s.course] || 0) + 1;

      const ageGroup = s.age < 20 ? 'under-20' : s.age < 25 ? '20-25' : '25+';
      ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;

      if (s.gpa !== undefined) {
        const gpaGroup = s.gpa >= 3.7 ? '3.7-4.0' : s.gpa >= 3.3 ? '3.3-3.7' : s.gpa >= 3.0 ? '3.0-3.3' : '<3.0';
        gpaDistribution[gpaGroup] = (gpaDistribution[gpaGroup] || 0) + 1;
      }
    });

    return {
      totalStudents: students.length,
      averageGPA: Math.round(avgGPA * 100) / 100,
      highestGPA: highest,
      lowestGPA: lowest,
      courseDistribution,
      ageDistribution,
      gpaDistribution,
    };
  }

  /**
   * Export report to JSON
   */
  static exportReportToJSON(
    students: Student[],
    filename = 'students-report'
  ): void {
    const report = this.generateReport(students);
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const bulkOperationsService = new BulkOperationsService();
