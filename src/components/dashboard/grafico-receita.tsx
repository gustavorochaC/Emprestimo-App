'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface ReceitaMensal {
  mes: string
  valor: number
}

interface GraficoReceitaProps {
  dados: ReceitaMensal[]
}

const chartConfig = {
  valor: {
    label: 'Receita',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function GraficoReceita({ dados }: GraficoReceitaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Mensal (Juros)</CardTitle>
        <CardDescription>Últimos 6 meses de juros recebidos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video w-full">
          <AreaChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-valor)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-valor)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  notation: 'compact',
                }).format(Number(value))
              }
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(value))
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="var(--color-valor)"
              fill="url(#fillReceita)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
