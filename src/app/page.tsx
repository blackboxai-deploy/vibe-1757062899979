'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthDialog } from '@/components/AuthDialog'
import { StudentDashboard } from '@/components/StudentDashboard'
import { ProfessorDashboard } from '@/components/ProfessorDashboard'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<'none' | 'student' | 'professor'>('none')
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Check for existing authentication
    const auth = localStorage.getItem('edu_ai_auth')
    if (auth) {
      setIsAuthenticated(auth as 'student' | 'professor')
    }
  }, [])

  if (isAuthenticated === 'student') {
    return <StudentDashboard onLogout={() => {
      localStorage.removeItem('edu_ai_auth')
      setIsAuthenticated('none')
    }} />
  }

  if (isAuthenticated === 'professor') {
    return <ProfessorDashboard onLogout={() => {
      localStorage.removeItem('edu_ai_auth')
      setIsAuthenticated('none')
    }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Educational AI System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered tools for code evaluation, review, and automated exam generation
          </p>
        </div>

        {/* System Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Code Evaluation
              </CardTitle>
              <CardDescription>
                AI-generated questions with context-aware validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary">10 Dynamic Questions</Badge>
              <Badge variant="secondary">Difficulty Levels</Badge>
              <Badge variant="secondary">Context Preservation</Badge>
              <p className="text-sm text-gray-600 mt-3">
                Submit your code and answer AI-generated questions to demonstrate understanding and implementation skills.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                Code Review
              </CardTitle>
              <CardDescription>
                Automated improvement suggestions and comprehension aid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary">Improvement Analysis</Badge>
              <Badge variant="secondary">External Questions</Badge>
              <Badge variant="secondary">Specification Check</Badge>
              <p className="text-sm text-gray-600 mt-3">
                Get detailed feedback on code quality, best practices, and suggestions for enhancement.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                Exam AI
              </CardTitle>
              <CardDescription>
                LaTeX-to-MCQ generation with anti-cheating measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary">Question Banking</Badge>
              <Badge variant="secondary">Randomization</Badge>
              <Badge variant="secondary">Skip/Report</Badge>
              <p className="text-sm text-gray-600 mt-3">
                Generate randomized multiple-choice questions from LaTeX subjects with comprehensive scoring.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Access Section */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Access System</CardTitle>
            <CardDescription>
              Choose your access level to begin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => {
                setIsAuthenticated('student')
                localStorage.setItem('edu_ai_auth', 'student')
              }}
              className="w-full"
              variant="default"
            >
              Student Access
            </Button>
            
            <Separator />
            
            <Button 
              onClick={() => setShowAuth(true)}
              className="w-full"
              variant="outline"
            >
              Professor Access
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">System Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">AI Integration</h3>
              <p className="text-sm text-gray-600">Claude-powered analysis with 0.5 temperature for accuracy</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Multilingual</h3>
              <p className="text-sm text-gray-600">Support for English and French languages</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibent text-gray-900 mb-2">Anti-Cheating</h3>
              <p className="text-sm text-gray-600">Randomized questions and answers for exam integrity</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">JSON-Based</h3>
              <p className="text-sm text-gray-600">Structured data handling for reliable processing</p>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog 
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthenticate={() => {
          setIsAuthenticated('professor')
          localStorage.setItem('edu_ai_auth', 'professor')
          setShowAuth(false)
        }}
      />
    </div>
  )
}