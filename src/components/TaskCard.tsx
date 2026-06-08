import { Task } from "@/types/task";

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-950">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{task.description}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{task.priority}</span>
      </div>
    </article>
  );
}
