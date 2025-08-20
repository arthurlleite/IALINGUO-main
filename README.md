# AI Linguo

AI-powered English tutoring application with conversational AI, grammar correction, pronunciation practice, and spaced repetition vocabulary system.

## Features

- 🤖 **AI Conversation Tutor** - Chat with an intelligent AI that provides real-time corrections and explanations
- 📝 **Writing Correction** - Grammar analysis with detailed feedback and suggestions
- 🎤 **Pronunciation Practice** - Audio recording and pronunciation analysis
- 🎯 **Vocabulary SRS** - Spaced repetition system for efficient vocabulary learning
- 📊 **Progress Tracking** - Daily goals, streaks, and personalized learning paths
- 🎓 **CEFR Level Adaptation** - Content adapted to your English level (A1-C1)

## Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)

## Quick Start with Docker

1. **Clone and setup**
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Build and start services
   docker-compose up --build
   ```

2. **Access the application**
   ```
   http://localhost:3000
   ```

That's it! The application will be running with MongoDB and all services.

## Local Development

### Environment Setup

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (if not using Docker)
   ```bash
   # Using Docker for MongoDB only
   docker run -d -p 27017:27017 --name mongo mongo:7
   
   # Or install MongoDB locally
   brew install mongodb/brew/mongodb-community
   brew services start mongodb-community
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn seed` - Seed database with sample data
- `yarn test:e2e` - Run end-to-end tests
- `yarn docker:build` - Build Docker images
- `yarn docker:up` - Start with Docker Compose
- `yarn docker:dev` - Build and start with Docker Compose

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Project Configuration
PROJECT_NAME=AI Linguo
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://mongo:27017/ailinguo
DB_NAME=ailinguo

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MODEL_FALLBACK=gpt-4o
AI_TUTOR_MOCK=1

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGINS=*
```

### AI Configuration

- **Mock Mode**: Set `AI_TUTOR_MOCK=1` to use simulated AI responses (no API key required)
- **Real AI**: Set `AI_TUTOR_MOCK=0` and provide `OPENAI_API_KEY` to use OpenAI GPT models

## Testing

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
yarn test:e2e
```

Tests cover:
- User registration and login
- Dashboard navigation
- AI chat functionality
- Writing correction
- Vocabulary practice
- Pronunciation interface

## Database Seeding

Populate the database with sample lessons and vocabulary:

```bash
yarn seed
```

This creates:
- Sample lessons for each CEFR level (A1-C1)
- Vocabulary cards with example sentences
- User progress data

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### AI Tutor
- `POST /api/tutor` - Chat with AI tutor

### Vocabulary
- `GET /api/vocabulary/due` - Get due vocabulary cards
- `POST /api/vocabulary/review` - Submit card review

### Chat
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/history` - Get chat history

## Project Structure

```
/app
├── /app                    # Next.js pages and API routes
│   ├── /api               # API endpoints
│   ├── page.js            # Main application component
│   ├── layout.js          # Root layout
│   └── globals.css        # Global styles
├── /components            # Reusable UI components
├── /lib                   # Utility functions
├── /public               # Static assets
├── docker-compose.yml    # Docker services
├── Dockerfile           # Application container
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 yarn dev
```

**Docker permission denied**
```bash
# Add your user to docker group (Linux/macOS)
sudo usermod -aG docker $USER
# Then restart your terminal
```

**MongoDB connection failed**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB container
docker-compose restart mongo
```

**Environment variables not loaded**
```bash
# Ensure .env file exists and has correct format
cp .env.example .env
# Restart the development server
```

### Database Issues

**Reset database**
```bash
# Stop services
docker-compose down

# Remove database volume
docker-compose down -v

# Start fresh
docker-compose up --build
```

**View database**
```bash
# Connect to MongoDB
docker exec -it <container_name> mongosh
# Use database
use ailinguo
# List collections
show collections
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Technologies Used

- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: Custom email/password
- **Animations**: Framer Motion
- **Testing**: Playwright
- **Deployment**: Docker, Docker Compose
