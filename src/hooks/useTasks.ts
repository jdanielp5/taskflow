"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { subscribeToUserTasks } from "@/services/task.service";

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserTasks(
      userId,
      (userTasks) => {
        setTasks(userTasks);
        setLoading(false);
      },
      (error) => {
        toast.error(error.message || "Não foi possível carregar as tarefas.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  return { tasks, loading };
}
