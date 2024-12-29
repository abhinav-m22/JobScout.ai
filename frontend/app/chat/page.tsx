// page.tsx
'use client'

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Message } from "@/types/chat"
import { MessageList } from "@/components/message-list"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from 'lucide-react'
import { chat } from "@/app/actions/chat"
import { nanoid } from 'nanoid'

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi! I'm your AI career assistant. I can help you with job search, skill analysis, career advice, and interview preparation. What would you like to discuss?",
    createdAt: new Date(),
  },
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const { content, error } = await chat(
        messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        user ? { id: user.id, email: user.email } : undefined
      )

      if (error) throw new Error(error)

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: content.trim(),
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      const errorMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: "I encountered an error. Please try again.",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex h-[calc(100vh-12rem)] flex-col">
          <MessageList messages={messages} isLoading={isLoading} />
          {error && (
            <div className="px-4 py-2 text-red-500 text-sm">Error: {error}</div>
          )}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about jobs, skills, career advice, or start an interview practice..."
                className="min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button type="submit" disabled={isLoading} className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}