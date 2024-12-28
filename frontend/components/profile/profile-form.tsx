"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { profileFormSchema, type ProfileFormValues } from "@/lib/validations/profile"
import { toast } from "sonner"

const employmentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance']

interface ProfileFormProps {
  initialData?: Partial<ProfileFormValues>
  userEmail: string
  userId: string
}

function transformPayload(payload: ProfileFormValues) {
  return {
    ...payload,
    // Transform array fields to comma-separated strings or empty strings if array is empty
    skills: Array.isArray(payload.skills) 
      ? payload.skills.join(', ') 
      : payload.skills || '',
      
    certifications: Array.isArray(payload.certifications) 
      ? payload.certifications.join(', ') 
      : payload.certifications || '',
      
    preferred_job_titles: Array.isArray(payload.preferred_job_titles) 
      ? payload.preferred_job_titles.join(', ') 
      : payload.preferred_job_titles || '',
      
    preferred_industries: Array.isArray(payload.preferred_industries) 
      ? payload.preferred_industries.join(', ') 
      : payload.preferred_industries || '',
      
    education: Array.isArray(payload.education)
      ? payload.education.join('\n')
      : payload.education || ''
  };
}

export function ProfileForm({ initialData, userEmail, userId }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const stringToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    const result = value.split(',').map(item => item.trim()).filter(Boolean);
    console.log(`Converting ${value} to array:`, result);
    return result;
  };

  const transformInitialData = (data: any): Partial<ProfileFormValues> => {
    if (!data) return {};

    return {
      // Required fields
      name: data.name || '',
      email: data.email || userEmail || '',
      phone: data.phone || '',
      location: data.location || '',
      current_title: data.current_title || '',
      current_industry: data.current_industry || '',
      experience_years: Number(data.experience_years) || 0,

      // Optional fields
      employment_type: data.employment_type || undefined,
      preferred_job_titles: Array.isArray(data.preferred_job_titles)
        ? data.preferred_job_titles.join(', ')
        : data.preferred_job_titles || '',
      preferred_industries: Array.isArray(data.preferred_industries)
        ? data.preferred_industries.join(', ')
        : data.preferred_industries || '',
      salary_expectations: data.salary_expectations ? Number(data.salary_expectations) : undefined,
      education: data.education || '',
      skills: Array.isArray(data.skills)
        ? data.skills.join(', ')
        : data.skills || '',
      certifications: Array.isArray(data.certifications)
        ? data.certifications.join(', ')
        : data.certifications || '',
      career_goals: data.career_goals || '',
      relocation_willingness: data.relocation_willingness === undefined ? false : Boolean(data.relocation_willingness),
      linkedin: data.linkedin || '',
      portfolio: data.portfolio || '',
      resume_link: data.resume_link || '',
      education: Array.isArray(data.education)
        ? data.education.join('\n')
        : data.education || '',
    };
  };



  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: transformInitialData(initialData),
  });

  useEffect(() => {
    console.log("Current Form Values:", form.getValues());
  }, [form]);

  useEffect(() => {
    if (initialData) {
      const transformed = transformInitialData(initialData);
      Object.entries(transformed).forEach(([key, value]) => {
        form.setValue(key as keyof ProfileFormValues, value);
      });
    }
  }, [initialData, form]);

  const API_URL = 'http://localhost:8000'

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      // Transform the data before sending to API
      const transformedData = transformPayload(data);
      
      const response = await fetch(`${API_URL}/users/profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(transformedData),
      })
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }
  
      toast.success('Profile updated successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Career Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="current_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current_industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferred_job_titles"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Preferred Job Titles</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Developer, Tech Lead, Engineering Manager" {...field} />
                    </FormControl>
                    <FormDescription>Separate multiple titles with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferred_industries"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Preferred Industries</FormLabel>
                    <FormControl>
                      <Input placeholder="Technology, Finance, Healthcare" {...field} />
                    </FormControl>
                    <FormDescription>Separate multiple industries with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary_expectations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Expectations (Annual)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Education and Skills</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Bachelor's in Computer Science, University Name, 2020"
                        {...field}
                        value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Enter each education detail on a new line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, Node.js, TypeScript, Python"
                        {...field}
                        // Only use join if it's an array
                        value={typeof field.value === 'string' ? field.value : field.value?.join(', ')}
                        onChange={(e) => {
                          // Just pass the string value, let the schema handle the transformation
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Separate multiple skills with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Input placeholder="AWS Certified Developer, Google Cloud Professional" {...field} />
                    </FormControl>
                    <FormDescription>Separate multiple certifications with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Preferences</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="career_goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your career goals and aspirations..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relocation_willingness"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Willing to Relocate</FormLabel>
                      <FormDescription>
                        Check this if you're open to relocating for job opportunities
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Professional Links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourportfolio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resume_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://drive.google.com/resume" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </form>
    </Form>
  )
}

