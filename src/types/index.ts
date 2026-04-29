export interface Cliente {
  id: string
  nome: string
  cpf_cnpj?: string
  telefone?: string
  email?: string
  endereco?: string
  observacoes?: string
  ativo: boolean
  criado_em: string
}

export interface Emprestimo {
  id: string
  cliente_id: string
  valor: number
  taxa_juros: number
  data_inicio: string
  data_vencimento?: string
  status: 'ativo' | 'quitado' | 'inadimplente'
  observacoes?: string
  criado_em: string
  cliente?: Cliente
}

export interface Pagamento {
  id: string
  emprestimo_id: string
  valor: number
  data_pagamento: string
  tipo: 'parcial' | 'juros' | 'quitacao'
  observacoes?: string
  criado_em: string
  emprestimo?: Emprestimo
}

export type TipoPagamento = 'parcial' | 'juros' | 'quitacao'
