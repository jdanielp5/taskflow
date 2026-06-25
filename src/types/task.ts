export type TaskPriority = "baixa" | "media" | "alta";
export type TaskStatus = "a-fazer" | "fazendo" | "concluido";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type WorkLog = {
  id: string;
  text: string;
  createdAt: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  showOnKanban: boolean;
  subtasks: Subtask[];
  workLogs: WorkLog[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type TaskFormValues = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  showOnKanban: boolean;
};
