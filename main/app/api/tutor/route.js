import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

// MongoDB connection
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// OpenAI configuration
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Mock responses for testing
const getMockTutorResponse = (userText, userLevel) => {
  const mockReplies = {
    A1: "That's a great start! Let me help you improve this sentence.",
    A2: "Good effort! I can see you're making progress with your English.",
    B1: "Nice work! Your English is developing well. Let me give you some feedback.",
    B2: "Excellent! You're expressing yourself clearly. Here are a few suggestions.",
    C1: "Very well articulated! Your English is quite advanced. Let me offer some refinements."
  };

  return {
    reply: mockReplies[userLevel] || mockReplies.B1,
    corrections: [
      {
        original: "I go to school yesterday",
        corrected: "I went to school yesterday", 
        explanation: "Use past tense 'went' for actions that happened in the past",
        rule: "Past Simple Tense"
      }
    ],
    miniExercise: {
      type: "multiple_choice",
      question: "Choose the correct past tense:",
      options: ["I go", "I went", "I going", "I goes"],
      correct: 1,
      explanation: "Past tense of 'go' is 'went'"
    }
  };
};

// Tutor system prompt
const getTutorPrompt = (userLevel) => `You are an English tutor for Brazilian Portuguese speakers learning English.

User Level: ${userLevel} (CEFR)
Your role:
1. Respond naturally in English first
2. Provide up to 3 corrections with brief explanations in Portuguese
3. Create 1 quick exercise based on the user's input
4. Be encouraging and motivating
5. Adapt vocabulary and complexity to the user's CEFR level

Format your response as JSON:
{
  "reply": "Natural English response",
  "corrections": [
    {
      "original": "user's text",
      "corrected": "corrected version", 
      "explanation": "Brief explanation in Portuguese",
      "rule": "Grammar rule name"
    }
  ],
  "miniExercise": {
    "type": "multiple_choice",
    "question": "Question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": 0,
    "explanation": "Why this answer is correct"
  }
}

Keep corrections to maximum 3 items. Be gentle and encouraging.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { userText, userLevel = 'B1', mode = 'conversation', sessionId } = body;

    // Mock mode
    if (process.env.AI_TUTOR_MOCK === '1' || !process.env.OPENAI_API_KEY) {
      const mockResponse = getMockTutorResponse(userText, userLevel);
      return Response.json(mockResponse);
    }

    try {
      const prompt = getTutorPrompt(userLevel);
      
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userText }
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message.content;
      
      try {
        const parsedResponse = JSON.parse(responseText);
        return Response.json(parsedResponse);
      } catch (parseError) {
        // Fallback if AI doesn't return valid JSON
        return Response.json({
          reply: responseText,
          corrections: [],
          miniExercise: null
        });
      }
    } catch (error) {
      console.error('OpenAI Error:', error);
      // Fallback to mock response
      const mockResponse = getMockTutorResponse(userText, userLevel);
      return Response.json(mockResponse);
    }
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}