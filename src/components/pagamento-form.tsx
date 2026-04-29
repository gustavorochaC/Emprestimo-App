'use client'

import { useState } from 'react'
import { Emprestimo } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PagamentoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (pagamento: { emprestimo_id: string; valor: number; data_pagamento: string; tipo: 'parcial' | 'juros' | 'quitacao'; observacoes: string }) => void
  emprestimos: Emprestimo[]
}

export function PagamentoForm({ open, onClose, onSubmit, emprestimos }: PagamentoFormProps) {
  const [formData, setFormData] = useState({
    emprestimo_id: '',
    valor: '',
    data_pagamento: new Date().toISOString().split('T')[0],
    tipo: 'juros' as 'parcial' | 'juros' | 'quitacao',
    observacoes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      valor: Number(formData.valor),
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emprestimo">Empréstimo *</Label>
            <Select value={formData.emprestimo_id} onValueChange={(value) => setFormData({ ...formData, emprestimo_id: value || '' })}>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input id="valor" type="number" step="0.01" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input id="data" type="date" value={formData.data_pagamento} onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: (value as 'parcial' | 'juros' | 'quitacao') || 'juros' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parcial">Parcial (abate capital)</SelectItem>
                <SelectItem value="juros">Juros</SelectItem>
                <SelectItem value="quitacao">Quitação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Input id="obs" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">Registrar Pagamento</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
