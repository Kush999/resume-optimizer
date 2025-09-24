'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Copy, Check, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ResumeTextDisplayProps {
  extractedText: string
  fileName: string
  jobDescription?: string
}

export default function ResumeTextDisplay({ extractedText, fileName, jobDescription }: ResumeTextDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'resume' | 'job'>('resume')

  const handleCopy = async () => {
    const textToCopy = activeTab === 'resume' ? extractedText : jobDescription || ''
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Analysis
        </CardTitle>
        <CardDescription>
          Resume text and job description for optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'resume'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              Resume ({extractedText.length} chars)
            </button>
            {jobDescription && (
              <button
                onClick={() => setActiveTab('job')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'job'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Job Description ({jobDescription.length} chars)
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab === 'resume' 
                  ? `Text extracted from ${fileName}`
                  : 'Job description for the position you\'re applying for'
                }
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Text
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {activeTab === 'resume' 
                  ? (extractedText || 'No text extracted from the file.')
                  : (jobDescription || 'No job description provided.')
                }
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
