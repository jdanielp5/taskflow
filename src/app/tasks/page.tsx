"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, ListTodo, Search } from "lucide-react";
import { toast } from "sonner";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { deleteTask, setTaskKanbanVisibility } from "@/services/task.service";
import { Task, TaskStatus } from "@/types/task";

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.uid);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"todos" | TaskStatus>("todos");

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesText = !term || task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term);
      const matchesStatus = status === "todos" || task.status === status;
      return matchesText && matchesStatus;
    });
  }, [tasks, search, status]);

  async function handleDelete(task: Task) {
    if (!window.confirm(`Deseja excluir a tarefa “${task.title}”?`)) return;
    try {
      await deleteTask(task.id);
      if (editingTask?.id === task.id) setEditingTask(null);
      toast.success("Tarefa excluída.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir.");
    }
  }

  async function handleToggleKanban(task: Task) {
    try {
      await setTaskKanbanVisibility(task.id, !task.showOnKanban);
      toast.success(task.showOnKanban ? "Tarefa removida do Kanban." : "Tarefa adicionada ao Kanban.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o Kanban.");
    }
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setTimeout(() => document.getElementById("task-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <ProtectedPage>
      <section className="page-shell">
        <div className="page-container">
          <header className="card mb-7 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Gestão completa</p>
                <h1 className="mt-2 text-3xl font-black md:text-4xl">Lista geral de tarefas</h1>
                <p className="mt-2 max-w-2xl text-muted">Crie, pesquise, filtre, edite e escolha quais tarefas aparecem no quadro Kanban.</p>
              </div>
              <Link href="/dashboard" className="button-secondary">Voltar ao dashboard</Link>
            </div>
          </header>

          <div id="task-form-section" className="scroll-mt-28">
            <TaskForm task={editingTask} onCancelEdit={() => setEditingTask(null)} />
          </div>

          <section className="card mt-7 p-6" aria-labelledby="task-list-title">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Dados em tempo real</p>
                <h2 id="task-list-title" className="mt-1 text-2xl font-black">Tarefas cadastradas ({tasks.length})</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_190px]">
                <label className="relative">
                  <span className="sr-only">Pesquisar tarefas</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input className="input-field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar por título..." />
                </label>
                <label className="relative">
                  <span className="sr-only">Filtrar por status</span>
                  <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <select className="input-field pl-10" value={status} onChange={(event) => setStatus(event.target.value as "todos" | TaskStatus)}>
                    <option value="todos">Todos os status</option>
                    <option value="a-fazer">A fazer</option>
                    <option value="fazendo">Fazendo</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </label>
              </div>
            </div>

            {loading && <p className="mt-5 rounded-2xl bg-[var(--surface-soft)] p-5 font-bold">Carregando tarefas...</p>}

            {!loading && filteredTasks.length === 0 && (
              <div className="mt-5 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-8 text-center">
                <ListTodo className="mx-auto text-blue-600" size={42} />
                <h3 className="mt-4 text-lg font-black">Nenhuma tarefa encontrada</h3>
                <p className="mt-2 text-sm text-muted">Crie uma tarefa ou altere os filtros de pesquisa.</p>
              </div>
            )}

            {!loading && filteredTasks.length > 0 && (
              <div className="mt-5 grid gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} onToggleKanban={handleToggleKanban} />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </ProtectedPage>
  );
}
