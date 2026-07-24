import { z } from "zod";

const emailSchema = z.string().trim().email("Digite um e-mail valido.");
const passwordSchema = z.string().min(6, "A senha precisa ter pelo menos 6 caracteres.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Digite sua senha."),
});

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Digite seu nome."),
  atelierName: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme sua nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });
