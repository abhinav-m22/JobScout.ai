import { InterviewFeedback } from "@/types/chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface InterviewFeedbackCardProps {
  feedback: InterviewFeedback
}

export function InterviewFeedbackCard({ feedback }: InterviewFeedbackCardProps) {
  const scoreColor =
    feedback.score >= 8
      ? "text-green-500"
      : feedback.score >= 6
      ? "text-yellow-500"
      : "text-red-500"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Interview Feedback</CardTitle>
          <div className={`text-2xl font-bold ${scoreColor}`}>
            {feedback.score}/10
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium">General Feedback</h4>
          <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
        </div>
        
        <div>
          <h4 className="mb-2 font-medium">Areas for Improvement</h4>
          <ul className="space-y-1">
            {feedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-500" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-medium">Next Questions</h4>
          <ul className="space-y-1">
            {feedback.nextQuestions.map((question, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {index + 1}. {question}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

