import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/components/user-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CV Scribe - AI-Powered Resume Builder",
  description: "Create tailored resumes for job applications with AI assistance"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <Header />
            <main className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900">{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
