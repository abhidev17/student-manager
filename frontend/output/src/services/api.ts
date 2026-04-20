import type { Student } from "../types";

const BASE = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Unknown error");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getStudents: () => request<Student[]>("/api/students"),

  createStudent: (data: Omit<Student, "id">) =>
    request<Student>("/api/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStudent: (id: number, data: Partial<Student>) =>
    request<Student>(`/api/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteStudent: (id: number) =>
    request<void>(`/api/students/${id}`, { method: "DELETE" }),
};
