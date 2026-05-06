'use server'

import { prisma } from '@/lib/prisma'
import { calcularSaldoDevedor } from '@/lib/juros'

const toNumber = (d: any) => (d ? Number(d) : 0)

function serializeCliente(c: any) {
  return {
    id: c.id,
    nome: c.nome,
    cpf_cnpj: c.cpf_cnpj,
    telefone: c.telefone,
    email: c.email,
    endereco: c.endereco,
    observacoes: c.observacoes,
    ativo: c.ativo,
    criado_em: c.criado_em.toISOString(),
  }
}

function serializeEmprestimo(e: any) {
  return {
    id: e.id,
    cliente_id: e.cliente_id,
    valor: toNumber(e.valor),
    taxa_juros: toNumber(e.taxa_juros),
    data_inicio: e.data_inicio.toISOString().split('T')[0],
    data_vencimento: e.data_vencimento ? e.data_vencimento.toISOString().split('T')[0] : undefined,
    status: e.status,
    observacoes: e.observacoes,
    criado_em: e.criado_em.toISOString(),
    cliente: e.cliente ? serializeCliente(e.cliente) : undefined,
  }
}

function serializePagamento(p: any) {
  return {
    id: p.id,
    emprestimo_id: p.emprestimo_id,
    valor: toNumber(p.valor),
    data_pagamento: p.data_pagamento.toISOString().split('T')[0],
    tipo: p.tipo,
    observacoes: p.observacoes,
    criado_em: p.criado_em.toISOString(),
    emprestimo: p.emprestimo ? serializeEmprestimo(p.emprestimo) : undefined,
  }
}

// Helper type
export type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

// =================== CLIENTES ===================
export async function getClientes(): Promise<ActionResult<any[]>> {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' },
      include: { emprestimos: { include: { pagamentos: true } } },
    })

    const data = clientes.map((c) => {
      const totalEmprestado = c.emprestimos.reduce((sum, e) => sum + Number(e.valor), 0)
      const emprestimosAtivos = c.emprestimos.filter((e) => e.status === 'ativo').length
      const saldoDevedor = c.emprestimos
        .filter((e) => e.status === 'ativo')
        .reduce((sum, e) => {
          const pags = e.pagamentos.map((p) => ({
            id: p.id,
            emprestimo_id: p.emprestimo_id,
            valor: Number(p.valor),
            data_pagamento: p.data_pagamento.toISOString().split('T')[0],
            tipo: p.tipo as 'parcial' | 'juros' | 'quitacao',
            observacoes: p.observacoes ?? undefined,
            criado_em: p.criado_em.toISOString(),
          }))
          return sum + calcularSaldoDevedor(Number(e.valor), pags)
        }, 0)

      return {
        ...serializeCliente(c),
        totalEmprestado,
        emprestimosAtivos,
        saldoDevedor,
      }
    })

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar clientes' }
  }
}

