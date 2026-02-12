'use client'

import { useState } from 'react'
import { FileText, Loader, Sparkles } from 'lucide-react'

interface SummaryGeneratorProps {
  content: string
  title: string
}

export default function SummaryGenerator({ content, title }: SummaryGeneratorProps) {
  const [summary, setSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [summaryType, setSummaryType] = useState<'brief' | 'detailed'>('brief')

  const generateSummary = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simple extractive summary (first few sentences)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
      const numSentences = summaryType === 'brief' ? 3 : 6
      const summaryText = sentences.slice(0, numSentences).join('. ') + '.'
      
      setSummary(summaryText || 'Unable to generate summary. Document may be too short.')
    } catch (error) {
      console.error('Summary generation error:', error)
      setSummary('Failed to generate summary. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const keyPoints = content
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 30)
    .slice(0, 5)
    .map(s => s.trim())

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">AI Summary</h2>
      </div>

      {/* Summary Type Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSummaryType('brief')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            summaryType === 'brief'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Brief
        </button>
        <button
          onClick={() => setSummaryType('detailed')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            summaryType === 'detailed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Detailed
        </button>
      </div>

      {/* Generate Button */}
      {!summary && (
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating Summary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Summary</span>
            </>
          )}
        </button>
      )}

      {/* Summary Output */}
      {summary && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-gray-800 leading-relaxed">{summary}</p>
          </div>

          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold"
          >
            Regenerate
          </button>
        </div>
      )}

      {/* Key Points */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3 text-gray-800">Key Points:</h3>
        <ul className="space-y-2">
          {keyPoints.map((point, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span className="text-gray-700 text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {content.split(/\s+/).length}
          </div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {content.split(/[.!?]+/).length}
          </div>
          <div className="text-sm text-gray-600">Sentences</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Math.ceil(content.split(/\s+/).length / 200)}
          </div>
          <div className="text-sm text-gray-600">Min Read</div>
        </div>
      </div>
    </div>
  )
}
