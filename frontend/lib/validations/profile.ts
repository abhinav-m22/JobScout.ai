import * as z from "zod"

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

export const profileFormSchema = z.object({
  // Required fields - core personal info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(1, "Location is required"),
  
  // Required fields - core professional info
  current_title: z.string().min(1, "Current title is required"),
  current_industry: z.string().min(1, "Current industry is required"),
  experience_years: z.number().min(0, "Years of experience must be positive"),
  
  // Optional fields with validation
  employment_type: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance']).optional(),
  preferred_job_titles: z
    .string()
    .transform((str) => str ? str.split(',').map((s) => s.trim()) : [])
    .optional(),
  preferred_industries: z
    .string()
    .transform((str) => str ? str.split(',').map((s) => s.trim()) : [])
    .optional(),
  salary_expectations: z
    .number()
    .min(0, "Salary expectations must be positive")
    .optional(),
  education: z.string().optional(),
  skills: z
    .string()
    .transform((str) => str ? str.split(',').map((s) => s.trim()) : [])
    .optional(),
  certifications: z
    .string()
    .transform((str) => str ? str.split(',').map((s) => s.trim()) : [])
    .optional(),
  career_goals: z.string().optional(),
  relocation_willingness: z.boolean().optional().default(false),
  
  // Optional URL fields
  linkedin: z
    .string()
    .optional(),
  portfolio: z
    .string()
    .optional(),
  resume_link: z
    .string()
    .optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>