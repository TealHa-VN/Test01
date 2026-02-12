'use client'

import { useState, useEffect } from 'react'
import PomodoroTimer from './PomodoroTimer'
import CameraRecorder from './CameraRecorder'
import FocusPlayer from '../music/FocusPlayer'
import { Trophy, Timer, Camera, Music, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StudyRoom() {
  const router = useRouter()
  const [isStudying, setIsStudying] = useState(false)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [xp, setXp] = useState(0)

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('study-progress')
    if (saved) {
      const data = JSON.parse(saved)
      setTotalMinutes(data.totalMinutes || 0)
      setXp(data.xp || 0)
    }
  }, [])

  const handleSessionComplete = (minutes: number) => {
    const newTotal = totalMinutes + minutes
    const newXp = xp + (minutes * 10) // 10 XP per minute
    
    setTotalMinutes(newTotal)
    setXp(newXp)
    
    // Save progress
    localStorage.setItem('study-progress', JSON.stringify({
      totalMinutes: newTotal,
      xp: newXp,
    }))
    
    setIsStudying(false)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background overlay when studying */}
      {isStudying && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
      )}

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white">
              <Timer className="w-5 h-5" />
              <span className="font-semibold">{totalMinutes}m total</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg text-yellow-300">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Timer Section */}
            <div className="lg:col-span-2">
              <PomodoroTimer 
                onSessionComplete={handleSessionComplete}
                onStudyStart={() => setIsStudying(true)}
                onStudyEnd={() => setIsStudying(false)}
              />
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Camera */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Camera className="w-5 h-5" />
                  <h3 className="font-semibold">Camera Tracking</h3>
                </div>
                <CameraRecorder isActive={isStudying} />
              </div>

              {/* Music Player */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Music className="w-5 h-5" />
                  <h3 className="font-semibold">Focus Music</h3>
                </div>
                <FocusPlayer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
