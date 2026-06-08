"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerWithEmail } from "@/services/auth.service";

const schema = z
  .object({
    name: z.string().min(3, "Informe pelo menos 3 caracteres."),
    email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, "A senha precisa ter no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "Use pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "Use pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "Use pelo menos um número."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);

    try {
      await registerWithEmail(data.name, data.email, data.password);
      toast.success("Conta criada. Confirme o e-mail antes de fazer login.");
      router.push("/login");
    } catch {
      toast.error("Não foi possível criar a conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card p-7">
      <div className="mb-6 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">Cadastro</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-500">Após cadastrar, confirme o e-mail para liberar o acesso.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="name">
            Nome
          </label>
          <input id="name" className="input-field" type="text" placeholder="Seu nome" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm font-semibold text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="email">
            E-mail
          </label>
          <input id="email" className="input-field" type="email" placeholder="seuemail@exemplo.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm font-semibold text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="password">
            Senha
          </label>
          <input id="password" className="input-field" type="password" placeholder="Mínimo 8 caracteres" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm font-semibold text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <input id="confirmPassword" className="input-field" type="password" placeholder="Repita sua senha" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm font-semibold text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Já tem conta? <Link href="/login" className="font-bold text-blue-600 hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
