"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginWithEmail,
  loginWithGithub,
  loginWithGoogle,
} from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
  try {
    await loginWithEmail(data.email, data.password);

    toast.success("Login realizado com sucesso.");
    router.push("/dashboard");
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Não foi possível entrar.");
    }
  }
}

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
      toast.success("Login com Google realizado.");
      router.push("/dashboard");
    } catch {
      toast.error("Não foi possível entrar com Google.");
    }
  }

  async function handleGithubLogin() {
    try {
      await loginWithGithub();
      toast.success("Login com GitHub realizado.");
      router.push("/dashboard");
    } catch {
      toast.error("Não foi possível entrar com GitHub.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Entrar no TaskFlow</h1>
        <p className="mt-2 text-sm text-slate-600">
          Acesse sua conta para gerenciar suas tarefas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            placeholder="seuemail@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            placeholder="Digite sua senha"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-500">ou</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <Mail className="h-4 w-4" />
          Entrar com Google
        </button>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Entrar com GitHub
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-semibold text-slate-900">
          Criar conta
        </Link>
      </p>
    </div>
  );
}