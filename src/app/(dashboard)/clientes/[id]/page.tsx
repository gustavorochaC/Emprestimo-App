import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { calcularSaldoDevedor, calcularJurosAcumulados, calcularJurosPendentes } from '@/lib/juros'
import { formatCpfCnpj, formatTelefone } from '@/lib/masks'
import { cn } from '@/lib/utils'

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cliente = await prisma.cliente.findUnique({ where: { id } })
  if (!cliente) notFound()

  const emprestimos = await prisma.emprestimo.findMany({
    where: { cliente_id: id },
    include: { pagamentos: true },
  })

  const pagamentos = await prisma.pagamento.findMany({
    where: { emprestimo: { cliente_id: id } },
    include: { emprestimo: true },
  })

  const totalEmprestado = emprestimos.reduce((sum, e) => sum + Number(e.valor), 0)
  const saldoDevedorTotal = emprestimos
    .filter((e) => e.status === 'ativo')
    .reduce((sum, e) => {
      const pags = e.pagamentos.map((p) => ({
        id: p.id,
        emprestimo_id: p.emprestimo_id,
        valor: Number(p.valor),
        data_pagamento: p.data_pagamento.toISOString().split('T')[0],
        tipo: p.tipo as 'parcial' | 'juros' | 'quitacao',
        observacoes: p.observacoes ?? undefined,
        criado_em: p.criado_em.toISOString(),
      }))
      return sum + calcularSaldoDevedor(Number(e.valor), pags)
    }, 0)
  const totalPagamentosRecebidos = pagamentos.reduce((sum, p) => sum + Number(p.valor), 0)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('pt-BR').format(date)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/clientes"
          className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold">{cliente.nome}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Emprestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalEmprestado)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Saldo Devedor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(saldoDevedorTotal)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPagamentosRecebidos)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quantidade de Empréstimos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emprestimos.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
            <p>{cliente.cpf_cnpj ? formatCpfCnpj(cliente.cpf_cnpj) : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p>{cliente.telefone ? formatTelefone(cliente.telefone) : '-'}</p>
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
          <div>
            <p className="text-sm text-muted-foreground">Data de Cadastro</p>
            <p>{formatDate(cliente.criado_em)}</p>
          </div>
        </CardContent>
      </Card>

      {(cliente.endereco || cliente.observacoes) && (
        <Card>
          <CardHeader>
            <CardTitle>Outras Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cliente.endereco && (
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p>{cliente.endereco}</p>
              </div>
            )}
            {cliente.observacoes && (
              <div>
                <p className="text-sm text-muted-foreground">Observações</p>
                <p>{cliente.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Saldo Devedor</TableHead>
                  <TableHead>Juros Pendentes</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emprestimos.map((e) => {
                  const pags = e.pagamentos.map((p) => ({
                    id: p.id,
                    emprestimo_id: p.emprestimo_id,
                    valor: Number(p.valor),
                    data_pagamento: p.data_pagamento.toISOString().split('T')[0],
                    tipo: p.tipo as 'parcial' | 'juros' | 'quitacao',
                    observacoes: p.observacoes ?? undefined,
                    criado_em: p.criado_em.toISOString(),
                  }))
                  const saldo = calcularSaldoDevedor(Number(e.valor), pags)
                  const jurosAcum = calcularJurosAcumulados(
                    Number(e.valor),
                    Number(e.taxa_juros),
                    e.data_inicio.toISOString().split('T')[0]
                  )
                  const jurosPend = calcularJurosPendentes(jurosAcum, pags)
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        {formatCurrency(Number(e.valor))}
                      </TableCell>
                      <TableCell>{Number(e.taxa_juros)}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            e.status === 'ativo' ? 'default' : e.status === 'quitado' ? 'secondary' : 'destructive'
                          }
                        >
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(saldo)}</TableCell>
                      <TableCell>{formatCurrency(jurosPend)}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/emprestimos/${e.id}`}
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                        >
                          Ver
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
