import { ProfileFormValues } from '@/lib/validations/profile'

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


export const initialProfileState: ProfileFormValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  current_title: "",
  employment_type: "Full-Time",
  experience_years: 0,
  current_industry: "",
  preferred_job_titles: [],
  preferred_industries: [],
  salary_expectations: 0,
  education: "",
  skills: [],
  certifications: [],
  career_goals: "",
  relocation_willingness: false,
  linkedin: "",
  portfolio: "",
  resume_link: "",
}
