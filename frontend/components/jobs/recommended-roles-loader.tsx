import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface RecommendedRolesLoaderProps {
  roles: string[]
  isLoading: boolean
}

export function RecommendedRolesLoader({ roles, isLoading }: RecommendedRolesLoaderProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">AI Recommended Role</span>
            </div>
            <h3 className="font-semibold">{role}</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/0" />
        </Card>
      ))}
    </div>
  )
}

