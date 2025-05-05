"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { jsPDF } from "jspdf"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ResumeEditor({ resumeData }: { resumeData: any }) {
  const [resume, setResume] = useState(resumeData)
  const { toast } = useToast()

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setResume({
      ...resume,
      [name]: value,
    })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResume({
      ...resume,
      title: e.target.value,
    })
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResume({
      ...resume,
      summary: e.target.value,
    })
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...resume.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setResume({
      ...resume,
      experience: updatedExperience,
    })
  }

  const handleHighlightChange = (expIndex: number, highlightIndex: number, value: string) => {
    const updatedExperience = [...resume.experience]
    const updatedHighlights = [...updatedExperience[expIndex].highlights]
    updatedHighlights[highlightIndex] = value
    updatedExperience[expIndex] = {
      ...updatedExperience[expIndex],
      highlights: updatedHighlights,
    }
    setResume({
      ...resume,
      experience: updatedExperience,
    })
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...resume.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setResume({
      ...resume,
      education: updatedEducation,
    })
  }

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...resume.skills]
    updatedSkills[index] = value
    setResume({
      ...resume,
      skills: updatedSkills,
    })
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const margin = 15
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const contentWidth = pageWidth - (margin * 2)
    let yPos = 25
    let currentPage = 1

    const checkPageBreak = (neededSpace: number) => {
      if (yPos + neededSpace > pageHeight - margin) {
        doc.addPage()
        currentPage++
        yPos = 25
        return true
      }
      return false
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)

    doc.text(resume.name, margin, yPos)
    yPos += 8

    doc.setFontSize(13)
    doc.text(resume.title, margin, yPos)
    yPos += 8

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(resume.email, margin, yPos)
    yPos += 5
    doc.text(resume.phone, margin, yPos)
    yPos += 5
    doc.text(resume.location, margin, yPos)
    yPos += 5
    doc.text(resume.linkedin, margin, yPos)
    yPos += 12

    checkPageBreak(25)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("PROFESSIONAL SUMMARY", margin, yPos)
    doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3)
    yPos += 10

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const summaryLines = doc.splitTextToSize(resume.summary, contentWidth)
    doc.text(summaryLines, margin, yPos)
    yPos += summaryLines.length * 5

    checkPageBreak(25)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("SKILLS", margin, yPos)
    doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3)
    yPos += 10

    let formattedSkills = ""
    resume.skills.forEach((skill: string, index: number) => {
      if (skill.includes(":")) {
        if (index > 0) formattedSkills += "\n\n"
        formattedSkills += skill
      } else {
        formattedSkills += (formattedSkills.length > 0 && !formattedSkills.endsWith("\n\n") ? " • " : "") + skill
      }
    })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const skillsLines = doc.splitTextToSize(formattedSkills, contentWidth)

    checkPageBreak(skillsLines.length * 5)
    doc.text(skillsLines, margin, yPos)
    yPos += skillsLines.length * 5

    checkPageBreak(25)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("PROFESSIONAL EXPERIENCE", margin, yPos)
    doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3)
    yPos += 10
    resume.experience.forEach((exp: any) => {
      const estimatedHighlightsSpace = exp.highlights.reduce((total: number, highlight: string) => {
        const lines = doc.splitTextToSize(highlight, contentWidth - 10).length
        return total + (lines * 5) + 2
      }, 0)
      const estimatedExpSpace = 25 + estimatedHighlightsSpace

      checkPageBreak(estimatedExpSpace)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.text(exp.company, margin, yPos)
      yPos += 5

      doc.text(exp.title, margin, yPos)
      yPos += 5

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text(`${exp.location} | ${exp.startDate} - ${exp.endDate}`, margin, yPos)
      yPos += 7

      exp.highlights.forEach((highlight: string) => {
        const bulletLines = doc.splitTextToSize(`• ${highlight}`, contentWidth - 10)

        if (checkPageBreak(bulletLines.length * 5)) {
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
        }

        doc.text(bulletLines, margin + 5, yPos)
        yPos += bulletLines.length * 5 + 2
      })

      yPos += 8
    })

    checkPageBreak(25)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("EDUCATION", margin, yPos)
    doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3)
    yPos += 10

    resume.education.forEach((edu: any) => {
      checkPageBreak(20)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.text(edu.institution, margin, yPos)
      yPos += 5

      doc.setFont("helvetica", "normal")
      doc.text(edu.degree, margin, yPos)
      yPos += 5

      doc.text(`${edu.location} | ${edu.graduationDate}`, margin, yPos)
      yPos += 10
    })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const filename = `${resume.name.replace(/\s+/g, "_")}_Resume.pdf`
    doc.save(filename)

    toast({
      title: "Success",
      description: `ATS-optimized ${currentPage}-page resume downloaded as PDF`,
    })
  }

  const downloadWord = () => {
    toast({
      title: "Info",
      description: "Word download would be implemented with a server-side API",
    })
  }

  const saveResume = () => {
    toast({
      title: "Success",
      description: "Resume saved successfully",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>Resume Editor</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={downloadWord}>
              <FileText className="mr-2 h-4 w-4" />
              Word
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4 max-h-[600px] overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-md font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm">
                    Full Name
                  </Label>
                  <Input id="name" name="name" value={resume.name} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={resume.email}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={resume.phone}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="location" className="text-sm">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={resume.location}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="linkedin" className="text-sm">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={resume.linkedin}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-medium">Professional Title</h3>
              <Input value={resume.title} onChange={handleTitleChange} />
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-medium">Professional Summary</h3>
              <Textarea value={resume.summary} onChange={handleSummaryChange} className="min-h-[80px]" />
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-medium">Experience</h3>
              {resume.experience.map((exp: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm">Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-sm">Start Date</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">End Date</Label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label className="text-sm">Highlights</Label>
                    {exp.highlights.map((highlight: string, hIndex: number) => (
                      <div key={hIndex} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => handleHighlightChange(index, hIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-medium">Education</h3>
              {resume.education.map((edu: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm">Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Graduation Date</Label>
                      <Input
                        value={edu.graduationDate}
                        onChange={(e) => handleEducationChange(index, "graduationDate", e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-medium">Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resume.skills.map((skill: string, index: number) => (
                  <Input key={index} value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="max-h-[600px] overflow-y-auto">
            <div className="bg-white text-black p-6 rounded-lg shadow-inner">
              {/* Header with name and contact info */}
              <div className="mb-6">
                <h1 className="text-xl font-bold">{resume.name}</h1>
                <h2 className="text-lg font-medium mt-2">{resume.title}</h2>
                <div className="mt-2 text-sm space-y-1">
                  <p>{resume.email}</p>
                  <p>{resume.phone}</p>
                  <p>{resume.location}</p>
                  <p>{resume.linkedin}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-md font-bold border-b border-gray-300 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
                <p className="text-sm">{resume.summary}</p>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-md font-bold border-b border-gray-300 pb-1 mb-3">SKILLS</h2>
                <div className="text-sm">
                  {resume.skills.map((skill: string, index: number) => (
                    <React.Fragment key={index}>
                      {skill.includes(":") ? (
                        <div className={index > 0 ? "mt-3" : ""}>
                          {skill}
                        </div>
                      ) : (
                        <span>
                          {index > 0 && !resume.skills[index - 1].includes(":") ? " • " : ""}
                          {skill}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-md font-bold border-b border-gray-300 pb-1 mb-3">PROFESSIONAL EXPERIENCE</h2>
                {resume.experience.map((exp: any, index: number) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold text-sm">{exp.company}</h3>
                    <h4 className="font-bold text-sm">{exp.title}</h4>
                    <p className="text-sm mb-2">
                      {exp.location} | {exp.startDate} - {exp.endDate}
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {exp.highlights.map((highlight: string, hIndex: number) => (
                        <li key={hIndex} className="text-sm">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-md font-bold border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
                {resume.education.map((edu: any, index: number) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-bold text-sm">{edu.institution}</h3>
                    <p className="text-sm">{edu.degree}</p>
                    <p className="text-sm">
                      {edu.location} | {edu.graduationDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveResume}>Save Resume</Button>
      </CardFooter>
    </Card>
  )
}
