'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SystemPrompt {
  id: string
  module: string
  name: string
  description: string
  prompt: string
  temperature: number
  maxTokens: number
}

const defaultPrompts: SystemPrompt[] = [
  {
    id: 'code-eval-questions',
    module: 'Code Evaluation',
    name: 'Question Generation',
    description: 'Generates 10 questions from submitted code',
    prompt: `You are an expert code reviewer and educator. Analyze the provided code and generate exactly 10 questions that test the student's understanding of their implementation.

Requirements:
- Generate questions of varying difficulty levels (Easy, Medium, Hard)
- Focus on implementation understanding, not just syntax
- Include questions about best practices, optimization, and potential issues
- Questions should be relevant to the specific code provided
- Return response in JSON format with the following structure:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "difficulty": "Easy|Medium|Hard"
    }
  ]
}

Temperature: 0.5 to ensure consistent, relevant questions while maintaining some variety.`,
    temperature: 0.5,
    maxTokens: 2000
  },
  {
    id: 'code-eval-validation',
    module: 'Code Evaluation',
    name: 'Answer Validation',
    description: 'Validates student answers with context preservation',
    prompt: `You are evaluating student answers to code-related questions. Use the original code context and the generated questions to provide accurate assessment.

Evaluation Criteria:
- Technical accuracy of the answer
- Understanding demonstrated through explanation
- Relevance to the original code
- Completeness of response

Return response in JSON format:
{
  "score": 85,
  "feedback": "Overall assessment...",
  "suggestions": ["Improvement suggestion 1", "Suggestion 2"]
}

Score should be out of 100. Provide constructive feedback and specific improvement suggestions.`,
    temperature: 0.5,
    maxTokens: 1500
  },
  {
    id: 'code-review-analysis',
    module: 'Code Review',
    name: 'Code Analysis',
    description: 'Analyzes code for improvements and generates comprehension questions',
    prompt: `You are a senior code reviewer analyzing code for quality, best practices, and maintainability.

Analysis Tasks:
1. Identify areas for improvement
2. Categorize issues by priority (High, Medium, Low)
3. Generate questions that help external reviewers understand the code
4. Check against provided specifications if available

Return response in JSON format:
{
  "overallScore": 75,
  "summary": "Overall assessment...",
  "improvements": [
    {
      "category": "Performance",
      "issue": "Description of issue",
      "suggestion": "Specific improvement suggestion",
      "priority": "High|Medium|Low"
    }
  ],
  "comprehensionQuestions": [
    {
      "question": "What does this function accomplish?",
      "purpose": "Helps understand main functionality"
    }
  ]
}`,
    temperature: 0.5,
    maxTokens: 2500
  },
  {
    id: 'exam-generation',
    module: 'Exam AI',
    name: 'MCQ Generation',
    description: 'Generates MCQ questions from LaTeX subject material',
    prompt: `You are an educational content expert creating multiple-choice questions from academic material.

Requirements:
- Generate relevant MCQ questions based on the provided subject material
- Each question should have 4 options with only one correct answer
- Questions should test different levels of understanding (recall, comprehension, application)
- Ensure questions are clear and unambiguous
- Cover key concepts from the material

Return response in JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": [
        {"id": "a", "text": "Option A"},
        {"id": "b", "text": "Option B"},
        {"id": "c", "text": "Option C"},
        {"id": "d", "text": "Option D"}
      ],
      "correctAnswer": "a"
    }
  ],
  "timeLimit": 1800
}

Generate 15-20 questions per exam. Questions and answer options should be randomized for anti-cheating.`,
    temperature: 0.5,
    maxTokens: 3000
  }
]

export function PromptEditor() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>(defaultPrompts)
  const [selectedPrompt, setSelectedPrompt] = useState<string>(defaultPrompts[0].id)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const currentPrompt = prompts.find(p => p.id === selectedPrompt)

  const updatePrompt = (field: keyof SystemPrompt, value: string | number) => {
    setPrompts(prev => prev.map(p => 
      p.id === selectedPrompt 
        ? { ...p, [field]: value }
        : p
    ))
  }

  const savePrompts = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save prompts:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefault = () => {
    const defaultPrompt = defaultPrompts.find(p => p.id === selectedPrompt)
    if (defaultPrompt) {
      setPrompts(prev => prev.map(p => 
        p.id === selectedPrompt ? { ...defaultPrompt } : p
      ))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Prompt Editor</h2>
        <p className="text-gray-600">Customize AI prompts for each module to control behavior and output quality.</p>
      </div>

      {saveSuccess && (
        <Alert>
          <AlertDescription>
            System prompts have been saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prompt Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Prompt</CardTitle>
            <CardDescription>
              Choose a system prompt to edit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPrompt === prompt.id 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPrompt(prompt.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{prompt.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {prompt.module}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{prompt.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prompt Editor */}
        <div className="lg:col-span-2">
          {currentPrompt && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentPrompt.name}</CardTitle>
                    <CardDescription>{currentPrompt.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{currentPrompt.module}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="prompt" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="prompt">Prompt Text</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prompt" className="space-y-4">
                    <div>
                      <Label htmlFor="prompt-text">System Prompt</Label>
                      <Textarea
                        id="prompt-text"
                        value={currentPrompt.prompt}
                        onChange={(e) => updatePrompt('prompt', e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Enter your system prompt here..."
                      />
                      <div className="text-sm text-gray-500 mt-1">
                        {currentPrompt.prompt.length} characters
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input
                          id="temperature"
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={currentPrompt.temperature}
                          onChange={(e) => updatePrompt('temperature', parseFloat(e.target.value))}
                        />
                        <div className="text-sm text-gray-500 mt-1">
                          Controls randomness (0.0 = deterministic, 1.0 = creative)
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="maxTokens">Max Tokens</Label>
                        <Input
                          id="maxTokens"
                          type="number"
                          min="100"
                          max="4000"
                          step="100"
                          value={currentPrompt.maxTokens}
                          onChange={(e) => updatePrompt('maxTokens', parseInt(e.target.value))}
                        />
                        <div className="text-sm text-gray-500 mt-1">
                          Maximum response length
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Prompt Guidelines</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li key="format">• Be specific about the desired output format (especially JSON)</li>
                        <li key="edge-cases">• Include clear instructions for handling edge cases</li>
                        <li key="criteria">• Specify evaluation criteria and scoring methods</li>
                        <li key="terminology">• Use consistent terminology across related prompts</li>
                        <li key="testing">• Test prompts with various input types to ensure reliability</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={resetToDefault}>
                    Reset to Default
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      Test Prompt
                    </Button>
                    <Button 
                      onClick={savePrompts}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}