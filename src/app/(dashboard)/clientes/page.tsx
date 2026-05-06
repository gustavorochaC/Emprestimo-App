'use client'

import { useState, useEffect, useCallback } from 'react'
import { ClienteResumo } from '@/types'
import { ClientesTable } from '@/components/clientes/clientes-table'
import { ClienteForm } from '@/components/cliente-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getClientes, createCliente, updateCliente, deleteCliente } from '@/app/actions'
import { clienteSchema } from '@/lib/schemas'
import type { z } from 'zod'

type ClienteFormData = z.infer<typeof clienteSchema>

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteResumo[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<ClienteResumo | null>(null)

  const fetchClientes = useCallback(async () => {
    const result = await getClientes()
    if (result.success) {
      setClientes(result.data)
    } else {
      alert(result.error)
    }
  }, [])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  const handleCreate = async (cliente: ClienteFormData) => {
    const result = await createCliente(cliente)
    if (result.success) {
      fetchClientes()
      setDialogOpen(false)
    } else {
      alert(result.error)
    }
  }

  const handleUpdate = async (cliente: ClienteFormData) => {
    if (editingCliente) {
      const result = await updateCliente(editingCliente.id, cliente)
      if (result.success) {
        fetchClientes()
        setDialogOpen(false)
      } else {
        alert(result.error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      const result = await deleteCliente(id)
      if (result.success) {
        fetchClientes()
      } else {
        alert(result.error)
      }
    }
  }

  const openEdit = (cliente: ClienteResumo) => {
    setEditingCliente(cliente)
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingCliente(null)
    setDialogOpen(true)
  }

  const totalClientes = clientes.length
  const clientesAtivos = clientes.filter((c) => c.ativo).length
  const clientesInativos = clientes.filter((c) => !c.ativo).length
  const clientesComSaldoDevedor = clientes.filter((c) => c.saldoDevedor > 0).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{clientesAtivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Clientes Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{clientesInativos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Clientes com Saldo Devedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{clientesComSaldoDevedor}</div>
          </CardContent>
        </Card>
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
