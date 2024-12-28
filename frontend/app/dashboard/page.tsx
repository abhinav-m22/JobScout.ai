// "use client"

// import { useState, useEffect, useMemo, useCallback } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { JobCard } from "@/components/jobs/job-card"
// import { JobFilters } from "@/components/jobs/job-filters"
// import { Input } from "@/components/ui/input"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Search } from 'lucide-react'
// import type { JobListing } from "@/types/jobs"

// export default function DashboardPage() {
//     const { user } = useAuth()
//     const [jobs, setJobs] = useState<JobListing[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [searchQuery, setSearchQuery] = useState("")
//     const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
//     const [error, setError] = useState<string | null>(null)
//     const platforms = ["Glassdoor", "LinkedIn", "Indeed"];

//     const fetchJobs = useCallback(async () => {
//         if (!user?.id) return

//         try {
//             const response = await fetch(`http://localhost:8000/snapshots/${user.id}`)
//             if (!response.ok) throw new Error('Failed to fetch jobs')

//             const data = await response.json()
//             setJobs(data)
//         } catch (err) {
//             setError('Failed to load jobs. Please try again later.')
//         } finally {
//             setIsLoading(false)
//         }
//     }, [user?.id])

//     useEffect(() => {
//         fetchJobs()
//     }, [fetchJobs])

//     const filteredJobs = useMemo(() =>
//         jobs.filter(job => {
//             const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(job.platform)
//             const matchesSearch = searchQuery === "" ||
//                 job.data.some(listing =>
//                     listing.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     listing.company_name.toLowerCase().includes(searchQuery.toLowerCase())
//                 )
//             return matchesPlatform && matchesSearch
//         }), [jobs, selectedPlatforms, searchQuery]
//     )

//     if (!user) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 <p className="text-lg">Please log in to view job listings.</p>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
//             <div className="container py-10">
//                 <div className="mb-8 space-y-4">
//                     <h1 className="text-3xl font-bold">Job Listings</h1>
//                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                             <Input
//                                 placeholder="Search jobs..."
//                                 className="pl-9"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {isLoading ? (
//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                         {Array.from({ length: 6 }).map((_, i) => (
//                             <div key={i} className="space-y-4 rounded-lg border p-4">
//                                 <Skeleton className="h-4 w-3/4" />
//                                 <Skeleton className="h-4 w-1/2" />
//                                 <div className="space-y-2">
//                                     <Skeleton className="h-4 w-full" />
//                                     <Skeleton className="h-4 w-full" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : error ? (
//                     <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-200">
//                         {error}
//                     </div>
//                 ) : filteredJobs.length === 0 ? (
//                     <div className="text-center text-muted-foreground">
//                         No jobs found matching your criteria.
//                     </div>
//                 ) : (
//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                         {filteredJobs.flatMap(listing =>
//                             listing.data.map((job, index) => (
//                                 <JobCard
//                                     key={`${listing.snapshot_id}-${index}`}
//                                     job={job}
//                                     platform={listing.platform}
//                                 />
//                             ))
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from 'lucide-react'
import type { JobListing } from "@/types/jobs"

export default function DashboardPage() {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<JobListing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const platforms = ["All", "Glassdoor", "LinkedIn", "Indeed"];

    const fetchJobs = useCallback(async () => {
        if (!user?.id) return

        try {
            const response = await fetch(`http://localhost:8000/snapshots/${user.id}`)
            if (!response.ok) throw new Error('Failed to fetch jobs')

            const data = await response.json()
            setJobs(data)
        } catch (err) {
            setError('Failed to load jobs. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    const filteredJobs = useMemo(() =>
        jobs.filter(job => {
            const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes("All") || selectedPlatforms.includes(job.platform)
            const matchesSearch = searchQuery === "" ||
                job.data.some(listing =>
                    listing.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    listing.company_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            return matchesPlatform && matchesSearch
        }), [jobs, selectedPlatforms, searchQuery]
    )

    const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSelectedPlatforms(value === "All" ? ["All"] : [value])
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg">Please log in to view job listings.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            <div className="container py-10">
                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl font-bold">Job Listings</h1>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search jobs..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="rounded-lg border px-4 py-2 dark:bg-gray-800 dark:text-white"
                            value={selectedPlatforms[0] || "All"}
                            onChange={handlePlatformChange}
                        >
                            {platforms.map(platform => (
                                <option key={platform} value={platform}>{platform}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-4 rounded-lg border p-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-200">
                        {error}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        No jobs found matching your criteria.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.flatMap(listing =>
                            listing.data.map((job, index) => (
                                <JobCard
                                    key={`${listing.snapshot_id}-${index}`}
                                    job={job}
                                    platform={listing.platform}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
