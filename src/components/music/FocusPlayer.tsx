'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react'

const LOFI_TRACKS = [
  { 
    title: 'Calm Study', 
    artist: 'Lofi Beats',
    // Using royalty-free lofi from freemusicarchive or similar
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'
  },
  { 
    title: 'Night Owl', 
    artist: 'Study Vibes',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_42856d2c5d.mp3'
  },
  { 
    title: 'Coffee Shop', 
    artist: 'Chill Hop',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_62a334b861.mp3'
  },
]

export default function FocusPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(LOFI_TRACKS[0].url)
      audioRef.current.volume = volume
      
      audioRef.current.onended = () => {
        nextTrack()
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } catch (err) {
      console.error('Playback error:', err)
    }
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % LOFI_TRACKS.length
    setCurrentTrack(next)
    
    if (audioRef.current) {
      audioRef.current.src = LOFI_TRACKS[next].url
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  const track = LOFI_TRACKS[currentTrack]

  return (
    <div className="space-y-4">
      {/* Track Info */}
      <div className="text-white">
        <div className="font-semibold">{track.title}</div>
        <div className="text-white/60 text-sm">{track.artist}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors text-white"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={nextTrack}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
        <span className="text-white/60 text-sm w-12 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {LOFI_TRACKS.map((track, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentTrack(idx)
              if (audioRef.current) {
                audioRef.current.src = track.url
                if (isPlaying) {
                  audioRef.current.play().catch(console.error)
                }
              }
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              idx === currentTrack
                ? 'bg-blue-500/20 text-white'
                : 'hover:bg-white/5 text-white/60'
            }`}
          >
            <div className="text-sm font-medium">{track.title}</div>
            <div className="text-xs opacity-60">{track.artist}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
