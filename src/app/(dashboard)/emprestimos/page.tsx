'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Emprestimo, Cliente } from '@/types'
import { EmprestimosTable } from '@/components/emprestimos/emprestimos-table'
import { EmprestimoForm } from '@/components/emprestimo-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: emps } = await supabase.from('emp_emprestimos').select('*, cliente:emp_clientes(*)').order('criado_em', { ascending: false })
    setEmprestimos(emps || [])
    const { data: clis } = await supabase.from('emp_clientes').select('*').eq('ativo', true)
    setClientes(clis || [])
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async (emprestimo: Omit<Emprestimo, 'id' | 'criado_em' | 'cliente'>) => {
    await supabase.from('emp_emprestimos').insert(emprestimo)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este empréstimo?')) {
      await supabase.from('emp_emprestimos').delete().eq('id', id)
      fetchData()
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
      <EmprestimosTable emprestimos={emprestimos} onDelete={handleDelete} />
      <EmprestimoForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        clientes={clientes}
      />
    </div>
  )
}
