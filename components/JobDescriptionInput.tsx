'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase } from 'lucide-react'

interface JobDescriptionInputProps {
  jobDescription: string
  onJobDescriptionChange: (description: string) => void
  isProcessing: boolean
}

export default function JobDescriptionInput({ 
  jobDescription, 
  onJobDescriptionChange, 
  isProcessing 
}: JobDescriptionInputProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Description
        </CardTitle>
        <CardDescription>
          Paste the job description for the position you&apos;re applying for
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here... Include key requirements, responsibilities, and qualifications."
          className="min-h-[200px] resize-none"
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {jobDescription.length} characters
        </p>
      </CardContent>
    </Card>
  )
}
