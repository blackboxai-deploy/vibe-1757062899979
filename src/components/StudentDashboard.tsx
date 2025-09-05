'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CodeEvaluationModule } from '@/components/modules/CodeEvaluationModule'
import { CodeReviewModule } from '@/components/modules/CodeReviewModule'
import { ExamAIModule } from '@/components/modules/ExamAIModule'

interface StudentDashboardProps {
  onLogout: () => void
}

type ModuleType = 'home' | 'code-eval' | 'code-review' | 'exam-ai'

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeModule, setActiveModule] = useState<ModuleType>('home')

  const renderModule = () => {
    switch (activeModule) {
      case 'code-eval':
        return <CodeEvaluationModule onBack={() => setActiveModule('home')} />
      case 'code-review':
        return <CodeReviewModule onBack={() => setActiveModule('home')} />
      case 'exam-ai':
        return <ExamAIModule onBack={() => setActiveModule('home')} />
      default:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
              <p className="text-lg text-gray-600">Choose a module to begin your assessment</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card 
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200"
                onClick={() => setActiveModule('code-eval')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">1</span>
                    </div>
                    Code Evaluation
                  </CardTitle>
                  <CardDescription>
                    Submit your code and answer AI-generated questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">10 Questions</Badge>
                      <Badge variant="secondary">AI Analysis</Badge>
                      <Badge variant="secondary">Context-Aware</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Demonstrate your understanding through dynamic questioning and validation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-200"
                onClick={() => setActiveModule('code-review')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xl">2</span>
                    </div>
                    Code Review
                  </CardTitle>
                  <CardDescription>
                    Get improvement suggestions and comprehension aid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Improvements</Badge>
                      <Badge variant="secondary">Best Practices</Badge>
                      <Badge variant="secondary">Specifications</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Receive detailed feedback and suggestions for code enhancement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200"
                onClick={() => setActiveModule('exam-ai')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-xl">3</span>
                    </div>
                    Exam AI
                  </CardTitle>
                  <CardDescription>
                    Take randomized MCQ exams from LaTeX subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">MCQ Format</Badge>
                      <Badge variant="secondary">Randomized</Badge>
                      <Badge variant="secondary">Scored /100</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Complete comprehensive exams with anti-cheating measures.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Submit Your Work</h3>
                    <p className="text-gray-600">Enter your code or select an exam topic to begin the assessment process.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
                    <p className="text-gray-600">Our AI system analyzes your submission and generates relevant questions or feedback.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Get Results</h3>
                    <p className="text-gray-600">Receive detailed feedback, scores, and improvement suggestions based on your performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {activeModule !== 'home' && (
              <Button 
                variant="ghost" 
                onClick={() => setActiveModule('home')}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back to Dashboard
              </Button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">
              Educational AI System
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Student Mode</Badge>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" onClick={onLogout} className="text-gray-600">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderModule()}
      </div>
    </div>
  )
}