"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, KanbanSquare, ListTodo, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { deleteCurrentUser, getAuthErrorMessage } from "@/services/auth.service";
import { getDashboardMetrics } from "@/services/dashboard.service";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.uid);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const metrics = useMemo(() => getDashboardMetrics(tasks), [tasks]);
  const needsPassword = user?.providerData.some((provider) => provider.providerId === "password") ?? false;

  async function handleDeleteAccount() {
    if (!window.confirm("Tem certeza? A conta e todas as tarefas serão excluídas permanentemente.")) return;
    setDeleting(true);
    try {
      await deleteCurrentUser(needsPassword ? password : undefined);
      toast.success("Conta excluída com sucesso.");
      router.push("/");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  const cards = [
    { label: "Tarefas pendentes", value: metrics.pending, icon: Clock3, className: "text-blue-600 bg-blue-100" },
    { label: "Concluídas na semana", value: metrics.completedThisWeek, icon: CheckCircle2, className: "text-green-700 bg-green-100" },
    { label: "Tarefas vencidas", value: metrics.overdue, icon: AlertTriangle, className: "text-red-700 bg-red-100" },
  ];

  return (
    <ProtectedPage>
      <section className="page-shell">
        <div className="page-container">
          <header className="card mb-7 p-6 md:p-8">
            <p className="eyebrow">Área autenticada</p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-black md:text-4xl">Olá, {user?.displayName || user?.email}</h1>
                <p className="mt-2 text-muted">Acompanhe o andamento das suas tarefas e acesse todas as visualizações.</p>
              </div>
              <span className="badge badge-blue max-w-full truncate">{user?.email}</span>
            </div>
          </header>

          <div className="mb-7 grid gap-5 md:grid-cols-3">
            {cards.map(({ label, value, icon: Icon, className }) => (
              <article key={label} className="card p-6">
                <span className={`inline-flex rounded-2xl p-3 ${className}`}><Icon /></span>
                <p className="mt-4 text-sm font-bold text-muted">{label}</p>
                <p className="mt-2 text-4xl font-black">{loading ? "..." : value}</p>
              </article>
            ))}
          </div>

          <DashboardCharts tasks={tasks} />

          <section className="mt-7 grid gap-5 md:grid-cols-3" aria-label="Atalhos do sistema">
            {[
              { href: "/tasks", title: "Lista de tarefas", text: "CRUD, filtros, subtarefas e detalhes.", icon: ListTodo },
              { href: "/kanban", title: "Quadro Kanban", text: "Mova tarefas entre as colunas.", icon: KanbanSquare },
              { href: "/calendar", title: "Calendário", text: "Veja os vencimentos por data.", icon: CalendarDays },
            ].map(({ href, title, text, icon: Icon }) => (
              <Link key={href} href={href} className="card block p-6 transition hover:-translate-y-1 hover:border-blue-400">
                <Icon className="text-blue-600" />
                <h2 className="mt-4 text-xl font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </Link>
            ))}
          </section>

          <section className="card mt-7 border-red-200 p-6" aria-labelledby="delete-account-title">
            <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <span className="inline-flex rounded-2xl bg-red-100 p-3 text-red-700"><Trash2 /></span>
                <h2 id="delete-account-title" className="mt-4 text-xl font-black">Excluir conta</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Esta ação remove o usuário do Firebase Authentication, o perfil e todas as tarefas vinculadas.</p>
              </div>
              <div>
                {needsPassword && (
                  <>
                    <label htmlFor="delete-password" className="mb-2 block text-sm font-bold">Senha atual</label>
                    <input id="delete-password" type="password" className="input-field mb-3" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Confirme sua senha" />
                  </>
                )}
                <button type="button" onClick={handleDeleteAccount} disabled={deleting || (needsPassword && !password)} className="button-danger w-full">
                  <Trash2 size={17} /> {deleting ? "Excluindo..." : "Excluir minha conta"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </ProtectedPage>
  );
}
