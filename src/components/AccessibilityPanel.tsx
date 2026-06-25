"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Accessibility, AArrowDown, AArrowUp, Eye, Link2, RotateCcw } from "lucide-react";

const scales = [100, 115, 130];

export function AccessibilityPanel() {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(() =>
    typeof window === "undefined" ? 100 : Number(localStorage.getItem("taskflow-font-scale")) || 100,
  );
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window === "undefined" ? false : localStorage.getItem("taskflow-reduce-motion") === "true",
  );
  const [underlineLinks, setUnderlineLinks] = useState(() =>
    typeof window === "undefined" ? false : localStorage.getItem("taskflow-underline-links") === "true",
  );

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
    document.documentElement.dataset.underlineLinks = String(underlineLinks);
    localStorage.setItem("taskflow-font-scale", String(scale));
    localStorage.setItem("taskflow-reduce-motion", String(reduceMotion));
    localStorage.setItem("taskflow-underline-links", String(underlineLinks));
  }, [scale, reduceMotion, underlineLinks]);

  function changeScale(direction: number) {
    const index = scales.indexOf(scale);
    const next = Math.min(scales.length - 1, Math.max(0, index + direction));
    setScale(scales[next]);
  }

  function reset() {
    setScale(100);
    setReduceMotion(false);
    setUnderlineLinks(false);
    setTheme("light");
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <section className="card w-[min(92vw,330px)] p-5 shadow-2xl" aria-label="Opções de acessibilidade">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-black">Acessibilidade</h2>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">6 recursos</span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="mb-2 font-bold">Tema visual</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["light", "Claro"],
                  ["dark", "Escuro"],
                  ["contrast", "Contraste"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    aria-pressed={theme === value}
                    className={`a11y-option ${theme === value ? "a11y-option-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-bold">Tamanho do texto: {scale}%</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="a11y-option" onClick={() => changeScale(-1)} disabled={scale === 100}>
                  <AArrowDown size={17} /> Diminuir
                </button>
                <button type="button" className="a11y-option" onClick={() => changeScale(1)} disabled={scale === 130}>
                  <AArrowUp size={17} /> Aumentar
                </button>
              </div>
            </div>

            <button
              type="button"
              className={`a11y-option w-full justify-start ${reduceMotion ? "a11y-option-active" : ""}`}
              aria-pressed={reduceMotion}
              onClick={() => setReduceMotion((value) => !value)}
            >
              <Eye size={17} /> Reduzir animações
            </button>

            <button
              type="button"
              className={`a11y-option w-full justify-start ${underlineLinks ? "a11y-option-active" : ""}`}
              aria-pressed={underlineLinks}
              onClick={() => setUnderlineLinks((value) => !value)}
            >
              <Link2 size={17} /> Sublinhar links
            </button>

            <button type="button" className="a11y-option w-full justify-start" onClick={reset}>
              <RotateCcw size={17} /> Restaurar padrão
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700"
        aria-label={open ? "Fechar painel de acessibilidade" : "Abrir painel de acessibilidade"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Accessibility size={27} aria-hidden="true" />
      </button>
    </div>
  );
}
