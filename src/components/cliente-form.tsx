'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema } from '@/lib/schemas'
import type { z } from 'zod'
import { Cliente } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCpfCnpj, formatTelefone } from '@/lib/masks'

type ClienteFormData = z.infer<typeof clienteSchema>

interface ClienteFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (cliente: ClienteFormData) => void
  cliente?: Cliente | null
}

export function ClienteForm({ open, onClose, onSubmit, cliente }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      cpf_cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
      observacoes: '',
      ativo: true,
    },
  })

  useEffect(() => {
    if (cliente) {
      reset({
        nome: cliente.nome,
        cpf_cnpj: cliente.cpf_cnpj || '',
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        endereco: cliente.endereco || '',
        observacoes: cliente.observacoes || '',
        ativo: cliente.ativo,
      })
    } else {
      reset({
        nome: '',
        cpf_cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        observacoes: '',
        ativo: true,
      })
    }
  }, [cliente, reset])

  const ativo = watch('ativo')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
            <Input
              id="cpf_cnpj"
              {...register('cpf_cnpj')}
              onChange={(e) => {
                const masked = formatCpfCnpj(e.target.value)
                setValue('cpf_cnpj', masked, { shouldValidate: true })
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              {...register('telefone')}
              onChange={(e) => {
                const masked = formatTelefone(e.target.value)
                setValue('telefone', masked, { shouldValidate: true })
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" {...register('endereco')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input id="observacoes" {...register('observacoes')} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ativo"
              checked={ativo}
              onCheckedChange={(checked) => setValue('ativo', checked as boolean, { shouldValidate: true })}
            />
            <Label htmlFor="ativo">Ativo</Label>
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            {cliente ? 'Salvar' : 'Criar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
