"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"

interface IProfile {
  name: string
  email: string
  phone: string
  location: string
  birthday: string | undefined
  github: string
  linkedin: string
  website: string
  education: string
  skills: string
  projects: string
  experience: string
}

export default function ProfilePage() {
  const { user } = useUser()
  const { toast } = useToast()

  const [profile, setProfile] = useState<IProfile>({
    name: "",
    email: "",
    phone: "",
    location: "",
    birthday: undefined,
    github: "",
    linkedin: "",
    website: "",
    education: "",
    skills: "",
    projects: "",
    experience: ""
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile')
      const result = await response.json()

      if (result.error) throw new Error(result.error)

      const data = result.data

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        birthday: data.birthday || undefined,
        github: data.github || "",
        linkedin: data.linkedin || "",
        website: data.website || "",
        education: data.education || "",
        skills: data.skills || "",
        projects: data.projects || "",
        experience: data.experience || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile)
      })

      const result = await response.json()

      if (result.error) throw new Error(result.error)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={profile.birthday}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  placeholder="github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  placeholder="Your educational background"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Skills & Projects</CardTitle>
              <CardDescription>Showcase your expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="List your skills (e.g., JavaScript, React, Node.js)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  placeholder="Describe your work experience"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea
                  id="projects"
                  name="projects"
                  value={profile.projects}
                  onChange={handleChange}
                  placeholder="Describe your notable projects"
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={saving}
                className="ml-auto"
              >
                {saving ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
