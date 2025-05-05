"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ResumeEditor } from "@/components/resume-editor"
import { InterviewQuestions } from "@/components/interview-questions"
import { ApplicationLogger } from "@/components/application-logger"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CreateResume() {
  const [jobDescription, setJobDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeGenerated, setResumeGenerated] = useState(false)
  const [resumeData, setResumeData] = useState(null)
  const { toast } = useToast()

  const handleGenerateResume = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobDescription }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data.resume:", data.resume)
        if (data.resume) {
          setResumeData(data.resume)
          setResumeGenerated(true)
          toast({
            title: "Success",
            description: "Resume generated successfully",
          })
        } else if (data.error) {
          throw new Error(data.error)
        }
      })
      .catch((error) => {
        console.error("Error generating resume:", error)
        toast({
          title: "Error",
          description: "Failed to generate resume",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsGenerating(false)
      })
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Tailored Resume</h1>
        <p className="text-muted-foreground">Enter a job description to generate an ATS-optimized resume</p>
      </div>

      <ApplicationLogger />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Paste the job description to tailor your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste job description here..."
                className="min-h-[300px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateResume} disabled={isGenerating} className="ml-auto">
                {isGenerating ? "Generating..." : "Generate Resume"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Output */}
        <div>
          {resumeGenerated ? (
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="interview">Interview Prep</TabsTrigger>
              </TabsList>
              <TabsContent value="resume">
                <ResumeEditor resumeData={resumeData} />
              </TabsContent>
              <TabsContent value="interview">
                <InterviewQuestions jobDescription={jobDescription} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center text-muted-foreground">
                <p>Enter a job description and click "Generate Resume" to create your tailored resume.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
