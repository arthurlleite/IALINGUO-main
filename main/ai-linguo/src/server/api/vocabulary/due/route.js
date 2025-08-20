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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
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
      },
      {
        _id: 'card3',
        term: 'necessary',
        meaning: 'necessário',
        example: 'It is necessary to study English',
        cefrLevel: 'B1'
      }
    ];

    return Response.json(cards);
  } catch (error) {
    console.error('Vocabulary Due Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}