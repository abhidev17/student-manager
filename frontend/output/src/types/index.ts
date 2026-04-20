export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  gpa?: number;
}

export interface FormErrors {
  name?: string;
  age?: string;
  course?: string;
  gpa?: string;
}

export type ToastVariant = "success" | "error" | "info";
