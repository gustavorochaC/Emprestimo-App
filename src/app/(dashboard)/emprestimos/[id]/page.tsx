import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { calcularJurosAcumulados, calcularSaldoDevedor, calcularJurosPendentes } from '@/lib/juros'
import { cn } from '@/lib/utils'

export default async function EmprestimoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const emprestimo = await prisma.emprestimo.findUnique({
    where: { id },
    include: { cliente: true, pagamentos: true },
  })
  if (!emprestimo) notFound()

  const jurosAcumulados = calcularJurosAcumulados(
    Number(emprestimo.valor),
    Number(emprestimo.taxa_juros),
    emprestimo.data_inicio.toISOString().split('T')[0]
  )
  const saldoDevedor = calcularSaldoDevedor(
    Number(emprestimo.valor),
    emprestimo.pagamentos.map((p) => ({
      id: p.id,
      emprestimo_id: p.emprestimo_id,
      valor: Number(p.valor),
      data_pagamento: p.data_pagamento.toISOString().split('T')[0],
      tipo: p.tipo as 'parcial' | 'juros' | 'quitacao',
      observacoes: p.observacoes ?? undefined,
      criado_em: p.criado_em.toISOString(),
    }))
  )
  const jurosPendentes = calcularJurosPendentes(
    jurosAcumulados,
    emprestimo.pagamentos.map((p) => ({
      id: p.id,
      emprestimo_id: p.emprestimo_id,
      valor: Number(p.valor),
      data_pagamento: p.data_pagamento.toISOString().split('T')[0],
      tipo: p.tipo as 'parcial' | 'juros' | 'quitacao',
      observacoes: p.observacoes ?? undefined,
      criado_em: p.criado_em.toISOString(),
    }))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/emprestimos"
          className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
        >
          <ArrowLeft className="h-4 w-4" />
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
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(emprestimo.valor))}
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
        <Link
          href={`/pagamentos?emprestimo=${emprestimo.id}`}
          className={cn(buttonVariants())}
        >
          Registrar Pagamento
        </Link>
      </div>

      {emprestimo.pagamentos.length > 0 ? (
        <div className="space-y-2">
          {emprestimo.pagamentos.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex justify-between items-center py-4">
                <div>
                  <p className="font-medium">{new Date(p.data_pagamento).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground capitalize">{p.tipo}</p>
                </div>
                <div className="text-lg font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.valor))}
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
