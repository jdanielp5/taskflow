"use client";

import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { getTasksByUser } from "@/services/task.service";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasksByUser()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  return { tasks, loading };
}
