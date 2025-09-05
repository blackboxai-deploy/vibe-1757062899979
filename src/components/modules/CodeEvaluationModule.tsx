'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
interface CodeEvaluationModuleProps {
  onBack: () => void
}

interface Question {
  id: number
  question: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  answer: string
}

interface EvaluationResult {
  score: number
  feedback: string
  suggestions: string[]
}

export function CodeEvaluationModule({ onBack }: CodeEvaluationModuleProps) {
  const [step, setStep] = useState<'input' | 'questions' | 'evaluation' | 'results'>('input')
  const [code, setCode] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<EvaluationResult | null>(null)

  const generateQuestions = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setStep('questions')
      } else {
        console.error('Failed to generate questions')
      }
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, answer } : q)
    )
  }

  const evaluateAnswers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/evaluate-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, questions }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setStep('results')
      } else {
        console.error('Failed to evaluate answers')
      }
    } catch (error) {
      console.error('Error evaluating answers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const progress = step === 'input' ? 25 : step === 'questions' ? 50 : step === 'evaluation' ? 75 : 100

  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Code Evaluation</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">Submit your code to receive AI-generated questions and evaluation.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Code</CardTitle>
            <CardDescription>
              Paste your code below. The AI will analyze it and generate 10 relevant questions to test your understanding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {code.length} characters
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack}>
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={generateQuestions}
                  disabled={!code.trim() || isLoading}
                >
                  {isLoading ? 'Generating Questions...' : 'Generate Questions'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• AI analyzes your code structure and functionality</li>
            <li>• 10 questions are generated with varying difficulty levels</li>
            <li>• Questions test implementation understanding and best practices</li>
            <li>• Your answers are validated with context preservation</li>
          </ul>
        </div>
      </div>
    )
  }

  if (step === 'questions') {
    const answeredQuestions = questions.filter(q => q.answer.trim()).length

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Answer Questions</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">
            Answer the AI-generated questions about your code ({answeredQuestions}/{questions.length} completed)
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className={question.answer.trim() ? 'border-green-200 bg-green-50/30' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                  <Badge 
                    variant={
                      question.difficulty === 'Easy' ? 'secondary' : 
                      question.difficulty === 'Medium' ? 'default' : 
                      'destructive'
                    }
                  >
                    {question.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {question.question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={question.answer}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={() => setStep('input')}>
            Back to Code Input
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {answeredQuestions}/{questions.length} questions answered
            </span>
            <Button 
              onClick={evaluateAnswers}
              disabled={answeredQuestions === 0 || isLoading}
            >
              {isLoading ? 'Evaluating Answers...' : 'Submit for Evaluation'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'results' && results) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Evaluation Results</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">Your performance analysis and improvement suggestions.</p>
        </div>

        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Score
                <Badge 
                  variant={results.score >= 80 ? 'secondary' : results.score >= 60 ? 'default' : 'destructive'}
                  className="text-lg px-3 py-1"
                >
                  {results.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={results.score} className="mb-4" />
              <p className="text-gray-600">{results.feedback}</p>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {results.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  Areas where you can enhance your code and understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
          <Button onClick={() => {
            setStep('input')
            setCode('')
            setQuestions([])
            setResults(null)
          }}>
            Start New Evaluation
          </Button>
        </div>
      </div>
    )
  }

  return null
}