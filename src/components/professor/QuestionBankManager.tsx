'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Question {
  id: string
  subject: string
  question: string
  type: 'MCQ' | 'Open'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  options?: string[]
  correctAnswer?: string
  tags: string[]
  createdAt: string
  usageCount: number
  reportCount: number
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    subject: 'Data Structures',
    question: 'What is the time complexity of inserting an element at the beginning of a linked list?',
    type: 'MCQ',
    difficulty: 'Easy',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 'O(1)',
    tags: ['linked-list', 'time-complexity'],
    createdAt: '2024-01-15',
    usageCount: 45,
    reportCount: 0
  },
  {
    id: '2',
    subject: 'Algorithms',
    question: 'Explain the difference between BFS and DFS traversal algorithms.',
    type: 'Open',
    difficulty: 'Medium',
    tags: ['graph-algorithms', 'traversal'],
    createdAt: '2024-01-14',
    usageCount: 32,
    reportCount: 1
  },
  {
    id: '3',
    subject: 'Database Design',
    question: 'Which normal form eliminates transitive dependencies?',
    type: 'MCQ',
    difficulty: 'Hard',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: '3NF',
    tags: ['normalization', 'database-design'],
    createdAt: '2024-01-13',
    usageCount: 28,
    reportCount: 0
  }
]

export function QuestionBankManager() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterType, setFilterType] = useState('')

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = !filterSubject || question.subject === filterSubject
    const matchesDifficulty = !filterDifficulty || question.difficulty === filterDifficulty
    const matchesType = !filterType || question.type === filterType

    return matchesSearch && matchesSubject && matchesDifficulty && matchesType
  })

  const subjects = [...new Set(questions.map(q => q.subject))]
  const totalQuestions = questions.length
  const reportedQuestions = questions.filter(q => q.reportCount > 0).length
  const avgUsage = Math.round(questions.reduce((sum, q) => sum + q.usageCount, 0) / questions.length)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Question Bank Manager</h2>
        <p className="text-gray-600">Manage your exam question database and monitor question performance.</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
            <p className="text-xs text-gray-500">Across all subjects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{subjects.length}</div>
            <p className="text-xs text-gray-500">Different topics</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgUsage}</div>
            <p className="text-xs text-gray-500">Times per question</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reportedQuestions}</div>
            <p className="text-xs text-gray-500">Need review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Questions</TabsTrigger>
          <TabsTrigger value="reported">Reported Issues</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Database</CardTitle>
              <CardDescription>
                Search and filter questions from your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid md:grid-cols-5 gap-4">
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">All Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">All Types</option>
                  <option value="MCQ">MCQ</option>
                  <option value="Open">Open</option>
                </select>
                <Button variant="outline">
                  Add Question
                </Button>
              </div>

              {/* Question List */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="max-w-md">
                          <div>
                            <p className="font-medium text-gray-900 truncate">
                              {question.question.length > 100 
                                ? `${question.question.substring(0, 100)}...` 
                                : question.question
                              }
                            </p>
                            <div className="flex gap-1 mt-1">
                              {question.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{question.subject}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{question.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              question.difficulty === 'Easy' ? 'secondary' : 
                              question.difficulty === 'Medium' ? 'default' : 
                              'destructive'
                            }
                          >
                            {question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{question.usageCount}</TableCell>
                        <TableCell className="text-center">
                          {question.reportCount > 0 ? (
                            <Badge variant="destructive">{question.reportCount}</Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="text-sm text-gray-500 text-center">
                Showing {filteredQuestions.length} of {totalQuestions} questions
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reported" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Questions</CardTitle>
              <CardDescription>
                Questions that have been flagged by students for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.filter(q => q.reportCount > 0).map((question) => (
                  <div key={question.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{question.reportCount} Report{question.reportCount > 1 ? 's' : ''}</Badge>
                        <Badge variant="outline">{question.subject}</Badge>
                        <Badge variant="secondary">{question.difficulty}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-900 mb-2">{question.question}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Used {question.usageCount} times • Created {question.createdAt}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Review</Button>
                        <Button variant="ghost" size="sm">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.filter(q => q.reportCount > 0).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No reported questions at this time.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjects.map(subject => {
                    const subjectQuestions = questions.filter(q => q.subject === subject)
                    const totalUsage = subjectQuestions.reduce((sum, q) => sum + q.usageCount, 0)
                    const avgUsage = Math.round(totalUsage / subjectQuestions.length)
                    
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="font-medium">{subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{subjectQuestions.length} questions</span>
                          <Badge variant="secondary">{avgUsage} avg usage</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>High Usage Questions (&gt;40 uses)</span>
                    <Badge variant="secondary">
                      {questions.filter(q => q.usageCount > 40).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Low Usage Questions (&lt;10 uses)</span>
                    <Badge variant="outline">
                      {questions.filter(q => q.usageCount < 10).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Questions Never Used</span>
                    <Badge variant="destructive">
                      {questions.filter(q => q.usageCount === 0).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Report Rate</span>
                    <Badge variant="outline">
                      {Math.round((reportedQuestions / totalQuestions) * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}