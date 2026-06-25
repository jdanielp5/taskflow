"use client";

import Link from "next/link";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { formatDate, getSubtaskProgress, priorityLabels } from "@/lib/utils";
import { Task, TaskStatus } from "@/types/task";

const columns: { id: TaskStatus; title: string; description: string }[] = [
  { id: "a-fazer", title: "A Fazer", description: "Itens ainda não iniciados" },
  { id: "fazendo", title: "Fazendo", description: "Trabalho em andamento" },
  { id: "concluido", title: "Concluído", description: "Entregas finalizadas" },
];

function KanbanCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: "task", status: task.status },
  });
  const style = { transform: CSS.Translate.toString(transform) };
  const priorityClass = task.priority === "alta" ? "badge-red" : task.priority === "media" ? "badge-amber" : "badge-green";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm ${isDragging ? "z-50 opacity-60 shadow-2xl" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="cursor-grab rounded-lg p-1 text-muted active:cursor-grabbing"
          aria-label={`Arrastar tarefa ${task.title}`}
          {...listeners}
          {...attributes}
        >
          <GripVertical size={19} />
        </button>
        <div className="min-w-0 flex-1">
          <span className={`badge ${priorityClass}`}>{priorityLabels[task.priority]}</span>
          <Link href={`/tasks/${task.id}`} className="mt-3 block break-words font-black hover:text-blue-600">{task.title}</Link>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{task.description}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-muted"><CalendarDays size={14} /> {formatDate(task.dueDate)}</p>
          <div className="mt-3"><ProgressBar value={getSubtaskProgress(task.subtasks)} label="Subtarefas" /></div>
        </div>
      </div>
    </article>
  );
}

function KanbanColumn({ column, tasks }: { column: (typeof columns)[number]; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: "column" } });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[430px] rounded-3xl border p-4 transition ${
        isOver ? "border-blue-500 bg-blue-500/10" : "border-[var(--border)] bg-[var(--surface-soft)]"
      }`}
      aria-labelledby={`column-${column.id}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id={`column-${column.id}`} className="font-black">{column.title}</h2>
          <p className="mt-1 text-xs text-muted">{column.description}</p>
        </div>
        <span className="badge badge-blue">{tasks.length}</span>
      </header>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 text-center text-xs font-bold text-muted">
            Arraste uma tarefa para esta coluna.
          </p>
        )}
        {tasks.map((task) => <KanbanCard key={task.id} task={task} />)}
      </div>
    </section>
  );
}

type KanbanBoardProps = {
  tasks: Task[];
  onStatusChange: (task: Task, status: TaskStatus) => Promise<void>;
};

export function KanbanBoard({ tasks, onStatusChange }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((item) => item.id === active.id);
    const status = over.id as TaskStatus;
    if (!task || !columns.some((column) => column.id === status) || task.status === status) return;
    await onStatusChange(task, status);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable: "Pressione espaço para selecionar a tarefa, use as setas para mover e espaço novamente para soltar.",
        },
      }}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} tasks={tasks.filter((task) => task.status === column.id)} />
        ))}
      </div>
    </DndContext>
  );
}
