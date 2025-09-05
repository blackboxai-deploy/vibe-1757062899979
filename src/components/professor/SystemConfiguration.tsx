'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface SystemSettings {
  aiProvider: string
  defaultModel: string
  temperature: number
  maxTokens: number
  enableMultilingual: boolean
  defaultLanguage: string
  examTimeLimit: number
  maxQuestions: number
  enableAntiCheating: boolean
  allowQuestionReporting: boolean
  autoSaveInterval: number
  sessionTimeout: number
}

export function SystemConfiguration() {
  const [settings, setSettings] = useState<SystemSettings>({
    aiProvider: 'OpenRouter',
    defaultModel: 'claude-sonnet-4',
    temperature: 0.5,
    maxTokens: 2000,
    enableMultilingual: true,
    defaultLanguage: 'English',
    examTimeLimit: 30,
    maxQuestions: 20,
    enableAntiCheating: true,
    allowQuestionReporting: true,
    autoSaveInterval: 30,
    sessionTimeout: 60
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    setSettings({
      aiProvider: 'OpenRouter',
      defaultModel: 'claude-sonnet-4',
      temperature: 0.5,
      maxTokens: 2000,
      enableMultilingual: true,
      defaultLanguage: 'English',
      examTimeLimit: 30,
      maxQuestions: 20,
      enableAntiCheating: true,
      allowQuestionReporting: true,
      autoSaveInterval: 30,
      sessionTimeout: 60
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Configuration</h2>
        <p className="text-gray-600">Configure AI models, exam settings, and system behavior.</p>
      </div>

      {saveSuccess && (
        <Alert>
          <AlertDescription>
            System configuration has been saved successfully! Changes will take effect immediately.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="exam">Exam Configuration</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Configure the AI provider and model settings for all modules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ai-provider">AI Provider</Label>
                  <select
                    id="ai-provider"
                    value={settings.aiProvider}
                    onChange={(e) => updateSetting('aiProvider', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="OpenRouter">OpenRouter</option>
                    <option value="Anthropic">Anthropic Direct</option>
                    <option value="OpenAI">OpenAI Direct</option>
                    <option value="Replicate">Replicate</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-model">Default Model</Label>
                  <select
                    id="default-model"
                    value={settings.defaultModel}
                    onChange={(e) => updateSetting('defaultModel', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="claude-sonnet-4">Claude Sonnet 4</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-haiku-3">Claude Haiku 3</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">
                    Controls randomness (0.0 = deterministic, 1.0 = creative)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={settings.maxTokens}
                    onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">
                    Maximum response length per API call
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Current API Configuration</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">https://oi-server.onrender.com/chat/completions</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Format:</span>
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">openrouter/{settings.defaultModel}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <Badge variant="secondary">{settings.temperature}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exam" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
              <CardDescription>
                Configure default exam parameters and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="exam-time-limit">Default Time Limit (minutes)</Label>
                  <Input
                    id="exam-time-limit"
                    type="number"
                    min="5"
                    max="180"
                    value={settings.examTimeLimit}
                    onChange={(e) => updateSetting('examTimeLimit', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-questions">Maximum Questions per Exam</Label>
                  <Input
                    id="max-questions"
                    type="number"
                    min="5"
                    max="50"
                    value={settings.maxQuestions}
                    onChange={(e) => updateSetting('maxQuestions', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Anti-Cheating Measures</Label>
                    <p className="text-sm text-gray-500">
                      Randomize question and answer order for each student
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAntiCheating}
                    onCheckedChange={(checked) => updateSetting('enableAntiCheating', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Question Reporting</Label>
                    <p className="text-sm text-gray-500">
                      Students can report problematic questions for review
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowQuestionReporting}
                    onCheckedChange={(checked) => updateSetting('allowQuestionReporting', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Behavior</CardTitle>
              <CardDescription>
                Configure general system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Multilingual Support</Label>
                    <p className="text-sm text-gray-500">
                      Support for multiple languages in the interface
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableMultilingual}
                    onCheckedChange={(checked) => updateSetting('enableMultilingual', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <select
                    id="default-language"
                    value={settings.defaultLanguage}
                    onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    disabled={!settings.enableMultilingual}
                  >
                    <option value="English">English</option>
                    <option value="French">Français</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="auto-save">Auto-save Interval (seconds)</Label>
                  <Input
                    id="auto-save"
                    type="number"
                    min="10"
                    max="300"
                    value={settings.autoSaveInterval}
                    onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="15"
                    max="480"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" key="status-indicator" />
                    <span className="font-semibold text-green-900">Professor Authentication</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Current passcode: <code className="bg-green-100 px-2 py-1 rounded">422025</code>
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Access Logs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Last professor login</span>
                      <Badge variant="outline">2 hours ago</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Active student sessions</span>
                      <Badge variant="secondary">12 users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Failed authentication attempts</span>
                      <Badge variant="destructive">0 today</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Security Recommendations</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li key="passcode">• Consider changing the professor passcode periodically</li>
                    <li key="sessions">• Monitor active sessions regularly</li>
                    <li key="logs">• Review access logs for suspicious activity</li>
                    <li key="timeouts">• Use appropriate session timeouts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            Export Settings
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving Configuration...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}