"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// Function to get status badge color
const getUserStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "inactive":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "admin":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return ""
  }
}

type User = {
  user_id: number,
  user_metadata: { name: string },
  email: string,
  created_at: string,
  status: string,
  github: string,
  linkedin: string,
}

export function UsersTable() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data.users))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = (id: number, status: string) => {
    fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.user_id === id ? { ...user, status } : user)),
        )
      })
      .catch((error) => console.error(error))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading...</p>
      </div>
    )
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Linkedin</TableHead>
            <TableHead>Github</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.user_metadata.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.linkedin || "-"}</TableCell>
              <TableCell>{user.github || "-"}</TableCell>
              <TableCell>
                <Badge className={getUserStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {
                user.status !== "admin" &&
                  (
                    <Button onClick={() => handleStatusChange(user.user_id, user.status === "not_allowed" ? "active" : "not_allowed")}>{user.status === "active" ? "Deactivate" : "Activate"}</Button>
                  )
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
