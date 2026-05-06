'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { UserButton } from '@clerk/nextjs'

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex flex-1 items-center justify-end">
        <UserButton />
      </div>
    </header>
  )
}
