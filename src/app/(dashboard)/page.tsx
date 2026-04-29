import { createClient } from '@/lib/supabase/server'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { AlertasAtraso } from '@/components/dashboard/alertas-atraso'
import { GraficoReceita } from '@/components/dashboard/grafico-receita'
import { PagamentosRecentes } from '@/components/dashboard/pagamentos-recentes'
import { calcularJurosAcumulados, calcularDiasAtraso } from '@/lib/juros'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all data
  const { data: emprestimos } = await supabase.from('emp_emprestimos').select('*, cliente:emp_clientes(nome)')
  const { data: pagamentos } = await supabase.from('emp_pagamentos').select('*').order('data_pagamento', { ascending: false }).limit(10)
  const { data: clientes } = await supabase.from('emp_clientes').select('*').eq('ativo', true)

  // Calculate KPIs
  const capitalEmprestado = emprestimos?.filter(e => e.status === 'ativo').reduce((sum, e) => sum + e.valor, 0) || 0

  const agora = new Date()
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const jurosRecebidos = pagamentos
    ?.filter(p => p.tipo === 'juros' && new Date(p.data_pagamento) >= inicioMes)
    .reduce((sum, p) => sum + p.valor, 0) || 0

  const inadimplentes = emprestimos?.filter(e => {
    if (e.status !== 'ativo') return false
    const dias = calcularDiasAtraso(e.data_vencimento || e.data_inicio)
    return dias > 30
  }).length || 0

  const alertas = emprestimos
    ?.filter(e => {
      if (e.status !== 'ativo') return false
      const dias = calcularDiasAtraso(e.data_vencimento || e.data_inicio)
      return dias > 30
    })
    .map(e => ({
      cliente: e.cliente?.nome || 'Desconhecido',
      valor: calcularJurosAcumulados(e.valor, e.taxa_juros, e.data_inicio),
      dias: calcularDiasAtraso(e.data_vencimento || e.data_inicio)
    })) || []

  // Mock monthly data for chart (will be replaced with real aggregation)
  const receitaMensal = [
    { mes: 'Jan', valor: 1200 },
    { mes: 'Fev', valor: 1800 },
    { mes: 'Mar', valor: 1500 },
    { mes: 'Abr', valor: 2200 },
    { mes: 'Mai', valor: 1900 },
    { mes: 'Jun', valor: 2500 },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <KpiCards
        capitalEmprestado={capitalEmprestado}
        jurosRecebidos={jurosRecebidos}
        inadimplentes={inadimplentes}
        clientesAtivos={clientes?.length || 0}
      />
      <AlertasAtraso alertas={alertas} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GraficoReceita dados={receitaMensal} />
        <PagamentosRecentes pagamentos={pagamentos || []} />
      </div>
    </div>
  )
}
