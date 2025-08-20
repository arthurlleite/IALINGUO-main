import { MongoClient } from 'mongodb';
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, level, topic = 'general' } = body;
    
    const { db } = await connectToDatabase();
    
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
  } catch (error) {
    console.error('Chat Session Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}