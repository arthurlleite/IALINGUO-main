const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'ailinguo';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('🌱 Seeding AI Linguo database...');
    
    // Clear existing data
    await db.collection('lessons').deleteMany({});
    await db.collection('vocabCards').deleteMany({});
    
    // Seed lessons
    const lessons = [
      // A1 Level
      {
        _id: uuidv4(),
        cefrLevel: 'A1',
        title: 'Basic Greetings and Introductions',
        contentMarkdown: `# Basic Greetings and Introductions

## Common Greetings
- Hello / Hi
- Good morning / Good afternoon / Good evening
- How are you?
- Nice to meet you

## Practice
Try introducing yourself using these phrases!`,
        estimatedMinutes: 10
      },
      {
        _id: uuidv4(),
        cefrLevel: 'A1',
        title: 'Numbers and Time',
        contentMarkdown: `# Numbers and Time

## Numbers 1-20
One, two, three, four, five...

## Telling Time
- What time is it?
- It's 3 o'clock
- It's half past two`,
        estimatedMinutes: 15
      },
      
      // A2 Level
      {
        _id: uuidv4(),
        cefrLevel: 'A2',
        title: 'Past Simple Tense',
        contentMarkdown: `# Past Simple Tense

## Regular Verbs
- I walked to school yesterday
- She played soccer last week
- We studied English together

## Irregular Verbs
- I went home early
- He ate breakfast at 8 AM
- They saw a movie last night`,
        estimatedMinutes: 20
      },
      
      // B1 Level
      {
        _id: uuidv4(),
        cefrLevel: 'B1',
        title: 'Present Perfect vs Past Simple',
        contentMarkdown: `# Present Perfect vs Past Simple

## Present Perfect
- I have lived here for 5 years
- She has already finished her homework
- They have never been to Japan

## Past Simple
- I lived in London last year
- She finished her homework yesterday
- They went to Japan in 2019`,
        estimatedMinutes: 25
      },
      
      // B2 Level
      {
        _id: uuidv4(),
        cefrLevel: 'B2',
        title: 'Conditional Sentences',
        contentMarkdown: `# Conditional Sentences

## First Conditional
- If it rains tomorrow, I will stay home
- She will call you if she has time

## Second Conditional
- If I were rich, I would travel the world
- What would you do if you won the lottery?`,
        estimatedMinutes: 30
      },
      
      // C1 Level
      {
        _id: uuidv4(),
        cefrLevel: 'C1',
        title: 'Advanced Grammar Structures',
        contentMarkdown: `# Advanced Grammar Structures

## Subjunctive Mood
- I suggest that he be more careful
- It's important that she arrive on time

## Passive Voice Variations
- The proposal is being considered by the committee
- Having been warned about the danger, we proceeded carefully`,
        estimatedMinutes: 35
      }
    ];
    
    await db.collection('lessons').insertMany(lessons);
    console.log(`✅ Inserted ${lessons.length} lessons`);
    
    // Seed vocabulary cards
    const vocabCards = [
      // A1 Level
      { _id: uuidv4(), term: 'apple', meaning: 'maçã', example: 'I eat an apple every day', cefrLevel: 'A1' },
      { _id: uuidv4(), term: 'house', meaning: 'casa', example: 'My house is very big', cefrLevel: 'A1' },
      { _id: uuidv4(), term: 'water', meaning: 'água', example: 'I drink water when I am thirsty', cefrLevel: 'A1' },
      { _id: uuidv4(), term: 'book', meaning: 'livro', example: 'I read a book every night', cefrLevel: 'A1' },
      { _id: uuidv4(), term: 'friend', meaning: 'amigo', example: 'My best friend lives next door', cefrLevel: 'A1' },
      
      // A2 Level
      { _id: uuidv4(), term: 'beautiful', meaning: 'bonito/bonita', example: 'The sunset is beautiful', cefrLevel: 'A2' },
      { _id: uuidv4(), term: 'important', meaning: 'importante', example: 'Education is very important', cefrLevel: 'A2' },
      { _id: uuidv4(), term: 'different', meaning: 'diferente', example: 'Every person is different', cefrLevel: 'A2' },
      { _id: uuidv4(), term: 'interesting', meaning: 'interessante', example: 'The movie was very interesting', cefrLevel: 'A2' },
      { _id: uuidv4(), term: 'difficult', meaning: 'difícil', example: 'Math is difficult for me', cefrLevel: 'A2' },
      
      // B1 Level
      { _id: uuidv4(), term: 'necessary', meaning: 'necessário', example: 'It is necessary to study English', cefrLevel: 'B1' },
      { _id: uuidv4(), term: 'although', meaning: 'embora', example: 'Although it was raining, we went out', cefrLevel: 'B1' },
      { _id: uuidv4(), term: 'according', meaning: 'de acordo com', example: 'According to the news, it will rain tomorrow', cefrLevel: 'B1' },
      { _id: uuidv4(), term: 'particularly', meaning: 'particularmente', example: 'I particularly enjoy reading books', cefrLevel: 'B1' },
      { _id: uuidv4(), term: 'knowledge', meaning: 'conhecimento', example: 'Knowledge is power', cefrLevel: 'B1' },
      
      // B2 Level
      { _id: uuidv4(), term: 'significant', meaning: 'significativo', example: 'There was a significant improvement in sales', cefrLevel: 'B2' },
      { _id: uuidv4(), term: 'consequence', meaning: 'consequência', example: 'Every action has a consequence', cefrLevel: 'B2' },
      { _id: uuidv4(), term: 'comprehensive', meaning: 'abrangente', example: 'We need a comprehensive solution', cefrLevel: 'B2' },
      { _id: uuidv4(), term: 'nevertheless', meaning: 'no entanto', example: 'The task was difficult; nevertheless, we completed it', cefrLevel: 'B2' },
      { _id: uuidv4(), term: 'controversy', meaning: 'controvérsia', example: 'The decision caused much controversy', cefrLevel: 'B2' },
      
      // C1 Level
      { _id: uuidv4(), term: 'sophisticated', meaning: 'sofisticado', example: 'She has sophisticated taste in art', cefrLevel: 'C1' },
      { _id: uuidv4(), term: 'phenomenon', meaning: 'fenômeno', example: 'Climate change is a global phenomenon', cefrLevel: 'C1' },
      { _id: uuidv4(), term: 'elaborate', meaning: 'elaborar/detalhado', example: 'Could you elaborate on your proposal?', cefrLevel: 'C1' },
      { _id: uuidv4(), term: 'unprecedented', meaning: 'sem precedentes', example: 'The pandemic created unprecedented challenges', cefrLevel: 'C1' },
      { _id: uuidv4(), term: 'substantial', meaning: 'substancial', example: 'There was substantial progress in the negotiations', cefrLevel: 'C1' }
    ];
    
    await db.collection('vocabCards').insertMany(vocabCards);
    console.log(`✅ Inserted ${vocabCards.length} vocabulary cards`);
    
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };