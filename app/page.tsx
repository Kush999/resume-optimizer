'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ResumeUpload from "@/components/ResumeUpload"
import ResumeTextDisplay from "@/components/ResumeTextDisplay"
import JobDescriptionInput from "@/components/JobDescriptionInput"
import { parseFile, ParseResult } from "@/lib/fileParser"
import { AlertCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string>('')
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string>('')

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setError('')
    setExtractedText('')
    setParseResult(null)
    setIsProcessing(true)

    try {
      const result = await parseFile(file, jobDescription)
      setParseResult(result)
      
      if (result.success) {
        setExtractedText(result.text)
        // Update job description from result if it was processed
        if (result.jobDescription) {
          setJobDescription(result.jobDescription)
        }
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

  const handleJobDescriptionChange = (description: string) => {
    setJobDescription(description)
  }

  const handleGenerateAnalysis = async () => {
    if (!uploadedFile || !jobDescription) return
    
    setIsAnalyzing(true)
    setError('')
    setAnalysisResult('')

    try {
      // For now, we'll create a simple analysis
      // In the future, this could call an AI service
      const analysis = await generateAnalysis(extractedText, jobDescription)
      setAnalysisResult(analysis)
    } catch (err) {
      setError('Failed to generate analysis. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateAnalysis = async (resumeText: string, jobDesc: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simple analysis logic - in a real app, this would call an AI service
    const resumeWords = resumeText.toLowerCase().split(/\s+/)
    const jobWords = jobDesc.toLowerCase().split(/\s+/)
    
    const commonWords = resumeWords.filter(word => 
      jobWords.includes(word) && word.length > 3
    )
    
    const uniqueCommonWords = Array.from(new Set(commonWords))
    
    return `## Resume Analysis Report

### Key Matches Found
${uniqueCommonWords.length > 0 ? uniqueCommonWords.slice(0, 10).map(word => `- ${word}`).join('\n') : 'No significant keyword matches found'}

### Resume Length
- Characters: ${resumeText.length}
- Words: ${resumeWords.length}

### Job Description Length
- Characters: ${jobDesc.length}
- Words: ${jobWords.length}

### Match Percentage
- Keyword overlap: ${((uniqueCommonWords.length / jobWords.length) * 100).toFixed(1)}%

### Recommendations
1. Add more relevant keywords from the job description
2. Highlight specific skills mentioned in the job posting
3. Quantify your achievements with numbers and metrics
4. Use action verbs that match the job requirements

### Next Steps
- Review the job description requirements
- Update your resume to better align with the position
- Consider adding specific examples of your relevant experience`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Optimizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Upload your PDF or DOCX resume and provide a job description to optimize your application
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Input Sections - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Description Input */}
            <JobDescriptionInput
              jobDescription={jobDescription}
              onJobDescriptionChange={handleJobDescriptionChange}
              isProcessing={isProcessing}
            />

            {/* Upload Section */}
            <ResumeUpload
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              uploadedFile={uploadedFile}
              isProcessing={isProcessing}
            />
          </div>

          {/* Generate Analysis Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateAnalysis}
              size="lg"
              className="px-8 py-3 text-lg"
              disabled={!uploadedFile || !jobDescription || isProcessing || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                'Generate Analysis'
              )}
            </Button>
          </div>

          {/* Processing State */}
          {(isProcessing || isAnalyzing) && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {isProcessing ? 'Processing your resume...' : 'Generating analysis...'}
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

          {/* Analysis Results */}
          {analysisResult && !isAnalyzing && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Resume analysis based on the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {analysisResult}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Text Display */}
          {extractedText && uploadedFile && !isProcessing && !isAnalyzing && (
            <ResumeTextDisplay
              extractedText={extractedText}
              fileName={uploadedFile.name}
              jobDescription={jobDescription}
            />
          )}

          {/* Welcome Message */}
          {!uploadedFile && !isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Provide a job description and upload your resume to begin the optimization process. We support PDF and DOCX files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-2xl mb-2">💼</div>
                    <h3 className="font-semibold mb-1">Job Description</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Paste the job description for the position you&apos;re applying for
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">📄</div>
                    <h3 className="font-semibold mb-1">Upload Resume</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop or click to upload your resume file
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="font-semibold mb-1">Generate Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click the button to analyze your resume against the job
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
