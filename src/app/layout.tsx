import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { VLibras } from "@/components/VLibras";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TaskFlow", template: "%s | TaskFlow" },
  description: "Sistema completo de gerenciamento de tarefas com Firebase, Kanban e calendário.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a>
          <Navbar />
          <main id="conteudo-principal" tabIndex={-1}>{children}</main>
          <Footer />
          <AccessibilityPanel />
          <VLibras />
          <Toaster richColors position="top-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
