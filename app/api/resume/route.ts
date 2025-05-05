import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { resumeEditorPrompt } from './prompt'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).single()
  const { jobDescription } = await request.json()

  const feedForPrompt = {
    location: profile!.location,
    experience: profile!.experience,
    skills: profile!.skills,
    projects: profile!.projects,
    education: profile!.education
  }

  const prompt = resumeEditorPrompt(jobDescription, feedForPrompt)

  try {
    const resume = await generateObject({
      model: openai('gpt-4-turbo-preview'),
      temperature: 0.5,
      prompt: prompt,
      schema: z.object({
        title: z.string().describe(`
          [FORMAT]
          - Professional job title matching the target role
          - Include specialization area when applicable
          - Should reflect the candidate's most senior or relevant expertise
          
          [EXAMPLES]
          "Senior Full Stack Developer"
          "Data Engineer"
          "DevOps Engineer"
          "Machine Learning Specialist"
        `),
        summary: z.string().describe(`
          [STRUCTURE]
          1. Professional identity statement
          2. Key specialization/niche
          3. Top 2 achievements with metrics
          4. Value proposition

          [RULES]
          - Must be 2-3 sentences
          - No first-person pronouns
          - Include at least one quantifiable result
          - Tailor to target job title/industry
        `),
        experience: z.array(
          z.object({
            title: z.string().describe(`
              [FORMATTING]
              - Standardized industry title
              - Should show career progression or related roles in the same field
              - Match level to JD when appropriate (Junior/Senior/etc.)
              - No company-specific titles
              - Titles should be related to the overall resume title (e.g., "Frontend Developer" 
                and "Backend Developer" are acceptable for a "Full Stack Developer" resume)

              [EXAMPLES]
              - For "Full Stack Developer": "Frontend Engineer", "Backend Developer", "Web Developer"
              - For "Data Engineer": "Data Analyst", "Database Administrator", "Data Scientist"
            `),
            company: z.string().describe(`
              [RULES]
              - Full legal name for recognized companies
              - "Client: [Name]" for consulting
              - Parent company in parentheses when applicable
              - Each company MUST appear only ONCE in the entire experience section

              [EXAMPLE]
              "Google (Alphabet Inc.)"
            `),
            location: z.string().describe(`
              [FORMAT]
              - "City, ST" for US locations
              - "City, Country" for international
              - Add "| Remote" when applicable

              [EXAMPLE]
              "London, UK | Remote"
            `),
            startDate: z.string().describe(`
              [REQUIREMENTS]
              - Always "Month YYYY"
              - No date ranges in this field
              - Use full month name

              [EXAMPLE]
              "March 2020"
            `),
            endDate: z.string().describe(`
              [RULES]
              - "Present" for current roles
              - "Month YYYY" for past roles
              - No gaps >1 month without explanation

              [EXAMPLE]
              "Present" or "August 2023"
            `),
            highlights: z.array(
              z.string().describe(`
                [STRUCTURE]
                1. Strong action verb
                2. Specific what/how
                3. Quantifiable result
                4. Relevant technology

                [EXAMPLE]
                "Led migration to React hooks, reducing component code by 40% while improving performance scores by 15 points"

                [RULES]
                - Must include a result
                - Avoid routine responsibilities
              `)
            ).min(5).max(6).describe(`
              [CONTENT RULES]
              - Ordered by impact (most impressive first)
              - 5-6 bullets per position
              - At least 3 quantified achievements
              - No redundant points across positions
            `),
          }).describe(`
            [SECTION RULES]
            - Most recent first
            - Maximum 10 years history (unless critical)
            - Combine similar short-term roles
            - Gaps >6 months need explanation
            - Each company MUST appear only ONCE in the entire experience section
            - If candidate had multiple roles at the same company, use the most senior/relevant title
          `)
        ).min(3).max(4).describe(`
          [VALIDATION]
          - Must include at least 3 positions
          - Show career progression
          - Highlight relevant experience to JD
          - No more than 4 positions unless critical
          - Each company MUST appear only ONCE in the entire array
          - No duplicate companies with different job titles
        `),
        skills: z.array(
          z.string().describe(`
            [FORMATTING]
            - "Category: Skill (Specifics)" for technical
            - "Skill (Proficiency)" when appropriate
            - Group related technologies

            [EXAMPLE]
            "Frontend: React (Hooks, Context), Vue 3"
            "Project Management (Agile, Scrum)"
          `)
        ).min(3).max(10).describe(`
          [ORGANIZATION]
          1. Technical Skills (grouped by domain)
          2. Tools/Platforms
          3. Methodologies
          4. Soft Skills (limited to 3-5)

          [RULES]
          - Must include exact terms from JD
          - Verify against user's actual skills
          - No exaggeration of proficiency
        `),
        education: z.array(
          z.object({
            degree: z.string().describe(`
              [FORMAT]
              - Standard degree name (e.g., "Bachelor of Science")
              - No abbreviations

              [EXAMPLE]
              "Bachelor of Science in Computer Science"
            `),
            institution: z.string().describe(`
              [FORMAT]
              - Full institution name
              - No abbreviations

              [EXAMPLE]
              "Stanford University"
            `),
            location: z.string().describe(`
              [FORMAT]
              - "City, ST" for US locations
              - "City, Country" for international

              [EXAMPLE]
              "Stanford, CA"
            `),
            graduationDate: z.string().describe(`
              [FORMAT]
              - "Month YYYY"
              - No date ranges

              [EXAMPLE]
              "May 2020"
            `),
          }).describe(`
            [RULES]
            - Include most recent degree
            - No more than 2 degrees unless critical
            - Verify against user's actual education
          `)
        ).min(1).describe(`
          [RULES]
          - Must include at least 1 degree
          - No more than 2 degrees unless critical
          - Verify against user's actual education
        `),
      }).describe(`
        [DOCUMENT STANDARDS]
        1. Truthful representation of candidate
        2. ATS-optimized formatting
        3. Achievement-focused content
        4. Consistent styling throughout
        5. Experience titles should show logical career progression related to the overall resume title

        [VALIDATION CHECKLIST]
        ✓ All dates formatted correctly
        ✓ No pronouns or subjective claims
        ✓ Skills verified against profile
        ✓ Quantifiable results in 80% of bullets
        ✓ Tailored to target job description
        ✓ Job titles show appropriate career progression
      `),
    });

    return NextResponse.json({
      resume: {
        ...profile,
        ...resume.object
      }
    });

  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json(
      {
        error: "Resume generation failed",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
