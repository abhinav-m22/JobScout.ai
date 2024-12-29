// components/navbar.tsx
"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { BrainCircuit, UserCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
interface NavbarProps {
  showAuthModal?: (view: "login" | "register") => void
}

export function Navbar({ showAuthModal }: NavbarProps) {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  const handleProfileClick = () => {
    if (user) {
      router.push('/profile?source=icon')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm transition-colors dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 animate-slide-in cursor-pointer" onClick={() => router.push('/')}>
          <BrainCircuit className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          <span className="text-xl font-bold">JobScout.ai</span>
        </div>
        <div className="flex items-center gap-4 animate-slide-in [animation-delay:200ms]">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
          ) : user ? (
            <>
              <Link
                href="/chat"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400"
              >
                <MessageSquare className="h-4 w-4" />
                AI Assistant
              </Link>
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button
                variant="ghost"
                className="hover:bg-violet-500/10 hover:text-violet-600"
                onClick={() => logout()}
              >
                Log out
              </Button>
              <Button
                variant="ghost"
                className="p-2 hover:bg-violet-500/10 hover:text-violet-600"
                onClick={handleProfileClick}
              >
                <UserCircle2 className="h-6 w-6" />
              </Button>
            </>
          ) : showAuthModal ? (
            <>
              <Button
                variant="ghost"
                className="hover:bg-violet-500/10 hover:text-violet-600"
                onClick={() => showAuthModal("login")}
              >
                Log in
              </Button>
              <Button
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                onClick={() => showAuthModal("register")}
              >
                Get Started
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}