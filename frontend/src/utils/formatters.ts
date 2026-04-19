/**
 * Format GPA as decimal with color coding
 */
export const formatGPA = (gpa?: number): { value: string; color: string } => {
  if (gpa === undefined || gpa === null) {
    return { value: '—', color: 'text-slate-400' };
  }
  
  const rounded = gpa.toFixed(2);
  let color = 'text-red-400';
  if (gpa >= 3.5) color = 'text-emerald-400';
  else if (gpa >= 2.5) color = 'text-amber-400';
  
  return { value: rounded, color };
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get avatar color based on name (deterministic)
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-sky-500 text-white',
    'bg-blue-500 text-white',
    'bg-indigo-500 text-white',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-rose-500 text-white',
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Calculate average GPA
 */
export const calculateAverageGPA = (students: any[]): number => {
  const studentsWithGPA = students.filter(s => s.gpa !== undefined && s.gpa !== null);
  if (studentsWithGPA.length === 0) return 0;
  
  const sum = studentsWithGPA.reduce((acc, s) => acc + s.gpa, 0);
  return parseFloat((sum / studentsWithGPA.length).toFixed(2));
};

/**
 * Get unique courses and their counts
 */
export const getCourseDistribution = (students: { course: string }[]): { course: string; count: number }[] => {
  const distribution = students.reduce(
    (acc: { course: string; count: number }[], student) => {
      const existing = acc.find((d: { course: string; count: number }) => d.course === student.course);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ course: student.course, count: 1 });
      }
      return acc;
    },
    [] as { course: string; count: number }[]
  );
  
  return distribution.sort((a: { course: string; count: number }, b: { course: string; count: number }) => b.count - a.count);
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Generate unique ID
 */
export const generateId = (): number => {
  return Date.now();
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: Array<any>) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Validate email (basic)
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate age range
 */
export const validateAge = (age: number): boolean => {
  return age >= 16 && age <= 100;
};

/**
 * Validate GPA range
 */
export const validateGPA = (gpa: number): boolean => {
  return gpa >= 0 && gpa <= 4.0;
};

/**
 * Calculate age group
 */
export const getAgeGroup = (age: number): 'under-20' | '20-25' | '25-plus' => {
  if (age < 20) return 'under-20';
  if (age <= 25) return '20-25';
  return '25-plus';
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(',')
    ),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
