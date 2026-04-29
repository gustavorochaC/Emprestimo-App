'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Emprestimo } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calcularJurosAcumulados, calcularJurosPendentes, calcularSaldoDevedor, calcularDiasAtraso } from '@/lib/juros'

export default function RelatoriosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('emp_emprestimos').select('*, cliente:emp_clientes(*)').eq('status', 'ativo')
    setEmprestimos(data || [])
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const devedores = emprestimos
    .filter((e) => {
      const dias = calcularDiasAtraso(e.data_vencimento || e.data_inicio)
      return dias > 30
    })
    .filter((e) => !search || e.cliente?.nome.toLowerCase().includes(search.toLowerCase()))
    .map((e) => {
      const jurosAcumulados = calcularJurosAcumulados(e.valor, e.taxa_juros, e.data_inicio)
      const jurosPendentes = calcularJurosPendentes(jurosAcumulados, [])
      const saldoDevedor = calcularSaldoDevedor(e.valor, [])
      const diasAtraso = calcularDiasAtraso(e.data_vencimento || e.data_inicio)

      return {
        ...e,
        jurosPendentes,
        saldoDevedor,
        diasAtraso,
        totalDevido: saldoDevedor + jurosPendentes,
      }
    })
    .sort((a, b) => b.diasAtraso - a.diasAtraso)

  const exportCSV = () => {
    const headers = ['Cliente', 'Valor Emprestado', 'Juros Pendentes', 'Dias em Atraso', 'Total Devido']
    const rows = devedores.map((d) => [
      d.cliente?.nome,
      d.valor,
      d.jurosPendentes,
      d.diasAtraso,
      d.totalDevido,
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'devedores.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <Button onClick={exportCSV}>Exportar CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Devedores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Emprestado</TableHead>
                <TableHead>Juros Pendentes</TableHead>
                <TableHead>Dias em Atraso</TableHead>
                <TableHead>Total Devido</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devedores.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.cliente?.nome}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.valor)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.jurosPendentes)}
                  </TableCell>
                  <TableCell>{d.diasAtraso}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.totalDevido)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.diasAtraso > 60 ? 'destructive' : 'default'}>
                      {d.diasAtraso > 60 ? 'Crítico' : 'Atrasado'}
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
