'use client'

import { useState } from 'react'
import StudyRoom from '@/components/deep-work/StudyRoom'
import { Book } from 'lucide-react'

export default function DeepWorkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <StudyRoom />
    </div>
  )
}
