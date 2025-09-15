'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  fileType: 'image' | 'audio' | 'video'
  onFileSelect: (file: File) => void
  isLoading: boolean
}

const ACCEPTED_TYPES = {
  image: {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  },
  audio: {
    'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']
  },
  video: {
    'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv']
  }
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export default function FileUpload({ fileType, onFileSelect, isLoading }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES[fileType],
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isLoading
  })

  const fileRejectionErrors = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="text-red-400 text-sm mt-2">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} />
        <span className="font-medium">{file.name}</span>
      </div>
      <ul className="ml-6 mt-1">
        {errors.map((error) => (
          <li key={error.code} className="text-xs">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  ))

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-400/10' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gray-700 rounded-full">
            <Upload 
              size={32} 
              className={isDragActive ? 'text-blue-400' : 'text-gray-400'} 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isDragActive ? 'Drop your file here' : `Upload ${fileType} file`}
            </h3>
            <p className="text-gray-400 text-sm">
              Drag and drop your {fileType} file here, or click to browse
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Max file size: 100MB
            </p>
          </div>
        </div>
      </div>

      {fileRejectionErrors.length > 0 && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          {fileRejectionErrors}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span>Uploading file...</span>
        </div>
      )}
    </div>
  )
}