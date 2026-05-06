import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Alerta {
  cliente: string
  valor: number
  dias: number
}

interface AlertasAtrasoProps {
  alertas: Alerta[]
}

function severidadeBadge(dias: number) {
  if (dias > 90) {
    return <Badge variant="destructive">Crítico</Badge>
  }
  if (dias > 60) {
    return <Badge className="bg-orange-500 text-white hover:bg-orange-500">Alto</Badge>
  }
  return <Badge className="bg-amber-500 text-white hover:bg-amber-500">Médio</Badge>
}

export function AlertasAtraso({ alertas }: AlertasAtrasoProps) {
  if (alertas.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Alertas de Atraso</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alertas.map((alerta, index) => (
          <Card key={index} className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{alerta.cliente}</CardTitle>
                {severidadeBadge(alerta.dias)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Valor em atraso</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(alerta.valor)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dias em atraso</span>
                <span className="font-semibold">{alerta.dias} dias</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
