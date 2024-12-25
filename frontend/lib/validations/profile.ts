import * as z from "zod"

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

export const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(1, "Location is required"),
  current_title: z.string().min(1, "Current title is required"),
  employment_type: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance']),
  experience_years: z.number().min(0, "Years of experience must be positive"),
  current_industry: z.string().min(1, "Current industry is required"),
  preferred_job_titles: z.string().transform((str) => str.split(',').map((s) => s.trim())),
  preferred_industries: z.string().transform((str) => str.split(',').map((s) => s.trim())),
  salary_expectations: z.number().min(0, "Salary expectations must be positive"),
  education: z.string().min(1, "Education details are required"),
  skills: z.string().transform((str) => str.split(',').map((s) => s.trim())),
  certifications: z.string().transform((str) => str.split(',').map((s) => s.trim())),
  career_goals: z.string().min(1, "Career goals are required"),
  relocation_willingness: z.boolean(),
  linkedin: z.string().regex(urlRegex, "Invalid LinkedIn URL"),
  portfolio: z.string().regex(urlRegex, "Invalid portfolio URL"),
  resume_link: z.string().regex(urlRegex, "Invalid resume URL").optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

