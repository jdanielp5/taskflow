"use client";

import { toast } from "sonner";

const columns = ["A Fazer", "Fazendo", "Concluído"];

export function KanbanBoard() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {columns.map((column) => (
        <button
          key={column}
          type="button"
          onClick={() => toast.info("Kanban será implementado na próxima entrega.")}
          className="min-h-48 rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
        >
          <h3 className="font-bold text-slate-950">{column}</h3>
          <p className="mt-3 text-sm text-slate-500">Clique reservado para a próxima etapa.</p>
        </button>
      ))}
    </div>
  );
}
