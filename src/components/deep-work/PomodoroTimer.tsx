'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'

interface PomodoroTimerProps {
  onSessionComplete: (minutes: number) => void
  onStudyStart: () => void
  onStudyEnd: () => void
}

export default function PomodoroTimer({ 
  onSessionComplete, 
  onStudyStart, 
  onStudyEnd 
}: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/bell.mp3')
    }
  }, [])

  useEffect(() => {
    if (isActive) {
      onStudyStart()
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else {
      if (!isBreak) {
        onStudyEnd()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, minutes, seconds])

  const handleTimerComplete = () => {
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }

    if (!isBreak) {
      // Completed a work session
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)
      onSessionComplete(workDuration)
      
      // Start break
      setIsBreak(true)
      setMinutes(breakDuration)
      setSeconds(0)
      setIsActive(false)
      onStudyEnd()
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: `Great job! Time for a ${breakDuration} minute break.`,
          icon: '/icons/icon-192x192.png'
        })
      }
    } else {
      // Break complete
      setIsBreak(false)
      setMinutes(workDuration)
      setSeconds(0)
      setIsActive(false)
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Over!', {
          body: 'Ready to focus again?',
          icon: '/icons/icon-192x192.png'
        })
      }
    }
  }

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setMinutes(workDuration)
    setSeconds(0)
    onStudyEnd()
  }

  const updateSettings = (work: number, breakTime: number) => {
    setWorkDuration(work)
    setBreakDuration(breakTime)
    if (!isActive) {
      setMinutes(work)
      setSeconds(0)
    }
    setShowSettings(false)
  }

  const progress = isBreak
    ? ((breakDuration * 60 - (minutes * 60 + seconds)) / (breakDuration * 60)) * 100
    : ((workDuration * 60 - (minutes * 60 + seconds)) / (workDuration * 60)) * 100

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-white">
          <h2 className="text-2xl font-bold">
            {isBreak ? '☕ Break Time' : '🎯 Focus Session'}
          </h2>
          <p className="text-white/60 mt-1">
            {completedPomodoros} pomodoro{completedPomodoros !== 1 ? 's' : ''} completed today
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 hover:bg-white/10 rounded-lg transition-colors text-white"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-2 block">Work Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Break Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <button
              onClick={() => updateSettings(workDuration, breakDuration)}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Progress Ring */}
        <svg className="w-full max-w-md mx-auto" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={isBreak ? '#10b981' : '#3b82f6'}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000"
          />
        </svg>

        {/* Time */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-white/60 text-sm">
              {Math.round(progress)}% complete
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all ${
            isActive
              ? 'bg-red-500 hover:bg-red-600'
              : isBreak
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>{isBreak ? 'Start Break' : 'Start Focus'}</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
