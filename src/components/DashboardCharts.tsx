import { Task } from "@/types/task";

type DashboardChartsProps = {
  tasks: Task[];
};

function percent(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function DashboardCharts({ tasks }: DashboardChartsProps) {
  const total = tasks.length;
  const todo = tasks.filter((task) => task.status === "a-fazer").length;
  const doing = tasks.filter((task) => task.status === "fazendo").length;
  const done = tasks.filter((task) => task.status === "concluido").length;
  const low = tasks.filter((task) => task.priority === "baixa").length;
  const medium = tasks.filter((task) => task.priority === "media").length;
  const high = tasks.filter((task) => task.priority === "alta").length;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-slate-950">Distribuição por status</h3>
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>A fazer</span>
              <span>{percent(todo, total)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-blue-600" style={{ width: `${percent(todo, total)}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>Fazendo</span>
              <span>{percent(doing, total)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-amber-500" style={{ width: `${percent(doing, total)}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>Concluídas</span>
              <span>{percent(done, total)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${percent(done, total)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-slate-950">Resumo por prioridade</h3>
        <div className="mt-5 grid h-48 items-end gap-4 sm:grid-cols-3">
          <div className="flex h-full flex-col justify-end gap-2 text-center">
            <div className="rounded-t-2xl bg-emerald-100" style={{ height: `${Math.max(percent(low, total), total ? 10 : 0)}%` }} />
            <span className="text-sm font-bold text-slate-700">Baixa: {low}</span>
          </div>
          <div className="flex h-full flex-col justify-end gap-2 text-center">
            <div className="rounded-t-2xl bg-amber-100" style={{ height: `${Math.max(percent(medium, total), total ? 10 : 0)}%` }} />
            <span className="text-sm font-bold text-slate-700">Média: {medium}</span>
          </div>
          <div className="flex h-full flex-col justify-end gap-2 text-center">
            <div className="rounded-t-2xl bg-red-100" style={{ height: `${Math.max(percent(high, total), total ? 10 : 0)}%` }} />
            <span className="text-sm font-bold text-slate-700">Alta: {high}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
