"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ApplicationLogger() {
  const [url, setUrl] = useState("")
  const [role, setRole] = useState("")
  const [extra, setExtra] = useState("")
  const { toast } = useToast()

  const handleSave = () => {
    if (!url.trim() || !role.trim()) {
      toast({
        title: "Error",
        description: "URL and Role are required fields",
        variant: "destructive",
      })
      return
    }

    // Mock save function
    toast({
      title: "Success",
      description: "Application logged successfully",
    })

    // Reset form
    setUrl("")
    setRole("")
    setExtra("")
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Log Application</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="space-y-1 md:col-span-4">
            <Label htmlFor="url" className="text-sm">
              Company Website
            </Label>
            <Input id="url" placeholder="company.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="space-y-1 md:col-span-4">
            <Label htmlFor="role" className="text-sm">
              Role
            </Label>
            <Input id="role" placeholder="Software Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="space-y-1 md:col-span-3">
            <Label htmlFor="extra" className="text-sm">
              Extra Notes (Optional)
            </Label>
            <Input id="extra" placeholder="Additional info" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </div>
          <div className="md:col-span-1">
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
