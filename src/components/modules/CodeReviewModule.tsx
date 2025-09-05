'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeReviewModuleProps {
  onBack: () => void
}

interface ReviewResult {
  improvements: Array<{
    category: string
    issue: string
    suggestion: string
    priority: 'High' | 'Medium' | 'Low'
  }>
  comprehensionQuestions: Array<{
    question: string
    purpose: string
  }>
  overallScore: number
  summary: string
}

export function CodeReviewModule({ onBack }: CodeReviewModuleProps) {
  const [step, setStep] = useState<'input' | 'analysis' | 'results'>('input')
  const [code, setCode] = useState('')
  const [specifications, setSpecifications] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)

  const analyzeCode = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, specifications }),
      })

      if (response.ok) {
        const data = await response.json()
        setReviewResult(data)
        setStep('results')
      } else {
        console.error('Failed to analyze code')
      }
    } catch (error) {
      console.error('Error analyzing code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const progress = step === 'input' ? 33 : step === 'analysis' ? 66 : 100

  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Code Review</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">Submit your code for comprehensive analysis and improvement suggestions.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Submission</CardTitle>
              <CardDescription>
                Paste your code below for AI-powered analysis and improvement suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="text-sm text-gray-500">
                {code.length} characters
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Specifications (Optional)</CardTitle>
              <CardDescription>
                Add project requirements, coding standards, or specific guidelines for more targeted analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Enter project specifications, coding standards, or requirements..."
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
            <Button 
              onClick={analyzeCode}
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? 'Analyzing Code...' : 'Start Analysis'}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Analysis Features</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Code quality assessment with best practices evaluation</li>
            <li>• Improvement suggestions categorized by priority</li>
            <li>• External comprehension questions for code understanding</li>
            <li>• Specification compliance checking (when provided)</li>
          </ul>
        </div>
      </div>
    )
  }

  if (step === 'results' && reviewResult) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Code Review Results</h1>
            <Progress value={progress} className="w-32" />
          </div>
          <p className="text-gray-600">Comprehensive analysis of your code with improvement suggestions.</p>
        </div>

        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Code Quality
                <Badge 
                  variant={reviewResult.overallScore >= 80 ? 'secondary' : reviewResult.overallScore >= 60 ? 'default' : 'destructive'}
                  className="text-lg px-3 py-1"
                >
                  {reviewResult.overallScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={reviewResult.overallScore} className="mb-4" />
              <p className="text-gray-600">{reviewResult.summary}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="improvements" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="questions">Comprehension Aid</TabsTrigger>
            </TabsList>

            <TabsContent value="improvements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                  <CardDescription>
                    Specific recommendations to enhance your code quality and maintainability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewResult.improvements.map((improvement, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{improvement.category}</span>
                          <Badge 
                            variant={
                              improvement.priority === 'High' ? 'destructive' : 
                              improvement.priority === 'Medium' ? 'default' : 
                              'secondary'
                            }
                          >
                            {improvement.priority} Priority
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-red-600">Issue:</span>
                            <p className="text-sm text-gray-700">{improvement.issue}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-600">Suggestion:</span>
                            <p className="text-sm text-gray-700">{improvement.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comprehension Questions</CardTitle>
                  <CardDescription>
                    Questions to help external reviewers understand your code without reading it entirely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewResult.comprehensionQuestions.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-blue-600">Question:</span>
                            <p className="text-sm text-gray-700 font-medium">{item.question}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-600">Purpose:</span>
                            <p className="text-sm text-gray-600">{item.purpose}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
          <Button onClick={() => {
            setStep('input')
            setCode('')
            setSpecifications('')
            setReviewResult(null)
          }}>
            Start New Review
          </Button>
        </div>
      </div>
    )
  }

  return null
}