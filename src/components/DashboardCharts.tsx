"use client";

import { useMemo } from "react";
import { TremorBarChart } from "@/components/tremor/BarChart";
import { TremorDonutChart } from "@/components/tremor/DonutChart";
import { Task } from "@/types/task";

export function DashboardCharts({ tasks }: { tasks: Task[] }) {
  const statusData = useMemo(
    () => [
      { name: "A fazer", value: tasks.filter((task) => task.status === "a-fazer").length },
      { name: "Fazendo", value: tasks.filter((task) => task.status === "fazendo").length },
      { name: "Concluído", value: tasks.filter((task) => task.status === "concluido").length },
    ],
    [tasks],
  );

  const priorityData = useMemo(
    () => [
      { name: "Baixa", value: tasks.filter((task) => task.priority === "baixa").length },
      { name: "Média", value: tasks.filter((task) => task.priority === "media").length },
      { name: "Alta", value: tasks.filter((task) => task.priority === "alta").length },
    ],
    [tasks],
  );

  return (
    <section aria-labelledby="dashboard-charts-title">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">Tremor UI</p>
          <h2 id="dashboard-charts-title" className="text-2xl font-black">Visualização dos dados</h2>
        </div>
        <span className="badge badge-blue">Tempo real</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="card p-6">
          <h3 className="font-black">Tarefas por status</h3>
          <p className="mt-1 text-sm text-muted">Distribuição entre as etapas do fluxo.</p>
          <TremorBarChart data={statusData} />
        </article>

        <article className="card p-6">
          <h3 className="font-black">Tarefas por prioridade</h3>
          <p className="mt-1 text-sm text-muted">Comparativo de baixa, média e alta prioridade.</p>
          <TremorDonutChart data={priorityData} />
          <div className="mt-1 flex flex-wrap justify-center gap-4 text-xs font-bold text-muted">
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-green-600" />Baixa</span>
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />Média</span>
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-600" />Alta</span>
          </div>
        </article>
      </div>
    </section>
  );
}
