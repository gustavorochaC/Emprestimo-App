import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface Alerta {
  cliente: string
  valor: number
  dias: number
}

interface AlertasAtrasoProps {
  alertas: Alerta[]
}

export function AlertasAtraso({ alertas }: AlertasAtrasoProps) {
  if (alertas.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Alertas de Atraso</h3>
      {alertas.map((alerta, index) => (
        <Alert key={index} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{alerta.cliente}</AlertTitle>
          <AlertDescription>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(alerta.valor)} — {alerta.dias} dias em atraso
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
