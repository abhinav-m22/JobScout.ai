"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { Bot, Send, User } from 'lucide-react'
import { useRef } from "react"
import { Card } from "@/components/ui/card"

const chatMessages = [
  {
    role: "assistant",
    content: "Hello! I'm your AI career assistant. How can I help you today?",
  },
  {
    role: "user",
    content: "I'm looking for senior developer positions in San Francisco",
  },
  {
    role: "assistant",
    content: "I found 28 matching positions. Based on your profile, I recommend these top 3 roles...",
  },
]

export function DemoSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])

  return (
    <section ref={containerRef} className="container py-24">
      <motion.div
        style={{ opacity }}
        className="mx-auto max-w-4xl space-y-8 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Experience AI-Powered Job Search
        </h2>
        <p className="text-lg text-muted-foreground">
          See how our intelligent assistant helps you find and apply to the perfect job
        </p>
      </motion.div>
      
      <motion.div
        style={{ opacity, y }}
        className="mx-auto mt-16 max-w-2xl"
      >
        <Card className="overflow-hidden">
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold">Career Assistant</span>
            </div>
          </div>
          <div className="space-y-4 p-4">
            {chatMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 rounded-lg border bg-background px-4 py-2"
              />
              <button className="rounded-lg bg-primary p-2 text-primary-foreground">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  )
}