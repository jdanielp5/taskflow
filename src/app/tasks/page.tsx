import { TaskForm } from "@/components/TaskForm";

export default function TasksPage() {
  return (
    <section className="min-h-[calc(100vh-145px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-slate-950">Tarefas</h1>
        <p className="mt-2 text-slate-600">Página criada para manter a estrutura do projeto. O CRUD completo fica para a próxima etapa.</p>
        <div className="mt-6">
          <TaskForm />
        </div>
      </div>
    </section>
  );
}
