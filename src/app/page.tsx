import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  LogIn,
  Sparkles,
} from "lucide-react";
import { BackgroundBeams } from "@/components/ui/aceternity/BackgroundBeams";
import { Spotlight } from "@/components/ui/aceternity/Spotlight";

const features = [
  { icon: ListTodo, title: "CRUD completo", text: "Crie, edite, conclua e exclua tarefas com subtarefas." },
  { icon: KanbanSquare, title: "Kanban interativo", text: "Mova cartões entre A fazer, Fazendo e Concluído." },
  { icon: CalendarDays, title: "Calendário integrado", text: "Visualize vencimentos e abra os detalhes em um modal." },
  { icon: LayoutDashboard, title: "Dashboard analítico", text: "Acompanhe métricas e gráficos atualizados em tempo real." },
];

export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-154px)] overflow-hidden bg-[var(--background)]">
      <Spotlight />
      <BackgroundBeams />

      <div className="relative mx-auto grid max-w-[1180px] gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-blue-600 shadow-sm">
            <Sparkles size={16} /> Entrega final completa
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight md:text-6xl">
            Transforme tarefas em um fluxo simples, visual e produtivo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            O TaskFlow reúne autenticação segura, dashboard, CRUD, subtarefas, Kanban, calendário e acessibilidade em uma única aplicação responsiva.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="button-primary px-6 py-4">
              Começar gratuitamente <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="button-secondary px-6 py-4">
              <LogIn size={18} /> Entrar no sistema
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Firebase Authentication", "Dados em tempo real", "Responsivo", "VLibras e temas visuais"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-bold shadow-sm">
                <CheckCircle2 className="text-blue-600" size={20} /> {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card relative overflow-hidden p-4 md:p-6">
          <div className="rounded-[1.4rem] bg-slate-950 p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Mockup do sistema</p>
                <h2 className="mt-1 text-xl font-black">Dashboard TaskFlow</h2>
              </div>
              <LayoutDashboard className="text-blue-300" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["Pendentes", "7"],
                ["Semana", "4"],
                ["Vencidas", "1"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-3 sm:p-4">
                  <p className="text-[11px] text-slate-300 sm:text-sm">{label}</p>
                  <p className="mt-2 text-2xl font-black sm:text-3xl">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {features.slice(0, 3).map(({ icon: Icon, title }, index) => (
                <div key={title} className="rounded-2xl bg-white p-4 text-slate-950">
                  <Icon className="text-blue-600" size={20} />
                  <p className="mt-4 text-sm font-black">{title}</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${75 - index * 14}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1180px] px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="card p-5">
              <div className="inline-flex rounded-2xl bg-blue-100 p-3 text-blue-700"><Icon /></div>
              <h2 className="mt-4 text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
