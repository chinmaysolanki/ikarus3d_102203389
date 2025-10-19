import { useState, useEffect } from 'react'
import { Brain, Sparkles, Search } from 'lucide-react'

interface ThinkingChipProps {
  text: string
  delay?: number
  className?: string
}

export default function ThinkingChip({ text, delay = 0, className = '' }: ThinkingChipProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const icons = [Brain, Sparkles, Search]
  const Icon = icons[Math.floor(Math.random() * icons.length)]

  if (!isVisible) return null

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 animate-fade-in ${className}`}>
      <Icon className="h-4 w-4 animate-pulse" />
      <span>{text}</span>
    </div>
  )
}

interface ThinkingChipsProps {
  className?: string
}

export function ThinkingChips({ className = '' }: ThinkingChipsProps) {
  const thinkingTexts = [
    "Analyzing your request...",
    "Searching our database...",
    "Finding similar products...",
    "Ranking results...",
    "Generating descriptions...",
    "Almost ready..."
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {thinkingTexts.map((text, index) => (
        <ThinkingChip
          key={index}
          text={text}
          delay={index * 200}
        />
      ))}
    </div>
  )
}
