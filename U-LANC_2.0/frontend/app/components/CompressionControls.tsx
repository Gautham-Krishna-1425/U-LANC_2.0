'use client'

import { useState } from 'react'
import { Brain, Settings, Play } from 'lucide-react'

interface CompressionControlsProps {
  fileType: 'image' | 'audio' | 'video'
  settings: {
    quality: number
    adaptiveMode: boolean
    bitrate: number
  }
  onSettingsChange: (settings: any) => void
  onStartCompression: () => void
  isLoading: boolean
}

export default function CompressionControls({
  fileType,
  settings,
  onSettingsChange,
  onStartCompression,
  isLoading
}: CompressionControlsProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleQualityChange = (quality: number) => {
    const newSettings = { ...localSettings, quality }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const handleBitrateChange = (bitrate: number) => {
    const newSettings = { ...localSettings, bitrate }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const handleAdaptiveModeChange = (adaptiveMode: boolean) => {
    const newSettings = { ...localSettings, adaptiveMode }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const getQualityDescription = (quality: number) => {
    if (quality >= 90) return 'Excellent (Near Lossless)'
    if (quality >= 70) return 'High Quality'
    if (quality >= 50) return 'Good Quality'
    if (quality >= 30) return 'Medium Quality'
    return 'Low Quality (High Compression)'
  }

  const getBitrateDescription = (bitrate: number) => {
    if (bitrate >= 20) return 'Crystal Clear (Lossless-like)'
    if (bitrate >= 12) return 'High Quality (Streaming)'
    if (bitrate >= 6) return 'Good (Voice Calls)'
    if (bitrate >= 3) return 'Acceptable (Low Bandwidth)'
    return 'Highly Compressed (Archival)'
  }

  return (
    <div className="space-y-6">
      {/* Quality Controls */}
      {(fileType === 'image' || fileType === 'video') && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Compression Quality: <span className="font-bold text-blue-400">{localSettings.quality}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={localSettings.quality}
            onChange={(e) => handleQualityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <p className="text-xs text-gray-500 mt-1">
            {getQualityDescription(localSettings.quality)}
          </p>
        </div>
      )}

      {/* Audio Bitrate Controls */}
      {fileType === 'audio' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Target Bitrate: <span className="font-bold text-blue-400">{localSettings.bitrate} kbps</span>
          </label>
          <select
            value={localSettings.bitrate}
            onChange={(e) => handleBitrateChange(parseFloat(e.target.value))}
            className="w-full bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={24}>24 kbps - Crystal Clear (Lossless-like)</option>
            <option value={12}>12 kbps - High Quality (Streaming)</option>
            <option value={6}>6 kbps - Good (Voice Calls)</option>
            <option value={3}>3 kbps - Acceptable (Low Bandwidth)</option>
            <option value={1.5}>1.5 kbps - Highly Compressed (Archival)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {getBitrateDescription(localSettings.bitrate)}
          </p>
        </div>
      )}

      {/* Adaptive Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-blue-400" />
            AI Adaptive Mode
          </div>
        </label>
        <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
          <div>
            <span className="text-gray-300 font-medium">
              {fileType === 'image' && 'Preserve Important Regions'}
              {fileType === 'audio' && 'Adaptive Bitrate Allocation'}
              {fileType === 'video' && 'Prioritize Faces & Text'}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {localSettings.adaptiveMode 
                ? 'AI will analyze content and apply different compression levels to different regions'
                : 'Standard compression applied equally to all regions'
              }
            </p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              checked={localSettings.adaptiveMode}
              onChange={(e) => handleAdaptiveModeChange(e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
          </div>
        </div>
      </div>

      {/* Start Compression Button */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={onStartCompression}
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Start Compression</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4A90E2;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4A90E2;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  )
}