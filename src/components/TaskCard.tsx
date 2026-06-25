import Link from "next/link";
import { CalendarDays, Edit3, Eye, KanbanSquare, Trash2 } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { formatDate, getSubtaskProgress, isTaskOverdue, priorityLabels, statusLabels } from "@/lib/utils";
import { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleKanban: (task: Task) => void;
};

export function TaskCard({ task, onEdit, onDelete, onToggleKanban }: TaskCardProps) {
  const progress = getSubtaskProgress(task.subtasks);
  const priorityClass = task.priority === "alta" ? "badge-red" : task.priority === "media" ? "badge-amber" : "badge-green";
  const statusClass = task.status === "concluido" ? "badge-green" : task.status === "fazendo" ? "badge-blue" : "badge-amber";

  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${priorityClass}`}>{priorityLabels[task.priority]}</span>
            <span className={`badge ${statusClass}`}>{statusLabels[task.status]}</span>
            {isTaskOverdue(task) && <span className="badge badge-red">Vencida</span>}
            <span className={`badge ${task.showOnKanban ? "badge-blue" : ""}`}>
              {task.showOnKanban ? "No Kanban" : "Fora do Kanban"}
            </span>
          </div>

          <h3 className="mt-3 break-words text-xl font-black">{task.title}</h3>
          <p className="task-description mt-2 line-clamp-3 text-sm leading-6 text-muted">{task.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-muted">
            <span className="inline-flex items-center gap-2"><CalendarDays size={17} /> {formatDate(task.dueDate)}</span>
            <span>{task.subtasks.filter((item) => item.completed).length}/{task.subtasks.length} subtarefas</span>
          </div>

          <div className="mt-4 max-w-xl">
            <ProgressBar value={progress} label="Progresso das subtarefas" />
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          <Link href={`/tasks/${task.id}`} className="button-secondary text-sm"><Eye size={16} /> Detalhes</Link>
          <button type="button" onClick={() => onEdit(task)} className="button-secondary text-sm"><Edit3 size={16} /> Editar</button>
          <button type="button" onClick={() => onToggleKanban(task)} className="button-secondary text-sm"><KanbanSquare size={16} /> {task.showOnKanban ? "Remover" : "Adicionar"}</button>
          <button type="button" onClick={() => onDelete(task)} className="button-danger text-sm"><Trash2 size={16} /> Excluir</button>
        </div>
      </div>
    </article>
  );
}
