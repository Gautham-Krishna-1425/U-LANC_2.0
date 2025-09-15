'use client'

import { useState } from 'react'
import { Upload, Image, Music, Video, Download, Brain, Settings } from 'lucide-react'
import FileUpload from './components/FileUpload'
import CompressionControls from './components/CompressionControls'
import BeforeAfterViewer from './components/BeforeAfterViewer'
import TaskStatus from './components/TaskStatus'
import { useCompression } from './hooks/useCompression'

type TabType = 'image' | 'audio' | 'video'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('image')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 80,
    adaptiveMode: true,
    bitrate: 6.0
  })

  const { 
    currentTask, 
    uploadFile, 
    checkTaskStatus, 
    downloadFile,
    isLoading,
    error 
  } = useCompression()

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    await uploadFile(file, activeTab, compressionSettings)
  }

  const handleSettingsChange = (newSettings: any) => {
    setCompressionSettings(newSettings)
  }

  const tabs = [
    { id: 'image' as TabType, label: 'Image', icon: Image },
    { id: 'audio' as TabType, label: 'Audio', icon: Music },
    { id: 'video' as TabType, label: 'Video', icon: Video },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            U-LANC
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Universal Lossless-Lossy Adaptive Neural Compression
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="flex justify-center mb-8 bg-gray-800 rounded-lg p-1 shadow-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-center font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Main Content */}
        <main className="space-y-8">
          {/* File Upload Section */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            </div>
            <FileUpload
              fileType={activeTab}
              onFileSelect={handleFileUpload}
              isLoading={isLoading}
            />
          </div>

          {/* Compression Controls */}
          {uploadedFile && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold">Compression Settings</h2>
              </div>
              <CompressionControls
                fileType={activeTab}
                settings={compressionSettings}
                onSettingsChange={handleSettingsChange}
                onStartCompression={() => {
                  if (uploadedFile) {
                    uploadFile(uploadedFile, activeTab, compressionSettings)
                  }
                }}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Task Status */}
          {currentTask && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold">AI Processing</h2>
              </div>
              <TaskStatus
                task={currentTask}
                onCheckStatus={checkTaskStatus}
                onDownload={downloadFile}
              />
            </div>
          )}

          {/* Before/After Viewer */}
          {currentTask && currentTask.status === 'completed' && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Download className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold">Results</h2>
              </div>
              <BeforeAfterViewer
                fileType={activeTab}
                originalFile={uploadedFile}
                task={currentTask}
                onDownload={downloadFile}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="card border-red-500 border-2">
              <div className="text-red-400">
                <h3 className="font-bold text-lg mb-2">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}