'use client'

import { useState, useEffect, useCallback } from 'react'
import { Pagamento, Emprestimo } from '@/types'
import { PagamentoForm } from '@/components/pagamento-form'
import { ReciboPdf } from '@/components/recibo-pdf'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { calcularSaldoDevedor } from '@/lib/juros'
import { getPagamentos, getEmprestimosAtivos, createPagamento } from '@/app/actions'
import { pagamentoSchema } from '@/lib/schemas'
import type { z } from 'zod'

type PagamentoFormData = z.infer<typeof pagamentoSchema>

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    const [pagsResult, empsResult] = await Promise.all([getPagamentos(), getEmprestimosAtivos()])
    if (!pagsResult.success) {
      alert(pagsResult.error)
      return
    }
    if (!empsResult.success) {
      alert(empsResult.error)
      return
    }
    setPagamentos(pagsResult.data)
    setEmprestimos(empsResult.data)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async (pagamento: PagamentoFormData) => {
    const result = await createPagamento(pagamento)
    if (result.success) {
      fetchData()
      setDialogOpen(false)
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pagamentos</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Pagamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Recibo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.data_pagamento).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{p.emprestimo?.cliente?.nome || 'N/A'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}
                  </TableCell>
                  <TableCell className="capitalize">{p.tipo}</TableCell>
                  <TableCell>
                    <ReciboPdf
                      data={{
                        cliente: p.emprestimo?.cliente?.nome || 'N/A',
                        valor: p.valor,
                        data: p.data_pagamento,
                        tipo: p.tipo,
                        saldoRestante: calcularSaldoDevedor(p.emprestimo?.valor || 0, p.emprestimo?.pagamentos || []),
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PagamentoForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        emprestimos={emprestimos}
      />
    </div>
  )
}
