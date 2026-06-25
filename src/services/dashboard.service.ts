import { Task } from "@/types/task";
import { isTaskOverdue } from "@/lib/utils";

function isThisWeek(dateValue: string | null) {
  if (!dateValue) return false;
  const today = new Date();
  const date = new Date(dateValue);
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return date >= monday && date <= sunday;
}

export function getDashboardMetrics(tasks: Task[]) {
  return {
    pending: tasks.filter((task) => task.status !== "concluido").length,
    completedThisWeek: tasks.filter(
      (task) => task.status === "concluido" && isThisWeek(task.completedAt),
    ).length,
    overdue: tasks.filter(isTaskOverdue).length,
  };
}
