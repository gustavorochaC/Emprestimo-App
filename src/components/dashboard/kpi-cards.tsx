'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, AlertTriangle, Users } from 'lucide-react'

interface KpiCardsProps {
  capitalEmprestado: number
  jurosRecebidos: number
  inadimplentes: number
  clientesAtivos: number
}

export function KpiCards({ capitalEmprestado, jurosRecebidos, inadimplentes, clientesAtivos }: KpiCardsProps) {
  const items = [
    {
      label: 'Capital Emprestado',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(capitalEmprestado),
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Juros Recebidos (Mês)',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(jurosRecebidos),
      icon: TrendingUp,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Inadimplentes',
      value: String(inadimplentes),
      icon: AlertTriangle,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600',
    },
    {
      label: 'Clientes Ativos',
      value: String(clientesAtivos),
      icon: Users,
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg}`}>
              <item.icon className={`h-4 w-4 ${item.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
