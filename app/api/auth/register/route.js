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
    const { email, name, password, cefrLevel = 'A2' } = body;
    
    const { db } = await connectToDatabase();
    
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
  } catch (error) {
    console.error('Register Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}