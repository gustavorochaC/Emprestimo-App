'use client'

import { useState } from 'react'
import { ClienteResumo } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCpfCnpj, formatTelefone, unmask } from '@/lib/masks'

interface ClientesTableProps {
  clientes: ClienteResumo[]
  onEdit: (cliente: ClienteResumo) => void
  onDelete: (id: string) => void
}

export function ClientesTable({ clientes, onEdit, onDelete }: ClientesTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos')

  const normalizedSearch = unmask(search).toLowerCase()

  const filtered = clientes.filter((c) => {
    const matchesStatus =
      statusFilter === 'todos'
        ? true
        : statusFilter === 'ativo'
          ? c.ativo
          : !c.ativo

    if (!search.trim()) return matchesStatus

    const matchesNome = c.nome.toLowerCase().includes(search.toLowerCase())
    const matchesCpf = c.cpf_cnpj
      ? unmask(c.cpf_cnpj).includes(normalizedSearch) ||
        formatCpfCnpj(c.cpf_cnpj).toLowerCase().includes(search.toLowerCase())
      : false
    const matchesTelefone = c.telefone
      ? unmask(c.telefone).includes(normalizedSearch) ||
        formatTelefone(c.telefone).toLowerCase().includes(search.toLowerCase())
      : false

    return matchesStatus && (matchesNome || matchesCpf || matchesTelefone)
  })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por nome, CPF/CNPJ ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'todos' | 'ativo' | 'inativo')}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empréstimos Ativos</TableHead>
              <TableHead>Saldo Devedor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf_cnpj ? formatCpfCnpj(cliente.cpf_cnpj) : '-'}</TableCell>
                  <TableCell>{cliente.telefone ? formatTelefone(cliente.telefone) : '-'}</TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell>{cliente.emprestimosAtivos}</TableCell>
                  <TableCell>{formatCurrency(cliente.saldoDevedor)}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.ativo ? 'default' : 'secondary'}>
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/clientes/${cliente.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(cliente)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(cliente.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
