'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Book, Brain, Users, Trophy, Timer, FileText } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect to dashboard in demo mode
    const timer = setTimeout(() => {
      router.push('/deep-work')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  const features = [
    { icon: Timer, title: 'Deep Work', desc: 'Pomodoro timer with camera tracking' },
    { icon: Brain, title: 'AI Tutor', desc: 'Document analysis & quiz generation' },
    { icon: Users, title: 'Community', desc: 'Share notes and collaborate' },
    { icon: Trophy, title: 'Gamification', desc: 'XP, streaks, and leaderboards' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Book className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            StudyHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Study Platform for Deep Focus
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/deep-work')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Studying
            </button>
            <button
              onClick={() => router.push('/ai-tutor')}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              AI Tutor
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p className="animate-pulse">Redirecting to Deep Work session...</p>
        </div>
      </div>
    </main>
  )
}
