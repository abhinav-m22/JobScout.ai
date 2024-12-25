"use client"

import { motion } from "framer-motion"
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-24 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container relative z-10"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered Job Search Platform</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            Find Your Dream Job with{" "}
            <span className="text-primary">AI-Powered Insights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            Transform your job search with real-time data, personalized recommendations,
            and AI-driven career guidance. Your next career move starts here.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Try Demo <Search className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>
    </div>
  )
}

