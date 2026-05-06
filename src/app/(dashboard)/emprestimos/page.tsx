'use client'

import { useState, useEffect, useCallback } from 'react'
import { Emprestimo, Cliente } from '@/types'
import { EmprestimosTable } from '@/components/emprestimos/emprestimos-table'
import { EmprestimoForm } from '@/components/emprestimo-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getEmprestimos, getClientes, createEmprestimo, deleteEmprestimo } from '@/app/actions'
import { emprestimoSchema } from '@/lib/schemas'
import type { z } from 'zod'

type EmprestimoFormData = z.infer<typeof emprestimoSchema>

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    const [empsResult, clisResult] = await Promise.all([getEmprestimos(), getClientes()])
    if (!empsResult.success) {
      alert(empsResult.error)
      return
    }
    if (!clisResult.success) {
      alert(clisResult.error)
      return
    }
    setEmprestimos(empsResult.data)
    setClientes(clisResult.data.filter((c) => c.ativo))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async (emprestimo: EmprestimoFormData) => {
    const result = await createEmprestimo(emprestimo)
    if (result.success) {
      fetchData()
      setDialogOpen(false)
    } else {
      alert(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este empréstimo?')) {
      const result = await deleteEmprestimo(id)
      if (result.success) {
        fetchData()
      } else {
        alert(result.error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Empréstimos</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Empréstimo
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <EmprestimosTable emprestimos={emprestimos} onDelete={handleDelete} />
        </CardContent>
      </Card>
      <EmprestimoForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        clientes={clientes}
      />
    </div>
  )
}
