"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProfileForm } from "@/components/profile/profile-form"
import DashboardPage from "../dashboard/page"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const isProfileComplete = user?.is_profile_complete

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isProfileComplete ? (
        <div className="container mx-auto py-10">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Complete Your Profile</h1>
              <p className="text-muted-foreground">
                Please provide your professional information to get started
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <ProfileForm userEmail={user.email} initialData={{}} userId={user.id} />
            </div>
          </div>
        </div>
      ) : (
        <>
        <DashboardPage />
        </>
      )}
    </div>
  )
}

