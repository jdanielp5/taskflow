import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Subtask, Task, TaskPriority, TaskStatus } from "@/types/task";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const priorityLabels: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const statusLabels: Record<TaskStatus, string> = {
  "a-fazer": "A fazer",
  fazendo: "Fazendo",
  concluido: "Concluído",
};

export function formatDate(value: string) {
  if (!value) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export function formatDateTime(value: string) {
  if (!value) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getSubtaskProgress(subtasks: Subtask[]) {
  if (subtasks.length === 0) return 0;
  const completed = subtasks.filter((subtask) => subtask.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

export function isTaskOverdue(task: Task) {
  if (!task.dueDate || task.status === "concluido") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${task.dueDate}T00:00:00`) < today;
}
