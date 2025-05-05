"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clipboard, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function InterviewQuestions({ jobDescription, resumeData }: { jobDescription: string, resumeData: any }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateAnswer = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: jobDescription,
          resume: resumeData,
          question: question 
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setAnswer(data.response.text)
      
      toast({
        title: "Success",
        description: "Answer generated successfully",
      })
    } catch (error) {
      console.error("Error generating answer:", error)
      toast({
        title: "Error",
        description: "Failed to generate answer",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!answer) return

    navigator.clipboard.writeText(answer)
    toast({
      title: "Copied",
      description: "Answer copied to clipboard",
    })
  }

  const regenerateAnswer = async () => {
    if (!question.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: jobDescription,
          resume: resumeData,
          question: question 
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setAnswer(data.response.text)
      
      toast({
        title: "Success",
        description: "Answer regenerated successfully",
      })
    } catch (error) {
      console.error("Error regenerating answer:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate answer",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interview-question">Enter an interview question</Label>
            <div className="flex gap-2">
              <Input
                id="interview-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How would you handle a disagreement with a team member?"
              />
              <Button onClick={handleGenerateAnswer} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {answer && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Answer</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white dark:bg-gray-800"
                onClick={copyToClipboard}
              >
                <Clipboard className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white dark:bg-gray-800"
                onClick={regenerateAnswer}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Regenerate answer</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea value={answer} readOnly className="min-h-[200px]" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
