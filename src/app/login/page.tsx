'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, Wallet, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResetSent(false)

    console.log('🔄 Tentando login com:', email)
    console.log('🔑 SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📡 Resposta:', { data, error })

      if (error) {
        console.error('❌ Erro de login:', error.message, error)
        setError(`Erro: ${error.message}`)
      } else {
        console.log('✅ Login OK! Redirecionando...')
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      console.error('💥 Exceção:', err)
      setError(`Exceção: ${err.message || 'Erro desconhecido'}`)
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Digite seu email para recuperar a senha')
      setResetSent(false)
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setError(error.message)
      setResetSent(false)
    } else {
      setError('')
      setResetSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              EmpréstimosApp
            </h1>
            <p className="text-sm text-slate-500">
              Sistema de Gestão de Empréstimos
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              {/* Error / Success Alert */}
              {error && (
                <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-800">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
              {resetSent && (
                <Alert className="rounded-xl border-green-200 bg-green-50 text-green-800">
                  <AlertDescription className="text-sm">
                    Email de recuperação enviado! Verifique sua caixa de entrada.
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-blue-600 focus-visible:ring-2 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Senha
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-blue-600 focus-visible:ring-2 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </form>

          <div className="px-6 pb-6 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={handleResetPassword}
              className="w-full mt-4 text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              Esqueceu a senha?
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} EmpréstimosApp. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
