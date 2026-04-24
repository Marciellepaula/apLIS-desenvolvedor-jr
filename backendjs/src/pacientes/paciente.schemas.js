import { z } from "zod";

export const pacienteCreateSchema = z.object({
  body: z.object({
    nome: z.string().trim().min(1).max(120),
    dataNascimento: z.string().date().optional(),
    carteirinha: z.string().trim().min(1).max(40),
    cpf: z
      .string()
      .trim()
      .regex(/^\d{11}$/, "cpf.invalid"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const pacienteIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).optional(),
  body: z.any().optional(),
});

export const pacienteUpdateSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    nome: z.string().trim().min(1).max(120),
    dataNascimento: z.string().date().optional(),
    carteirinha: z.string().trim().min(1).max(40),
    cpf: z
      .string()
      .trim()
      .regex(/^\d{11}$/, "cpf.invalid"),
  }),
  query: z.object({}).optional(),
});

