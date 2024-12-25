"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(defaultView)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {view === "login" ? "Welcome back" : "Create an account"}
          </DialogTitle>
        </DialogHeader>
        {view === "login" ? (
          <LoginForm onSuccess={onClose} switchToRegister={() => setView("register")} />
        ) : (
          <RegisterForm onSuccess={onClose} switchToLogin={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  )
}

