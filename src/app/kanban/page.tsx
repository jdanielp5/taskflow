"use client";

import Link from "next/link";
import { KanbanSquare, ListTodo } from "lucide-react";
import { toast } from "sonner";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { updateTaskStatus } from "@/services/task.service";
import { Task, TaskStatus } from "@/types/task";

export default function KanbanPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.uid);
  const boardTasks = tasks.filter((task) => task.showOnKanban);

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      await updateTaskStatus(task.id, status, task.status);
      toast.success(`“${task.title}” movida com sucesso.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível mover a tarefa.");
    }
  }

  return (
    <ProtectedPage>
      <section className="page-shell">
        <div className="page-container">
          <header className="card mb-7 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Dnd Kit</p>
                <h1 className="mt-2 text-3xl font-black md:text-4xl">Quadro Kanban interativo</h1>
                <p className="mt-2 max-w-2xl text-muted">Arraste tarefas entre A Fazer, Fazendo e Concluído. O status é atualizado automaticamente no Firestore.</p>
              </div>
              <Link href="/tasks" className="button-secondary"><ListTodo size={18} /> Gerenciar lista geral</Link>
            </div>
          </header>

          {loading && <div className="card p-8 text-center font-bold">Carregando quadro...</div>}

          {!loading && boardTasks.length === 0 && (
            <div className="card p-10 text-center">
              <KanbanSquare className="mx-auto text-blue-600" size={48} />
              <h2 className="mt-4 text-2xl font-black">Nenhuma tarefa no Kanban</h2>
              <p className="mt-2 text-muted">Na lista geral, crie uma tarefa ou use o botão “Adicionar” em uma tarefa existente.</p>
              <Link href="/tasks" className="button-primary mt-5">Abrir lista de tarefas</Link>
            </div>
          )}

          {!loading && boardTasks.length > 0 && <KanbanBoard tasks={boardTasks} onStatusChange={handleStatusChange} />}
        </div>
      </section>
    </ProtectedPage>
  );
}
