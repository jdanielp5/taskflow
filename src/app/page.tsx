import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, LockKeyhole, Sparkles } from "lucide-react";

const features = [
  "Cadastro com validação de campos",
  "Login com e-mail, Google e GitHub",
  "Dashboard protegido para usuários autenticados",
  "Lista de tarefas com cadastro, edição e exclusão",
];

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-145px)] bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),#f8fafc]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <Sparkles size={16} /> Entrega parcial 1
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Organize tarefas com um acesso simples e seguro.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            O TaskFlow é uma base para um gestor de tarefas. Nesta etapa, o foco é o sistema de login completo com Firebase Authentication e o CRUD principal de tarefas no Firestore.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
              Criar conta <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-800 transition hover:bg-slate-50">
              Entrar no sistema
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
                <CheckCircle2 className="text-blue-600" size={20} />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-300">Mockup do sistema</p>
                <h2 className="text-xl font-black">Dashboard TaskFlow</h2>
              </div>
              <LayoutDashboard className="text-blue-300" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Pendentes</p>
                <p className="mt-2 text-3xl font-black">0</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Semana</p>
                <p className="mt-2 text-3xl font-black">0</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Vencidas</p>
                <p className="mt-2 text-3xl font-black">0</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-5 text-slate-900">
              <div className="mb-4 flex items-center gap-2 font-black">
                <LockKeyhole size={18} className="text-blue-600" /> Área protegida
              </div>
              <div className="space-y-3">
                <div className="h-3 rounded-full bg-slate-200" />
                <div className="h-3 w-10/12 rounded-full bg-slate-200" />
                <div className="h-3 w-7/12 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
