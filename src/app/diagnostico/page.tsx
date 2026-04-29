'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DiagnosticoPage() {
  const [logs, setLogs] = useState<string[]>([])
  const supabase = createClient()

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const testarConexao = async () => {
    setLogs([])
    addLog('🔄 Iniciando testes...')
    
    // Test 1: Verificar variáveis de ambiente
    addLog(`📡 SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
    addLog(`🔑 ANON_KEY existe: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`)
    
    // Test 2: Tentar login
    addLog('🔐 Tentando login...')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'gustavorocarvalho@hotmail.com',
        password: '*!@Gu221204',
      })
      
      if (error) {
        addLog(`❌ Erro: ${error.message}`)
        addLog(`📋 Código: ${error.status}`)
      } else {
        addLog(`✅ Login OK! User: ${data.user?.id}`)
        addLog(`📧 Email: ${data.user?.email}`)
        
        // Test 3: Verificar sessão
        const { data: sessionData } = await supabase.auth.getSession()
        addLog(`🍪 Sessão: ${sessionData.session ? 'Ativa' : 'Inativa'}`)
      }
    } catch (err: any) {
      addLog(`💥 Exceção: ${err.message}`)
      console.error(err)
    }
    
    // Test 4: Testar conexão com banco
    addLog('🗄️ Testando banco...')
    const { data: clientes, error: dbError } = await supabase.from('emp_clientes').select('*').limit(1)
    if (dbError) {
      addLog(`❌ DB Erro: ${dbError.message}`)
    } else {
      addLog(`✅ DB OK! ${clientes?.length || 0} registros`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Diagnóstico do Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testarConexao} className="w-full">
            🚀 Iniciar Testes
          </Button>
          
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-slate-500">Clique no botão para iniciar...</p>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
