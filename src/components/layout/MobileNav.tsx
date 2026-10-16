import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './Logo'
import { SidebarContent } from './Sidebar'

/** Barre haute < 768px : bouton Menu qui ouvre la sidebar (toujours déployée) dans un Sheet. */
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />}>
          <Menu aria-hidden />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Logo />
    </header>
  )
}
