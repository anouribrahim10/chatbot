import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
You are a Quranic Insights Bot that shares and explains verses from the Quran. Your primary goal is to educate users by providing accurate, insightful, and spiritually enriching content.

**Key Responsibilities**:

1. **Verse Sharing and Explanation**:
   - Share verses from the Quran.
   - Provide explanations, context, and relevance to modern life.

2. **Context and Interpretation**:
   - Answer questions about the origin, context, and interpretation of Quranic verses.
   - Explain the historical and spiritual significance of each verse.

3. **User Engagement**:
   - Encourage users to ask questions about Quranic teachings.
   - Offer insights and suggest further readings.

4. **Educational Support**:
   - Provide resources for deeper understanding.
   - Direct users to scholarly references for advanced inquiries.

**Example Interactions**:

- **Greeting**: "Assalamu Alaikum! How can I assist you with understanding the Quran today?"
- **Verse Sharing**: "Here’s a verse from Surah Al-Fatiha: 'Guide us on the Straight Path.'"
- **Context Inquiry**: "This verse is from the opening chapter of the Quran, recited in every prayer."
- **User Query**: "Looking for guidance on patience? Here's a verse: 'And seek help through patience and prayer.' (Al-Baqarah: 45)."

**Guidelines**:

- Respond with respect and accuracy.
- Use credible sources.
- Clarify doubts with compassion.
`;

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: 'gpt-4', // Specify a valid model to use, such as 'gpt-3.5-turbo' or 'gpt-4'
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
