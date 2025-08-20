# 🤖 IA e Algoritmos

## 🎯 Visão Geral

O AI Linguo utiliza inteligência artificial avançada para criar uma experiência de aprendizado personalizada e eficiente. Esta seção detalha os algoritmos e técnicas de IA implementados no sistema.

---

## 🧠 Integração com OpenAI GPT

### 🔧 **Configuração Técnica**
```javascript
// Setup otimizado da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 segundos
  maxRetries: 3,
  dangerouslyAllowBrowser: false
});

// Configuração dos modelos
const AI_CONFIG = {
  primary: 'gpt-4o-mini',     // Modelo principal (custo-efetivo)
  fallback: 'gpt-4o',        // Fallback para casos complexos
  maxTokens: 1500,           // Limite de resposta
  temperature: 0.7,          // Criatividade controlada
  topP: 0.9,                // Diversidade de resposta
  presencePenalty: 0.1      // Evita repetição
};
```

### 📝 **Sistema de Prompts Estruturado**

#### **Prompt Base do Tutor**
```javascript
const BASE_TUTOR_PROMPT = `
Você é um tutor especializado em ensinar inglês para brasileiros.
Suas características:
- Paciente e encorajador
- Foca em erros comuns de brasileiros
- Explica regras de forma simples
- Dá exemplos práticos

IMPORTANTE:
1. Sempre responda em inglês primeiro
2. Dê no máximo 3 correções por mensagem
3. Inclua explicações em português para correções
4. Gere um mini-exercício baseado nos erros
`;

// Adaptação por nível CEFR
const LEVEL_ADAPTATIONS = {
  A1: {
    vocabulary: 'simple',
    grammar: 'present tense, basic verbs',
    complexity: 'short sentences',
    focus: 'vocabulary building, pronunciation'
  },
  A2: {
    vocabulary: 'expanded',
    grammar: 'past tense, future, comparatives',
    complexity: 'compound sentences', 
    focus: 'grammar patterns, common phrases'
  },
  B1: {
    vocabulary: 'intermediate',
    grammar: 'perfect tenses, conditionals, passive voice',
    complexity: 'complex sentences',
    focus: 'fluency, natural expressions'
  },
  B2: {
    vocabulary: 'advanced',
    grammar: 'all tenses, reported speech, advanced modals',
    complexity: 'sophisticated structures',
    focus: 'accuracy, style, register'
  },
  C1: {
    vocabulary: 'sophisticated',
    grammar: 'complex structures, subtle meanings',
    complexity: 'native-like expressions',
    focus: 'nuance, cultural context'
  }
};
```

#### **Prompt de Correção Especializado**
```javascript
const createCorrectionPrompt = (userText, userLevel) => `
${BASE_TUTOR_PROMPT}

Nível do usuário: ${userLevel}
Texto do usuário: "${userText}"

Responda no seguinte formato JSON:
{
  "reply": "Resposta natural em inglês",
  "corrections": [
    {
      "original": "texto original com erro",
      "corrected": "versão corrigida", 
      "explanation": "explicação em português",
      "rule": "nome da regra gramatical"
    }
  ],
  "miniExercise": {
    "question": "Pergunta em português",
    "options": ["opção 1", "opção 2", "opção 3", "opção 4"],
    "correct": 1
  }
}

Foque nos erros mais comuns de brasileiros:
- False friends (realize → understand)
- Preposições incorretas (in vs on vs at)
- Gerúndio vs infinitivo (I like to do vs doing)
- Ordem das palavras (adjetivos, advérbios)
- Verbos auxiliares (do/does/did)
`;
```

---

## 🎯 Algoritmo SRS (Spaced Repetition System)

### 📊 **Implementação Baseada no Anki**
```javascript
// Algoritmo principal do SRS
const calculateNextReview = (result, interval, ease, repetitions) => {
  let newInterval = interval;
  let newEase = ease;
  let newRepetitions = repetitions;
  
  switch (result) {
    case 'again': // Errei completamente
      newInterval = 1; // Revisar amanhã
      newEase = Math.max(1.3, ease - 0.2); // Reduz facilidade
      newRepetitions = 0; // Reset repetições
      break;
      
    case 'hard': // Difícil, mas lembrei
      newInterval = Math.max(1, Math.floor(interval * 0.8));
      newEase = Math.max(1.3, ease - 0.15);
      newRepetitions = repetitions + 1;
      break;
      
    case 'good': // Lembrei bem
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.floor(interval * ease);
      }
      newRepetitions = repetitions + 1;
      break;
      
    case 'easy': // Muito fácil
      newInterval = Math.floor(interval * ease * 1.3);
      newEase = Math.min(2.5, ease + 0.15); // Aumenta facilidade
      newRepetitions = repetitions + 1;
      break;
  }
  
  // Calcula a data da próxima revisão
  const now = new Date();
  const dueAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
  
  return {
    interval: newInterval,
    ease: newEase,
    repetitions: newRepetitions,
    dueAt: dueAt
  };
};
```

