import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf_cnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  ativo: z.boolean().optional(),
})

export const emprestimoSchema = z.object({
  cliente_id: z.string().uuid('Selecione um cliente'),
  valor: z.number().positive('Valor deve ser maior que 0'),
  taxa_juros: z.number().min(0, 'Taxa não pode ser negativa'),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_vencimento: z.string().optional(),
  observacoes: z.string().optional(),
  status: z.enum(['ativo', 'quitado', 'inadimplente']).optional(),
})

export const pagamentoSchema = z.object({
  emprestimo_id: z.string().uuid('Selecione um empréstimo'),
  valor: z.number().positive('Valor deve ser maior que 0'),
  data_pagamento: z.string().min(1, 'Data é obrigatória'),
  tipo: z.enum(['parcial', 'juros', 'quitacao']),
  observacoes: z.string().optional(),
})
