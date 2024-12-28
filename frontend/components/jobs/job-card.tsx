import { Building2, MapPin, Clock, Briefcase, Star, DollarSign, IndianRupee } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LinkedInJob, GlassdoorJob, IndeedJob } from "@/types/jobs"

interface JobCardProps {
  job: LinkedInJob | GlassdoorJob | IndeedJob
  platform: string
}

export function JobCard({ job, platform }: JobCardProps) {
  const platformColors = {
    LinkedIn: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Glassdoor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Indeed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  }

  const formatSalary = (job: any) => {
    if ('base_salary' in job && job.base_salary?.max_amount) {
      return `${job.base_salary.currency || '$'}${job.base_salary.min_amount?.toLocaleString()} - ${job.base_salary.max_amount?.toLocaleString()}`
    }
    if ('pay_median_glassdoor' in job && job.pay_median_glassdoor) {
      return `${job.pay_range_currency || '$'}${job.pay_median_glassdoor.toLocaleString()}`
    }
    if ('salary_formatted' in job && job.salary_formatted) {
      return job.salary_formatted
    }
    return null
  }

  const getLocation = (job: any) => {
    return job.job_location || job.location || 'Remote'
  }

  const getRating = (job: any) => {
    return job.company_rating ? (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{job.company_rating.toFixed(1)}</span>
      </div>
    ) : null
  }

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{job.job_title}</h3>
            <p className="text-sm text-muted-foreground">{job.company_name}</p>
          </div>
          {'company_logo' in job && job.company_logo ? (
            <img
              src={job.company_logo}
              alt={`${job.company_name} logo`}
              className="h-12 w-12 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary" className={platformColors[platform as keyof typeof platformColors]}>
            {platform}
          </Badge>
          {getRating(job)}
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{getLocation(job)}</span>
          </div>
          {'job_employment_type' in job && job.job_employment_type && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.job_employment_type}</span>
            </div>
          )}
          {'job_posted_time' in job && job.job_posted_time && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{job.job_posted_time}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {formatSalary(job) && (
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                  <IndianRupee className="h-4 w-4" />
                  {formatSalary(job)}
                </div>
              </TooltipTrigger>
              <TooltipContent>Estimated salary range</TooltipContent>
            </Tooltip>
          )}
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {'job_description_formatted' in job
              ? job.job_description_formatted.replace(/<[^>]*>/g, '')
              : 'job_overview' in job
              ? job.job_overview
              : job.description_text}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

