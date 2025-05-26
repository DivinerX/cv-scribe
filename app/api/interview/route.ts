import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getCurrentSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
	// Get user ID from session
	const session = await getCurrentSession()

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
	const { resume, question, jobDescription } = await request.json()
	const prompt = `You are an AI assistant helping a job seeker prepare for interviews. Generate a first-person response that the job seeker can use when answering this interview question.

The response should:
- Be written in first person (I, my, me) as if the job seeker is speaking
- Only reference skills and experiences that are actually in the resume
- Be concise, professional, and directly address the question
- Incorporate relevant details from both the resume and job description
- Must be tailored to the specific job description and resume
- Must be personalized to the job seeker's background and experiences
- Sound natural and conversational, as if in an actual interview with the job seeker
- Must be human-like and avoid robotic language and gpt-like responses

Resume: ${JSON.stringify(resume, null, 2)}

---

Job Description: ${jobDescription}

---

Interview Question: ${question}
`
	const response = await generateText({
		model: openai('gpt-3.5-turbo'),
		temperature: 0.5,
		prompt: prompt,
	})
	return NextResponse.json({ response })
}
