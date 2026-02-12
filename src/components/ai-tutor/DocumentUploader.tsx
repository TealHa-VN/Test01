'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, Loader } from 'lucide-react'

interface DocumentUploaderProps {
  onDocumentProcessed: (content: string, name: string) => void
}

export default function DocumentUploader({ onDocumentProcessed }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    setError('')
    setIsProcessing(true)
    setFileName(file.name)

    try {
      const extension = file.name.split('.').pop()?.toLowerCase()

      if (extension === 'txt' || extension === 'md') {
        const text = await file.text()
        onDocumentProcessed(text, file.name)
      } else if (extension === 'pdf') {
        // For PDF, we'll extract text using a simple reader
        // In production, use pdf.js library
        const text = await file.text()
        onDocumentProcessed(text, file.name)
      } else if (extension === 'docx') {
        // For DOCX, use mammoth.js in production
        const text = await file.text()
        onDocumentProcessed(text, file.name)
      } else {
        throw new Error('Unsupported file type. Please upload TXT, MD, PDF, or DOCX files.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
      console.error('File processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearFile = () => {
    setFileName('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-600">Processing document...</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-4">
            <File className="w-12 h-12 text-green-500" />
            <p className="text-gray-800 font-semibold">{fileName}</p>
            <button
              onClick={clearFile}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-gray-600 mb-2">
                Drag and drop your document here
              </p>
              <p className="text-gray-400 text-sm mb-4">
                or
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Browse Files
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Supports: TXT, MD, PDF, DOCX
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Upload lecture notes, textbooks, or study materials</li>
          <li>Get AI-generated summaries and mind maps</li>
          <li>Generate practice quizzes automatically</li>
          <li>All processing happens locally in your browser</li>
        </ul>
      </div>
    </div>
  )
}
