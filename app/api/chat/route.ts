// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-3.5-turbo-0613:personal::8LTsgSSu',
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "Create a training data array for fine tuning for open AI format in jsonl format, use provided format only in the fine tune data set given"
      },
      ...messages
    ],
    temperature: 0.7,
    stream: true,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
