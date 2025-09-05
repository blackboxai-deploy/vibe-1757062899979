'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ExamAIModuleProps {
  onBack: () => void
}

interface MCQOption {
  id: string
  text: string
}

interface MCQQuestion {
  id: number
  question: string
  options: MCQOption[]
  correctAnswer: string
  userAnswer?: string
  reported?: boolean
}

interface ExamResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  feedback: string
  questionResults: Array<{
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }>
}

export function ExamAIModule({ onBack }: ExamAIModuleProps) {
  const [step, setStep] = useState<'input' | 'exam' | 'results'>('input')
  const [subject, setSubject] = useState('')
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const generateExam = async () => {
    if (!subject.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setTimeRemaining(data.timeLimit || 1800) // 30 minutes default
        setStep('exam')
      } else {
        console.error('Failed to generate exam')
      }
    } catch (error) {
      console.error('Error generating exam:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, userAnswer: answer } : q)
    )
  }

  const reportQuestion = (questionId: number) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, reported: true } : q)
    )
  }

  const submitExam = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/evaluate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      })

      if (response.ok) {
        const data = await response.json()
        setExamResult(data)
        setStep('results')
      } else {
        console.error('Failed to evaluate exam')
      }
    } catch (error) {
      console.error('Error evaluating exam:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const progress = step === 'input' ? 25 : step === 'exam' ? 75 : 100
  const answeredQuestions = questions.filter(q => q.userAnswer).length

  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Exam AI</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">Generate a randomized multiple-choice exam from your LaTeX subject material.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Material</CardTitle>
            <CardDescription>
              Paste your LaTeX subject content below to generate relevant MCQ questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Paste your LaTeX subject material here..."
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {subject.length} characters
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack}>
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={generateExam}
                  disabled={!subject.trim() || isLoading}
                >
                  {isLoading ? 'Generating Exam...' : 'Generate Exam'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Exam Features</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Questions generated from LaTeX subject material</li>
            <li>• Randomized question and answer order for anti-cheating</li>
            <li>• Skip/Report functionality for problematic questions</li>
            <li>• Comprehensive scoring out of 100 points</li>
            <li>• Detailed feedback on performance</li>
          </ul>
        </div>
      </div>
    )
  }

  if (step === 'exam') {
    const currentQuestion = questions[currentQuestionIndex]
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Taking Exam</h1>
            <div className="flex items-center gap-4">
              <Progress value={(answeredQuestions / questions.length) * 100} className="w-32" />
              <Badge variant="outline">
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-gray-600">
              {answeredQuestions} answered
            </p>
          </div>
        </div>

        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {currentQuestion.question}
              </CardTitle>
              {currentQuestion.reported && (
                <Alert>
                  <AlertDescription>
                    This question has been reported and will be reviewed.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={currentQuestion.userAnswer || ''}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reportQuestion(currentQuestion.id)}
                  disabled={currentQuestion.reported}
                >
                  {currentQuestion.reported ? 'Reported' : 'Report Issue'}
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => (
                <Button
                  key={q.id}
                  variant={index === currentQuestionIndex ? 'default' : q.userAnswer ? 'secondary' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setStep('input')}>
            Exit Exam
          </Button>
          <Button 
            onClick={submitExam}
            disabled={answeredQuestions === 0 || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Exam'}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'results' && examResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">Your exam performance and detailed feedback.</p>
        </div>

        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Final Score
                <Badge 
                  variant={examResult.score >= 80 ? 'secondary' : examResult.score >= 60 ? 'default' : 'destructive'}
                  className="text-2xl px-4 py-2"
                >
                  {examResult.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{examResult.correctAnswers}</div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{examResult.totalQuestions - examResult.correctAnswers}</div>
                  <div className="text-sm text-gray-500">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100)}%</div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
              </div>
              <Progress value={examResult.score} className="mb-4" />
              <p className="text-gray-600">{examResult.feedback}</p>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>
                Detailed breakdown of your answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {examResult.questionResults.map((result, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-gray-900">Question {index + 1}</span>
                      <Badge variant={result.isCorrect ? 'secondary' : 'destructive'}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.question}</p>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium">Your answer:</span> {result.userAnswer}
                      </div>
                      {!result.isCorrect && (
                        <div>
                          <span className="font-medium text-green-600">Correct answer:</span> {result.correctAnswer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
          <Button onClick={() => {
            setStep('input')
            setSubject('')
            setQuestions([])
            setCurrentQuestionIndex(0)
            setExamResult(null)
          }}>
            Take New Exam
          </Button>
        </div>
      </div>
    )
  }

  return null
}