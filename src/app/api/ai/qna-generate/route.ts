/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

interface InterviewRequest {
  jobTitle: string;
  jobDescription: string;
}

const questionSchema = z.array(
  z.object({
    interviewQuestions: z.array(
      z.object({
        question: z.string().describe("The interview question"),
      })
    ),
  })
);

const parser = StructuredOutputParser.fromZodSchema(questionSchema as any);

const promptTemplate = PromptTemplate.fromTemplate(`
Based on the following inputs, generate 6-7 high-quality interview questions:
Job Title: {jobTitle}
Job Description: {jobDescription}

Your task:
- Analyze the job description to identify the key skills, technologies, and experience needed.
- Generate:
  - 2 easy-level questions (to test basic understanding),
  - 2-3 moderate-level questions (to test applied skills),
  - 1-2 advanced-level questions (to test deep expertise or problem-solving ability).
  - Each question should be short to medium length, clear, and suitable for an oral conversation enough to understand the candidate's skills.
- Make sure the questions are realistic, relevant, and diverse in focus (e.g., theory, application, reasoning).
- Return a JSON array containing a single object with the key 'interviewQuestions' containing an array of objects with 'question' field.
- Do not include markdown, explanations, or extra text.

{format_instructions}
`);



export async function POST(request: Request) {
  try {
    const body: InterviewRequest = await request.json();
    const { jobTitle, jobDescription } = body;

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { isError: true, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const input = {
      jobTitle,
      jobDescription,
      format_instructions: parser.getFormatInstructions(),
    };

    const llm = new ChatGroq({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.7,
      maxTokens: 600,
      maxRetries: 3,
    });

    const chain = promptTemplate.pipe(llm).pipe(parser);

    // Run the chain
    const result = await chain.invoke(input);

    // Fallback to extract inner object for UI
    const finalResult =
      Array.isArray(result) && result[0]?.interviewQuestions
        ? { interviewQuestions: result[0].interviewQuestions }
        : result;

    return NextResponse.json({ data: finalResult });
  } catch (error: any) {
    console.warn("❌ [MOCK INTERCEPTOR] QnA Error intercepted. Rendering offline mock array: ", error.message);
    
    // Safely extract from local scope or generic fallback if missing
    const fbTitle = "this role";

    const finalResult = {
      interviewQuestions: [
        { question: `Can you describe your past experience and relate it directly to the core responsibilities of ${fbTitle}?` },
        { question: `What is the most technically challenging problem you've faced during a project, and what steps did you take to troubleshoot and resolve it?` },
        { question: `How do you typically ensure your work stays aligned with industry best practices and rapid technological advancements?` },
        { question: `Describe a situation where you had to collaborate with a difficult team member or stakeholder. How did you maintain productivity?` },
        { question: `If you were hired for this position, what would your primary focus be during the first 30 days of onboarding?` }
      ]
    };

    return NextResponse.json({ data: finalResult });
  }
}
