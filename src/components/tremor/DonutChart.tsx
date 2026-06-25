"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type TremorDonutDatum = { name: string; value: number };

const colors = ["#16a34a", "#f59e0b", "#dc2626"];

export function TremorDonutChart({ data }: { data: TremorDonutDatum[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative h-72 w-full" role="img" aria-label="Gráfico de rosca com tarefas por prioridade">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
            formatter={(value) => [Number(value), "Tarefas"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">{total}</span>
        <span className="text-xs font-bold text-muted">tarefas</span>
      </div>
    </div>
  );
}
