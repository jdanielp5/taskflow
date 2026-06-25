"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProgressBar } from "@/components/ProgressBar";
import { getSubtaskProgress } from "@/lib/utils";
import { saveTaskSubtasks } from "@/services/task.service";
import { Subtask } from "@/types/task";

export function SubtaskManager({ taskId, subtasks }: { taskId: string; subtasks: Subtask[] }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function persist(next: Subtask[], message: string) {
    setSaving(true);
    try {
      await saveTaskSubtasks(taskId, next);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar as subtarefas.");
    } finally {
      setSaving(false);
    }
  }

  async function addSubtask(event: React.FormEvent) {
    event.preventDefault();
    const normalized = title.trim();
    if (normalized.length < 2) {
      toast.error("Digite um título com pelo menos 2 caracteres.");
      return;
    }

    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title: normalized,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    await persist([...subtasks, newSubtask], "Subtarefa adicionada.");
    setTitle("");
  }

  function toggleSubtask(subtask: Subtask) {
    void persist(
      subtasks.map((item) =>
        item.id === subtask.id ? { ...item, completed: !item.completed } : item,
      ),
      subtask.completed ? "Subtarefa reaberta." : "Subtarefa concluída.",
    );
  }

  function removeSubtask(subtask: Subtask) {
    if (!window.confirm(`Remover a subtarefa “${subtask.title}”?`)) return;
    void persist(
      subtasks.filter((item) => item.id !== subtask.id),
      "Subtarefa removida.",
    );
  }

  return (
    <section className="card p-6" aria-labelledby="subtasks-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Progresso automático</p>
          <h2 id="subtasks-title" className="mt-1 text-2xl font-black">Subtarefas</h2>
          <p className="mt-1 text-sm text-muted">Marque cada etapa e acompanhe a porcentagem concluída.</p>
        </div>
        <span className="badge badge-blue">{subtasks.filter((item) => item.completed).length}/{subtasks.length} concluídas</span>
      </div>

      <div className="mt-5">
        <ProgressBar value={getSubtaskProgress(subtasks)} />
      </div>

      <form onSubmit={addSubtask} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="new-subtask">Nova subtarefa</label>
        <input
          id="new-subtask"
          className="input-field flex-1"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Revisar referências"
          disabled={saving}
        />
        <button className="button-primary" type="submit" disabled={saving}><Plus size={17} /> Adicionar</button>
      </form>

      <div className="mt-5 space-y-2">
        {subtasks.length === 0 && (
          <p className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm font-bold text-muted">Nenhuma subtarefa cadastrada.</p>
        )}

        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3">
            <button
              type="button"
              className="shrink-0 rounded-full text-blue-600"
              onClick={() => toggleSubtask(subtask)}
              aria-label={subtask.completed ? `Reabrir ${subtask.title}` : `Concluir ${subtask.title}`}
              disabled={saving}
            >
              {subtask.completed ? <CheckCircle2 /> : <Circle />}
            </button>
            <span className={`min-w-0 flex-1 break-words text-sm font-bold ${subtask.completed ? "text-muted line-through" : ""}`}>
              {subtask.title}
            </span>
            <button
              type="button"
              className="rounded-xl p-2 text-red-600 hover:bg-red-50"
              onClick={() => removeSubtask(subtask)}
              aria-label={`Excluir ${subtask.title}`}
              disabled={saving}
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
