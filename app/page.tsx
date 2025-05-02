import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Create ATS-Optimized Resumes with AI</h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          CV Assist helps you create tailored resumes for specific job descriptions, prepare for interviews, and track
          your applications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/signin">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">ATS-Optimized Resumes</h3>
          <p className="text-muted-foreground">
            Our AI ensures your resume passes through Applicant Tracking Systems with the right keywords and formatting.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Interview Preparation</h3>
          <p className="text-muted-foreground">
            Get AI-generated answers to common interview questions tailored to the job you're applying for.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Application Tracking</h3>
          <p className="text-muted-foreground">
            Keep track of all your job applications, their statuses, and important dates in one place.
          </p>
        </div>
      </div>
    </div>
  )
}
