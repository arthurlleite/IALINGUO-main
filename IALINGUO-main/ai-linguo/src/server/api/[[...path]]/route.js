import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

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

export async function POST(request, { params }) {
  try {
    const path = params.path?.join('/') || '';
    const body = await request.json();

    const { db } = await connectToDatabase();

    // API Routes
    switch (path) {
      case 'tutor':
        return await handleTutorRequest(body);
      
      case 'auth/login':
        return await handleLogin(body, db);
      
      case 'auth/register':
        return await handleRegister(body, db);
      
      case 'user/progress':
        return await handleUserProgress(body, db);
      
      case 'lessons':
        return await handleLessons(body, db);
      
      case 'vocabulary/cards':
        return await handleVocabularyCards(body, db);
      
      case 'vocabulary/review':
        return await handleVocabularyCards(body, db);
      
      case 'pronunciation/analyze':
        return await handlePronunciation(body, db);
      
      case 'chat/sessions':
        return await handleChatSessions(body, db);
      
      default:
        return Response.json({ error: 'Route not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const path = params.path?.join('/') || '';
    const { searchParams } = new URL(request.url);
    
    const { db } = await connectToDatabase();

    switch (path) {
      case 'user/profile':
        return await handleGetProfile(searchParams, db);
      
      case 'lessons':
        return await handleGetLessons(searchParams, db);
      
      case 'vocabulary/due':
        return await handleGetDueCards(searchParams, db);
      
      case 'chat/history':
        return await handleGetChatHistory(searchParams, db);
      
      default:
        return Response.json({ error: 'Route not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Tutor AI Handler
async function handleTutorRequest(body) {
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
}

// Authentication Handlers
async function handleLogin(body, db) {
  const { email, password } = body;
  
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  // Simple password check (in production, use proper hashing)
  if (user.password !== password) {
    return Response.json({ error: 'Invalid password' }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user;
  return Response.json({ user: userWithoutPassword, token: 'mock-token' });
}

async function handleRegister(body, db) {
  const { email, name, password, cefrLevel = 'A2' } = body;
  
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return Response.json({ error: 'User already exists' }, { status: 400 });
  }

  const user = {
    _id: uuidv4(),
    email,
    name,
    password, // In production, hash this
    cefrLevel,
    dailyGoalMinutes: 15,
    createdAt: new Date(),
    streakDays: 0,
    totalMinutes: 0
  };

  await db.collection('users').insertOne(user);
  
  const { password: _, ...userWithoutPassword } = user;
  return Response.json({ user: userWithoutPassword, token: 'mock-token' });
}

// User Progress Handler
async function handleUserProgress(body, db) {
  const { userId, minutesStudied } = body;
  
  await db.collection('users').updateOne(
    { _id: userId },
    { 
      $inc: { totalMinutes: minutesStudied },
      $set: { lastStudyDate: new Date() }
    }
  );

  return Response.json({ success: true });
}

// Lessons Handlers
async function handleLessons(body, db) {
  const { userId, lessonId, completed = true } = body;
  
  const progress = {
    _id: uuidv4(),
    userId,
    lessonId,
    completed,
    completedAt: new Date()
  };

  await db.collection('lessonProgress').insertOne(progress);
  return Response.json({ success: true });
}

async function handleGetLessons(searchParams, db) {
  const level = searchParams.get('level') || 'A1';
  
  // Return mock lessons for now
  const lessons = [
    {
      _id: '1',
      cefrLevel: level,
      title: 'Basic Greetings',
      contentMarkdown: '# Hello and Introduction\n\nLearn basic greetings...',
      estimatedMinutes: 10
    },
    {
      _id: '2', 
      cefrLevel: level,
      title: 'Present Simple',
      contentMarkdown: '# Present Simple Tense\n\nI am, you are, he is...',
      estimatedMinutes: 15
    }
  ];

  return Response.json(lessons);
}

// Vocabulary Handlers
async function handleVocabularyCards(body, db) {
  const { userId, cardId, result } = body; // result: 'easy', 'good', 'hard', 'again'
  
  // Simple SRS logic
  const intervals = {
    again: 1,
    hard: 1,
    good: 4,
    easy: 7
  };

  const interval = intervals[result] || 1;
  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + interval);

  await db.collection('srsReviews').updateOne(
    { userId, cardId },
    {
      $set: {
        dueAt,
        interval,
        ease: result === 'easy' ? 2.5 : result === 'good' ? 2.0 : 1.3,
        lastResult: result,
        reviewedAt: new Date()
      }
    },
    { upsert: true }
  );

  return Response.json({ success: true, nextDue: dueAt });
}

async function handleGetDueCards(searchParams, db) {
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit')) || 10;

  // Mock vocabulary cards
  const cards = [
    {
      _id: 'card1',
      term: 'apple',
      meaning: 'maçã',
      example: 'I eat an apple every day',
      cefrLevel: 'A1'
    },
    {
      _id: 'card2',
      term: 'beautiful',
      meaning: 'bonito/bonita',
      example: 'The sunset is beautiful',
      cefrLevel: 'A2'
    }
  ];

  return Response.json(cards);
}

// Pronunciation Handler
async function handlePronunciation(body, db) {
  const { userId, phrase, audioBase64 } = body;
  
  // Mock pronunciation analysis
  const analysis = {
    _id: uuidv4(),
    userId,
    phrase,
    transcript: phrase.toLowerCase(), // Mock: return same phrase
    score: 0.85,
    tips: ['Focus on the "th" sound in "the"', 'Stress the first syllable in "beautiful"'],
    createdAt: new Date()
  };

  await db.collection('pronunciation').insertOne(analysis);
  
  return Response.json(analysis);
}

// Chat Session Handlers
async function handleChatSessions(body, db) {
  const { userId, level, topic = 'general' } = body;
  
  const session = {
    _id: uuidv4(),
    userId,
    level,
    topic,
    createdAt: new Date(),
    summary: ''
  };

  await db.collection('chatSessions').insertOne(session);
  return Response.json(session);
}

async function handleGetChatHistory(searchParams, db) {
  const sessionId = searchParams.get('sessionId');
  const limit = parseInt(searchParams.get('limit')) || 20;

  const turns = await db.collection('chatTurns')
    .find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .toArray();

  return Response.json(turns);
}

async function handleGetProfile(searchParams, db) {
  const userId = searchParams.get('userId');
  
  const user = await db.collection('users').findOne({ _id: userId });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const { password: _, ...userWithoutPassword } = user;
  return Response.json(userWithoutPassword);
}