'use client'

import { useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface CompressionSettings {
  quality: number
  adaptiveMode: boolean
  bitrate: number
}

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

export function useCompression() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (
    file: File,
    fileType: 'image' | 'audio' | 'video',
    settings: CompressionSettings
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      let endpoint = ''
      let params: any = {}

      switch (fileType) {
        case 'image':
          endpoint = '/upload/image'
          params = {
            quality: settings.quality,
            adaptive_mode: settings.adaptiveMode
          }
          break
        case 'audio':
          endpoint = '/upload/audio'
          params = {
            bitrate: settings.bitrate
          }
          break
        case 'video':
          endpoint = '/upload/video'
          params = {
            quality: settings.quality,
            adaptive_mode: settings.adaptiveMode
          }
          break
      }

      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        formData,
        {
          params,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const { task_id } = response.data
      
      // Create initial task object
      const newTask: Task = {
        id: task_id,
        status: 'processing',
        progress: 0,
        original_size: file.size,
      }
      
      setCurrentTask(newTask)
      
      // Start polling for status updates
      pollTaskStatus(task_id)
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Upload failed'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkTaskStatus = useCallback(async (taskId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/task/${taskId}`)
      const taskData = response.data
      
      const updatedTask: Task = {
        id: taskData.task_id,
        status: taskData.status,
        progress: taskData.progress || 0,
        original_size: taskData.original_size,
        compressed_size: taskData.compressed_size,
        compression_ratio: taskData.compression_ratio,
        error_message: taskData.error,
        ai_analysis: taskData.ai_analysis
      }
      
      setCurrentTask(updatedTask)
      
      // Continue polling if still processing
      if (taskData.status === 'processing') {
        setTimeout(() => pollTaskStatus(taskId), 2000)
      }
      
      return updatedTask
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to check task status'
      setError(errorMessage)
      console.error('Status check error:', err)
      throw err
    }
  }, [])

  const pollTaskStatus = useCallback((taskId: string) => {
    checkTaskStatus(taskId).catch((err) => {
      console.error('Polling error:', err)
    })
  }, [checkTaskStatus])

  const downloadFile = useCallback(async (taskId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/download/${taskId}`,
        { responseType: 'blob' }
      )
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Extract filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'compressed_file'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Download failed'
      setError(errorMessage)
      console.error('Download error:', err)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const resetTask = useCallback(() => {
    setCurrentTask(null)
    setError(null)
  }, [])

  return {
    currentTask,
    isLoading,
    error,
    uploadFile,
    checkTaskStatus,
    downloadFile,
    clearError,
    resetTask
  }
}