"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListTodo, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { deleteTask } from "@/services/task.service";
import { Task } from "@/types/task";

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(user?.uid);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();

  const totalByStatus = useMemo(() => {
    return tasks.reduce(
      (accumulator, task) => {
        accumulator[task.status] += 1;
        return accumulator;
      },
      { "a-fazer": 0, fazendo: 0, concluido: 0 },
    );
  }, [tasks]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  async function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(`Deseja excluir a tarefa "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);
      toast.success("Tarefa excluída com sucesso.");

      if (editingTask?.id === task.id) {
        setEditingTask(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a tarefa.",
      );
    }
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);

    setTimeout(() => {
      const formElement = document.getElementById("task-form-section");

      formElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }

  if (authLoading || !user) {
    return (
      <section className="flex min-h-[calc(100vh-145px)] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-bold text-slate-700">Carregando tarefas...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-145px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              CRUD de tarefas
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
              Lista de tarefas
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Cadastre, liste, edite e exclua tarefas vinculadas ao usuário
              autenticado no Firebase.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-center font-bold text-slate-700 hover:bg-slate-50"
          >
            Voltar ao dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">A fazer</p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {totalByStatus["a-fazer"]}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Fazendo</p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {totalByStatus.fazendo}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Concluídas</p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {totalByStatus.concluido}
            </p>
          </div>
        </div>

        <div id="task-form-section" className="scroll-mt-28">
          <TaskForm
            task={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Tarefas cadastradas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Total: {tasks.length}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
              <PlusCircle size={18} />
              Dados em tempo real
            </div>
          </div>

          {tasksLoading && (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-600">
              Carregando tarefas...
            </p>
          )}

          {!tasksLoading && tasks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <ListTodo className="mx-auto text-blue-600" size={42} />

              <h3 className="mt-4 text-lg font-black text-slate-950">
                Nenhuma tarefa cadastrada
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Use o formulário acima para criar a primeira tarefa.
              </p>
            </div>
          )}

          {!tasksLoading && tasks.length > 0 && (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}