'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, LayoutDashboard, Users, DollarSign, CreditCard, BarChart3, LogOut } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/emprestimos', label: 'Empréstimos', icon: DollarSign },
  { href: '/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/login' })
  }

  return (
    <>
      {/* Mobile */}
      <Sheet>
        <SheetTrigger
          className="lg:hidden fixed top-4 left-4 z-50"
          render={<Button variant="outline" size="icon" />}
        >
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-4 text-xl font-bold">💰 Empréstimos</div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href ? 'bg-blue-600' : 'hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4">
              <Button variant="ghost" className="w-full text-white hover:bg-slate-800" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 text-white fixed left-0 top-0">
        <div className="p-4 text-xl font-bold">💰 Empréstimos</div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathname === item.href ? 'bg-blue-600' : 'hover:bg-slate-800'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <Button variant="ghost" className="w-full text-white hover:bg-slate-800" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </>
  )
}
