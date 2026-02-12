'use client'

import { useState } from 'react'
import { Brain, Loader, CheckCircle, XCircle, Trophy } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizGeneratorProps {
  content: string
  title: string
}

export default function QuizGenerator({ content, title }: QuizGeneratorProps) {
  const [quiz, setQuiz] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)

  const generateQuiz = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate simple questions from content
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30)
      const questions: Question[] = []
      
      for (let i = 0; i < Math.min(5, sentences.length); i++) {
        const sentence = sentences[i].trim()
        const words = sentence.split(' ')
        
        if (words.length > 5) {
          // Create a fill-in-the-blank question
          const blankIndex = Math.floor(words.length / 2)
          const correctWord = words[blankIndex]
          const questionText = words.map((w, idx) => 
            idx === blankIndex ? '____' : w
          ).join(' ')
          
          questions.push({
            question: `Fill in the blank: ${questionText}`,
            options: [
              correctWord,
              words[blankIndex - 1] || 'option',
              words[blankIndex + 1] || 'answer',
              words[Math.floor(Math.random() * words.length)] || 'choice'
            ].sort(() => Math.random() - 0.5),
            correctAnswer: 0 // Will be updated after shuffle
          })
          
          // Update correct answer index after shuffle
          questions[i].correctAnswer = questions[i].options.indexOf(correctWord)
        }
      }
      
      setQuiz(questions)
      setQuizStarted(false)
      setCurrentQuestion(0)
      setScore(0)
      setShowResult(false)
    } catch (error) {
      console.error('Quiz generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    
    if (index === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizStarted(true)
  }

  if (showResult) {
    const percentage = Math.round((score / quiz.length) * 100)
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <div className="text-5xl font-bold text-blue-600 my-6">
            {score}/{quiz.length}
          </div>
          <p className="text-xl text-gray-600 mb-6">
            You scored {percentage}%
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Retry Quiz
            </button>
            <button
              onClick={generateQuiz}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              New Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (quiz.length > 0 && (quizStarted || selectedAnswer !== null)) {
    const question = quiz[currentQuestion]
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Practice Quiz</h2>
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quiz.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = idx === question.correctAnswer
              const showFeedback = selectedAnswer !== null

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showFeedback
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showFeedback && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Next Button */}
        {selectedAnswer !== null && (
          <button
            onClick={nextQuestion}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            {currentQuestion < quiz.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}

        {/* Score */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Current Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Practice Quiz</h2>
      </div>

      {quiz.length === 0 ? (
        <button
          onClick={generateQuiz}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating Quiz...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Generate Quiz</span>
            </>
          )}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Your quiz with {quiz.length} questions is ready!
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            Start Quiz
          </button>
        </div>
      )}

      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <p>📝 <strong>Quiz Features:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>AI-generated questions from your document</li>
          <li>Multiple choice format</li>
          <li>Instant feedback on answers</li>
          <li>Track your score and progress</li>
        </ul>
      </div>
    </div>
  )
}
