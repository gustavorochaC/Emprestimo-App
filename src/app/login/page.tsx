'use client'

import { SignIn } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

const clerkAppearance = {
  theme: 'simple' as const,
  variables: {
    colorPrimary: '#2563eb',
    colorForeground: '#0f172a',
    colorMutedForeground: '#64748b',
    colorBackground: 'transparent',
    colorInput: '#ffffff',
    colorInputForeground: '#0f172a',
    colorBorder: '#e2e8f0',
    borderRadius: '0.5rem',
    spacing: '1rem',
  },
  elements: {
    // Remove o card interno do Clerk
    card: 'shadow-none border-none bg-transparent p-0 gap-0',
    // Esconde o header do Clerk
    header: 'hidden',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    // Esconde o footer do Clerk ("Secured by Clerk", "Development mode")
    footer: 'hidden',
    // Manter e estilizar o link "Sign up"
    footerAction: 'text-sm text-muted-foreground text-center mt-4 block',
    footerActionLink: 'text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline',
    // Botão primário (Continue)
    formButtonPrimary:
      'bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11 font-medium w-full transition-colors duration-200 shadow-none',
    // Inputs
    formFieldInput:
      'h-11 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200',
    // Labels
    formFieldLabel: 'text-sm font-medium text-foreground mb-1.5 block',
    // Container do campo
    formField: 'mb-0',
    // Botão Google OAuth
    socialButtonsBlockButton:
      'h-11 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-medium transition-colors duration-200',
    socialButtonsBlockButtonText: 'text-sm font-medium',
    // Container dos botões sociais
    socialButtons: 'mb-0',
    // Divisor "or"
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground text-sm font-normal',
    dividerRow: 'my-5',
    // Container do formulário
    form: 'gap-0',
    // Container principal
    main: 'gap-0',
    // Preview de identidade (quando email é inserido)
    identityPreview: 'rounded-lg border border-border bg-muted p-3 mb-4',
    identityPreviewText: 'text-sm text-foreground',
    identityPreviewEditButton: 'text-primary hover:text-primary/80 text-sm font-medium',
    // Alertas/erros
    alert: 'rounded-lg border border-destructive/20 bg-destructive/10 text-destructive p-3 text-sm mb-4',
    alertText: 'text-sm',
    // Erros de campo
    formFieldError: 'text-sm text-destructive mt-1.5',
    // Warning
    formFieldWarning: 'text-sm text-amber-600 mt-1.5',
    // Link geral
    link: 'text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors duration-200',
    // OTP input (código de verificação)
    otpCodeFieldInput: 'h-11 w-11 rounded-lg border border-border bg-background text-center text-lg font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20',
    // Container do OTP
    otpCodeField: 'gap-2 justify-center',
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              EmpréstimosApp
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistema de Gestão de Empréstimos
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border border-border/60 shadow-xl shadow-border/50 rounded-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2 pt-6 px-6">
            <CardTitle className="text-lg font-semibold text-foreground">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            <SignIn
              routing="hash"
              signUpUrl="/sign-up"
              appearance={clerkAppearance}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EmpréstimosApp. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
