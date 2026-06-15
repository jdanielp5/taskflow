"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createTask, updateTask } from "@/services/task.service";
import { Task, TaskFormValues } from "@/types/task";

const taskSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  description: z.string().min(3, "Informe uma descrição com pelo menos 3 caracteres."),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  priority: z.enum(["baixa", "media", "alta"]),
  status: z.enum(["a-fazer", "fazendo", "concluido"]),
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
};

export function TaskForm({ task, onCancelEdit }: TaskFormProps) {
  const isEditing = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      });
      return;
    }

    reset(defaultValues);
  }, [task, reset]);

  async function onSubmit(data: TaskFormValues) {
    try {
      if (task) {
        await updateTask(task.id, data);
        toast.success("Tarefa atualizada com sucesso.");
        onCancelEdit?.();
        return;
      }

      await createTask(data);
      toast.success("Tarefa cadastrada com sucesso.");
      reset(defaultValues);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a tarefa.");
    }
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">{isEditing ? "Editar tarefa" : "Nova tarefa"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados principais da tarefa para salvar no Firestore.
          </p>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancelar edição
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="title">
            Título
          </label>
          <input id="title" className="input-field" type="text" placeholder="Ex.: Entregar relatório" {...register("title")} />
          {errors.title && <p className="mt-1 text-sm font-semibold text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="dueDate">
            Data de vencimento
          </label>
          <input id="dueDate" className="input-field" type="date" {...register("dueDate")} />
          {errors.dueDate && <p className="mt-1 text-sm font-semibold text-red-600">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="priority">
            Prioridade
          </label>
          <select id="priority" className="input-field" {...register("priority")}>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          {errors.priority && <p className="mt-1 text-sm font-semibold text-red-600">{errors.priority.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="status">
            Status
          </label>
          <select id="status" className="input-field" {...register("status")}>
            <option value="a-fazer">A fazer</option>
            <option value="fazendo">Fazendo</option>
            <option value="concluido">Concluído</option>
          </select>
          {errors.status && <p className="mt-1 text-sm font-semibold text-red-600">{errors.status.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          className="input-field min-h-28 resize-y"
          placeholder="Descreva o que precisa ser feito"
          {...register("description")}
        />
        {errors.description && <p className="mt-1 text-sm font-semibold text-red-600">{errors.description.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="primary-button mt-5">
        {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar tarefa"}
      </button>
    </form>
  );
}
