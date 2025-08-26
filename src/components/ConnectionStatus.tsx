import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setStatus('checking')
      setError('')
      
      // Test connection by trying to fetch from a table
      const { error } = await supabase.from('socios').select('count').limit(1)
      
      if (error) {
        throw error
      }
      
      setStatus('connected')
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Error de conexión')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando conexión...'
      case 'connected':
        return 'Conectado a Supabase'
      case 'error':
        return `Error: ${error}`
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
    }
  }

  return (
    <div className={`border rounded-lg p-3 mb-4 flex items-center gap-2 ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
      {status === 'error' && (
        <button
          onClick={checkConnection}
          className="ml-auto text-sm underline hover:no-underline"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}