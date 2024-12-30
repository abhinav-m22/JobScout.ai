import { AuthProvider } from "@/lib/auth-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
  <html lang="en">
    <body>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Analytics />
        </TooltipProvider>
      </AuthProvider>
    </body>
  </html>
)
}

