"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, ListTodo, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { deleteCurrentUser } from "@/services/auth.service";
import { getDashboardMetrics } from "@/services/dashboard.service";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(user?.uid);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const metrics = useMemo(() => getDashboardMetrics(tasks), [tasks]);
  const mainProvider = user?.providerData[0]?.providerId;
  const needsPassword = mainProvider === "password";

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  async function handleDeleteAccount() {
    const confirmed = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");
    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteCurrentUser(needsPassword ? password : undefined);
      toast.success("Conta e tarefas excluídas com sucesso.");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir a conta.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !user) {
    return (
      <section className="flex min-h-[calc(100vh-145px)] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-bold text-slate-700">Carregando acesso...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-145px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">Área autenticada</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-950 md:text-4xl">Olá, {user.displayName || user.email}</h1>
              <p className="mt-2 text-slate-600">Acesse o cadastro de tarefas ou acompanhe o resumo das suas atividades.</p>
            </div>
            <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
              {user.email}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
              <Clock3 />
            </div>
            <p className="text-sm font-bold text-slate-500">Tarefas pendentes</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{tasksLoading ? "..." : metrics.pending}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-green-50 p-3 text-green-700">
              <CheckCircle2 />
            </div>
            <p className="text-sm font-bold text-slate-500">Concluídas na semana</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{tasksLoading ? "..." : metrics.completedThisWeek}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-red-50 p-3 text-red-700">
              <AlertTriangle />
            </div>
            <p className="text-sm font-bold text-slate-500">Tarefas vencidas</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{tasksLoading ? "..." : metrics.overdue}</p>
          </div>
        </div>

        <DashboardCharts tasks={tasks} />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
              <ListTodo />
            </div>
            <h2 className="text-xl font-black text-slate-950">Gestão de tarefas</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A página de tarefas já permite cadastrar, visualizar, editar e excluir tarefas do usuário logado.
            </p>
            <Link href="/tasks" className="primary-button mt-5 inline-flex items-center justify-center gap-2">
              Abrir lista de tarefas
            </Link>
          </div>

          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-red-50 p-3 text-red-700">
              <Trash2 />
            </div>
            <h2 className="text-xl font-black text-slate-950">Excluir conta</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Esta opção remove o usuário autenticado e também apaga as tarefas vinculadas a ele no Firestore.
            </p>

            {needsPassword && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="deletePassword">
                  Senha atual
                </label>
                <input
                  id="deletePassword"
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                />
              </div>
            )}

            <button type="button" disabled={deleting} onClick={handleDeleteAccount} className="danger-button mt-4 inline-flex items-center justify-center gap-2">
              <Trash2 size={18} /> {deleting ? "Excluindo..." : "Excluir minha conta"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
