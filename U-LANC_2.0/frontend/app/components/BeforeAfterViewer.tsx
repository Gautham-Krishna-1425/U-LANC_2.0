'use client'

import { useState } from 'react'
import { Download, Eye, EyeOff, Image, Music, Video } from 'lucide-react'

interface Task {
  id: string
  original_size: number
  compressed_size?: number
  compression_ratio?: number
  ai_analysis?: any
}

interface BeforeAfterViewerProps {
  fileType: 'image' | 'audio' | 'video'
  originalFile: File | null
  task: Task
  onDownload: (taskId: string) => void
}

export default function BeforeAfterViewer({
  fileType,
  originalFile,
  task,
  onDownload
}: BeforeAfterViewerProps) {
  const [showComparison, setShowComparison] = useState(true)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)

  // Create object URL for original file
  useState(() => {
    if (originalFile) {
      const url = URL.createObjectURL(originalFile)
      setOriginalUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image size={24} className="text-blue-400" />
      case 'audio':
        return <Music size={24} className="text-blue-400" />
      case 'video':
        return <Video size={24} className="text-blue-400" />
    }
  }

  const renderFilePreview = (file: File | null, isOriginal: boolean) => {
    if (!file) return null

    const size = isOriginal ? task.original_size : task.compressed_size
    const label = isOriginal ? 'Original' : 'Compressed'
    const sizeColor = isOriginal ? 'text-white' : 'text-green-400'

    switch (fileType) {
      case 'image':
        return (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={isOriginal && originalUrl ? originalUrl : '#'}
                alt={`${label} image`}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop'
                }}
              />
              {!isOriginal && task.ai_analysis?.important_regions > 0 && (
                <div className="absolute top-2 left-2 bg-blue-500/80 text-white px-2 py-1 rounded text-xs">
                  AI Enhanced
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">{label} Size</p>
              <p className={`font-bold ${sizeColor}`}>{formatFileSize(size || 0)}</p>
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="space-y-3">
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              {getFileIcon()}
              <p className="text-sm text-gray-400 mt-2">{file.name}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-400">{label} Size</p>
                <p className={`font-bold ${sizeColor}`}>{formatFileSize(size || 0)}</p>
              </div>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-3">
            <div className="relative">
              <video
                src={isOriginal && originalUrl ? originalUrl : '#'}
                className="w-full h-auto rounded-lg"
                controls
                poster="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&auto=format&fit=crop"
              />
              {!isOriginal && task.ai_analysis?.important_regions > 0 && (
                <div className="absolute top-2 left-2 bg-blue-500/80 text-white px-2 py-1 rounded text-xs">
                  AI Enhanced
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">{label} Size</p>
              <p className={`font-bold ${sizeColor}`}>{formatFileSize(size || 0)}</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Toggle Comparison View */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Compression Results</h3>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="btn-secondary flex items-center gap-2"
        >
          {showComparison ? <EyeOff size={16} /> : <Eye size={16} />}
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </button>
      </div>

      {/* Comparison Grid */}
      {showComparison ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-xl font-semibold mb-3 text-center text-white">Before</h4>
            {renderFilePreview(originalFile, true)}
          </div>

          {/* Compressed */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-xl font-semibold mb-3 text-center text-green-400">After</h4>
            {renderFilePreview(originalFile, false)}
          </div>
        </div>
      ) : (
        /* Single View */
        <div className="bg-gray-800 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4 text-center text-green-400">Compressed Result</h4>
          {renderFilePreview(originalFile, false)}
        </div>
      )}

      {/* Compression Statistics */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Compression Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">Original Size</p>
            <p className="text-xl font-bold text-white">{formatFileSize(task.original_size)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Compressed Size</p>
            <p className="text-xl font-bold text-green-400">{formatFileSize(task.compressed_size || 0)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Size Reduction</p>
            <p className="text-xl font-bold text-green-400">{task.compression_ratio?.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Summary */}
      {task.ai_analysis && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <span>🧠</span>
            AI Analysis Summary
          </h4>
          <div className="space-y-2 text-sm">
            {task.ai_analysis.adaptive_mode && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">✓ Adaptive Compression:</span> AI analyzed the content and applied different compression levels to different regions
              </p>
            )}
            {task.ai_analysis.important_regions > 0 && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">✓ Important Regions:</span> {task.ai_analysis.important_regions} regions were identified and preserved with higher quality
              </p>
            )}
            {task.ai_analysis.neural_compression && (
              <p className="text-gray-300">
                <span className="text-green-400 font-medium">✓ Neural Compression:</span> Advanced AI models were used for optimal compression
              </p>
            )}
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={() => onDownload(task.id)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Download size={16} />
          <span>Download Compressed File</span>
        </button>
      </div>
    </div>
  )
}