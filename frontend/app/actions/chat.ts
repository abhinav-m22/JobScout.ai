'use server'

import { OpenAI } from 'openai'
import { Message } from '@/types/chat'

const SYSTEM_PROMPT = `You are an AI career assistant for JobScout.ai. You help users with:
1. Finding relevant jobs based on their profile and preferences
2. Analyzing skill gaps and providing learning resources
3. Offering career advice and industry insights
4. Conducting mock interviews and providing feedback

Use the user's profile information when availa  ble to personalize responses.
Be professional yet friendly, and always provide actionable insights.`

export async function chat(
  messages: { role: string; content: string }[],
  userProfile?: Record<string, unknown>
): Promise<{ content: string; error?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { content: '', error: 'OPENAI_API_KEY is not configured' }
  }

  try {
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
    })

    return { content: response.choices[0].message.content }
  } catch (error) {
    console.error('Chat API error:', error)
    return { content: '', error: 'Failed to process chat request' }
  }
}
