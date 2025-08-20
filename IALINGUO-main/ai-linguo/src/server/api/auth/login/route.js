import { MongoClient } from 'mongodb';

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
    const { email, password } = body;
    
    const { db } = await connectToDatabase();
    
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
  } catch (error) {
    console.error('Login Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}