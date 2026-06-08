"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, KanbanSquare, ListTodo, LogOut, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const pendingMessage = "Tela reservada para a próxima entrega.";

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("Você saiu da conta.");
    router.push("/");
  }

  function handlePendingClick() {
    toast.info(pendingMessage);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-950">
          Task<span className="text-blue-600">Flow</span>
        </Link>

        <button
          type="button"
          className="inline-flex rounded-xl border border-slate-200 p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <nav className="hidden items-center gap-3 md:flex">
          {!user && (
            <>
              <Link className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100" href="/login">
                Entrar
              </Link>
              <Link className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700" href="/register">
                Criar conta
              </Link>
            </>
          )}

          {user && (
            <>
              <Link className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100" href="/dashboard">
                Dashboard
              </Link>
              <button type="button" onClick={handlePendingClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">
                <ListTodo size={18} /> Tarefas
              </button>
              <button type="button" onClick={handlePendingClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">
                <KanbanSquare size={18} /> Kanban
              </button>
              <button type="button" onClick={handlePendingClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">
                <CalendarDays size={18} /> Calendário
              </button>
              <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800">
                <LogOut size={18} /> Sair
              </button>
            </>
          )}
        </nav>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 pt-3">
            {!user && (
              <>
                <Link onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100" href="/login">
                  Entrar
                </Link>
                <Link onClick={() => setOpen(false)} className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700" href="/register">
                  Criar conta
                </Link>
              </>
            )}

            {user && (
              <>
                <Link onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100" href="/dashboard">
                  Dashboard
                </Link>
                <button type="button" onClick={handlePendingClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                  <ListTodo size={18} /> Tarefas
                </button>
                <button type="button" onClick={handlePendingClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                  <KanbanSquare size={18} /> Kanban
                </button>
                <button type="button" onClick={handlePendingClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                  <CalendarDays size={18} /> Calendário
                </button>
                <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800">
                  <LogOut size={18} /> Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
