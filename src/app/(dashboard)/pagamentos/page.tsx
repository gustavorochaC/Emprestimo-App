'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pagamento, Emprestimo } from '@/types'
import { PagamentoForm } from '@/components/pagamento-form'
import { ReciboPdf } from '@/components/recibo-pdf'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { calcularSaldoDevedor } from '@/lib/juros'

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: pags } = await supabase
      .from('emp_pagamentos')
      .select('*, emprestimo:emp_emprestimos(*, cliente:emp_clientes(nome))')
      .order('data_pagamento', { ascending: false })
    setPagamentos(pags || [])

    const { data: emps } = await supabase.from('emp_emprestimos').select('*, cliente:emp_clientes(*)').eq('status', 'ativo')
    setEmprestimos(emps || [])
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async (pagamento: { emprestimo_id: string; valor: number; data_pagamento: string; tipo: 'parcial' | 'juros' | 'quitacao'; observacoes: string }) => {
    await supabase.from('emp_pagamentos').insert(pagamento)

    if (pagamento.tipo === 'quitacao') {
      await supabase.from('emp_emprestimos').update({ status: 'quitado' }).eq('id', pagamento.emprestimo_id)
    }

    fetchData()
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
                    saldoRestante: calcularSaldoDevedor(p.emprestimo?.valor || 0, []),
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PagamentoForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        emprestimos={emprestimos}
      />
    </div>
  )
}
