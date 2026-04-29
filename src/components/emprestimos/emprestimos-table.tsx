'use client'

import { Emprestimo } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { calcularSaldoDevedor, calcularJurosAcumulados } from '@/lib/juros'

interface EmprestimosTableProps {
  emprestimos: Emprestimo[]
  onDelete: (id: string) => void
}

export function EmprestimosTable({ emprestimos, onDelete }: EmprestimosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Taxa</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Saldo Devedor</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emprestimos.map((emprestimo) => (
          <TableRow key={emprestimo.id}>
            <TableCell className="font-medium">{emprestimo.cliente?.nome || 'N/A'}</TableCell>
            <TableCell>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emprestimo.valor)}
            </TableCell>
            <TableCell>{emprestimo.taxa_juros}%</TableCell>
            <TableCell>
              <Badge
                variant={
                  emprestimo.status === 'ativo'
                    ? 'default'
                    : emprestimo.status === 'quitado'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {emprestimo.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                calcularSaldoDevedor(emprestimo.valor, [])
              )}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Link href={`/emprestimos/${emprestimo.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => onDelete(emprestimo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
