# 🔄 Fluxo do Usuário

## 🎯 Visão Geral

Esta seção mapeia os fluxos completos de interação do usuário com o AI Linguo, desde o primeiro acesso até o uso avançado da plataforma.

---

## 🚀 Jornada do Usuário Completa

### 📊 Overview do Fluxo Principal
```mermaid
flowchart TD
    A[Usuário descobre AI Linguo] --> B[Landing Page]
    B --> C{Interessado?}
    C -->|Sim| D[Registro]
    C -->|Não| E[Saída]
    D --> F[Dashboard]
    F --> G[Escolhe Atividade]
    G --> H[Pratica]
    H --> I[Progresso Salvo]
    I --> J{Continuar?}
    J -->|Sim| G
    J -->|Não| K[Logout]
```

---

## 🏠 Fluxo: Primeira Visita

### 1. Discovery e Landing
```mermaid
flowchart LR
    A[Google Search] --> B[Landing Page]
    C[Social Media] --> B
    D[Referral] --> B
    
    B --> E[Hero Section]
    E --> F{Convencido?}
    F -->|Sim| G[Clica 'Começar Agora']
    F -->|Não| H[Scroll para Features]
    H --> I[Vê Demonstrações]
    I --> J{Convencido?}
    J -->|Sim| G
    J -->|Não| K[Sai do Site]
```

### 2. Pontos de Conversão
| Elemento | Taxa Conversão Target | Atual |
|----------|----------------------|-------|
| Hero CTA | 8% | 12% |
| Feature Cards | 5% | 7% |
| Demo Videos | 15% | 18% |
| Social Proof | 3% | 4% |

---

## 🔐 Fluxo: Registro e Onboarding

### Processo de Registro
```mermaid
flowchart TD
    A[Clica 'Começar Agora'] --> B[Modal Registro]
    B --> C[Preenche Nome]
    C --> D[Preenche Email]
    D --> E[Cria Senha]
    E --> F[Seleciona Nível CEFR]
    F --> G{Dados Válidos?}
    G -->|Não| H[Mostra Erros]
    H --> C
    G -->|Sim| I[Conta Criada]
    I --> J[Redireciona Dashboard]
```

### Validações em Tempo Real
```javascript
// Exemplo de validações
const validations = {
  name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^.{8,}$/, // Mínimo 8 caracteres
  cefrLevel: ['A1', 'A2', 'B1', 'B2', 'C1']
};

// Estados visuais
const fieldStates = {
  empty: 'border-gray-300',
  valid: 'border-green-500 bg-green-50',
  invalid: 'border-red-500 bg-red-50'
};
```

### Primeira Experiência (Onboarding)
```mermaid
flowchart LR
    A[Login Sucesso] --> B[Dashboard]
    B --> C[Welcome Modal]
    C --> D[Tour Guiado]
    D --> E[Primeira Conversa]
    E --> F[Feedback Inicial]
    F --> G[Setup Metas]
    G --> H[Onboarding Completo]
```

---

## 💬 Fluxo: Chat com IA

### Fluxo Detalhado de Conversa
```mermaid
flowchart TD
    A[Dashboard] --> B[Clica 'Praticar Conversa']
    B --> C[Carrega Interface]
    C --> D[Exibe Sugestões]
    D --> E{Usuário Escolhe}
    E -->|Sugestão| F[Clica Botão Tópico]
    E -->|Próprio| G[Digita Mensagem]
    F --> H[Envia para IA]
    G --> H
    H --> I[Loading State]
    I --> J[Recebe Resposta]
    J --> K[Exibe Correções]
    K --> L[Mostra Exercício]
    L --> M{Continuar?}
    M -->|Sim| D
    M -->|Não| N[Salva Sessão]
    N --> O[Volta Dashboard]
```

### Estados da Interface
1. **Inicial**: Sugestões de tópicos visíveis
2. **Digitando**: Contador de caracteres, botão enviar ativo
3. **Enviando**: Botão desabilitado, loading spinner
4. **Processando**: "IA está pensando..." com animação
5. **Resposta**: Animação de aparição, correções destacadas
6. **Exercício**: Botões interativos, feedback visual

### Tratamento de Erros
```mermaid
flowchart LR
    A[Erro na API] --> B{Tipo do Erro}
    B -->|Timeout| C[Retry Automático]
    B -->|Rate Limit| D[Aguardar 1min]
    B -->|Server Error| E[Modo Offline]
    C --> F[Sucesso?]
    F -->|Não| G[Exibir Erro]
    F -->|Sim| H[Continuar Normal]
    D --> I[Tentar Novamente]
    E --> J[Respostas Mock]
```

---

## ✍️ Fluxo: Correção de Escrita

