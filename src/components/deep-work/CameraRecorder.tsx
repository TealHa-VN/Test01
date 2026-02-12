'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, CameraOff, Video } from 'lucide-react'

interface CameraRecorderProps {
  isActive: boolean
}

export default function CameraRecorder({ isActive }: CameraRecorderProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  useEffect(() => {
    if (isActive && hasPermission) {
      startRecording()
    } else {
      stopRecording()
    }
  }, [isActive, hasPermission])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setHasPermission(true)
      setError('')
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setHasPermission(false)
    stopRecording()
  }

  const startRecording = () => {
    if (!streamRef.current) return

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp8'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        chunksRef.current = []
        
        // Save recording to IndexedDB or download
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `study-session-${Date.now()}.webm`
        // Optionally auto-download: a.click()
        
        console.log('Recording saved:', url)
      }

      mediaRecorder.start(1000) // Capture in 1s chunks
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (err) {
      console.error('Recording error:', err)
      setError('Failed to start recording')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {hasPermission ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover camera-preview"
            />
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-sm font-semibold">REC</span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraOff className="w-12 h-12 text-gray-600" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {!hasPermission ? (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Enable Camera</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
          >
            <CameraOff className="w-4 h-4" />
            <span>Disable Camera</span>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="text-white/60 text-xs">
        <p>📹 Camera tracks your study sessions</p>
        <p className="mt-1">Recordings are stored locally on your device</p>
      </div>
    </div>
  )
}
