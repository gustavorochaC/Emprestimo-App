import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { calcularJurosAcumulados, calcularSaldoDevedor, calcularJurosPendentes } from '@/lib/juros'

export default async function EmprestimoDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: emprestimo } = await supabase
    .from('emp_emprestimos')
    .select('*, cliente:emp_clientes(*)')
    .eq('id', params.id)
    .single()
  if (!emprestimo) notFound()

  const { data: pagamentos } = await supabase.from('emp_pagamentos').select('*').eq('emprestimo_id', params.id)

  const jurosAcumulados = calcularJurosAcumulados(emprestimo.valor, emprestimo.taxa_juros, emprestimo.data_inicio)
  const saldoDevedor = calcularSaldoDevedor(emprestimo.valor, pagamentos || [])
  const jurosPendentes = calcularJurosPendentes(jurosAcumulados, pagamentos || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/emprestimos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Empréstimo — {emprestimo.cliente?.nome}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Emprestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emprestimo.valor)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Juros Acumulados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(jurosAcumulados)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Saldo Devedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoDevedor)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Juros Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(jurosPendentes)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pagamentos</h2>
        <Link href={`/pagamentos?emprestimo=${emprestimo.id}`}>
          <Button>Registrar Pagamento</Button>
        </Link>
      </div>

      {pagamentos && pagamentos.length > 0 ? (
        <div className="space-y-2">
          {pagamentos.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex justify-between items-center py-4">
                <div>
                  <p className="font-medium">{new Date(p.data_pagamento).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground capitalize">{p.tipo}</p>
                </div>
                <div className="text-lg font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum pagamento registrado.</p>
      )}
    </div>
  )
}
