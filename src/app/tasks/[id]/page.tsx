"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, KanbanSquare } from "lucide-react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SubtaskManager } from "@/components/SubtaskManager";
import { TaskForm } from "@/components/TaskForm";
import { WorkLogSection } from "@/components/WorkLogSection";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { formatDate, priorityLabels, statusLabels } from "@/lib/utils";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.uid);
  const task = tasks.find((item) => item.id === params.id);

  return (
    <ProtectedPage>
      <section className="page-shell">
        <div className="page-container">
          {loading && <div className="card p-8 text-center font-bold">Carregando detalhes...</div>}

          {!loading && !task && (
            <div className="card p-8 text-center">
              <h1 className="text-2xl font-black">Tarefa não encontrada</h1>
              <p className="mt-2 text-muted">Ela pode ter sido excluída ou não pertencer ao usuário conectado.</p>
              <Link href="/tasks" className="button-primary mt-5"><ArrowLeft size={17} /> Voltar para tarefas</Link>
            </div>
          )}

          {task && (
            <>
              <header className="card mb-7 p-6 md:p-8">
                <Link href="/tasks" className="inline-flex items-center gap-2 text-sm font-black text-blue-600"><ArrowLeft size={17} /> Voltar para a lista</Link>
                <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="eyebrow">Página dedicada</p>
                    <h1 className="mt-2 break-words text-3xl font-black md:text-4xl">{task.title}</h1>
                    <p className="task-description mt-3 max-w-3xl text-muted">{task.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-blue">{statusLabels[task.status]}</span>
                    <span className="badge badge-amber">{priorityLabels[task.priority]}</span>
                    <span className="badge badge-blue"><CalendarDays size={14} /> {formatDate(task.dueDate)}</span>
                    <span className="badge badge-blue"><KanbanSquare size={14} /> {task.showOnKanban ? "No Kanban" : "Fora do Kanban"}</span>
                  </div>
                </div>
              </header>

              <div className="grid gap-7 xl:grid-cols-[1.05fr_0.95fr]">
                <TaskForm task={task} />
                <SubtaskManager taskId={task.id} subtasks={task.subtasks} />
              </div>

              <div className="mt-7">
                <WorkLogSection taskId={task.id} workLogs={task.workLogs} />
              </div>
            </>
          )}
        </div>
      </section>
    </ProtectedPage>
  );
}
