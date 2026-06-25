"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage, registerWithEmail } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

const schema = z
  .object({
    name: z.string().trim().min(3, "Informe pelo menos 3 caracteres."),
    email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, "A senha precisa ter no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "Use pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "Use pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "Use pelo menos um número.")
      .regex(/[^A-Za-z0-9]/, "Use pelo menos um caractere especial."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerWithEmail(data.name, data.email, data.password);
      toast.success("Conta criada. Abra seu e-mail e confirme o cadastro antes de entrar.");
      router.push("/login");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  }

  return (
    <div className="auth-card p-7">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><UserPlus size={26} /></span>
        <p className="eyebrow mt-5">Novo usuário</p>
        <h1 className="mt-2 text-3xl font-black">Criar conta</h1>
        <p className="mt-2 text-sm text-muted">Você receberá um e-mail para confirmar o cadastro.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="name">Nome</label>
          <input id="name" className="input-field" type="text" autoComplete="name" placeholder="Seu nome completo" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="email">E-mail</label>
          <input id="email" className="input-field" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="password">Senha forte</label>
          <input id="password" className="input-field" type="password" autoComplete="new-password" placeholder="8+ caracteres, maiúscula, número e símbolo" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.password.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="confirmPassword">Confirmar senha</label>
          <input id="confirmPassword" className="input-field" type="password" autoComplete="new-password" placeholder="Repita sua senha" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm font-bold text-red-600" role="alert">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="button-primary w-full">
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta? <Link href="/login" className="font-black text-blue-600">Entrar</Link>
      </p>
    </div>
  );
}
