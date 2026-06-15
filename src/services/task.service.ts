import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
import { Task, TaskFormValues, TaskPriority, TaskStatus } from "@/types/task";

const TASKS_COLLECTION = "tasks";
const priorities: TaskPriority[] = ["baixa", "media", "alta"];
const statuses: TaskStatus[] = ["a-fazer", "fazendo", "concluido"];

function getCurrentUserId() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  return user.uid;
}

function dateToIso(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date().toISOString();
}

function normalizePriority(value: unknown): TaskPriority {
  return priorities.includes(value as TaskPriority) ? (value as TaskPriority) : "media";
}

function normalizeStatus(value: unknown): TaskStatus {
  return statuses.includes(value as TaskStatus) ? (value as TaskStatus) : "a-fazer";
}

function mapTask(documentId: string, data: Record<string, unknown>): Task {
  return {
    id: documentId,
    userId: typeof data.userId === "string" ? data.userId : "",
    title: typeof data.title === "string" ? data.title : "Sem título",
    description: typeof data.description === "string" ? data.description : "",
    dueDate: typeof data.dueDate === "string" ? data.dueDate : "",
    priority: normalizePriority(data.priority),
    status: normalizeStatus(data.status),
    subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
    createdAt: dateToIso(data.createdAt),
    updatedAt: dateToIso(data.updatedAt),
  };
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((first, second) => {
    if (!first.dueDate && !second.dueDate) return second.createdAt.localeCompare(first.createdAt);
    if (!first.dueDate) return 1;
    if (!second.dueDate) return -1;
    return first.dueDate.localeCompare(second.dueDate);
  });
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
    subtasks: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, data: TaskFormValues) {
  const userId = getCurrentUserId();

  await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
    userId,
    title: data.title.trim(),
    description: data.description.trim(),
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
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
