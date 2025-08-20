# 🤖 AI Linguo - Tutor de Inglês com Inteligência Artificial

**Projeto desenvolvido pelo estudante Arthur Carvalho Leite.**

> Um aplicativo web completo para aprendizado de inglês powered by IA, desenvolvido com Next.js, MongoDB e OpenAI. Inclui conversação inteligente, correção de gramática automática, prática de pronúncia e sistema de vocabulário com algoritmo de revisão espaçada.

![Status](https://img.shields.io/badge/Status-Funcional-brightgreen) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green)

---

## 📋 Índice

- [🚀 Como Rodar (Modo Simples)](#-como-rodar-modo-simples)
- [💻 Setup para Desenvolvimento](#-setup-para-desenvolvimento)
- [🎯 Funcionalidades do App](#-funcionalidades-do-app)
- [📁 Estrutura do Projeto Explicada](#-estrutura-do-projeto-explicada)
- [🔧 Tecnologias e Dependências](#-tecnologias-e-dependências)
- [⚙️ Configuração Detalhada](#️-configuração-detalhada)
- [🧪 Como Executar Testes](#-como-executar-testes)
- [🐛 Resolução de Problemas](#-resolução-de-problemas)
- [🤝 Como Contribuir](#-como-contribuir)

---

## 🚀 Como Rodar (Modo Simples)

> **Para quem só quer ver o app funcionando sem mexer em código**

### 🛠️ Pré-requisitos Obrigatórios

Você precisa ter instalado na sua máquina:

**1. Docker Desktop**
- **Windows/Mac**: Baixe em [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Linux Ubuntu/Debian**: 
  ```bash
  sudo apt update
  sudo apt install docker.io docker-compose
  sudo usermod -aG docker $USER
  # Reinicie o terminal após este comando
  ```

**Como verificar se está instalado:**
```bash
docker --version
# Deve mostrar: Docker version 20.x.x ou superior

docker-compose --version  
# Deve mostrar: docker-compose version 1.29.x ou superior
```

### 📦 Executar o Projeto

**3 comandos e pronto:**

```bash
# 1. Extrair o projeto
unzip ai-linguo.zip && cd ai-linguo

# 2. Configurar ambiente
cp .env.example .env

# 3. Iniciar tudo (vai baixar dependências automaticamente)
docker-compose up --build
```

**⏰ Aguarde**: A primeira execução demora ~3-5 minutos (baixa Node.js, MongoDB, etc.)

**🎉 Pronto!** Abra seu navegador em: **http://localhost:3000**

### 🔴 Para Parar o App
```bash
# No terminal onde está rodando, pressione:
Ctrl + C

# OU em outro terminal:
docker-compose down
```

### ✨ Como Testar o App

1. **Abra**: http://localhost:3000
2. **Clique**: "Começar Agora" 
3. **Registre**: uma conta (pode usar email fictício como `teste@email.com`)
4. **Teste as funcionalidades**:
   - 💬 **Chat IA**: Digite "I go to school yesterday" e veja as correções
   - ✍️ **Correção**: Cole um texto em inglês para análise
   - 🎯 **Vocabulário**: Pratique flashcards com sistema SRS
   - 🎤 **Pronúncia**: Interface de gravação (modo demonstração)

---

## 💻 Setup para Desenvolvimento

> **Para quem quer mexer no código, entender como funciona e desenvolver**

### 🔧 Pré-requisitos para Desenvolvimento

**1. Node.js 18+**
- **Download**: [nodejs.org/download](https://nodejs.org/download/)
- **Verificar**: `node --version` (deve mostrar v18.x.x+)

**2. Yarn (Gerenciador de Pacotes)**
```bash
# Instalar globalmente
npm install -g yarn

# Verificar instalação
yarn --version  # Deve mostrar 1.22.x+
```

**3. Docker (para MongoDB)**
- Mesma instalação do modo simples acima

**4. Git (para versionamento)**
- **Windows**: [git-scm.com](https://git-scm.com/)
- **Mac**: `brew install git`
- **Linux**: `sudo apt install git`

**5. Editor de Código (Recomendado)**
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)
- **Extensões úteis**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense

### 📥 Instalação Completa Passo a Passo

#### **Etapa 1: Preparar Ambiente**
```bash
# Extrair e entrar no projeto
unzip ai-linguo.zip && cd ai-linguo

# Verificar se todas as dependências estão instaladas
node --version    # v18+
yarn --version    # 1.22+  
docker --version  # 20.x+

# Copiar configurações
cp .env.example .env
```

#### **Etapa 2: Instalar Dependências do Projeto**
```bash
# Instalar todas as bibliotecas necessárias
yarn install

# Isso vai instalar ~200 pacotes incluindo:
# - Next.js (framework)
# - React (interface)  
# - Tailwind CSS (estilos)
# - MongoDB Driver (banco)
# - OpenAI SDK (IA)
# - Playwright (testes)
# - E muito mais...
```

#### **Etapa 3: Configurar Banco de Dados**

**Opção A: MongoDB via Docker (Recomendado)**
```bash
# Subir apenas o MongoDB em background
docker-compose up mongo -d

# Verificar se está rodando
docker ps | grep mongo
# Deve mostrar container mongo rodando na porta 27017
```

**Opção B: MongoDB Instalado Localmente**
```bash
# macOS (com Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows: Baixar MSI em mongodb.com/try/download/community
```

#### **Etapa 4: Popular Banco com Dados de Exemplo**
```bash
# Criar automaticamente:
# - 25+ lições de inglês (A1 até C1)
# - 100+ flashcards de vocabulário
# - Exercícios por nível
yarn seed

# Saída esperada:
# ✅ Inserted 25 lessons
# ✅ Inserted 100 vocabulary cards
# 🎉 Database seeded successfully!
```

#### **Etapa 5: Iniciar Modo Desenvolvimento**
```bash
# Servidor com hot-reload (recarrega automático ao alterar código)
yarn dev

# Saída esperada:
# ▲ Next.js 14.2.3
# - Local:    http://localhost:3000
# - Network:  http://0.0.0.0:3000
# ✓ Ready in 2.3s
```

### ⚡ Comandos de Desenvolvimento

```bash
# 🔥 Desenvolvimento
yarn dev          # Servidor desenvolvimento (hot reload)
yarn build        # Build otimizado para produção  
yarn start        # Rodar versão de produção
yarn lint         # Verificar qualidade do código

# 🗄️ Banco de Dados
yarn seed         # Popular com dados de exemplo
# Para resetar: apagar volume Docker e rodar seed novamente

# 🧪 Testes
yarn test:e2e     # Testes end-to-end com Playwright
# Testa: registro, login, chat, vocabulário, etc.

# 🐳 Docker
yarn docker:build    # Construir imagem Docker
yarn docker:up       # Subir com Docker Compose
yarn docker:dev      # Build + subir (desenvolvimento)

# 🔧 Utilitários
yarn setup        # cp .env.example .env + yarn install
```

### 🔄 Fluxo de Desenvolvimento Típico

```bash
# 1. Fazer alterações no código
# Exemplo: editar src/pages/page.js para mudar interface

# 2. Ver mudanças em tempo real
# Abrir http://localhost:3000 (recarrega automaticamente)

# 3. Testar se não quebrou nada
yarn test:e2e

# 4. Verificar qualidade do código
yarn lint

# 5. Build final (opcional)
yarn build
```

---

## 🎯 Funcionalidades do App

### 🤖 **Chat com IA Tutor**
- **O que faz**: Conversa natural em inglês com correções em tempo real
- **Como funciona**: Usa OpenAI GPT-4o-mini para analisar sua mensagem e retornar:
  - Resposta natural em inglês
  - Até 3 correções gramaticais com explicações em português
  - Mini-exercício baseado no seu erro
- **Adaptativo**: Ajusta dificuldade conforme seu nível CEFR (A1-C1)

### ✍️ **Correção de Escrita**
- **O que faz**: Analisa textos longos e corrige gramática/estilo
- **Como funciona**: 
  - Você cola um parágrafo em inglês
  - IA identifica erros e gera versão corrigida
  - Mostra diff visual (vermelho=erro, verde=correção)
  - Explica cada regra aplicada
- **Útil para**: Emails, redações, textos profissionais

### 🎤 **Prática de Pronúncia**
- **O que faz**: Avalia sua pronúncia e dá dicas específicas
- **Como funciona**:
  - Sistema reproduz frase modelo
  - Você grava sua tentativa
  - IA compara e gera feedback com dicas articulatórias
  - Focado em dificuldades de brasileiros (th, r, v/w, etc.)

### 🎯 **Vocabulário com SRS (Spaced Repetition System)**
- **O que faz**: Flashcards inteligentes que otimizam memorização
- **Como funciona**:
  - Algoritmo similar ao Anki
  - Cards aparecem em intervalos calculados
  - Errou → aparece em 1 dia
  - Acertou → intervalo aumenta (4, 10, 25 dias...)
  - Mantém curva de esquecimento otimizada

### 📊 **Dashboard de Progresso**
- **Métricas**: Sequência de dias, minutos estudados, nível atual
- **Metas**: Configuráveis (15min/dia padrão)
- **Gamificação**: Sistema de pontos e conquistas simples

---

## 📁 Estrutura do Projeto Explicada

```
ai-linguo/
├── 📂 src/                      # 🎯 Código fonte principal
│   ├── 📂 pages/               # 🖥️ Interface do usuário (Next.js)
│   │   ├── 📄 page.js          # ⭐ Aplicação principal (SPA)
│   │   ├── 📄 layout.js        # 🏗️ Layout geral (HTML, meta tags)
│   │   └── 📂 api/             # 🔌 Backend APIs
│   │       ├── 📂 auth/        # 🔐 Login e registro
│   │       ├── 📂 tutor/       # 🤖 IA conversacional  
│   │       ├── 📂 chat/        # 💬 Sessões de chat
│   │       └── 📂 vocabulary/  # 🎯 Sistema SRS
│   ├── 📂 components/          # 🧩 Componentes reutilizáveis
│   │   └── 📂 ui/             # 🎨 Biblioteca shadcn/ui
│   ├── 📂 lib/                # 🛠️ Funções utilitárias
│   ├── 📂 hooks/              # ⚡ React hooks customizados
│   └── 📂 styles/             # 🎨 Estilos CSS
│       └── 📄 globals.css     # 🌐 Tailwind + customizações
├── 📂 scripts/                # 🔧 Scripts de automação
│   └── 📄 seed.js            # 🌱 Popular banco de dados
├── 📂 tests/                  # 🧪 Testes automatizados
│   └── 📄 smoke.spec.js      # 🔍 Testes E2E principais
├── 📂 public/                 # 📁 Arquivos estáticos
├── 📄 docker-compose.yml      # 🐳 Orquestração de containers
├── 📄 Dockerfile             # 🐳 Imagem da aplicação
├── 📄 package.json           # 📦 Dependências e scripts
├── 📄 .env.example           # ⚙️ Modelo de configuração
└── 📄 README.md              # 📖 Este arquivo
```

### 🔍 **Detalhamento dos Arquivos Principais**

#### 📄 `src/pages/page.js` - Interface Principal
**O que é**: Aplicação React completa (SPA - Single Page Application)
**O que contém**:
- Landing page animada com Framer Motion
- Sistema de autenticação (modais de login/registro)
- Dashboard do usuário
- Interface de chat com IA
- Telas de correção de escrita, vocabulário e pronúncia

**Se você mexer aqui, estará alterando**:
- Layout e design das telas
- Fluxo de navegação entre seções
- Componentes visuais (botões, formulários, cards)
- Animações e transições
- Estados da aplicação (login, mensagens, etc.)

#### 📄 `src/pages/layout.js` - Configuração Geral
**O que é**: Wrapper que envolve toda a aplicação
**O que contém**:
- Tag `<html>` e `<body>`
- Metadados (título, descrição, favicon)
- Configuração de fontes (Inter)
- Providers globais

**Se você mexer aqui, estará alterando**:
- Título da aba do navegador
- Metadados para SEO
- Fonte padrão da aplicação
- Configurações globais de contexto

#### 📂 `src/pages/api/` - Backend (APIs)

**📁 `auth/`** - Sistema de Autenticação
- `login/route.js`: Verifica email/senha e retorna token
- `register/route.js`: Cria nova conta de usuário
**Se mexer**: Alterar regras de login, validações, criptografia

**📁 `tutor/`** - Inteligência Artificial
- `route.js`: Processa mensagens do chat, chama OpenAI, formata correções
**Se mexer**: Ajustar comportamento da IA, prompts, tipos de exercício

**📁 `vocabulary/`** - Sistema SRS
- `due/route.js`: Retorna flashcards que estão "vencendo"
- `review/route.js`: Processa resposta do usuário e calcula próxima revisão
**Se mexer**: Alterar algoritmo SRS, intervalos, dificuldade

#### 📂 `src/components/ui/` - Componentes Visuais
**O que é**: Biblioteca shadcn/ui com componentes profissionais
**Principais arquivos**:
- `button.jsx`: Botões com variantes (primary, outline, ghost)
- `card.jsx`: Cards com header, content, footer
- `dialog.jsx`: Modais e pop-ups
- `input.jsx`: Campos de texto
- `select.jsx`: Dropdowns
- `tabs.jsx`: Abas navegáveis

**Se mexer**: Personalizar aparência, criar novos componentes, alterar comportamentos

#### 📄 `scripts/seed.js` - Dados de Exemplo
**O que faz**: Popula MongoDB com conteúdo educacional
**Conteúdo criado**:
- 25+ lições por nível CEFR (A1 até C1)
- 100+ flashcards de vocabulário contextual
- Exemplos de frases e exercícios

**Se mexer**: Adicionar mais lições, personalizar vocabulário, criar novos níveis

#### 📄 `package.json` - Configuração do Projeto
**Dependências principais**:
```json
{
  "next": "14.2.3",           // Framework React
  "react": "^18.3.1",         // Biblioteca de UI
  "tailwindcss": "^3.4.1",    // CSS utilitário
  "mongodb": "^6.6.0",        // Driver do banco
  "openai": "^5.13.1",        // SDK da OpenAI
  "framer-motion": "^12.23.12" // Animações
}
```

**Scripts disponíveis**:
- `dev`: Desenvolvimento com hot reload
- `build`: Build otimizado
- `test:e2e`: Testes automatizados
- `seed`: Popular banco de dados

#### 📄 `docker-compose.yml` - Orquestração
**Serviços definidos**:
- `app`: Aplicação Next.js (porta 3000)
- `mongo`: MongoDB (porta 27017)

**Configuração de volumes** para persistência de dados
**Variáveis de ambiente** injetadas automaticamente

---

## 🔧 Tecnologias e Dependências

### 🎨 **Frontend (Interface)**

#### **Next.js 14** - Framework Principal
- **O que é**: Framework React com recursos avançados (SSR, API Routes, otimizações)
- **Por que usar**: Desenvolvimento rápido, SEO-friendly, full-stack em um projeto
- **Como instalar**: `yarn add next react react-dom`

#### **Tailwind CSS** - Estilização
- **O que é**: Framework CSS utilitário (classes pré-definidas)
- **Por que usar**: Desenvolvimento rápido, consistência visual, responsivo por padrão
- **Como instalar**: 
  ```bash
  yarn add tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

#### **Framer Motion** - Animações
- **O que é**: Biblioteca de animações para React
- **Por que usar**: Animações fluidas e performáticas
- **Como instalar**: `yarn add framer-motion`

#### **shadcn/ui** - Componentes
- **O que é**: Biblioteca de componentes baseada em Radix UI + Tailwind
- **Por que usar**: Componentes acessíveis, customizáveis e profissionais
- **Como instalar**: 
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card dialog
  ```

### 🔧 **Backend (Servidor)**

#### **Next.js API Routes** - APIs Serverless
- **O que é**: Backend integrado ao Next.js
- **Por que usar**: Full-stack em um projeto, deploy simplificado
- **Localização**: `src/pages/api/`

#### **MongoDB** - Banco de Dados
- **O que é**: Banco NoSQL orientado a documentos
- **Por que usar**: Flexível para dados dinâmicos, escalável
- **Como instalar**: 
  ```bash
  # Via Docker (recomendado)
  docker run -d -p 27017:27017 mongo:7
  
  # Via package manager
  brew install mongodb/brew/mongodb-community  # macOS
  sudo apt install mongodb  # Ubuntu
  ```

#### **OpenAI SDK** - Inteligência Artificial
- **O que é**: SDK oficial para integração com GPT models
- **Por que usar**: IA conversacional avançada para tutoria
- **Como instalar**: `yarn add openai`
- **Configuração**: Necessita `OPENAI_API_KEY` no `.env`

### 🧪 **Qualidade e Testes**

#### **Playwright** - Testes E2E
- **O que é**: Framework de testes automatizados multi-browser
- **Por que usar**: Testa fluxos completos como usuário real
- **Como instalar**: 
  ```bash
  yarn add -D @playwright/test
  npx playwright install
  ```

#### **ESLint** - Qualidade de Código
- **O que é**: Linter para JavaScript/TypeScript
- **Por que usar**: Detecta bugs, mantém consistência
- **Como usar**: `yarn lint`

### 🐳 **DevOps e Deploy**

#### **Docker** - Containerização
- **O que é**: Plataforma de containers
- **Por que usar**: Ambiente consistente, fácil distribuição
- **Arquivos**: `Dockerfile`, `docker-compose.yml`

#### **UUID** - Identificadores Únicos
- **O que é**: Gerador de IDs únicos
- **Por que usar**: IDs únicos para banco sem conflitos
- **Como instalar**: `yarn add uuid`

### 📦 **Instalação Completa do Ambiente**

#### **Windows**
```powershell
# 1. Node.js
# Baixar: https://nodejs.org/download/
# Instalar MSI

# 2. Yarn
npm install -g yarn

# 3. Docker Desktop
# Baixar: https://www.docker.com/products/docker-desktop

# 4. Git
# Baixar: https://git-scm.com/download/win

# 5. VS Code (opcional)
# Baixar: https://code.visualstudio.com/
```

#### **macOS**
```bash
# 1. Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Node.js
brew install node

# 3. Yarn
npm install -g yarn

# 4. Docker Desktop
brew install --cask docker

# 5. Git
brew install git
```

#### **Ubuntu/Debian**
```bash
# 1. Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Yarn
npm install -g yarn

# 3. Docker
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER

# 4. Git
sudo apt install git
```

---

## ⚙️ Configuração Detalhada

### 📄 **Arquivo `.env` - Variáveis de Ambiente**

```bash
# 🏷️ Identidade do Projeto
PROJECT_NAME=AI Linguo           # Nome exibido na interface
NODE_ENV=development             # development | production

# 🗄️ Banco de Dados
MONGODB_URI=mongodb://mongo:27017/ailinguo  # URL do MongoDB
DB_NAME=ailinguo                 # Nome do banco

# 🤖 Inteligência Artificial
OPENAI_API_KEY=                  # Sua chave da OpenAI (opcional)
OPENAI_MODEL=gpt-4o-mini         # Modelo principal (mais barato)
OPENAI_MODEL_FALLBACK=gpt-4o     # Modelo premium (backup)
AI_TUTOR_MOCK=1                  # 1=respostas simuladas | 0=IA real

# 🌐 Configurações da Aplicação
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # URL base
CORS_ORIGINS=*                   # Origens permitidas
```

#### 🔑 **Como Obter Chave da OpenAI (Opcional)**

1. **Criar conta**: [platform.openai.com](https://platform.openai.com/)
2. **Ir para API Keys**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. **Create new secret key**
4. **Copiar chave**: `sk-...` (começa sempre com sk-)
5. **Editar `.env`**: 
   ```bash
   OPENAI_API_KEY=sk-sua-chave-aqui
   AI_TUTOR_MOCK=0
   ```
6. **Restart**: `docker-compose restart`

**💰 Custos**: GPT-4o-mini custa ~$0.15 por 1M tokens (~750 palavras)

### 🐳 **Docker - Como Funciona**

#### **docker-compose.yml Explicado**
```yaml
services:
  app:                    # Aplicação Next.js
    build: .              # Usar Dockerfile local
    ports:
      - "3000:3000"       # Porta externa:interna
    environment:          # Variáveis do .env
      - MONGODB_URI=mongodb://mongo:27017/ailinguo
    depends_on:
      - mongo             # Aguardar MongoDB iniciar
    volumes:
      - .:/app            # Sincronizar código (dev)
      
  mongo:                  # Banco de dados
    image: mongo:7        # Imagem oficial MongoDB v7
    ports:
      - "27017:27017"     # Porta padrão MongoDB
    volumes:
      - mongo_data:/data/db  # Persistir dados
    environment:
      - MONGO_INITDB_DATABASE=ailinguo

volumes:
  mongo_data:             # Volume nomeado para dados
```

#### **Dockerfile Explicado**
```dockerfile
FROM node:18-alpine      # Base: Node.js 18 (versão leve)
WORKDIR /app            # Diretório de trabalho

COPY package*.json ./   # Copiar apenas package.json primeiro
RUN yarn install        # Instalar dependências (cache layer)

COPY . .               # Copiar código fonte
RUN yarn build         # Build otimizado para produção

EXPOSE 3000            # Documentar porta exposta
CMD ["yarn", "start"]  # Comando padrão
```

### 🗄️ **MongoDB - Estrutura dos Dados**

#### **Coleções (Tabelas)**
```javascript
// Usuários
users: {
  _id: "uuid-string",
  email: "usuario@email.com",
  name: "Nome Completo",
  password: "hash-senha",        // Em produção: bcrypt
  cefrLevel: "B1",               // A1, A2, B1, B2, C1
  dailyGoalMinutes: 15,
  createdAt: Date,
  streakDays: 0,
  totalMinutes: 0
}

// Lições estruturadas
lessons: {
  _id: "uuid-string",
  cefrLevel: "A1",
  title: "Basic Greetings",
  contentMarkdown: "# Hello\n\nLearn...",
  estimatedMinutes: 10
}

// Flashcards de vocabulário
vocabCards: {
  _id: "uuid-string",
  term: "beautiful",
  meaning: "bonito/bonita",
  example: "The sunset is beautiful",
  cefrLevel: "A2"
}

// Revisões SRS (Spaced Repetition)
srsReviews: {
  _id: "uuid-string",
  userId: "user-uuid",
  cardId: "card-uuid",
  dueAt: Date,                   // Quando revisar novamente
  interval: 4,                   // Dias até próxima revisão
  ease: 2.5,                     // Fator de facilidade
  lastResult: "good"             // easy|good|hard|again
}

// Sessões de chat
chatSessions: {
  _id: "uuid-string",
  userId: "user-uuid",
  level: "B1",
  topic: "general",
  createdAt: Date,
  summary: "Praticou past tense..."
}

// Mensagens do chat
chatTurns: {
  _id: "uuid-string",
  sessionId: "session-uuid",
  role: "user" | "assistant",
  text: "Hello, I go yesterday...",
  corrections: [
    {
      original: "I go",
      corrected: "I went", 
      explanation: "Past tense...",
      rule: "Past Simple"
    }
  ],
  createdAt: Date
}
```

---

## 🧪 Como Executar Testes

### 🎭 **Testes E2E (End-to-End) com Playwright**

#### **Primeira Execução**
```bash
# Instalar navegadores necessários
npx playwright install

# Executar todos os testes
yarn test:e2e
```

#### **Opções Avançadas**
```bash
# Modo interativo (visualizar testes rodando)
yarn test:e2e --ui

# Rodar teste específico
yarn test:e2e tests/smoke.spec.js

# Rodar em navegador específico
yarn test:e2e --project=chromium

# Debug mode (pausar em falhas)
yarn test:e2e --debug
```

#### **O que os Testes Verificam**

1. **✅ Landing Page**: Carregamento, botões, navegação
2. **✅ Autenticação**: Registro de usuário, login, validações
3. **✅ Dashboard**: Exibição de dados, navegação entre seções
4. **✅ Chat IA**: Envio de mensagens, recebimento de correções
5. **✅ Correção de Escrita**: Processamento de texto, diffs
6. **✅ Vocabulário**: Flashcards, sistema SRS, avaliações
7. **✅ Pronúncia**: Interface de gravação, feedback

#### **Interpretar Resultados**
```bash
# Saída típica:
Running 8 tests using 1 worker

  ✓ landing page loads correctly (2.1s)
  ✓ user can register and login (4.2s)
  ✓ chat functionality works (3.8s)
  ✓ vocabulary practice works (2.5s)
  ✗ writing correction fails (1.2s)  # ❌ Teste falhou

  7 passed, 1 failed (14.1s)

# Se algum teste falhar:
# 1. Checar se aplicação está rodando
# 2. Ver relatório HTML em: playwright-report/index.html
# 3. Screenshots automáticos em caso de erro
```

### 🔍 **Testes Manuais Recomendados**

#### **Fluxo Básico**
```
1. 🏠 Landing Page
   ✅ Página carrega sem erros
   ✅ Animações funcionam
   ✅ Botões são clicáveis

2. 🔐 Autenticação  
   ✅ Registro com dados válidos
   ✅ Login com credenciais corretas
   ✅ Validação de campos obrigatórios

3. 📊 Dashboard
   ✅ Dados do usuário aparecem
   ✅ Navegação entre seções funciona
   ✅ Progresso é exibido corretamente

4. 💬 Chat IA
   ✅ Mensagem é enviada
   ✅ Resposta da IA aparece
   ✅ Correções são destacadas
   ✅ Exercícios são gerados

5. ✍️ Correção de Escrita
   ✅ Texto é processado
   ✅ Diff visual funciona
   ✅ Explicações aparecem

6. 🎯 Vocabulário
   ✅ Flashcards carregam
   ✅ Botões de avaliação funcionam
   ✅ Progresso é salvo
```

---

## 🐛 Resolução de Problemas

### ❌ **Problemas Comuns de Instalação**

#### **"Port 3000 already in use"**
```bash
# Encontrar processo ocupando porta
lsof -ti:3000

# Matar processo
lsof -ti:3000 | xargs kill -9

# OU usar porta diferente
PORT=3001 yarn dev
```

#### **"Docker não inicia"**
```bash
# Verificar se Docker está rodando
docker --version
docker ps

# Linux: iniciar serviço Docker
sudo systemctl start docker
sudo systemctl enable docker

# Windows/Mac: abrir Docker Desktop
```

#### **"yarn install falhou"**
```bash
# Limpar cache e reinstalar
yarn cache clean
rm -rf node_modules
rm yarn.lock
yarn install

# Se persistir, verificar versão Node
node --version  # Deve ser 18+
```

#### **"MongoDB connection failed"**
```bash
# Verificar se MongoDB está rodando
docker ps | grep mongo

# Reiniciar container
docker-compose restart mongo

# Ver logs do MongoDB
docker-compose logs mongo

# Verificar conectividade
telnet localhost 27017  # Deve conectar
```

#### **"Next.js não compila"**
```bash
# Limpar cache do Next.js
rm -rf .next

# Verificar sintaxe JavaScript
yarn lint

# Build com mais detalhes
yarn build --debug
```

### 🔧 **Problemas de Desenvolvimento**

#### **"Mudanças não aparecem"**
```bash
# Verificar se está em modo dev
yarn dev  # Não yarn start

# Forçar restart
# Ctrl+C e yarn dev novamente

# Limpar cache
rm -rf .next
yarn dev
```

#### **"IA não responde (OpenAI)"**
```bash
# Verificar .env
cat .env | grep OPENAI

# Modo mock ativo?
AI_TUTOR_MOCK=1  # Usar respostas simuladas
AI_TUTOR_MOCK=0  # Usar OpenAI real

# Testar chave da API
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

#### **"Banco de dados vazio"**
```bash
# Popular com dados
yarn seed

# Verificar se populou
docker exec -it $(docker ps -q -f name=mongo) mongosh
use ailinguo
db.lessons.count()  # Deve mostrar 25+
db.vocabCards.count()  # Deve mostrar 100+
```

#### **"Testes E2E falhando"**
```bash
# Verificar se app está rodando
curl http://localhost:3000

# Instalar navegadores
npx playwright install

# Rodar um teste por vez
yarn test:e2e tests/smoke.spec.js --headed
```

### 🚨 **Reset Completo do Projeto**

Se nada funcionar, reset total:

```bash
# 1. Parar tudo
docker-compose down -v

# 2. Limpar Node.js
rm -rf node_modules .next yarn.lock

# 3. Limpar Docker (cuidado!)
docker system prune -a

# 4. Reinstalar tudo
yarn install

# 5. Recriar containers
docker-compose up --build

# 6. Popular banco
yarn seed
```

### 📞 **Logs para Debug**

```bash
# Logs da aplicação em tempo real
docker-compose logs -f app

# Logs do MongoDB
docker-compose logs mongo

# Logs do Next.js (development)
yarn dev  # Mostra no terminal

# Verificar logs do navegador
# F12 → Console → ver erros JavaScript
```

---

## 🤝 Como Contribuir

### 🛠️ **Adicionando Novas Funcionalidades**

#### **1. Nova Tela/Página**
```javascript
// Em src/pages/page.js
const [currentView, setCurrentView] = useState('landing');

// Adicionar nova view
if (currentView === 'minha-nova-tela') {
  return (
    <div>
      <h1>Minha Nova Tela</h1>
      {/* Seu conteúdo aqui */}
    </div>
  );
}

// Adicionar navegação
<Button onClick={() => setCurrentView('minha-nova-tela')}>
  Ir para Nova Tela
</Button>
```

#### **2. Nova API**
```javascript
// Criar src/pages/api/minha-api/route.js
export async function GET(request) {
  return Response.json({ message: 'Hello World' });
}

export async function POST(request) {
  const body = await request.json();
  // Processar dados
  return Response.json({ success: true });
}
```

#### **3. Novo Componente UI**
```javascript
// Criar src/components/MeuComponente.jsx
export function MeuComponente({ titulo, children }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">{titulo}</h2>
      {children}
    </div>
  );
}

// Usar em pages/page.js
import { MeuComponente } from '@/components/MeuComponente';

<MeuComponente titulo="Teste">
  Conteúdo aqui
</MeuComponente>
```

### 🎨 **Personalizando Visual**

#### **Alterar Cores**
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 220 100% 50%;    /* Azul padrão */
    --secondary: 270 100% 50%;  /* Roxo */
    --accent: 120 100% 50%;     /* Verde */
  }
}
```

#### **Alterar Fontes**
```javascript
// src/pages/layout.js
import { Roboto } from 'next/font/google';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

// Aplicar
<body className={roboto.className}>
```

#### **Personalizar Componentes shadcn/ui**
```bash
# Gerar componente personalizado
npx shadcn-ui@latest add button

# Editar em src/components/ui/button.jsx
# Alterar variantes, cores, tamanhos
```

### 📚 **Adicionando Conteúdo Educacional**

#### **Novas Lições**
```javascript
// Editar scripts/seed.js
const lessons = [
  {
    _id: uuidv4(),
    cefrLevel: 'A1',
    title: 'Minha Nova Lição',
    contentMarkdown: `
# Título da Lição

## Conteúdo
Explicação aqui...

## Exercícios
1. Pergunta 1
2. Pergunta 2
    `,
    estimatedMinutes: 15
  }
];
```

#### **Novos Flashcards**
```javascript
// Em scripts/seed.js
const vocabCards = [
  {
    _id: uuidv4(),
    term: 'understand',
    meaning: 'entender',
    example: 'I understand English now',
    cefrLevel: 'A2'
  }
];
```

#### **Ajustar Comportamento da IA**
```javascript
// Em src/pages/api/tutor/route.js
const getTutorPrompt = (userLevel) => `
Você é um tutor de inglês especializado.

Nível do usuário: ${userLevel}

Suas regras:
1. Sempre responda em inglês primeiro
2. Dê no máximo 3 correções
3. Seja encorajador
4. Foque em erros comuns de brasileiros

// Personalizar prompt aqui
`;
```

### 🚀 **Workflow de Desenvolvimento**

```bash
# 1. Criar branch para feature
git checkout -b minha-nova-feature

# 2. Fazer alterações
# Editar arquivos...

# 3. Testar localmente
yarn dev
yarn test:e2e

# 4. Commit das mudanças
git add .
git commit -m "feat: adicionar nova funcionalidade X"

# 5. Push e Pull Request
git push origin minha-nova-feature
# Abrir PR no GitHub
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Desenvolvedor

**Projeto desenvolvido pelo estudante Arthur Carvalho Leite.**

- 📧 **Email**: [arthur@exemplo.com](mailto:arthur@exemplo.com)
- 🐙 **GitHub**: [@arthurleite](https://github.com/arthurleite)
- 💼 **LinkedIn**: [Arthur Carvalho Leite](https://linkedin.com/in/arthurleite)
- 📍 **Local**: Brasil

### 🎓 **Sobre o Desenvolvedor**
Estudante apaixonado por tecnologia e educação, com foco em desenvolvimento web full-stack e aplicações de inteligência artificial para educação. Este projeto representa a aplicação prática de conhecimentos em React, Next.js, MongoDB e integração com APIs de IA.

---

## 🙏 Agradecimentos

- **OpenAI** - pela API GPT que torna a tutoria inteligente possível
- **Vercel** - pelo framework Next.js e plataforma de deploy
- **shadcn/ui** - pelos componentes de interface profissionais  
- **MongoDB** - pelo banco de dados flexível e escalável
- **Comunidade Open Source** - pelas inúmeras bibliotecas que tornaram este projeto possível

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!**

**📚 Para documentação adicional, visite: [https://arthurleite.github.io/ai-linguo](https://arthurleite.github.io/ai-linguo)**