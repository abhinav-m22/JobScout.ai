"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProfileForm } from "@/components/profile/profile-form"
import { Navbar } from "@/components/navbar"
import DashboardPage from "../dashboard/page"
import {initialProfileState} from "@/types/profile"


export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const isProfileComplete = user?.is_profile_complete
  const [profile, setProfile] = useState(initialProfileState)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    const source = searchParams.get('source')
    if (user) {
      setShowForm(!isProfileComplete || source === 'icon')
    }

    if (source === 'icon') {
      fetch(`http://localhost:8000/users/profile/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`
        }
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          console.log(data);
          setProfile(data)
          setShowForm(true)
        }
      })
    }
  }, [user, isLoading, router, isProfileComplete, searchParams])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4">
        {showForm ? (
          <div className="py-10">
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {isProfileComplete ? "Update Your Profile" : "Complete Your Profile"}
                </h1>
                <p className="text-muted-foreground">
                  {isProfileComplete 
                    ? "Update your professional information"
                    : "Please provide your professional information to get started"
                  }
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <ProfileForm userEmail={user.email} initialData={{
                  name: user.name,
                  career_goals: profile.career_goals,
                  certifications: profile.certifications,
                  current_industry: profile.current_industry,
                  current_title: profile.current_title,
                  education: profile.education,
                  email: user.email,
                  employment_type: profile.employment_type,
                  experience_years: profile.experience_years,
                  location: profile.location,
                  phone: profile.phone,
                  portfolio: profile.portfolio,
                  preferred_industries: profile.preferred_industries,
                  preferred_job_titles: profile.preferred_job_titles,
                  relocation_willingness: profile.relocation_willingness,
                  resume_link: profile.resume_link,
                  salary_expectations: profile.salary_expectations,
                  linkedin: profile.linkedin,
                  skills: profile.skills,
                }} userId={user.id} />
              </div>
            </div>
          </div>
        ) : (
          <DashboardPage />
        )}
      </div>
    </div>
  )
}