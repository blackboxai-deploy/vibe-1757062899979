'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AnalyticsDashboard() {
  const studentData = {
    totalStudents: 47,
    activeThisWeek: 32,
    averageScore: 78.5,
    completionRate: 85.2
  }

  const moduleUsage = [
    { name: 'Code Evaluation', usage: 65, avgScore: 82.3 },
    { name: 'Code Review', usage: 45, avgScore: 76.8 },
    { name: 'Exam AI', usage: 38, avgScore: 74.1 }
  ]

  const performanceByDifficulty = [
    { level: 'Easy', avgScore: 89.2, attempts: 234 },
    { level: 'Medium', avgScore: 75.6, attempts: 198 },
    { level: 'Hard', avgScore: 62.4, attempts: 156 }
  ]

  const recentActivity = [
    { student: 'Student #42', module: 'Code Evaluation', score: 85, timestamp: '2 hours ago' },
    { student: 'Student #38', module: 'Exam AI', score: 72, timestamp: '3 hours ago' },
    { student: 'Student #51', module: 'Code Review', score: 91, timestamp: '4 hours ago' },
    { student: 'Student #29', module: 'Code Evaluation', score: 68, timestamp: '5 hours ago' },
    { student: 'Student #44', module: 'Exam AI', score: 83, timestamp: '6 hours ago' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Monitor student performance and system usage across all modules.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{studentData.totalStudents}</div>
            <p className="text-xs text-gray-500">
              +{studentData.activeThisWeek} active this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{studentData.averageScore}</div>
            <p className="text-xs text-gray-500">Out of 100</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{studentData.completionRate}%</div>
            <p className="text-xs text-gray-500">Students completing assessments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">73.2%</div>
            <p className="text-xs text-gray-500">Scores above 70</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Performance</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty Analysis</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Student performance across all assessments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Excellent (90-100)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '23%'}} />
                      </div>
                      <span className="text-sm text-gray-600">23%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Good (80-89)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '34%'}} />
                      </div>
                      <span className="text-sm text-gray-600">34%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fair (70-79)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '28%'}} />
                      </div>
                      <span className="text-sm text-gray-600">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Poor (Below 70)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '15%'}} />
                      </div>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>Assessment activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">This Week</span>
                    <Badge variant="secondary">156 assessments</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Week</span>
                    <Badge variant="outline">142 assessments</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">+9.9%</Badge>
                  </div>
                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Peak Usage Times</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div key="morning">• 10:00-12:00: 32% of daily activity</div>
                      <div key="afternoon">• 14:00-16:00: 28% of daily activity</div>
                      <div key="evening">• 19:00-21:00: 25% of daily activity</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Performance Comparison</CardTitle>
              <CardDescription>Usage statistics and average scores by module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {moduleUsage.map((module, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{module.name}</span>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{module.usage} users</Badge>
                        <Badge variant="secondary">Avg: {module.avgScore}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={(module.usage / 70) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Usage Rate</span>
                        <span>{Math.round((module.usage / 70) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty Level</CardTitle>
              <CardDescription>How students perform across different question difficulties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceByDifficulty.map((level, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            level.level === 'Easy' ? 'secondary' : 
                            level.level === 'Medium' ? 'default' : 
                            'destructive'
                          }
                        >
                          {level.level}
                        </Badge>
                        <span className="font-medium text-gray-900">Average Score: {level.avgScore}</span>
                      </div>
                      <span className="text-sm text-gray-600">{level.attempts} attempts</span>
                    </div>
                    <Progress value={level.avgScore} className="h-3" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Insights</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li key="easy-perf">• Easy questions show consistent high performance (89.2% avg)</li>
                  <li key="medium-perf">• Medium questions indicate good understanding with room for improvement</li>
                  <li key="hard-perf">• Hard questions reveal areas where additional instruction may be needed</li>
                  <li key="engagement">• Lower attempt rates on hard questions suggest some students skip challenging content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Student Activity</CardTitle>
              <CardDescription>Latest assessment submissions and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {activity.student.replace('Student #', '')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.student}</div>
                        <div className="text-sm text-gray-600">{activity.module}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={activity.score >= 80 ? 'secondary' : activity.score >= 60 ? 'default' : 'destructive'}
                      >
                        {activity.score}/100
                      </Badge>
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}