### 📈 **Métricas de Aprendizado**
```javascript
// Análise de performance do usuário
const analyzeUserProgress = (srsReviews) => {
  const stats = {
    totalCards: srsReviews.length,
    masteredCards: srsReviews.filter(r => r.ease > 2.0 && r.interval > 21).length,
    strugglingCards: srsReviews.filter(r => r.ease < 1.5).length,
    avgAccuracy: 0,
    learningVelocity: 0
  };
  
  // Calcula taxa de acerto
  const recentReviews = srsReviews.filter(r => 
    r.reviewedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  const correctAnswers = recentReviews.filter(r => 
    ['good', 'easy'].includes(r.lastResult)
  ).length;
  
  stats.avgAccuracy = recentReviews.length > 0 
    ? (correctAnswers / recentReviews.length) * 100 
    : 0;
  
  // Velocidade de aprendizado (cards dominados por semana)
  const weeksStudying = Math.max(1, 
    (Date.now() - Math.min(...srsReviews.map(r => r.createdAt))) 
    / (7 * 24 * 60 * 60 * 1000)
  );
  
  stats.learningVelocity = stats.masteredCards / weeksStudying;
  
  return stats;
};
```

---

## 🎵 Análise de Pronúncia

### 🎙️ **Pipeline de Processamento de Áudio**
```javascript
// Configuração do Web Speech API
const initializeSpeechRecognition = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  
  recognition.configure({
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    maxAlternatives: 3
  });
  
  return recognition;
};

// Análise mock de pronúncia (demo)
const analyzePronunciation = (targetPhrase, userTranscription) => {
  const targetWords = targetPhrase.toLowerCase().split(' ');
  const userWords = userTranscription.toLowerCase().split(' ');
  
  const analysis = {
    overallScore: 0,
    wordScores: [],
    commonMistakes: [],
    tips: []
  };
  
  // Análise palavra por palavra
  targetWords.forEach((targetWord, index) => {
    const userWord = userWords[index] || '';
    const similarity = calculateSimilarity(targetWord, userWord);
    
    analysis.wordScores.push({
      target: targetWord,
      user: userWord,
      score: similarity,
      correct: similarity > 0.8
    });
  });
  
  // Score geral
  analysis.overallScore = Math.round(
    analysis.wordScores.reduce((sum, w) => sum + w.score, 0) / targetWords.length * 100
  );
  
  // Detecta erros comuns de brasileiros
  analysis.commonMistakes = detectBrazilianMistakes(targetPhrase, userTranscription);
  
  // Gera dicas específicas
  analysis.tips = generatePronunciationTips(analysis.commonMistakes);
  
  return analysis;
};

// Detecção de erros específicos
const detectBrazilianMistakes = (target, user) => {
  const mistakes = [];
  
  // 'th' sound problems
  if (target.includes('th') && user.includes('d')) {
    mistakes.push({
      type: 'th_sound',
      explanation: 'Som "th" pronunciado como "d"'
    });
  }
  
  // Final 's' missing
  if (target.endsWith('s') && !user.endsWith('s')) {
    mistakes.push({
      type: 'final_s',
      explanation: 'Plural ou 3ª pessoa não pronunciado'
    });
  }
  
  // 'r' sound issues
  if (target.includes('r') && user.includes('h')) {
    mistakes.push({
      type: 'r_sound',
      explanation: 'Som do "r" americano vs brasileiro'
    });
  }
  
  return mistakes;
};
```

---

## 🔍 Processamento de Texto

