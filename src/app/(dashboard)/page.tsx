import { prisma } from '@/lib/prisma'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { AlertasAtraso } from '@/components/dashboard/alertas-atraso'
import { GraficoReceita } from '@/components/dashboard/grafico-receita'
import { PagamentosRecentes } from '@/components/dashboard/pagamentos-recentes'
import { calcularJurosAcumulados, calcularDiasAtraso } from '@/lib/juros'
import { getReceitaMensal } from '@/app/actions'

export default async function DashboardPage() {
  const emprestimos = await prisma.emprestimo.findMany({
    include: { cliente: true },
  })
  const pagamentos = await prisma.pagamento.findMany({
    orderBy: { data_pagamento: 'desc' },
    take: 10,
    include: { emprestimo: { include: { cliente: true } } },
  })
  const clientes = await prisma.cliente.findMany({ where: { ativo: true } })

  const capitalEmprestado = emprestimos
    .filter((e) => e.status === 'ativo')
    .reduce((sum, e) => sum + Number(e.valor), 0)

  const agora = new Date()
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const jurosRecebidos = pagamentos
    .filter((p) => p.tipo === 'juros' && new Date(p.data_pagamento) >= inicioMes)
    .reduce((sum, p) => sum + Number(p.valor), 0)

  const inadimplentes = emprestimos.filter((e) => {
    if (e.status !== 'ativo') return false
    const dias = calcularDiasAtraso(
      e.data_vencimento ? e.data_vencimento.toISOString().split('T')[0] : e.data_inicio.toISOString().split('T')[0]
    )
    return dias > 30
  }).length

  const alertas = emprestimos
    .filter((e) => {
      if (e.status !== 'ativo') return false
      const dias = calcularDiasAtraso(
        e.data_vencimento ? e.data_vencimento.toISOString().split('T')[0] : e.data_inicio.toISOString().split('T')[0]
      )
      return dias > 30
    })
    .map((e) => ({
      cliente: e.cliente?.nome || 'Desconhecido',
      valor: calcularJurosAcumulados(
        Number(e.valor),
        Number(e.taxa_juros),
        e.data_inicio.toISOString().split('T')[0]
      ),
      dias: calcularDiasAtraso(
        e.data_vencimento ? e.data_vencimento.toISOString().split('T')[0] : e.data_inicio.toISOString().split('T')[0]
      ),
    }))

  const receitaResult = await getReceitaMensal(6)
  const receitaMensal = receitaResult.success ? receitaResult.data : []

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <KpiCards
        capitalEmprestado={capitalEmprestado}
        jurosRecebidos={jurosRecebidos}
        inadimplentes={inadimplentes}
        clientesAtivos={clientes.length}
      />
      <AlertasAtraso alertas={alertas} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GraficoReceita dados={receitaMensal} />
        <PagamentosRecentes
          pagamentos={pagamentos.map((p) => ({
            id: p.id,
            emprestimo_id: p.emprestimo_id,
            valor: Number(p.valor),
            data_pagamento: p.data_pagamento.toISOString().split('T')[0],
            tipo: p.tipo as 'parcial' | 'juros' | 'quitacao',
            observacoes: p.observacoes ?? undefined,
            criado_em: p.criado_em.toISOString(),
            emprestimo: p.emprestimo
              ? {
                  id: p.emprestimo.id,
                  cliente_id: p.emprestimo.cliente_id,
                  valor: Number(p.emprestimo.valor),
                  taxa_juros: Number(p.emprestimo.taxa_juros),
                  data_inicio: p.emprestimo.data_inicio.toISOString().split('T')[0],
                  data_vencimento: p.emprestimo.data_vencimento
                    ? p.emprestimo.data_vencimento.toISOString().split('T')[0]
                    : undefined,
                  status: p.emprestimo.status as 'ativo' | 'quitado' | 'inadimplente',
                  observacoes: p.emprestimo.observacoes ?? undefined,
                  criado_em: p.emprestimo.criado_em.toISOString(),
                  cliente: p.emprestimo.cliente
                    ? {
                        id: p.emprestimo.cliente.id,
                        nome: p.emprestimo.cliente.nome,
                        cpf_cnpj: p.emprestimo.cliente.cpf_cnpj ?? undefined,
                        telefone: p.emprestimo.cliente.telefone ?? undefined,
                        email: p.emprestimo.cliente.email ?? undefined,
                        endereco: p.emprestimo.cliente.endereco ?? undefined,
                        observacoes: p.emprestimo.cliente.observacoes ?? undefined,
                        ativo: p.emprestimo.cliente.ativo,
                        criado_em: p.emprestimo.cliente.criado_em.toISOString(),
                      }
                    : undefined,
                }
              : undefined,
          }))}
        />
      </div>
    </div>
  )
}
