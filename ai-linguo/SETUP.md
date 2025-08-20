# AI Linguo - Setup Rápido

## Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (opcional, para desenvolvimento local)

## Setup em 3 Comandos

### Opção 1: Docker (Recomendado)
```bash
# 1. Copie as variáveis de ambiente
cp .env.example .env

# 2. Inicie todos os serviços
docker-compose up --build

# 3. Acesse o aplicativo
# http://localhost:3000
```

### Opção 2: Desenvolvimento Local
```bash
# 1. Setup inicial
yarn setup

# 2. Instalar dependências
yarn install

# 3. Iniciar desenvolvimento
yarn dev
```

## Primeiro Acesso

1. **Abra** http://localhost:3000
2. **Clique** em "Começar Agora"
3. **Registre** uma conta com:
   - Nome completo
   - Email válido
   - Senha (mínimo 8 caracteres)
   - Selecione seu nível de inglês

## Testando Funcionalidades

### Chat com IA (Modo Mock)
- Vá para "Praticar Conversa"
- Digite: "I go to school yesterday"
- Veja correções automáticas

### Correção de Escrita
- Vá para "Treinar Escrita" 
- Cole: "I have difficult with english"
- Clique "Verificar Texto"

### Vocabulário SRS
- Vá para "Vocabulário"
- Pratique com flashcards
- Use botões: Errei/Difícil/Bom/Fácil

## Ativando IA Real

1. **Obtenha chave OpenAI**: https://platform.openai.com/api-keys
2. **Edite .env**:
   ```
   OPENAI_API_KEY=sk-sua-chave-aqui
   AI_TUTOR_MOCK=0
   ```
3. **Reinicie**: `docker-compose restart` ou `yarn dev`

## Comandos Úteis

```bash
# Seed banco com dados exemplo
yarn seed

# Testes E2E
yarn test:e2e

# Build para produção
yarn build
yarn start
```

## Troubleshooting

**Porta 3000 ocupada:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Reset completo:**
```bash
docker-compose down -v
docker-compose up --build
```

**Logs do MongoDB:**
```bash
docker-compose logs mongo
```