### Pipeline de Correção
```mermaid
flowchart TD
    A[Dashboard] --> B[Clica 'Treinar Escrita']
    B --> C[Interface Carregada]
    C --> D[Cola/Digita Texto]
    D --> E{Texto Válido?}
    E -->|Não| F[Mostra Limitações]
    E -->|Sim| G[Clica 'Verificar']
    G --> H[Envia para IA]
    H --> I[Processamento]
    I --> J[Recebe Análise]
    J --> K[Gera Diff Visual]
    K --> L[Lista Correções]
    L --> M[Exibe Versão Final]
    M --> N{Nova Correção?}
    N -->|Sim| O[Limpar Texto]
    N -->|Não| P[Volta Dashboard]
    O --> D
```

### Processamento Visual do Diff
```javascript
// Algoritmo de diff simplificado
const generateDiff = (original, corrected) => {
  const changes = [];
  const originalWords = original.split(' ');
  const correctedWords = corrected.split(' ');
  
  // Comparison logic
  for (let i = 0; i < Math.max(originalWords.length, correctedWords.length); i++) {
    if (originalWords[i] !== correctedWords[i]) {
      changes.push({
        type: 'change',
        original: originalWords[i],
        corrected: correctedWords[i],
        position: i
      });
    }
  }
  
  return changes;
};
```

---

## 🎯 Fluxo: Vocabulário SRS

### Ciclo de Revisão Completo
```mermaid
flowchart TD
    A[Dashboard] --> B[Vê 'X cards devidas']
    B --> C[Clica 'Vocabulário']
    C --> D[Carrega Cards]
    D --> E{Há Cards?}
    E -->|Não| F[Mensagem Vazio]
    E -->|Sim| G[Exibe Primeiro Card]
    G --> H[Mostra Palavra]
    H --> I[Usuário Pensa]
    I --> J[Clica Card]
    J --> K[Revela Significado]
    K --> L[Avalia Dificuldade]
    L --> M[Calcula Próxima Revisão]
    M --> N[Salva Progresso]
    N --> O{Mais Cards?}
    O -->|Sim| P[Próximo Card]
    O -->|Não| Q[Tela Parabéns]
    P --> G
    Q --> R[Volta Dashboard]
```

### Algoritmo SRS em Ação
```javascript
// Cálculo da próxima revisão
const calculateNextReview = (lastResult, currentInterval, ease) => {
  const now = new Date();
  let newInterval;
  let newEase = ease;
  
  switch (lastResult) {
    case 'again':
      newInterval = 1; // 1 dia
      newEase = Math.max(1.3, ease - 0.2);
      break;
    case 'hard':
      newInterval = Math.max(1, Math.floor(currentInterval * 1.0));
      newEase = Math.max(1.3, ease - 0.15);
      break;
    case 'good':
      newInterval = Math.floor(currentInterval * newEase);
      break;
    case 'easy':
      newInterval = Math.floor(currentInterval * newEase * 1.3);
      newEase = Math.min(2.5, ease + 0.15);
      break;
  }
  
  const dueAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
  return { interval: newInterval, ease: newEase, dueAt };
};
```

### Estados de Feedback Visual
| Avaliação | Cor | Próxima Revisão | Ease Adjustment |
|-----------|-----|-----------------|-----------------|
| Errei | 🔴 Vermelho | 1 dia | -0.2 |
| Difícil | 🟡 Amarelo | 1-2 dias | -0.15 |
| Bom | 🟢 Verde | 4-7 dias | Mantém |
| Fácil | 🔵 Azul | 7+ dias | +0.15 |

---

## 🎤 Fluxo: Pronúncia

### Processo de Análise de Áudio
```mermaid
flowchart TD
    A[Dashboard] --> B[Clica 'Pronúncia']
    B --> C[Carrega Interface]
    C --> D[Exibe Frase Modelo]
    D --> E[Botão 'Ouvir']
    E --> F[Reproduz Áudio]
    F --> G[Botão 'Gravar']
    G --> H{Permissão Mic?}
    H -->|Não| I[Solicita Permissão]
    H -->|Sim| J[Inicia Gravação]
    I --> K{Concedida?}
    K -->|Não| L[Modo Demo]
    K -->|Sim| J
    J --> M[Timer Gravação]
    M --> N[Para Gravação]
    N --> O[Processa Áudio]
    O --> P[Análise IA]
    P --> Q[Exibe Feedback]
    Q --> R{Tentar Novamente?}
    R -->|Sim| G
    R -->|Não| S[Próxima Frase]
```

### Tratamento de Permissões
```javascript
// Gerenciamento de permissões de microfone
const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    });
    
    return { granted: true, stream };
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return { granted: false, error: error.message };
  }
};

// Estados visuais
const microphoneStates = {
  pending: 'Solicitando permissão...',
  granted: 'Pronto para gravar',
  denied: 'Permissão negada - Modo demo',
  recording: 'Gravando... 🎙️',
  processing: 'Analisando áudio...'
};
```

