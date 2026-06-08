export function DashboardCharts() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-slate-950">Distribuição de tarefas</h3>
        <div className="mt-5 flex h-48 items-end gap-4">
          <div className="h-24 flex-1 rounded-t-2xl bg-blue-100" />
          <div className="h-36 flex-1 rounded-t-2xl bg-blue-200" />
          <div className="h-16 flex-1 rounded-t-2xl bg-blue-300" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-slate-950">Resumo semanal</h3>
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>Pendentes</span>
              <span>0%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100" />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>Concluídas</span>
              <span>0%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100" />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>Vencidas</span>
              <span>0%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
