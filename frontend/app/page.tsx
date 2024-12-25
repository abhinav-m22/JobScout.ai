"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { BrainCircuit, Globe2, Bot, LineChart, MessageSquareText, BarChart3, Sparkles, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeatureCard } from "@/components/feature-card"
import { StatCard } from "@/components/stat-card"
import { ChatMessage } from "@/components/chat-message"
import ProfilePage from "./profile/page"

export default function LandingPage() {
  const { user, logout, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState<"login" | "register">("login")

  const openModal = (view: "login" | "register") => {
    setAuthView(view)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100 via-white to-fuchsia-100 dark:from-gray-900 dark:via-gray-900 dark:to-violet-900/20">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm transition-colors dark:border-gray-800 dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 animate-slide-in">
            <BrainCircuit className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            <span className="text-xl font-bold">JobScout.ai</span>
          </div>
          <div className="flex items-center gap-4 animate-slide-in [animation-delay:200ms]">
            {isLoading ? (
              <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
            ) : user ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Button
                  variant="ghost"
                  className="hover:bg-violet-500/10 hover:text-violet-600"
                  onClick={() => logout()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hover:bg-violet-500/10 hover:text-violet-600"
                  onClick={() => openModal("login")}
                >
                  Log in
                </Button>
                <Button
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                  onClick={() => openModal("register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {user ? (
        <ProfilePage />
      ) : (
        <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[500px] w-[500px] animate-gradient rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-3xl" />
          </div>

          <div className="container relative mx-auto px-4">
            <div className="text-center">
              <h1 className="animate-slide-in mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
                Your AI-Powered
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text px-2 text-transparent">
                    Career Navigator
                  </span>
                  <span className="absolute bottom-0 left-0 h-3 w-full animate-fade-in [animation-delay:500ms] bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-sm" />
                </span>
              </h1>

              <p className="animate-slide-in [animation-delay:200ms] mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                Transform your job search with real-time insights, personalized recommendations, and
                AI-driven career guidance.
              </p>

              <div className="animate-slide-in [animation-delay:400ms] mx-auto mb-12 flex max-w-md flex-col items-center gap-4 sm:flex-row">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="h-12 border-violet-200 bg-white/50 backdrop-blur-sm transition-all focus-visible:border-violet-500 focus-visible:ring-violet-500 dark:border-gray-700 dark:bg-gray-800/50"
                />
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all hover:from-violet-700 hover:to-fuchsia-700 sm:w-auto"
                  onClick={() => openModal("register")}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="animate-slide-in [animation-delay:200ms]">
                <FeatureCard
                  icon={Globe2}
                  title="Real-Time Market Data"
                  description="Stay updated with the latest job market trends and opportunities."
                />
              </div>
              <div className="animate-slide-in [animation-delay:400ms]">
                <FeatureCard
                  icon={Bot}
                  title="AI Career Assistant"
                  description="Get instant answers to your career questions from our AI chatbot."
                />
              </div>
              <div className="animate-slide-in [animation-delay:600ms]">
                <FeatureCard
                  icon={LineChart}
                  title="Smart Analytics"
                  description="Track your application progress and success metrics."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Chat Demo Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-r from-violet-100 to-fuchsia-100 p-8 dark:from-violet-900/20 dark:to-fuchsia-900/20">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="animate-slide-in">
                  <h2 className="mb-4 text-3xl font-bold">AI-Powered Chat Support</h2>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Get instant answers to your career questions, compare job opportunities, and receive
                    personalized advice for your professional growth.
                  </p>
                  <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all hover:from-violet-700 hover:to-fuchsia-700">
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    Try Demo Chat
                  </Button>
                </div>

                <div className="animate-slide-in [animation-delay:200ms] rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                  <div className="space-y-4">
                    <ChatMessage
                      isBot
                      message="Hi! I'm your AI career assistant. How can I help you today?"
                    />
                    <ChatMessage
                      message="I need help improving my resume for tech jobs."
                    />
                    <ChatMessage
                      isBot
                      message="I'll help you optimize your resume for tech positions. Let's start with these key areas:
                      1. Technical skills highlight
                      2. Project showcase
                      3. Industry keywords
                      Would you like me to analyze your current resume?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="animate-slide-in">
                <StatCard number="100K+" label="Active Users" icon={BarChart3} />
              </div>
              <div className="animate-slide-in [animation-delay:200ms]">
                <StatCard number="50+" label="Job Platforms" icon={Globe2} />
              </div>
              <div className="animate-slide-in [animation-delay:400ms]">
                <StatCard number="95%" label="Success Rate" icon={Sparkles} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="animate-slide-in mb-6 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Job Search?
            </h2>
            <p className="animate-slide-in [animation-delay:200ms] mx-auto mb-8 max-w-2xl text-gray-600 dark:text-gray-300">
              Join thousands of professionals who have already discovered the power of AI-driven career
              guidance.
            </p>
            <div className="animate-slide-in [animation-delay:400ms]">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all hover:from-violet-700 hover:to-fuchsia-700"
                onClick={() => openModal("register")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
      </main>
      )}

      <footer className="border-t bg-white/50 py-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>© 2024 JobScout.ai. All rights reserved.</p>
        </div>
      </footer>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />
    </div>
  )
}

