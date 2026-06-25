"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const authenticatedLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: ListTodo },
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/calendar", label: "Calendário", icon: CalendarDays },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();


  async function handleLogout() {
    try {
      await logout();
      toast.success("Sessão encerrada.");
      router.push("/");
    } catch {
      toast.error("Não foi possível sair da conta.");
    }
  }

  const linkClass = (href: string) =>
    cn(
      "inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition",
      pathname.startsWith(href)
        ? "bg-blue-600 text-white"
        : "text-[var(--foreground)] hover:bg-[var(--surface-soft)]",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[74px] max-w-[1180px] items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Ir para a página inicial do TaskFlow">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-black text-white shadow-lg shadow-blue-500/20">
            TF
          </span>
          <span>
            <strong className="block text-lg leading-none">TaskFlow</strong>
            <small className="text-xs font-bold text-muted">Gestor de tarefas</small>
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-2"
        >
          {!loading && user ? (
            <>
              <div className="grid gap-1 sm:grid-cols-2 lg:flex">
                {authenticatedLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className={linkClass(href)}>
                    <Icon size={17} aria-hidden="true" /> {label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3 lg:ml-2 lg:mt-0 lg:flex-row lg:items-center lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <span className="max-w-48 truncate text-xs font-bold text-muted" title={user.email || "Usuário"}>
                  {user.displayName || user.email}
                </span>
                <button type="button" onClick={handleLogout} className="button-secondary text-sm">
                  <LogOut size={17} /> Sair
                </button>
              </div>
            </>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:flex">
              <Link href="/login" className={linkClass("/login")}>
                <LogIn size={18} /> Entrar
              </Link>
              <Link href="/register" className="button-primary text-sm">
                <UserPlus size={18} /> Criar conta
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