---

## 📊 Fluxo: Dashboard e Progresso

### Carregamento Dinâmico do Dashboard
```mermaid
flowchart LR
    A[Login] --> B[Carrega Dados Usuário]
    B --> C[Parallel Loading]
    C --> D[Métricas Progresso]
    C --> E[Cards Vocabulário]
    C --> F[Sessões Chat]
    C --> G[Lições Disponíveis]
    D --> H[Renderiza Cards]
    E --> H
    F --> H  
    G --> H
    H --> I[Dashboard Completo]
```

### Métricas Calculadas
```javascript
// Cálculos de progresso em tempo real
const calculateUserMetrics = async (userId) => {
  const [chatSessions, vocabReviews, lessons] = await Promise.all([
    getChatSessions(userId),
    getVocabReviews(userId),
    getCompletedLessons(userId)
  ]);
  
  return {
    studyStreak: calculateStreak(chatSessions),
    dailyProgress: getTodayMinutes(chatSessions),
    masteredWords: vocabReviews.filter(r => r.ease > 2.0).length,
    currentLevel: determineLevel(lessons, vocabReviews),
    nextRecommendation: getNextLesson(userId)
  };
};
```

---

## 🔄 Fluxos de Erro e Recuperação

### Tratamento de Falhas de Rede
```mermaid
flowchart TD
    A[Ação do Usuário] --> B[Request API]
    B --> C{Sucesso?}
    C -->|Sim| D[Exibe Resultado]
    C -->|Não| E{Tipo Erro}
    E -->|Network| F[Retry Automático]
    E -->|Server| G[Fallback Local]
    E -->|Auth| H[Redirect Login]
    F --> I{Sucesso Retry?}
    I -->|Não| J[Exibe Erro]
    I -->|Sim| D
    G --> K[Dados Cache/Mock]
    K --> L[Aviso Offline]
```

### Estados de Loading
```javascript
// Estados globais de carregamento
const loadingStates = {
  idle: 'Pronto',
  loading: 'Carregando...',
  success: 'Sucesso',
  error: 'Erro - Tente novamente',
  offline: 'Modo offline ativo'
};

// Componente de Loading Universal
const LoadingSpinner = ({ state, message }) => (
  <div className={`loading-container ${state}`}>
    {state === 'loading' && <Spinner />}
    {state === 'error' && <ErrorIcon />}
    {state === 'offline' && <OfflineIcon />}
    <span>{message || loadingStates[state]}</span>
  </div>
);
```

---

## 📱 Fluxos Mobile-Specific

### Adaptações para Mobile
```mermaid
flowchart TD
    A[Acesso Mobile] --> B[Detecta Dispositivo]
    B --> C[Layout Responsivo]
    C --> D[Touch Interactions]
    D --> E{Funcionalidade}
    E -->|Chat| F[Teclado Virtual]
    E -->|Vocab| G[Swipe Gestures]
    E -->|Audio| H[Native Recording]
    F --> I[Ajusta Viewport]
    G --> J[Haptic Feedback]
    H --> K[Permission Handling]
```

### Gestos Touch
| Ação | Gesto | Feedback |
|------|-------|----------|
| Próximo Card | Swipe Left | Slide Animation |
| Card Anterior | Swipe Right | Slide Back |
| Revelar Resposta | Tap | Flip Animation |
| Menu Rápido | Long Press | Haptic + Menu |

---

## 🎮 Gamificação Flow

### Sistema de Recompensas
```mermaid
flowchart LR
    A[Ação Usuário] --> B[Calcula Pontos]
    B --> C[Atualiza Progresso]
    C --> D{Milestone?}
    D -->|Sim| E[Desbloqueia Badge]
    D -->|Não| F[Salva Progresso]
    E --> G[Animação Conquista]
    G --> H[Notificação]
    H --> F
    F --> I[Dashboard Atualizado]
```

### Triggers de Engajamento
```javascript
// Sistema de conquistas
const achievements = {
  firstChat: {
    name: 'Primeira Conversa',
    description: 'Complete sua primeira conversa com a IA',
    points: 50,
    trigger: (stats) => stats.chatSessions >= 1
  },
  streakWeek: {
    name: 'Semana Consistente', 
    description: 'Estude por 7 dias consecutivos',
    points: 200,
    trigger: (stats) => stats.currentStreak >= 7
  },
  vocabularyMaster: {
    name: 'Mestre das Palavras',
    description: 'Domine 100 palavras de vocabulário',
    points: 500,
    trigger: (stats) => stats.masteredWords >= 100
  }
};
```

Estes fluxos garantem uma experiência de usuário fluida e intuitiva em todas as funcionalidades do AI Linguo.