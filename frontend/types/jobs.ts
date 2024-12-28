export interface JobListing {
    platform: 'LinkedIn' | 'Glassdoor' | 'Indeed'
    role: string
    snapshot_id: string
    data: (LinkedInJob | GlassdoorJob | IndeedJob)[]
}

export interface LinkedInJob {
    job_title: string
    company_name: string
    company_logo?: string
    job_location: string
    job_posted_time: string
    job_employment_type?: string
    job_industries?: string
    job_description_formatted: string
    job_seniority_level?: string
    job_function?: string
    base_salary?: {
        min_amount: number | null
        max_amount: number | null
        currency: string | null
    }
    url: string
}

export interface GlassdoorJob {
    job_title: string
    company_name: string
    company_rating?: number
    job_location: string
    job_overview: string
    company_size?: string
    company_industry?: string
    pay_median_glassdoor?: number
    pay_range_currency?: string
    company_benefits_rating?: number
    url: string
}

export interface IndeedJob {
    job_title: string
    company_name: string
    company_rating?: number
    location: string
    salary_formatted?: string
    description_text: string
    benefits?: string[]
    url: string
    date_posted: string
}

