'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emprestimoSchema } from '@/lib/schemas'
import type { z } from 'zod'
import { Cliente } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type EmprestimoFormData = z.infer<typeof emprestimoSchema>

interface EmprestimoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (emprestimo: EmprestimoFormData) => void
  clientes: Cliente[]
}

export function EmprestimoForm({ open, onClose, onSubmit, clientes }: EmprestimoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<EmprestimoFormData>({
    resolver: zodResolver(emprestimoSchema),
    mode: 'onChange',
    defaultValues: {
      cliente_id: '',
      valor: 0,
      taxa_juros: 0,
      data_inicio: '',
      data_vencimento: '',
      observacoes: '',
      status: 'ativo',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        cliente_id: '',
        valor: 0,
        taxa_juros: 0,
        data_inicio: new Date().toISOString().split('T')[0],
        data_vencimento: '',
        observacoes: '',
        status: 'ativo',
      })
    }
  }, [open, reset])

  const clienteId = watch('cliente_id')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Empréstimo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select
              value={clienteId}
              onValueChange={(value) => setValue('cliente_id', value || '', { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cliente_id && <p className="text-sm text-red-600">{errors.cliente_id.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input id="valor" type="number" step="0.01" {...register('valor', { valueAsNumber: true })} />
            {errors.valor && <p className="text-sm text-red-600">{errors.valor.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxa">Taxa de Juros Mensal (%) *</Label>
            <Input id="taxa" type="number" step="0.01" {...register('taxa_juros', { valueAsNumber: true })} />
            {errors.taxa_juros && <p className="text-sm text-red-600">{errors.taxa_juros.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data de Início *</Label>
            <Input id="data_inicio" type="date" {...register('data_inicio')} />
            {errors.data_inicio && <p className="text-sm text-red-600">{errors.data_inicio.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_vencimento">Data de Vencimento</Label>
            <Input id="data_vencimento" type="date" {...register('data_vencimento')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input id="observacoes" {...register('observacoes')} />
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Criar Empréstimo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
