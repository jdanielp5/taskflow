"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TremorBarDatum = { name: string; value: number };

export function TremorBarChart({ data }: { data: TremorBarDatum[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Gráfico de barras com tarefas por status">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "var(--surface-soft)" }}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
            formatter={(value) => [Number(value), "Tarefas"]}
          />
          <Bar dataKey="value" name="Tarefas" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
