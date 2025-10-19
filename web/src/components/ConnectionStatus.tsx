import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface ConnectionStatusProps {
  className?: string
}

export default function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    try {
      setStatus('checking')
      await apiClient.getHealth()
      setStatus('connected')
      setLastChecked(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
      setStatus('disconnected')
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkHealth()
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-3 w-3 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...'
      case 'connected':
        return 'Connected'
      case 'disconnected':
        return 'Disconnected'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600'
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-red-600'
    }
  }

  return (
    <div className={`flex items-center space-x-1 text-xs ${className}`}>
      {getStatusIcon()}
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
      {lastChecked && (
        <span className="text-gray-400">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
    </div>
  )
}
