"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  getAuthErrorMessage,
  loginWithEmail,
  loginWithGithub,
  loginWithGoogle,
} from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginFormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  async function onSubmit(data: LoginFormData) {
    try {
      await loginWithEmail(data.email, data.password);
      toast.success("Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  }

  async function socialLogin(provider: "google" | "github") {
    setSocialLoading(provider);
    try {
      if (provider === "google") await loginWithGoogle();
      else await loginWithGithub();
      toast.success("Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSocialLoading(null);
    }
  }

  return (
    <div className="auth-card p-7">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <LockKeyhole size={26} />
        </span>
        <p className="eyebrow mt-5">Acesso seguro</p>
        <h1 className="mt-2 text-3xl font-black">Entrar no TaskFlow</h1>
        <p className="mt-2 text-sm text-muted">Acesse suas tarefas, métricas, quadro e calendário.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="email">E-mail</label>
          <input id="email" className="input-field" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="password">Senha</label>
          <input id="password" className="input-field" type="password" autoComplete="current-password" placeholder="Sua senha" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting || socialLoading !== null} className="button-primary w-full">
          {isSubmitting ? "Entrando..." : "Entrar com e-mail"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs text-muted">ou continue com</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => socialLogin("google")} disabled={socialLoading !== null || isSubmitting} className="button-secondary">
          <Mail size={18} /> {socialLoading === "google" ? "Abrindo..." : "Google"}
        </button>
        <button type="button" onClick={() => socialLogin("github")} disabled={socialLoading !== null || isSubmitting} className="button-secondary">
          <Code2 size={18} /> {socialLoading === "github" ? "Abrindo..." : "GitHub"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta? <Link href="/register" className="font-black text-blue-600">Criar conta</Link>
      </p>
    </div>
  );
}
