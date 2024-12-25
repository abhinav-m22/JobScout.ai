import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatProps {
  number: string;
  label: string;
  icon: LucideIcon;
}

export function StatCard({ number, label, icon: Icon }: StatProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-6 text-center backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-2xl animate-scale-in" />
      <Icon className="mx-auto mb-4 h-8 w-8 text-violet-600 dark:text-violet-400" />
      <h3 className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-3xl font-bold text-transparent">
        {number}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}
