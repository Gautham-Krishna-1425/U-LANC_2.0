'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Download, RefreshCw } from 'lucide-react'

interface Task {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  original_size: number
  compressed_size?: number
  compression_ratio?: number
  error_message?: string
  ai_analysis?: any
}

interface TaskStatusProps {
  task: Task
  onCheckStatus: (taskId: string) => Promise<void>
  onDownload: (taskId: string) => void
}

export default function TaskStatus({ task, onCheckStatus, onDownload }: TaskStatusProps) {
  const [isChecking, setIsChecking] = useState(false)

  // Auto-refresh for processing tasks
  useEffect(() => {
    if (task.status === 'processing') {
      const interval = setInterval(() => {
        setIsChecking(true)
        onCheckStatus(task.id).finally(() => setIsChecking(false))
      }, 2000) // Check every 2 seconds

      return () => clearInterval(interval)
    }
  }, [task.status, task.id, onCheckStatus])

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="text-green-400" size={24} />
      case 'processing':
        return <Clock className="text-blue-400 animate-pulse" size={24} />
      case 'failed':
        return <AlertCircle className="text-red-400" size={24} />
      default:
        return <Clock className="text-gray-400" size={24} />
    }
  }

  const getStatusText = () => {
    switch (task.status) {
      case 'completed':
        return 'Compression Completed'
      case 'processing':
        return 'AI Processing...'
      case 'failed':
        return 'Compression Failed'
      default:
        return 'Task Pending'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleManualCheck = async () => {
    setIsChecking(true)
    try {
      await onCheckStatus(task.id)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-white">{getStatusText()}</h3>
            <p className="text-sm text-gray-400">Task ID: {task.id.slice(0, 8)}...</p>
          </div>
        </div>
        
        {task.status === 'processing' && (
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {task.status === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-blue-400 font-medium">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* File Size Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Original Size</h4>
          <p className="text-lg font-bold text-white">{formatFileSize(task.original_size)}</p>
        </div>
        
        {task.compressed_size && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Compressed Size</h4>
            <p className="text-lg font-bold text-green-400">{formatFileSize(task.compressed_size)}</p>
          </div>
        )}
        
        {task.compression_ratio && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Size Reduction</h4>
            <p className="text-lg font-bold text-green-400">{task.compression_ratio.toFixed(1)}%</p>
          </div>
        )}
      </div>

      {/* AI Analysis */}
      {task.ai_analysis && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
            <span>🧠</span>
            AI Analysis Report
          </h4>
          <div className="space-y-2 text-sm">
            {task.ai_analysis.adaptive_mode && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">Adaptive Mode:</span> Enabled
              </p>
            )}
            {task.ai_analysis.important_regions !== undefined && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">Important Regions Detected:</span> {task.ai_analysis.important_regions}
              </p>
            )}
            {task.ai_analysis.neural_compression !== undefined && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">Neural Compression:</span> {task.ai_analysis.neural_compression ? 'Enabled' : 'Fallback Mode'}
              </p>
            )}
            {task.ai_analysis.target_bitrate && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">Target Bitrate:</span> {task.ai_analysis.target_bitrate} kbps
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {task.status === 'failed' && task.error_message && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Compression Failed</span>
          </div>
          <p className="text-red-300 text-sm">{task.error_message}</p>
        </div>
      )}

      {/* Download Button */}
      {task.status === 'completed' && (
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => onDownload(task.id)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download size={16} />
            <span>Download Compressed File</span>
          </button>
        </div>
      )}
    </div>
  )
}