import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagamento } from '@/types'

interface PagamentosRecentesProps {
  pagamentos: Pagamento[]
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
              <TableHead>Valor</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{new Date(p.data_pagamento).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}
                </TableCell>
                <TableCell className="capitalize">{p.tipo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
