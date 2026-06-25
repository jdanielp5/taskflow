"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { createTask, updateTask } from "@/services/task.service";
import { Task, TaskFormValues } from "@/types/task";

const taskSchema = z.object({
  title: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres."),
  description: z.string().trim().min(3, "Informe uma descrição com pelo menos 3 caracteres."),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  priority: z.enum(["baixa", "media", "alta"]),
  status: z.enum(["a-fazer", "fazendo", "concluido"]),
  showOnKanban: z.boolean(),
});

type TaskFormProps = {
  task?: Task | null;
  onCancelEdit?: () => void;
};

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "media",
  status: "a-fazer",
  showOnKanban: true,
};

export function TaskForm({ task, onCancelEdit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({ resolver: zodResolver(taskSchema), defaultValues });

  useEffect(() => {
    reset(
      task
        ? {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            showOnKanban: task.showOnKanban,
          }
        : defaultValues,
    );
  }, [task, reset]);

  async function onSubmit(data: TaskFormValues) {
    try {
      if (task) {
        await updateTask(task.id, data, task.status);
        toast.success("Tarefa atualizada com sucesso.");
        onCancelEdit?.();
      } else {
        await createTask(data);
        toast.success("Tarefa criada com sucesso.");
        reset(defaultValues);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a tarefa.");
    }
  }

  return (
    <form className="card p-6 md:p-7" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Formulário</p>
          <h2 className="mt-1 text-2xl font-black">{task ? "Editar tarefa" : "Nova tarefa"}</h2>
          <p className="mt-1 text-sm text-muted">Os dados são salvos no Firestore em tempo real.</p>
        </div>
        {task && (
          <button type="button" onClick={onCancelEdit} className="button-secondary text-sm"><X size={17} /> Cancelar</button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="title">Título</label>
          <input id="title" className="input-field" type="text" placeholder="Ex.: Finalizar relatório" {...register("title")} />
          {errors.title && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="dueDate">Data de vencimento</label>
          <input id="dueDate" className="input-field" type="date" {...register("dueDate")} />
          {errors.dueDate && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.dueDate.message}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-bold" htmlFor="description">Descrição</label>
          <textarea id="description" className="input-field min-h-28 resize-y" placeholder="Descreva o que precisa ser feito" {...register("description")} />
          {errors.description && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.description.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="priority">Prioridade</label>
          <select id="priority" className="input-field" {...register("priority")}>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="status">Status</label>
          <select id="status" className="input-field" {...register("status")}>
            <option value="a-fazer">A fazer</option>
            <option value="fazendo">Fazendo</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-blue-600" {...register("showOnKanban")} />
        <span>
          <strong className="block text-sm">Exibir no quadro Kanban</strong>
          <span className="mt-1 block text-xs text-muted">Também pode ser ativado ou removido depois na lista geral.</span>
        </span>
      </label>

      <button type="submit" disabled={isSubmitting} className="button-primary mt-5 w-full sm:w-auto sm:min-w-52">
        <Save size={18} /> {isSubmitting ? "Salvando..." : task ? "Salvar alterações" : "Criar tarefa"}
      </button>
    </form>
  );
}