### ✍️ **Algoritmo de Correção de Escrita**
```javascript
// Pipeline de correção de texto
const processTextCorrection = async (userText, userLevel) => {
  // 1. Pré-processamento
  const cleanText = preprocessText(userText);
  
  // 2. Análise via IA
  const analysis = await analyzeWithAI(cleanText, userLevel);
  
  // 3. Geração do diff visual
  const diff = generateDiff(cleanText, analysis.correctedText);
  
  // 4. Categorização de erros
  const categorizedErrors = categorizeErrors(analysis.corrections);
  
  return {
    original: userText,
    corrected: analysis.correctedText,
    diff: diff,
    corrections: categorizedErrors,
    explanations: analysis.explanations,
    score: calculateWritingScore(analysis)
  };
};

// Categorização inteligente de erros
const categorizeErrors = (corrections) => {
  const categories = {
    grammar: [],
    spelling: [],
    vocabulary: [],
    style: [],
    structure: []
  };
  
  corrections.forEach(correction => {
    const category = classifyError(correction);
    categories[category].push(correction);
  });
  
  return categories;
};

// Classificador de tipos de erro
const classifyError = (correction) => {
  const { rule, original, corrected } = correction;
  
  // Regras gramaticais
  if (rule.includes('tense') || rule.includes('verb') || rule.includes('auxiliary')) {
    return 'grammar';
  }
  
  // Ortografia
  if (levenshteinDistance(original, corrected) <= 2) {
    return 'spelling';
  }
  
  // Vocabulário (palavras completamente diferentes)
  if (!shareCommonLetters(original, corrected)) {
    return 'vocabulary';
  }
  
  // Estrutura (ordem das palavras)
  if (hasSameWords(original, corrected)) {
    return 'structure';
  }
  
  return 'style';
};
```

---

## 📊 Machine Learning Insights

### 🎯 **Personalização Adaptativa**
```javascript
// Sistema de recomendação baseado em dados
const generatePersonalizedContent = (userProgress) => {
  const insights = analyzeUserWeaknesses(userProgress);
  
  return {
    recommendedLessons: selectLessons(insights.weakAreas),
    vocabularyFocus: prioritizeVocabulary(insights.vocabulary),
    grammarEmphasis: emphasizeGrammar(insights.grammar),
    difficultyAdjustment: adjustDifficulty(insights.performance)
  };
};

// Análise de padrões de erro
const analyzeUserWeaknesses = (userProgress) => {
  const { chatHistory, corrections, srsData } = userProgress;
  
  // Agrupa erros por categoria
  const errorPatterns = corrections.reduce((patterns, correction) => {
    const category = correction.rule;
    patterns[category] = (patterns[category] || 0) + 1;
    return patterns;
  }, {});
  
  // Identifica áreas problemáticas
  const weakAreas = Object.entries(errorPatterns)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([area]) => area);
  
  return {
    weakAreas,
    vocabulary: analyzeVocabularyGaps(srsData),
    grammar: identifyGrammarIssues(corrections),
    performance: calculatePerformanceTrends(chatHistory)
  };
};
```

### 🧮 **Algoritmos de Otimização**
```javascript
// Otimização da curva de aprendizado
const optimizeLearningCurve = (userMetrics) => {
  const {
    retentionRate,
    studyConsistency,
    difficultyPreference,
    timeConstraints
  } = userMetrics;
  
  // Ajusta intervalo SRS baseado na retenção
  const srsMultiplier = retentionRate > 0.8 ? 1.2 : 0.9;
  
  // Adapta dificuldade do conteúdo
  const difficultyLevel = calculateOptimalDifficulty(
    userMetrics.currentLevel,
    retentionRate,
    difficultyPreference
  );
  
  // Personaliza cronograma de estudo
  const studySchedule = generateOptimalSchedule(
    timeConstraints,
    studyConsistency
  );
  
  return {
    srsMultiplier,
    difficultyLevel,
    studySchedule,
    recommendedDuration: calculateSessionLength(userMetrics)
  };
};

// Cálculo de dificuldade ótima (zona de desenvolvimento proximal)
const calculateOptimalDifficulty = (currentLevel, retention, preference) => {
  const baseLevel = CEFR_LEVELS[currentLevel].numericValue;
  
  // Ajuste baseado na retenção
  let adjustment = 0;
  if (retention > 0.9) adjustment = 0.2; // Aumentar dificuldade
  else if (retention < 0.7) adjustment = -0.2; // Diminuir dificuldade
  
  // Considera preferência do usuário
  const preferenceAdjustment = preference === 'challenging' ? 0.1 : 
                              preference === 'comfortable' ? -0.1 : 0;
  
  return Math.max(1, Math.min(5, baseLevel + adjustment + preferenceAdjustment));
};
```

---

## 🔄 Feedback Loop Inteligente

