import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Subtask,
  Task,
  TaskFormValues,
  TaskPriority,
  TaskStatus,
  WorkLog,
} from "@/types/task";

const TASKS_COLLECTION = "tasks";
const priorities: TaskPriority[] = ["baixa", "media", "alta"];
const statuses: TaskStatus[] = ["a-fazer", "fazendo", "concluido"];

function getCurrentUserId() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");
  return user.uid;
}

function timestampToIso(value: unknown, fallback = "") {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return fallback;
}

function timestampToIsoOrNull(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
}

function normalizePriority(value: unknown): TaskPriority {
  return priorities.includes(value as TaskPriority) ? (value as TaskPriority) : "media";
}

function normalizeStatus(value: unknown): TaskStatus {
  return statuses.includes(value as TaskStatus) ? (value as TaskStatus) : "a-fazer";
}

function normalizeSubtasks(value: unknown): Subtask[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      title: typeof item.title === "string" ? item.title : "Subtarefa",
      completed: Boolean(item.completed),
      createdAt:
        typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    }));
}

function normalizeWorkLogs(value: unknown): WorkLog[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      text: typeof item.text === "string" ? item.text : "Registro",
      createdAt:
        typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function mapTask(documentId: string, data: Record<string, unknown>): Task {
  const fallbackDate = new Date().toISOString();
  return {
    id: documentId,
    userId: typeof data.userId === "string" ? data.userId : "",
    title: typeof data.title === "string" ? data.title : "Sem título",
    description: typeof data.description === "string" ? data.description : "",
    dueDate: typeof data.dueDate === "string" ? data.dueDate : "",
    priority: normalizePriority(data.priority),
    status: normalizeStatus(data.status),
    showOnKanban: data.showOnKanban !== false,
    subtasks: normalizeSubtasks(data.subtasks),
    workLogs: normalizeWorkLogs(data.workLogs),
    createdAt: timestampToIso(data.createdAt, fallbackDate),
    updatedAt: timestampToIso(data.updatedAt, fallbackDate),
    completedAt: timestampToIsoOrNull(data.completedAt),
  };
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((first, second) => {
    if (!first.dueDate && !second.dueDate) {
      return second.createdAt.localeCompare(first.createdAt);
    }
    if (!first.dueDate) return 1;
    if (!second.dueDate) return -1;
    return first.dueDate.localeCompare(second.dueDate);
  });
}

function completionValue(status: TaskStatus, previousStatus?: TaskStatus) {
  if (status === "concluido" && previousStatus !== "concluido") return serverTimestamp();
  if (status !== "concluido") return null;
  return undefined;
}

export async function createTask(data: TaskFormValues) {
  const userId = getCurrentUserId();
  await addDoc(collection(db, TASKS_COLLECTION), {
    userId,
    title: data.title.trim(),
    description: data.description.trim(),
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status,
    showOnKanban: data.showOnKanban,
    subtasks: [],
    workLogs: [],
    completedAt: data.status === "concluido" ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, data: TaskFormValues, previousStatus?: TaskStatus) {
  const updateData: Record<string, unknown> = {
    title: data.title.trim(),
    description: data.description.trim(),
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status,
    showOnKanban: data.showOnKanban,
    updatedAt: serverTimestamp(),
  };

  const completedAt = completionValue(data.status, previousStatus);
  if (completedAt !== undefined) updateData.completedAt = completedAt;
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), updateData);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus, previousStatus?: TaskStatus) {
  const updateData: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
  const completedAt = completionValue(status, previousStatus);
  if (completedAt !== undefined) updateData.completedAt = completedAt;
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), updateData);
}

export async function setTaskKanbanVisibility(taskId: string, showOnKanban: boolean) {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
    showOnKanban,
    updatedAt: serverTimestamp(),
  });
}

export async function saveTaskSubtasks(taskId: string, subtasks: Subtask[]) {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
    subtasks,
    updatedAt: serverTimestamp(),
  });
}

export async function saveTaskWorkLogs(taskId: string, workLogs: WorkLog[]) {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
    workLogs,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const userId = getCurrentUserId();
  const snapshot = await getDoc(doc(db, TASKS_COLLECTION, taskId));
  if (!snapshot.exists()) return null;
  const task = mapTask(snapshot.id, snapshot.data());
  if (task.userId !== userId) throw new Error("Você não tem acesso a esta tarefa.");
  return task;
}

export async function getTasksByUser(userId = getCurrentUserId()): Promise<Task[]> {
  const tasksQuery = query(collection(db, TASKS_COLLECTION), where("userId", "==", userId));
  const snapshot = await getDocs(tasksQuery);
  return sortTasks(snapshot.docs.map((taskDoc) => mapTask(taskDoc.id, taskDoc.data())));
}

export function subscribeToUserTasks(
  userId: string,
  onTasks: (tasks: Task[]) => void,
  onError: (error: Error) => void,
) {
  const tasksQuery = query(collection(db, TASKS_COLLECTION), where("userId", "==", userId));
  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      onTasks(sortTasks(snapshot.docs.map((taskDoc) => mapTask(taskDoc.id, taskDoc.data()))));
    },
    (error) => onError(error),
  );
}

export async function deleteTasksByUser(userId: string) {
  const tasksQuery = query(collection(db, TASKS_COLLECTION), where("userId", "==", userId));
  const snapshot = await getDocs(tasksQuery);
  const batch = writeBatch(db);
  snapshot.docs.forEach((taskDoc) => batch.delete(taskDoc.ref));
  await batch.commit();
}
