"use client";

import { CalendarDays, CheckCircle2, Clock3, Edit3, Trash2 } from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const priorityLabels: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const statusLabels: Record<TaskStatus, string> = {
  "a-fazer": "A fazer",
  fazendo: "Fazendo",
  concluido: "Concluído",
};

function formatDate(date: string) {
  if (!date) return "Sem vencimento";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getPriorityClass(priority: TaskPriority) {
  const classes = {
    baixa: "bg-emerald-50 text-emerald-700",
    media: "bg-amber-50 text-amber-700",
    alta: "bg-red-50 text-red-700",
  };

  return classes[priority];
}

function getStatusIcon(status: TaskStatus) {
  if (status === "concluido") return <CheckCircle2 size={16} />;
  return <Clock3 size={16} />;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black ${getPriorityClass(task.priority)}`}>
              {priorityLabels[task.priority]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              {getStatusIcon(task.status)} {statusLabels[task.status]}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-black text-slate-950">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
            <CalendarDays size={16} /> Vence em {formatDate(task.dueDate)}
          </div>
        </div>

        <div className="flex gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <Edit3 size={16} /> Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