### 📈 **Análise Contínua de Performance**
```javascript
// Sistema de feedback em tempo real
const provideContinuousFeedback = async (userSession) => {
  const realTimeMetrics = {
    engagementLevel: calculateEngagement(userSession),
    learningVelocity: measureLearningSpeed(userSession),
    frustrationLevel: detectFrustration(userSession),
    masteryIndicators: assessMastery(userSession)
  };
  
  // Ajustes dinâmicos
  if (realTimeMetrics.frustrationLevel > 0.7) {
    return {
      action: 'reduce_difficulty',
      message: 'Vamos com calma! Que tal praticar algo mais simples?',
      contentAdjustment: 'easier'
    };
  }
  
  if (realTimeMetrics.engagementLevel < 0.3) {
    return {
      action: 'increase_engagement',
      message: 'Que tal um desafio mais interessante?',
      contentAdjustment: 'more_interactive'
    };
  }
  
  return {
    action: 'continue',
    message: 'Você está indo muito bem! Continue assim!',
    contentAdjustment: 'maintain'
  };
};

// Detecção de frustração baseada em padrões
const detectFrustration = (session) => {
  const indicators = {
    repetitiveErrors: countRepetitiveErrors(session.corrections),
    timeSpentPerMessage: calculateAverageResponseTime(session.messages),
    errorRateIncrease: measureErrorRateChange(session),
    sessionDuration: session.duration
  };
  
  // Peso dos indicadores
  const frustrationScore = 
    (indicators.repetitiveErrors * 0.3) +
    (indicators.timeSpentPerMessage > 120 ? 0.25 : 0) +
    (indicators.errorRateIncrease * 0.3) +
    (indicators.sessionDuration < 300 ? 0.15 : 0); // Sessão muito curta
  
  return Math.min(1, frustrationScore);
};
```

---

## 🚀 Otimizações de Performance

### ⚡ **Caching Inteligente**
```javascript
// Cache de respostas da IA para reduzir custos
const cacheManager = {
  // Cache de respostas por padrão de entrada
  responseCache: new Map(),
  
  // Cache de correções comuns
  correctionCache: new Map(),
  
  // TTL para diferentes tipos de cache
  ttl: {
    responses: 24 * 60 * 60 * 1000, // 24 horas
    corrections: 7 * 24 * 60 * 60 * 1000, // 7 dias
    vocabulary: 30 * 24 * 60 * 60 * 1000 // 30 dias
  },
  
  // Busca com fallback para IA
  async getCachedResponse(input, level) {
    const key = `${hashInput(input)}_${level}`;
    const cached = this.responseCache.get(key);
    
    if (cached && !this.isExpired(cached)) {
      return cached.data;
    }
    
    // Não encontrou no cache, chama IA
    const freshResponse = await callOpenAI(input, level);
    
    // Armazena no cache
    this.responseCache.set(key, {
      data: freshResponse,
      timestamp: Date.now()
    });
    
    return freshResponse;
  },
  
  isExpired(cached) {
    return Date.now() - cached.timestamp > this.ttl.responses;
  }
};
```

### 🔄 **Rate Limiting e Fallbacks**
```javascript
// Sistema de rate limiting inteligente
const rateLimiter = {
  requests: new Map(),
  limits: {
    perMinute: 20,
    perHour: 100,
    perDay: 1000
  },
  
  async checkLimit(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove requests antigos
    const recentRequests = userRequests.filter(timestamp => 
      now - timestamp < 60 * 1000 // Último minuto
    );
    
    if (recentRequests.length >= this.limits.perMinute) {
      throw new Error('Rate limit exceeded');
    }
    
    // Adiciona request atual
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    
    return true;
  }
};

// Sistema de fallback para IA
const aiWithFallback = async (input, level, userId) => {
  try {
    // Verifica rate limit
    await rateLimiter.checkLimit(userId);
    
    // Tenta cache primeiro
    return await cacheManager.getCachedResponse(input, level);
    
  } catch (error) {
    if (error.message.includes('Rate limit')) {
      // Fallback para respostas pré-definidas
      return getMockResponse(input, level);
    }
    
    if (error.code === 'insufficient_quota') {
      // Ativa modo mock temporariamente
      console.warn('OpenAI quota exceeded, switching to mock mode');
      return getMockResponse(input, level);
    }
    
    throw error;
  }
};
```

Esta arquitetura de IA garante uma experiência de aprendizado inteligente, personalizada e eficiente, adaptando-se continuamente às necessidades do usuário.