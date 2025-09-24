import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Optimizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Optimize your resume with AI-powered suggestions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Resume Optimizer</CardTitle>
              <CardDescription>
                Get started by uploading your resume or creating a new one from scratch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 text-lg" variant="default">
                  Upload Resume
                </Button>
                <Button className="h-20 text-lg" variant="outline">
                  Create New Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
