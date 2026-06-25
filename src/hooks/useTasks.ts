"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { subscribeToUserTasks } from "@/services/task.service";

type TaskState = {
  userId: string | null;
  tasks: Task[];
  loaded: boolean;
};

export function useTasks(userId?: string) {
  const [state, setState] = useState<TaskState>({ userId: null, tasks: [], loaded: false });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserTasks(
      userId,
      (userTasks) => {
        setState({ userId, tasks: userTasks, loaded: true });
      },
      (error) => {
        toast.error(error.message || "Não foi possível carregar as tarefas.");
        setState({ userId, tasks: [], loaded: true });
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const isCurrentUser = Boolean(userId && state.userId === userId);
  return {
    tasks: isCurrentUser ? state.tasks : [],
    loading: Boolean(userId) && (!isCurrentUser || !state.loaded),
  };
}
