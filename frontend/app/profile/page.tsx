// "use client"
// import { useEffect, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useAuth } from "@/lib/auth-context"
// import { ProfileForm } from "@/components/profile/profile-form"
// import { Navbar } from "@/components/navbar"
// import DashboardPage from "../dashboard/page"
// import { initialProfileState } from "@/types/profile"
// import { Button } from "@/components/ui/button"

// export default function ProfilePage() {
//   const { user, isLoading } = useAuth()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [showForm, setShowForm] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const isProfileComplete = user?.is_profile_complete
//   const [profile, setProfile] = useState(initialProfileState)

//   const handleResumeUpload = async (event: any) => {
//     const file = event.target.files[0]
//     if (!file) return
  
//     setIsUploading(true)
//     const formData = new FormData()
//     formData.append('file', file)
//     if (user?.id) {
//       formData.append('userId', user.id)
//     }
  
//     try {
//       const response = await fetch('http://localhost:8000/resume/upload', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${user?.access_token}`,
//         },
//         body: formData,
//       })
  
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.detail || 'Resume upload failed')
//       }
      
//       const data = await response.json()
      
//       // Validate that we received an object with the expected fields
//       if (typeof data !== 'object' || data === null) {
//         throw new Error('Invalid response format from server')
//       }
  
//       setProfile(prev => ({
//         ...prev,
//         ...data,
//         // Ensure arrays are always arrays even if server sends null
//         education: Array.isArray(data.education) ? data.education : [],
//         skills: Array.isArray(data.skills) ? data.skills : [],
//         certifications: Array.isArray(data.certifications) ? data.certifications : [],
//       }))
  
//     } catch (error) {
//       console.error('Resume upload error:', error)
//       // You might want to add a toast or alert here to notify the user
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   useEffect(() => {
//     if (!isLoading && !user) {
//       router.push('/login')
//       return
//     }

//     const source = searchParams.get('source')
//     if (user) {
//       setShowForm(!isProfileComplete || source === 'icon')
//     }

//     if (source === 'icon') {
//       fetch(`http://localhost:8000/users/profile/${user?.id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user?.access_token}`
//         }
//       }).then(async (res) => {
//         if (res.ok) {
//           const data = await res.json()
//           setProfile(data)
//           setShowForm(true)
//         }
//       })
//     }
//   }, [user, isLoading, router, isProfileComplete, searchParams])

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex min-h-screen items-center justify-center">
//           <div className="h-32 w-32 animate-pulse rounded-lg bg-gray-200" />
//         </div>
//       </>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="container mx-auto px-4">
//         {showForm ? (
//           <div className="py-10">
//             <div className="mx-auto max-w-3xl space-y-6">
//               <div>
//                 <h1 className="text-3xl font-bold">
//                   {isProfileComplete ? "Update Your Profile" : "Complete Your Profile"}
//                 </h1>
//                 <p className="text-muted-foreground">
//                   {isProfileComplete
//                     ? "Update your professional information"
//                     : "Please provide your professional information to get started"}
//                 </p>
//               </div>

//               <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <div className="mb-6">
//                   <input
//                     type="file"
//                     id="resume-upload"
//                     accept=".pdf"
//                     className="hidden"
//                     onChange={handleResumeUpload}
//                   />
//                   <Button
//                     disabled={isUploading}
//                     onClick={() => {
//                       const resumeUploadElement = document.getElementById('resume-upload');
//                       if (resumeUploadElement) {
//                         resumeUploadElement.click();
//                       }
//                     }}
//                     className="w-full"
//                   >
//                     {isUploading ? 'Uploading...' : 'Upload Resume to Auto-Fill'}
//                   </Button>
//                 </div>

//                 <ProfileForm
//                   userEmail={user.email}
//                   initialData={{
//                     name: user.name,
//                     career_goals: profile.career_goals,
//                     certifications: profile.certifications,
//                     current_industry: profile.current_industry,
//                     current_title: profile.current_title,
//                     education: profile.education,
//                     email: user.email,
//                     employment_type: profile.employment_type,
//                     experience_years: profile.experience_years,
//                     location: profile.location,
//                     phone: profile.phone,
//                     portfolio: profile.portfolio,
//                     preferred_industries: profile.preferred_industries,
//                     preferred_job_titles: profile.preferred_job_titles,
//                     relocation_willingness: profile.relocation_willingness,
//                     resume_link: profile.resume_link,
//                     salary_expectations: profile.salary_expectations,
//                     linkedin: profile.linkedin,
//                     skills: profile.skills,
//                   }}
//                   userId={user.id}
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <DashboardPage />
//         )}
//       </div>
//     </div>
//   )
// }

"use client"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProfileForm } from "@/components/profile/profile-form"
import { Navbar } from "@/components/navbar"
import DashboardPage from "../dashboard/page"
import { initialProfileState } from "@/types/profile"
import { Button } from "@/components/ui/button"

// Separate component for the search params logic
function ProfileContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const isProfileComplete = user?.is_profile_complete
  const [profile, setProfile] = useState(initialProfileState)

  const handleResumeUpload = async (event: any) => {
    const file = event.target.files[0]
    if (!file) return
  
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (user?.id) {
      formData.append('userId', user.id)
    }
  
    try {
      const response = await fetch('http://localhost:8000/resume/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: formData,
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Resume upload failed')
      }
      
      const data = await response.json()
      
      if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid response format from server')
      }
  
      setProfile(prev => ({
        ...prev,
        ...data,
        education: Array.isArray(data.education) ? data.education : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
      }))
  
    } catch (error) {
      console.error('Resume upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
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
          setProfile(data)
          setShowForm(true)
        }
      })
    }
  }, [user, isLoading, router, isProfileComplete, searchParams])

  if (!user) {
    return null
  }

  return (
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
                  : "Please provide your professional information to get started"}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
                <Button
                  disabled={isUploading}
                  onClick={() => {
                    const resumeUploadElement = document.getElementById('resume-upload');
                    if (resumeUploadElement) {
                      resumeUploadElement.click();
                    }
                  }}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload Resume to Auto-Fill'}
                </Button>
              </div>

              <ProfileForm
                userEmail={user.email}
                initialData={{
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
                }}
                userId={user.id}
              />
            </div>
          </div>
        </div>
      ) : (
        <DashboardPage />
      )}
    </div>
  )
}

// Loading component
function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-lg bg-gray-200" />
    </div>
  )
}

// Main component
export default function ProfilePage() {
  const { isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isLoading ? (
        <LoadingState />
      ) : (
        <Suspense fallback={<LoadingState />}>
          <ProfileContent />
        </Suspense>
      )}
    </div>
  )
}