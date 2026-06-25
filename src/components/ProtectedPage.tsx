"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <section className="page-shell flex min-h-[70vh] items-center justify-center">
        <div className="card flex items-center gap-3 p-6 font-bold">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Carregando acesso...
        </div>
      </section>
    );
  }

  return children;
}
