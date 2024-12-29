export type MessageRole = "user" | "assistant" | "system"

export interface Message {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    createdAt: Date
  }

export interface ChatMessage extends Message {
  jobListings?: JobListing[]
  skillGaps?: SkillGap[]
  interviewFeedback?: InterviewFeedback
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  requirements: string[]
  matchScore: number
  matchReason: string
}

export interface SkillGap {
  skill: string
  importance: "high" | "medium" | "low"
  resources: {
    title: string
    url: string
    type: "course" | "documentation" | "tutorial"
  }[]
}

export interface InterviewFeedback {
  score: number
  feedback: string
  improvements: string[]
  nextQuestions: string[]
}

