"use client";

import { useState } from "react";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";
import { saveTaskWorkLogs } from "@/services/task.service";
import { WorkLog } from "@/types/task";

export function WorkLogSection({ taskId, workLogs }: { taskId: string; workLogs: WorkLog[] }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function addLog(event: React.FormEvent) {
    event.preventDefault();
    const normalized = text.trim();
    if (normalized.length < 3) {
      toast.error("Digite um comentário com pelo menos 3 caracteres.");
      return;
    }

    setSaving(true);
    try {
      const newLog: WorkLog = {
        id: crypto.randomUUID(),
        text: normalized,
        createdAt: new Date().toISOString(),
      };
      await saveTaskWorkLogs(taskId, [newLog, ...workLogs]);
      setText("");
      toast.success("Registro adicionado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o registro.");
    } finally {
      setSaving(false);
    }
  }

  async function removeLog(log: WorkLog) {
    if (!window.confirm("Excluir este registro de trabalho?")) return;
    setSaving(true);
    try {
      await saveTaskWorkLogs(taskId, workLogs.filter((item) => item.id !== log.id));
      toast.success("Registro excluído.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o registro.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6" aria-labelledby="work-log-title">
      <p className="eyebrow">Histórico</p>
      <h2 id="work-log-title" className="mt-1 text-2xl font-black">Log de trabalho</h2>
      <p className="mt-1 text-sm text-muted">Registre decisões, observações e avanços da tarefa.</p>

      <form className="mt-5" onSubmit={addLog}>
        <label className="sr-only" htmlFor="work-log">Novo registro</label>
        <textarea
          id="work-log"
          className="input-field min-h-24 resize-y"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ex.: Revisão concluída e enviada para validação."
          disabled={saving}
        />
        <button type="submit" className="button-primary mt-2" disabled={saving}>
          <MessageSquarePlus size={17} /> {saving ? "Salvando..." : "Adicionar registro"}
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {workLogs.length === 0 && (
          <p className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm font-bold text-muted">Nenhum registro de trabalho.</p>
        )}
        {workLogs.map((log) => (
          <article key={log.id} className="rounded-2xl border border-[var(--border)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="task-description break-words text-sm leading-6">{log.text}</p>
                <time className="mt-2 block text-xs font-bold text-muted" dateTime={log.createdAt}>{formatDateTime(log.createdAt)}</time>
              </div>
              <button type="button" className="shrink-0 rounded-xl p-2 text-red-600 hover:bg-red-50" onClick={() => removeLog(log)} aria-label="Excluir registro" disabled={saving}>
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
