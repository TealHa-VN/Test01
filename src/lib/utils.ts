import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime())
  let streak = 1
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.abs(sortedDates[i].getTime() - sortedDates[i + 1].getTime())
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days === 1) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function getXPLevel(xp: number): { level: number; progress: number } {
  const level = Math.floor(xp / 1000)
  const progress = (xp % 1000) / 1000 * 100
  
  return { level, progress }
}
