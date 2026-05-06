import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pagamento } from '@/types'

interface PagamentosRecentesProps {
  pagamentos: Pagamento[]
}

function tipoBadge(tipo: 'parcial' | 'juros' | 'quitacao') {
  switch (tipo) {
    case 'parcial':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Parcial</Badge>
    case 'juros':
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Juros</Badge>
    case 'quitacao':
      return <Badge variant="secondary" className="bg-sky-100 text-sky-700 hover:bg-sky-100">Quitação</Badge>
    default:
      return <Badge variant="secondary">{tipo}</Badge>
  }
}

export function PagamentosRecentes({ pagamentos }: PagamentosRecentesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{new Date(p.data_pagamento).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="font-medium">{p.emprestimo?.cliente?.nome || 'N/A'}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}
                </TableCell>
                <TableCell>{tipoBadge(p.tipo)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
