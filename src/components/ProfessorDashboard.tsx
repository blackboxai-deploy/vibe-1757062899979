'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptEditor } from '@/components/professor/PromptEditor'
import { QuestionBankManager } from '@/components/professor/QuestionBankManager'
import { AnalyticsDashboard } from '@/components/professor/AnalyticsDashboard'
import { SystemConfiguration } from '@/components/professor/SystemConfiguration'

interface ProfessorDashboardProps {
  onLogout: () => void
}

export function ProfessorDashboard({ onLogout }: ProfessorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Educational AI System
            </h1>
            <Badge variant="secondary">Professor Panel</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Authenticated
            </Badge>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" onClick={onLogout} className="text-gray-600">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prompts">Prompt Editor</TabsTrigger>
            <TabsTrigger value="questions">Question Bank</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Professor Dashboard</h2>
              <p className="text-lg text-gray-600">Manage system prompts, question banks, and monitor student performance</p>
            </div>

            {/* System Status Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <p className="text-xs text-gray-500">+12 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Question Bank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">1,234</div>
                  <p className="text-xs text-gray-500">Questions available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Avg. Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">78.5</div>
                  <p className="text-xs text-gray-500">Out of 100</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-green-600">Operational</span>
                  </div>
                  <p className="text-xs text-gray-500">All modules running</p>
                </CardContent>
              </Card>
            </div>

            {/* Module Management */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    Code Evaluation
                  </CardTitle>
                  <CardDescription>
                    Manage prompts and parameters for code evaluation module
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <span className="text-sm font-medium">0.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Questions:</span>
                    <span className="text-sm font-medium">10 per session</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => setActiveTab('prompts')}
                  >
                    Edit Prompts
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    Code Review
                  </CardTitle>
                  <CardDescription>
                    Configure improvement suggestions and review parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Review Depth:</span>
                    <span className="text-sm font-medium">Comprehensive</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Languages:</span>
                    <span className="text-sm font-medium">EN, FR</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => setActiveTab('prompts')}
                  >
                    Edit Prompts
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    Exam AI
                  </CardTitle>
                  <CardDescription>
                    Manage question banks and exam generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Questions:</span>
                    <span className="text-sm font-medium">1,234 total</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Randomization:</span>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => setActiveTab('questions')}
                  >
                    Manage Bank
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks and system management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('prompts')}
                    className="justify-start"
                  >
                    Edit System Prompts
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('questions')}
                    className="justify-start"
                  >
                    Manage Questions
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('analytics')}
                    className="justify-start"
                  >
                    View Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('config')}
                    className="justify-start"
                  >
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts">
            <PromptEditor />
          </TabsContent>

          <TabsContent value="questions">
            <QuestionBankManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="config">
            <SystemConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}