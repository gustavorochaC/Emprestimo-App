import { Emprestimo, Pagamento } from '@/types'

export const calcularJurosMensais = (valor: number, taxaJuros: number): number => {
  return valor * (taxaJuros / 100)
}

export const calcularJurosDiarios = (jurosMensais: number): number => {
  return jurosMensais / 30
}

export const calcularMesesDecorridos = (dataInicio: string | Date): number => {
  const inicio = new Date(dataInicio)
  const hoje = new Date()
  const diffTime = hoje.getTime() - inicio.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return Math.max(0, diffDays / 30)
}

export const calcularJurosAcumulados = (valor: number, taxaJuros: number, dataInicio: string | Date): number => {
  const jurosMensais = calcularJurosMensais(valor, taxaJuros)
  const meses = calcularMesesDecorridos(dataInicio)
  return jurosMensais * meses
}

export const calcularSaldoDevedor = (valor: number, pagamentos: Pagamento[]): number => {
  const quitacoes = pagamentos
    .filter(p => p.tipo === 'quitacao' || p.tipo === 'parcial')
    .reduce((sum, p) => sum + p.valor, 0)
  return Math.max(0, valor - quitacoes)
}

export const calcularJurosPendentes = (jurosAcumulados: number, pagamentos: Pagamento[]): number => {
  const jurosPagos = pagamentos
    .filter(p => p.tipo === 'juros')
    .reduce((sum, p) => sum + p.valor, 0)
  return Math.max(0, jurosAcumulados - jurosPagos)
}

export const calcularDiasAtraso = (dataVencimento: string | Date): number => {
  const vencimento = new Date(dataVencimento)
  const hoje = new Date()
  const diffTime = hoje.getTime() - vencimento.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}
