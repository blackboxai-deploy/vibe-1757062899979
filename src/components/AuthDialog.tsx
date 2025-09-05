'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
  onAuthenticate: () => void
}

export function AuthDialog({ open, onClose, onAuthenticate }: AuthDialogProps) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (passcode === '422025') {
      onAuthenticate()
      setPasscode('')
    } else {
      setError('Invalid passcode. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleClose = () => {
    setPasscode('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Professor Authentication</DialogTitle>
          <DialogDescription>
            Enter your passcode to access professor features including prompt editing and system management.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="passcode" className="text-sm font-medium">
              Passcode
            </label>
            <Input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter professor passcode"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !passcode}
              className="flex-1"
            >
              {isLoading ? 'Authenticating...' : 'Access System'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}