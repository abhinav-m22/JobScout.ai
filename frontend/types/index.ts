export interface Feature {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface Testimonial {
    content: string;
    author: string;
    role: string;
}

export interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
}

