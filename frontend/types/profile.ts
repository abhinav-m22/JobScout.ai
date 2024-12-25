export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship' | 'Freelance'

export interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  currentTitle: string
  employmentType: EmploymentType
  yearsOfExperience: number
  currentIndustry: string
  preferredJobTitles: string[]
  preferredIndustries: string[]
  salaryExpectations: number
  education: string
  skills: string[]
  certifications: string[]
  careerGoals: string
  isWillingToRelocate: boolean
  linkedinUrl: string
  portfolioUrl: string
  resumeUrl?: string
  isProfileComplete: boolean
}

