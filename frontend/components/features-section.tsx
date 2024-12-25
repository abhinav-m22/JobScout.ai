"use client"

import { motion } from "framer-motion"
import { Bot, LineChart, Search, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Feature } from "../app/types"

const features: Feature[] = [
  {
    title: "Real-Time Job Data",
    description: "Access the latest job listings from top platforms like LinkedIn, Glassdoor, and Indeed in real-time.",
    icon: Search,
  },
  {
    title: "AI-Powered Insights",
    description: "Get personalized job recommendations and tailored resume tips powered by advanced AI.",
    icon: Sparkles,
  },
  {
    title: "Smart Career Assistant",
    description: "Chat with our AI assistant for career guidance, job comparisons, and professional advice.",
    icon: Bot,
  },
  {
    title: "Analytics Dashboard",
    description: "Track your application progress, success rates, and career growth with detailed analytics.",
    icon: LineChart,
  },
]

export function FeaturesSection() {
  return (
    <section className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Powerful Features</h2>
        <p className="mb-12 text-lg text-muted-foreground">
          Discover how JobScout.ai revolutionizes your job search experience
        </p>
      </motion.div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-muted/20 opacity-0 transition-opacity hover:opacity-100" />
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

