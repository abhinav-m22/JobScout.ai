"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { JobCard } from "@/components/jobs/job-card"
import { RecommendedRolesLoader } from "@/components/jobs/recommended-roles-loader"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import type { JobListing } from "@/types/jobs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InteractiveRolesLoader } from "@/components/jobs/interactive-loader"
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const ITEMS_PER_PAGE = 12

export default function DashboardPage() {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<JobListing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const platforms = ["All", "Glassdoor", "LinkedIn", "Indeed"]
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [recommendedRoles, setRecommendedRoles] = useState<string[]>([])
    const [rolesError, setRolesError] = useState<string | null>(null)

    const fetchRecommendedRoles = useCallback(async () => {
        if (!user?.id) return

        try {
            const response = await fetch(`http://localhost:8000/roles/${user.id}`)
            if (!response.ok) throw new Error('Failed to fetch recommended roles')

            const roles = await response.json()
            setRecommendedRoles(roles)
        } catch (err) {
            setRolesError('Unable to load role recommendations')
        }
    }, [user?.id])

    const fetchJobs = useCallback(async (pageNum: number) => {
        if (!user?.id) return

        try {
            setIsLoading(true)
            const response = await fetch(
                `http://localhost:8000/snapshots/${user.id}?page=${pageNum}&limit=${ITEMS_PER_PAGE}`
            )
            if (!response.ok) throw new Error('Failed to fetch jobs')

            const data = await response.json()
            if (pageNum === 1) {
                setJobs(data.items)
            } else {
                setJobs(prev => [...prev, ...data.items])
            }
            setHasMore(data.total > pageNum * ITEMS_PER_PAGE)
        } catch (err) {
            setError('Failed to load jobs. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        if (user?.id) {
            fetchRecommendedRoles()
            fetchJobs(1)
        }
    }, [fetchRecommendedRoles, fetchJobs, user?.id])

    const filteredJobs = useMemo(() =>
        jobs?.filter(job => {
            const matchesPlatform = selectedPlatforms.length === 0 || 
                                  selectedPlatforms.includes("All") || 
                                  selectedPlatforms.includes(job.platform)
            const matchesSearch = searchQuery === "" ||
                job.data.some(listing =>
                    listing.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    listing.company_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            return matchesPlatform && matchesSearch
        }) ?? []
    , [jobs, selectedPlatforms, searchQuery])

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
        fetchJobs(page + 1)
    }

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

                {rolesError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{rolesError}</AlertDescription>
                    </Alert>
                )}

                {isLoading && page === 1 ? (
                    recommendedRoles.length > 0 ? (
                        <InteractiveRolesLoader roles={recommendedRoles} />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4 rounded-lg border p-4">
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm text-muted-foreground">Loading jobs...</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        No jobs found matching your criteria.
                    </div>
                ) : (
                    <>
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
                        
                        {hasMore && (
                            <div className="mt-8 flex justify-center">
                                <Button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    {isLoading ? "Loading..." : "Load More Jobs"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}