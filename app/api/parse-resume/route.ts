import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'API route is working' })
}

export async function POST(request: NextRequest) {
  console.log('API route called')
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('File received:', file?.name, file?.type, file?.size)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Use dynamic import to avoid module loading issues
        const PDFParser = (await import('pdf2json')).default
        const pdfParser = new PDFParser()
        
        return new Promise((resolve) => {
          pdfParser.on('pdfParser_dataError', (errData: any) => {
            console.error('PDF parsing error:', errData.parserError)
            resolve(NextResponse.json({
              success: false,
              error: 'Failed to parse PDF file. Please ensure the PDF is not corrupted.'
            }, { status: 400 }))
          })
          
          pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            try {
              // Extract text from PDF data
              let extractedText = ''
              
              if (pdfData.Pages) {
                pdfData.Pages.forEach((page: any) => {
                  if (page.Texts) {
                    page.Texts.forEach((text: any) => {
                      if (text.R) {
                        text.R.forEach((run: any) => {
                          if (run.T) {
                            extractedText += decodeURIComponent(run.T) + ' '
                          }
                        })
                      }
                    })
                  }
                })
              }
              
              resolve(NextResponse.json({
                success: true,
                text: extractedText.trim()
              }))
            } catch (parseError) {
              console.error('PDF data parsing error:', parseError)
              resolve(NextResponse.json({
                success: false,
                error: 'Failed to extract text from PDF data.'
              }, { status: 400 }))
            }
          })
          
          pdfParser.parseBuffer(buffer)
        })
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError)
        return NextResponse.json({
          success: false,
          error: 'Failed to parse PDF file. Please ensure the PDF is valid and not password-protected.'
        }, { status: 400 })
      }
    }
    
    // Handle DOCX files
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.endsWith('.docx')) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const mammoth = (await import('mammoth')).default
        
        const result = await mammoth.extractRawText({ buffer: arrayBuffer })
        
        return NextResponse.json({
          success: true,
          text: result.value
        })
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError)
        return NextResponse.json({
          success: false,
          error: 'Failed to parse DOCX file. Please ensure the file is valid.'
        }, { status: 400 })
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unsupported file type. Please upload a PDF or DOCX file.'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('File parsing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: `Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    )
  }
}
