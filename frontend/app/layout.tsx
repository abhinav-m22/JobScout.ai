import { AuthProvider } from "@/lib/auth-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

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
        </TooltipProvider>
      </AuthProvider>
    </body>
  </html>
)
}

