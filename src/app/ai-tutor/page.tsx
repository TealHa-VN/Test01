'use client'

import { useState } from 'react'
import DocumentUploader from '@/components/ai-tutor/DocumentUploader'
import SummaryGenerator from '@/components/ai-tutor/SummaryGenerator'
import QuizGenerator from '@/components/ai-tutor/QuizGenerator'
import { Book, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AITutorPage() {
  const router = useRouter()
  const [documentContent, setDocumentContent] = useState<string>('')
  const [documentName, setDocumentName] = useState<string>('')

  const handleDocumentProcessed = (content: string, name: string) => {
    setDocumentContent(content)
    setDocumentName(name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Book className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">AI Tutor</h1>
              <p className="text-gray-600">Upload documents to get summaries, quizzes & more</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <DocumentUploader onDocumentProcessed={handleDocumentProcessed} />
          </div>

          <div className="space-y-6">
            {documentContent ? (
              <>
                <SummaryGenerator content={documentContent} title={documentName} />
                <QuizGenerator content={documentContent} title={documentName} />
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-lg text-center">
                <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload a document to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
