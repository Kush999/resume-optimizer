'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, X } from 'lucide-react'

interface ResumeUploadProps {
  onFileUpload: (file: File) => void
  onFileRemove: () => void
  uploadedFile: File | null
  isProcessing: boolean
}

export default function ResumeUpload({ 
  onFileUpload, 
  onFileRemove, 
  uploadedFile, 
  isProcessing 
}: ResumeUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isProcessing
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Resume
        </CardTitle>
        <CardDescription>
          Upload your resume in PDF or DOCX format
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                Drop your resume here...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <Button variant="outline" disabled={isProcessing}>
                  Choose File
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Supports PDF and DOCX files
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              disabled={isProcessing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