export async function getClienteById(id: string): Promise<ActionResult<ReturnType<typeof serializeCliente> | null>> {
  try {
    const cliente = await prisma.cliente.findUnique({ where: { id } })
    if (!cliente) return { success: true, data: null }
    return { success: true, data: serializeCliente(cliente) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar cliente' }
  }
}

export async function createCliente(data: {
  nome: string
  cpf_cnpj?: string
  telefone?: string
  email?: string
  endereco?: string
  observacoes?: string
  ativo?: boolean
}): Promise<ActionResult<ReturnType<typeof serializeCliente>>> {
  try {
    const cliente = await prisma.cliente.create({ data })
    return { success: true, data: serializeCliente(cliente) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao criar cliente' }
  }
}

export async function updateCliente(
  id: string,
  data: {
    nome?: string
    cpf_cnpj?: string
    telefone?: string
    email?: string
    endereco?: string
    observacoes?: string
    ativo?: boolean
  }
): Promise<ActionResult<ReturnType<typeof serializeCliente>>> {
  try {
    const cliente = await prisma.cliente.update({ where: { id }, data })
    return { success: true, data: serializeCliente(cliente) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar cliente' }
  }
}

export async function deleteCliente(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.cliente.delete({ where: { id } })
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao excluir cliente' }
  }
}

// =================== EMPRÉSTIMOS ===================
export async function getEmprestimos(): Promise<ActionResult<ReturnType<typeof serializeEmprestimo>[]>> {
  try {
    const emprestimos = await prisma.emprestimo.findMany({
      orderBy: { criado_em: 'desc' },
      include: { cliente: true },
    })
    return { success: true, data: emprestimos.map(serializeEmprestimo) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar empréstimos' }
  }
}

export async function getEmprestimosAtivos(): Promise<ActionResult<ReturnType<typeof serializeEmprestimo>[]>> {
  try {
    const emprestimos = await prisma.emprestimo.findMany({
      where: { status: 'ativo' },
      include: { cliente: true, pagamentos: true },
    })
    return {
      success: true,
      data: emprestimos.map((e) => ({
        ...serializeEmprestimo(e),
        pagamentos: e.pagamentos.map(serializePagamento),
      })),
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar empréstimos ativos' }
  }
}

export async function getEmprestimoById(id: string): Promise<ActionResult<any>> {
  try {
    const emprestimo = await prisma.emprestimo.findUnique({
      where: { id },
      include: { cliente: true, pagamentos: true },
    })
    if (!emprestimo) return { success: true, data: null }
    return {
      success: true,
      data: {
        ...serializeEmprestimo(emprestimo),
        pagamentos: emprestimo.pagamentos.map(serializePagamento),
      },
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar empréstimo' }
  }
}

export async function createEmprestimo(data: {
  cliente_id: string
  valor: number
  taxa_juros: number
  data_inicio: string
  data_vencimento?: string
  status?: string
  observacoes?: string
}): Promise<ActionResult<ReturnType<typeof serializeEmprestimo>>> {
  try {
    const emprestimo = await prisma.emprestimo.create({
      data: {
        ...data,
        data_inicio: new Date(data.data_inicio),
        data_vencimento: data.data_vencimento ? new Date(data.data_vencimento) : null,
      },
      include: { cliente: true },
    })
    return { success: true, data: serializeEmprestimo(emprestimo) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao criar empréstimo' }
  }
}

export async function updateEmprestimoStatus(
  id: string,
  status: string
): Promise<ActionResult<ReturnType<typeof serializeEmprestimo>>> {
  try {
    const emprestimo = await prisma.emprestimo.update({
      where: { id },
      data: { status },
      include: { cliente: true },
    })
    return { success: true, data: serializeEmprestimo(emprestimo) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar status' }
  }
}

export async function deleteEmprestimo(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.emprestimo.delete({ where: { id } })
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao excluir empréstimo' }
  }
}

// =================== PAGAMENTOS ===================
export async function getPagamentos(): Promise<ActionResult<any[]>> {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      orderBy: { data_pagamento: 'desc' },
      include: { emprestimo: { include: { cliente: true, pagamentos: true } } },
    })
    return {
      success: true,
      data: pagamentos.map((p) => ({
        ...serializePagamento(p),
        emprestimo: {
          ...serializeEmprestimo(p.emprestimo),
          pagamentos: p.emprestimo.pagamentos.map(serializePagamento),
        },
      })),
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar pagamentos' }
  }
}

export async function getPagamentosRecentes(limit = 10): Promise<ActionResult<any[]>> {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      orderBy: { data_pagamento: 'desc' },
      take: limit,
      include: { emprestimo: { include: { cliente: true } } },
    })
    return { success: true, data: pagamentos.map(serializePagamento) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar pagamentos recentes' }
  }
}

export async function getPagamentosByEmprestimoId(emprestimoId: string): Promise<ActionResult<any[]>> {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      where: { emprestimo_id: emprestimoId },
      orderBy: { data_pagamento: 'desc' },
    })
    return { success: true, data: pagamentos.map(serializePagamento) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar pagamentos' }
  }
}

export async function createPagamento(data: {
  emprestimo_id: string
  valor: number
  data_pagamento: string
  tipo: string
  observacoes?: string
}): Promise<ActionResult<any>> {
  try {
    const pagamento = await prisma.pagamento.create({
      data: {
        ...data,
        valor: data.valor,
        data_pagamento: new Date(data.data_pagamento),
      },
      include: { emprestimo: { include: { cliente: true } } },
    })

    if (data.tipo === 'quitacao') {
      await prisma.emprestimo.update({
        where: { id: data.emprestimo_id },
        data: { status: 'quitado' },
      })
    }

    return { success: true, data: serializePagamento(pagamento) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao registrar pagamento' }
  }
}

// =================== DASHBOARD / RELATÓRIOS ===================
export async function getDashboardData(): Promise<ActionResult<any>> {
  try {
    const [emprestimos, pagamentos, clientes] = await Promise.all([
      prisma.emprestimo.findMany({ include: { cliente: true } }),
      prisma.pagamento.findMany({
        orderBy: { data_pagamento: 'desc' },
        take: 10,
        include: { emprestimo: { include: { cliente: true } } },
      }),
      prisma.cliente.findMany({ where: { ativo: true } }),
    ])

    return {
      success: true,
      data: {
        emprestimos: emprestimos.map(serializeEmprestimo),
        pagamentos: pagamentos.map(serializePagamento),
        clientes: clientes.map(serializeCliente),
      },
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar dados do dashboard' }
  }
}

export async function getReceitaMensal(months = 6): Promise<ActionResult<{ mes: string; valor: number }[]>> {
  try {
    const hoje = new Date()
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - months + 1, 1)
    const pagamentos = await prisma.pagamento.findMany({
      where: {
        tipo: 'juros',
        data_pagamento: { gte: inicio },
      },
      orderBy: { data_pagamento: 'asc' },
    })

    const map = new Map<string, number>()
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    for (let i = 0; i < months; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - months + 1 + i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map.set(key, 0)
    }

    for (const p of pagamentos) {
      const d = new Date(p.data_pagamento)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (map.has(key)) {
        map.set(key, map.get(key)! + Number(p.valor))
      }
    }

    const resultado = Array.from(map.entries()).map(([key, valor]) => {
      const [ano, mes] = key.split('-')
      const nomeMes = nomesMeses[parseInt(mes, 10) - 1]
      return { mes: `${nomeMes} ${ano}`, valor }
    })

    return { success: true, data: resultado }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao buscar receita mensal' }
  }
}
