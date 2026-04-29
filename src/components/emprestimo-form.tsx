'use client'

import { useState, useEffect } from 'react'
import { Emprestimo, Cliente } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmprestimoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (emprestimo: Omit<Emprestimo, 'id' | 'criado_em' | 'cliente'>) => void
  clientes: Cliente[]
}

export function EmprestimoForm({ open, onClose, onSubmit, clientes }: EmprestimoFormProps) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    valor: '',
    taxa_juros: '',
    data_inicio: '',
    data_vencimento: '',
    observacoes: '',
    status: 'ativo' as const,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        cliente_id: '',
        valor: '',
        taxa_juros: '',
        data_inicio: new Date().toISOString().split('T')[0],
        data_vencimento: '',
        observacoes: '',
        status: 'ativo',
      })
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      valor: Number(formData.valor),
      taxa_juros: Number(formData.taxa_juros),
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Empréstimo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value || '' })}>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input id="valor" type="number" step="0.01" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxa">Taxa de Juros Mensal (%) *</Label>
            <Input id="taxa" type="number" step="0.01" value={formData.taxa_juros} onChange={(e) => setFormData({ ...formData, taxa_juros: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data de Início *</Label>
            <Input id="data_inicio" type="date" value={formData.data_inicio} onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_vencimento">Data de Vencimento</Label>
            <Input id="data_vencimento" type="date" value={formData.data_vencimento} onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input id="observacoes" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">Criar Empréstimo</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
