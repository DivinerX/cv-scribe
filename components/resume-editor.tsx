"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { jsPDF } from "jspdf"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ResumeEditor({ resumeData }) {
  const [resume, setResume] = useState(resumeData)
  const { toast } = useToast()

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [name]: value,
      },
    })
  }

  const handleSummaryChange = (e) => {
    setResume({
      ...resume,
      summary: e.target.value,
    })
  }

  const handleExperienceChange = (index, field, value) => {
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

  const handleHighlightChange = (expIndex, highlightIndex, value) => {
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

  const handleEducationChange = (index, field, value) => {
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

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...resume.skills]
    updatedSkills[index] = value
    setResume({
      ...resume,
      skills: updatedSkills,
    })
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    // Set font styles
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)

    // Personal Info
    doc.text(resume.personalInfo.name, 105, 20, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(resume.personalInfo.email, 105, 25, { align: "center" })
    doc.text(
      `${resume.personalInfo.phone} | ${resume.personalInfo.location} | ${resume.personalInfo.linkedin}`,
      105,
      30,
      { align: "center" },
    )

    // Summary
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("SUMMARY", 20, 40)
    doc.line(20, 42, 190, 42)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const summaryLines = doc.splitTextToSize(resume.summary, 170)
    doc.text(summaryLines, 20, 47)

    // Experience
    let yPos = 47 + summaryLines.length * 5

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("EXPERIENCE", 20, yPos)
    doc.line(20, yPos + 2, 190, yPos + 2)

    yPos += 7

    resume.experience.forEach((exp) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.text(exp.title, 20, yPos)

      doc.setFont("helvetica", "normal")
      doc.text(`${exp.company}, ${exp.location}`, 120, yPos)

      doc.setFontSize(10)
      doc.text(`${exp.startDate} - ${exp.endDate}`, 170, yPos, { align: "right" })

      yPos += 5

      exp.highlights.forEach((highlight) => {
        const bulletLines = doc.splitTextToSize(`• ${highlight}`, 165)
        doc.text(bulletLines, 25, yPos)
        yPos += bulletLines.length * 5
      })

      yPos += 3
    })

    // Education
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("EDUCATION", 20, yPos)
    doc.line(20, yPos + 2, 190, yPos + 2)

    yPos += 7

    resume.education.forEach((edu) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.text(edu.degree, 20, yPos)

      doc.setFont("helvetica", "normal")
      doc.text(`${edu.institution}, ${edu.location}`, 120, yPos)

      doc.setFontSize(10)
      doc.text(edu.graduationDate, 170, yPos, { align: "right" })

      yPos += 7
    })

    // Skills
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("SKILLS", 20, yPos)
    doc.line(20, yPos + 2, 190, yPos + 2)

    yPos += 7

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const skillsText = resume.skills.join(", ")
    const skillsLines = doc.splitTextToSize(skillsText, 170)
    doc.text(skillsLines, 20, yPos)

    // Save the PDF
    doc.save("resume.pdf")

    toast({
      title: "Success",
      description: "Resume downloaded as PDF",
    })
  }

  const downloadWord = () => {
    // This is a mock function since we can't actually generate Word docs in the browser
    // In a real app, this would call a server endpoint to generate a .docx file

    toast({
      title: "Info",
      description: "Word download would be implemented with a server-side API",
    })
  }

  const saveResume = () => {
    // Mock save function
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
                  <Input id="name" name="name" value={resume.personalInfo.name} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={resume.personalInfo.email}
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
                    value={resume.personalInfo.phone}
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
                    value={resume.personalInfo.location}
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
                    value={resume.personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-medium">Professional Summary</h3>
              <Textarea value={resume.summary} onChange={handleSummaryChange} className="min-h-[80px]" />
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-medium">Experience</h3>
              {resume.experience.map((exp, index) => (
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
                    {exp.highlights.map((highlight, hIndex) => (
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
              {resume.education.map((edu, index) => (
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
                {resume.skills.map((skill, index) => (
                  <Input key={index} value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="max-h-[600px] overflow-y-auto">
            <div className="bg-white text-black p-6 rounded-lg shadow-inner">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold">{resume.personalInfo.name}</h1>
                <p className="text-sm">{resume.personalInfo.email}</p>
                <p className="text-sm">
                  {resume.personalInfo.phone} | {resume.personalInfo.location} | {resume.personalInfo.linkedin}
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-md font-bold border-b border-gray-300 mb-1">SUMMARY</h2>
                <p className="text-sm">{resume.summary}</p>
              </div>

              <div className="mb-4">
                <h2 className="text-md font-bold border-b border-gray-300 mb-1">EXPERIENCE</h2>
                {resume.experience.map((exp, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{exp.title}</h3>
                        <p className="text-sm">
                          {exp.company}, {exp.location}
                        </p>
                      </div>
                      <p className="text-sm">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <ul className="list-disc pl-5 mt-1">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li key={hIndex} className="text-sm">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h2 className="text-md font-bold border-b border-gray-300 mb-1">EDUCATION</h2>
                {resume.education.map((edu, index) => (
                  <div key={index} className="mb-2 flex justify-between">
                    <div>
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      <p className="text-sm">
                        {edu.institution}, {edu.location}
                      </p>
                    </div>
                    <p className="text-sm">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-md font-bold border-b border-gray-300 mb-1">SKILLS</h2>
                <p className="text-sm">{resume.skills.join(", ")}</p>
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
