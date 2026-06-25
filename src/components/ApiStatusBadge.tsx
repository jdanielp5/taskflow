"use client";

import { useEffect, useState } from "react";

export function ApiStatusBadge() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then((response) => setOnline(response.ok))
      .catch(() => setOnline(false));
  }, []);

  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold text-muted" aria-live="polite">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          online === null ? "bg-amber-500" : online ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      API {online === null ? "verificando" : online ? "online" : "indisponível"}
    </span>
  );
}
