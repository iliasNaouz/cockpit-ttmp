import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { AuthProvider } from '@/auth/auth-context'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SiteProvider } from '@/contexts/site-context'

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: false, refetchOnWindowFocus: false } },
  })
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </SiteProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
