'use client'

import { useState, useEffect } from 'react'
import { Code2, Database, Laptop2, Loader2, Server } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '../navbar'

interface InteractiveRolesLoaderProps {
    roles: string[]
}

export function InteractiveRolesLoader({ roles }: InteractiveRolesLoaderProps) {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
        }, 2000) // Change role every 2 seconds

        return () => clearInterval(interval)
    }, [roles.length])

    const icons = [
        <Code2 key="code" className="h-6 w-6" />,
        <Laptop2 key="laptop" className="h-6 w-6" />,
        <Database key="database" className="h-6 w-6" />,
        <Server key="server" className="h-6 w-6" />
    ]

    return (
        <>
            <Navbar />
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="relative flex flex-col items-center space-y-8">
                    {icons.map((icon, index) => (
                        <motion.div
                            key={index}
                            className="absolute"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                rotate: 360,
                                x: Math.cos((index * 2 * Math.PI) / icons.length) * 80,
                                y: Math.sin((index * 2 * Math.PI) / icons.length) * 80,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            {icon}
                        </motion.div>
                    ))}

                    {/* Center loader */}
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />

                    {/* Role text with animation */}
                    <div className="text-center space-y-4">
                        <div className="text-lg font-semibold text-muted-foreground">
                            Please wait while we find the best latest job for you
                        </div>
                        <div className="text-base text-muted-foreground">
                            These are the roles our AI thinks you might be interested in:
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentRoleIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-2 text-2xl font-bold text-primary"
                            >
                                {roles[currentRoleIndex]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
}
