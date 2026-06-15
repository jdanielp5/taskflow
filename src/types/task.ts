export type TaskPriority = "baixa" | "media" | "alta";
export type TaskStatus = "a-fazer" | "fazendo" | "concluido";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
};

export type TaskFormValues = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
};
