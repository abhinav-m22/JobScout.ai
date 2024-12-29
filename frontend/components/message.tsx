import { ChatMessage } from "@/types/chat"
import { Bot, User } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { JobListingCard } from "./job-listing-card"
import { SkillGapCard } from "./skill-gap-card"
import { InterviewFeedbackCard } from "./interview-feedback-card"

interface MessageProps {
  message: ChatMessage
}

export function Message({ message }: MessageProps) {
  const isBot = message.role === "assistant"

  return (
    <div className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <div
        className={`rounded-full p-2 ${
          isBot
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <Card className="p-4">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </Card>
        
        {message.jobListings && message.jobListings.length > 0 && (
          <div className="space-y-2">
            {message.jobListings.map((job) => (
              <JobListingCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {message.skillGaps && message.skillGaps.length > 0 && (
          <div className="space-y-2">
            {message.skillGaps.map((gap, index) => (
              <SkillGapCard key={index} skillGap={gap} />
            ))}
          </div>
        )}

        {message.interviewFeedback && (
          <InterviewFeedbackCard feedback={message.interviewFeedback} />
        )}
      </div>
    </div>
  )
}

