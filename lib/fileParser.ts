export interface ParseResult {
  text: string
  success: boolean
  error?: string
  jobDescription?: string
}

export async function parseFile(file: File, jobDescription?: string): Promise<ParseResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (jobDescription) {
      formData.append('jobDescription', jobDescription)
    }

    console.log('Sending file to API:', file.name, file.type, file.size)
    console.log('Job description length:', jobDescription?.length || 0)

    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData,
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.log('Non-JSON response:', text.substring(0, 200))
      return {
        text: '',
        success: false,
        error: `Server returned non-JSON response: ${text.substring(0, 100)}...`
      }
    }

    const result = await response.json()
    console.log('API result:', result)

    if (!response.ok) {
      return {
        text: '',
        success: false,
        error: result.error || 'Failed to parse file'
      }
    }

    return {
      text: result.text || '',
      success: result.success,
      error: result.error,
      jobDescription: result.jobDescription
    }
  } catch (error) {
    console.error('Parse error:', error)
    return {
      text: '',
      success: false,
      error: `Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
