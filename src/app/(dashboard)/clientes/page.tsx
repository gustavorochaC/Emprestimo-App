'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Cliente } from '@/types'
import { ClientesTable } from '@/components/clientes/clientes-table'
import { ClienteForm } from '@/components/cliente-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const supabase = createClient()

  const fetchClientes = useCallback(async () => {
    const { data } = await supabase.from('emp_clientes').select('*').order('nome')
    setClientes(data || [])
  }, [supabase])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  const handleCreate = async (cliente: Omit<Cliente, 'id' | 'criado_em'>) => {
    await supabase.from('emp_clientes').insert(cliente)
    fetchClientes()
  }

  const handleUpdate = async (cliente: Omit<Cliente, 'id' | 'criado_em'>) => {
    if (editingCliente) {
      await supabase.from('emp_clientes').update(cliente).eq('id', editingCliente.id)
      fetchClientes()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await supabase.from('emp_clientes').delete().eq('id', id)
      fetchClientes()
    }
  }

  const openEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingCliente(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>
      <ClientesTable clientes={clientes} onEdit={openEdit} onDelete={handleDelete} />
      <ClienteForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={editingCliente ? handleUpdate : handleCreate}
        cliente={editingCliente}
      />
    </div>
  )
}
