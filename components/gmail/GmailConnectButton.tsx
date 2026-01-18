'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface GmailConnectButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function GmailConnectButton({
  className,
  variant = 'default',
  size = 'default'
}: GmailConnectButtonProps) {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/auth/gmail/status')
      if (response.ok) {
        const data = await response.json()
        setConnected(data.connected)
      }
    } catch (error) {
      console.error('Error checking Gmail connection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    window.location.href = '/api/auth/gmail'
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/auth/gmail/disconnect', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect')
      }

      setConnected(false)
      toast.success('Gmail disconnected')
    } catch (error) {
      console.error('Error disconnecting Gmail:', error)
      toast.error('Failed to disconnect Gmail')
    }
  }

  if (loading) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (connected) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleDisconnect}
        className={className}
      >
        <Mail className="w-4 h-4 mr-2" />
        Disconnect Gmail
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleConnect}
      className={className}
    >
      <Mail className="w-4 h-4 mr-2" />
      Connect Gmail
    </Button>
  )
}
