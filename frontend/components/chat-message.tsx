import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  message: string
  isBot?: boolean
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div
        className={`rounded-full p-2 ${
          isBot
            ? 'bg-violet-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div
        className={`rounded-lg px-4 py-2 ${
          isBot
            ? 'bg-violet-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        {message}
      </div>
    </div>
  )
}

