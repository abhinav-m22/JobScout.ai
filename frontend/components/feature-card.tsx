import { type LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/40 p-6 transition-all hover:bg-white/60 hover:shadow-lg dark:bg-gray-800/40 dark:hover:bg-gray-800/60">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20">
          <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  )
}

