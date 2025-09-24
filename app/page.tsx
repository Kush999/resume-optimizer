'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ResumeUpload from "@/components/ResumeUpload"
import ResumeTextDisplay from "@/components/ResumeTextDisplay"
import { parseFile, ParseResult } from "@/lib/fileParser"
import { AlertCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setError('')
    setExtractedText('')
    setParseResult(null)
    setIsProcessing(true)

    try {
      const result = await parseFile(file)
      setParseResult(result)
      
      if (result.success) {
        setExtractedText(result.text)
      } else {
        setError(result.error || 'Failed to parse file')
      }
    } catch (err) {
      setError('An unexpected error occurred while parsing the file')
      console.error('File parsing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    setExtractedText('')
    setError('')
    setParseResult(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Optimizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Upload your PDF or DOCX resume to extract and analyze the text content
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <ResumeUpload
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            uploadedFile={uploadedFile}
            isProcessing={isProcessing}
          />

          {/* Processing State */}
          {isProcessing && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Processing your resume...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="flex items-center gap-3 py-4">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Extracted Text Display */}
          {extractedText && uploadedFile && !isProcessing && (
            <ResumeTextDisplay
              extractedText={extractedText}
              fileName={uploadedFile.name}
            />
          )}

          {/* Welcome Message */}
          {!uploadedFile && !isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Upload your resume to begin the optimization process. We support PDF and DOCX files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-2xl mb-2">📄</div>
                    <h3 className="font-semibold mb-1">Upload Resume</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop or click to upload your resume file
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="font-semibold mb-1">Text Extraction</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We&apos;ll extract all text content from your resume
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">✨</div>
                    <h3 className="font-semibold mb-1">Optimization</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get AI-powered suggestions to improve your resume
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
