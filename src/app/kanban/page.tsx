import { KanbanBoard } from "@/components/KanbanBoard";

export default function KanbanPage() {
  return (
    <section className="min-h-[calc(100vh-145px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-slate-950">Kanban</h1>
        <p className="mt-2 text-slate-600">Página criada para manter a estrutura do projeto.</p>
        <div className="mt-6">
          <KanbanBoard />
        </div>
      </div>
    </section>
  );
}
