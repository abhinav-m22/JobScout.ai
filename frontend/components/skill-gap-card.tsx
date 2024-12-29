import { SkillGap } from "@/types/chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book } from 'lucide-react'

interface SkillGapCardProps {
  skillGap: SkillGap
}

export function SkillGapCard({ skillGap }: SkillGapCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{skillGap.skill}</CardTitle>
          <Badge
            variant={
              skillGap.importance === "high"
                ? "destructive"
                : skillGap.importance === "medium"
                ? "default"
                : "secondary"
            }
          >
            {skillGap.importance} priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="font-medium">Recommended Resources:</h4>
          <ul className="space-y-1">
            {skillGap.resources.map((resource, index) => (
              <li key={index} className="flex items-center gap-2">
                <Book className="h-4 w-4 text-muted-foreground" />
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {resource.title}
                </a>
                <Badge variant="outline" className="text-xs">
                  {resource.type}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

