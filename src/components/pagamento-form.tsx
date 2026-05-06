'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pagamentoSchema } from '@/lib/schemas'
import type { z } from 'zod'
import { Emprestimo } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type PagamentoFormData = z.infer<typeof pagamentoSchema>

interface PagamentoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (pagamento: PagamentoFormData) => void
  emprestimos: Emprestimo[]
}

export function PagamentoForm({ open, onClose, onSubmit, emprestimos }: PagamentoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PagamentoFormData>({
    resolver: zodResolver(pagamentoSchema),
    mode: 'onChange',
    defaultValues: {
      emprestimo_id: '',
      valor: 0,
      data_pagamento: new Date().toISOString().split('T')[0],
      tipo: 'juros',
      observacoes: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        emprestimo_id: '',
        valor: 0,
        data_pagamento: new Date().toISOString().split('T')[0],
        tipo: 'juros',
        observacoes: '',
      })
    }
  }, [open, reset])

  const emprestimoId = watch('emprestimo_id')
  const tipo = watch('tipo')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emprestimo">Empréstimo *</Label>
            <Select
              value={emprestimoId}
              onValueChange={(value) => setValue('emprestimo_id', value || '', { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um empréstimo" />
              </SelectTrigger>
              <SelectContent>
                {emprestimos.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.cliente?.nome} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(e.valor)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.emprestimo_id && <p className="text-sm text-red-600">{errors.emprestimo_id.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input id="valor" type="number" step="0.01" {...register('valor', { valueAsNumber: true })} />
            {errors.valor && <p className="text-sm text-red-600">{errors.valor.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input id="data" type="date" {...register('data_pagamento')} />
            {errors.data_pagamento && <p className="text-sm text-red-600">{errors.data_pagamento.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={tipo}
              onValueChange={(value) => setValue('tipo', value as 'parcial' | 'juros' | 'quitacao', { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parcial">Parcial (abate capital)</SelectItem>
                <SelectItem value="juros">Juros</SelectItem>
                <SelectItem value="quitacao">Quitação</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-sm text-red-600">{errors.tipo.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Input id="obs" {...register('observacoes')} />
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Registrar Pagamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
