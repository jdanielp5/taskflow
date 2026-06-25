"use client";

import Link from "next/link";
import { CalendarDays, X } from "lucide-react";
import { formatDate, getSubtaskProgress, priorityLabels, statusLabels } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";
import { Task } from "@/types/task";

export function CalendarTaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="card w-full max-w-xl p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Detalhes do calendário</p>
            <h2 id="calendar-modal-title" className="mt-2 break-words text-2xl font-black">{task.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="button-secondary p-2.5" aria-label="Fechar detalhes"><X size={20} /></button>
        </div>

        <p className="task-description mt-4 text-sm leading-6 text-muted">{task.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge badge-blue">{statusLabels[task.status]}</span>
          <span className="badge badge-amber">{priorityLabels[task.priority]}</span>
          <span className="badge badge-blue"><CalendarDays size={14} /> {formatDate(task.dueDate)}</span>
        </div>

        <div className="mt-5"><ProgressBar value={getSubtaskProgress(task.subtasks)} /></div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="button-secondary">Fechar</button>
          <Link href={`/tasks/${task.id}`} className="button-primary">Abrir página completa</Link>
        </div>
      </article>
    </div>
  );
}
