'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ResumeTextDisplayProps {
  extractedText: string
  fileName: string
}

export default function ResumeTextDisplay({ extractedText, fileName }: ResumeTextDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractedText)
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
          Extracted Text
        </CardTitle>
        <CardDescription>
          Text extracted from {fileName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {extractedText.length} characters extracted
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
              {extractedText || 'No text extracted from the file.'}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
