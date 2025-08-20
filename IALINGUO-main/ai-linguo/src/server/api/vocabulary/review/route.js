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
    const { userId, cardId, result } = body; // result: 'easy', 'good', 'hard', 'again'
    
    const { db } = await connectToDatabase();
    
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
  } catch (error) {
    console.error('Vocabulary Review Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}