"use client";

import { toast } from "sonner";

export function TaskForm() {
  return (
    <form
      className="rounded-2xl border border-dashed border-slate-300 bg-white p-5"
      onSubmit={(event) => {
        event.preventDefault();
        toast.info("Cadastro de tarefas ficará para a próxima etapa.");
      }}
    >
      <button type="submit" className="secondary-button">
        Nova tarefa
      </button>
    </form>
  );
}
