"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import type { EventClickArg } from "@fullcalendar/core";
import { CalendarDays, ListTodo } from "lucide-react";
import { CalendarTaskModal } from "@/components/CalendarTaskModal";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";

const colors = {
  baixa: { backgroundColor: "#16a34a", borderColor: "#15803d" },
  media: { backgroundColor: "#f59e0b", borderColor: "#d97706" },
  alta: { backgroundColor: "#dc2626", borderColor: "#b91c1c" },
};

export default function CalendarPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.uid);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const events = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate)
        .map((task) => ({
          id: task.id,
          title: task.title,
          start: task.dueDate,
          allDay: true,
          ...colors[task.priority],
          extendedProps: { taskId: task.id },
        })),
    [tasks],
  );

  function handleEventClick(info: EventClickArg) {
    const task = tasks.find((item) => item.id === info.event.extendedProps.taskId);
    if (task) setSelectedTask(task);
  }

  return (
    <ProtectedPage>
      <section className="page-shell">
        <div className="page-container">
          <header className="card mb-7 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">FullCalendar</p>
                <h1 className="mt-2 text-3xl font-black md:text-4xl">Calendário de vencimentos</h1>
                <p className="mt-2 max-w-2xl text-muted">As tarefas com data aparecem automaticamente. Clique em um evento para abrir seus detalhes.</p>
              </div>
              <Link href="/tasks" className="button-secondary"><ListTodo size={18} /> Abrir tarefas</Link>
            </div>
          </header>

          <div className="card overflow-x-auto p-4 md:p-6">
            {loading ? (
              <p className="p-8 text-center font-bold">Carregando calendário...</p>
            ) : events.length === 0 ? (
              <div className="p-10 text-center">
                <CalendarDays className="mx-auto text-blue-600" size={48} />
                <h2 className="mt-4 text-2xl font-black">Nenhum vencimento cadastrado</h2>
                <p className="mt-2 text-muted">Crie tarefas com data de vencimento para preencher o calendário.</p>
              </div>
            ) : (
              <div className="min-w-[720px]">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  firstDay={1}
                  events={events}
                  eventClick={handleEventClick}
                  height="auto"
                  dayMaxEvents
                  headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek" }}
                  buttonText={{ today: "Hoje", month: "Mês", week: "Semana" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedTask && <CalendarTaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </ProtectedPage>
  );
}
