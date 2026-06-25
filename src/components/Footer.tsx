import { ApiStatusBadge } from "@/components/ApiStatusBadge";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-6">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black">TaskFlow - Maria Eduarda e José Daniel</p>
          <p className="mt-1 text-xs text-muted">Projeto acadêmico desenvolvido com Next.js, Firebase e TypeScript.</p>
        </div>
        <ApiStatusBadge />
      </div>
    </footer>
  );
}
