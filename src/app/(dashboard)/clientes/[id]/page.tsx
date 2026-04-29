import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function ClienteDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: cliente } = await supabase.from('emp_clientes').select('*').eq('id', params.id).single()
  if (!cliente) notFound()

  const { data: emprestimos } = await supabase.from('emp_emprestimos').select('*').eq('cliente_id', params.id)
  const { data: pagamentos } = await supabase
    .from('emp_pagamentos')
    .select('*, emprestimo:emp_emprestimos(id)')
    .eq('emprestimo.cliente_id', params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{cliente.nome}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
            <p>{cliente.cpf_cnpj || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p>{cliente.telefone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{cliente.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={cliente.ativo ? 'default' : 'secondary'}>
              {cliente.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emprestimos?.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(e.valor)}
                  </TableCell>
                  <TableCell>{e.taxa_juros}%</TableCell>
                  <TableCell>
                    <Badge variant={e.status === 'ativo' ? 'default' : e.status === 'quitado' ? 'secondary' : 'destructive'}>
                      {e.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
