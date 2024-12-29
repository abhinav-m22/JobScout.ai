import { JobListing } from "@/types/chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, DollarSign, Trophy } from 'lucide-react'

interface JobListingCardProps {
  job: JobListing
}

export function JobListingCard({ job }: JobListingCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {job.company}
              <MapPin className="h-4 w-4 ml-2" />
              {job.location}
              <DollarSign className="h-4 w-4 ml-2" />
              {job.salary}
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            {Math.round(job.matchScore * 100)}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{job.matchReason}</p>
        <div className="flex flex-wrap gap-1">
          {job.requirements.map((req) => (
            <Badge key={req} variant="outline">
              {req}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

