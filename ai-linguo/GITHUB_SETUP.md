# 🚀 Setup GitHub + Deploy Automático

## 📋 Passo a Passo Completo

### 1. 🔧 Preparar o Projeto Local
```bash
# Extrair e entrar na pasta
unzip ai-linguo.zip && cd ai-linguo

# Testar se funciona localmente
cp .env.example .env
docker-compose up --build
# Acesse: http://localhost:3000
```

### 2. 📦 Criar Repositório no GitHub

1. **Vá para GitHub.com**
2. **Clique em "New repository"**
3. **Nome**: `ai-linguo` (ou outro nome)
4. **Descrição**: "Tutor de Inglês com IA"
5. **Público ou Privado** (sua escolha)
6. **NÃO marque** "Add README" (já temos)
7. **Clique "Create repository"**

### 3. 🔗 Conectar Projeto ao GitHub
```bash
# Dentro da pasta ai-linguo
git init
git add .
git commit -m "Projeto AI Linguo inicial - Arthur Carvalho Leite"

# Substituir por SEU usuário e repositório
git remote add origin https://github.com/SEU-USUARIO/ai-linguo.git
git branch -M main
git push -u origin main
```

### 4. ⚙️ Configurar GitHub Pages

1. **No seu repositório**, vá em **Settings**
2. **Lado esquerdo**: clique em **Pages**
3. **Source**: selecione **"GitHub Actions"**
4. **Save**

### 5. 🎯 Primeiro Deploy

Aguarde alguns minutos... o GitHub Actions vai:
- ✅ Executar testes
- ✅ Fazer build
- ✅ Deploy automático

Seu site estará em: `https://SEU-USUARIO.github.io/ai-linguo`

## 🔄 Fluxo de Trabalho Diário

### Comandos Simples:
```bash
# Fazer alterações no código...
# Exemplo: editar README.md, alterar cores, etc.

# Deploy em 1 comando:
yarn deploy
```

### OU passo a passo:
```bash
git add .
git commit -m "Suas alterações aqui"
git push
```

**Resultado**: Deploy automático em ~5 minutos! 🚀

## 📸 Screenshots do Processo

### GitHub Repository Creation:
```
New Repository → ai-linguo → Create
```

### Settings → Pages:
```
Settings → Pages → Source: GitHub Actions → Save
```

### Actions Tab (Deploy Status):
```
Actions → ✅ Deploy to GitHub Pages → ✅ Complete
```

## 🛠️ Personalização Avançada

### Alterar URL do Site:
Se quiser usar domínio personalizado (`seusite.com`):

1. **Settings → Pages → Custom domain**
2. **Digite seu domínio**
3. **Criar arquivo** `public/CNAME` com seu domínio

### Alterar Branch de Deploy:
No arquivo `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [ main ]  # Mudar para develop, etc.
```

### Variables de Ambiente no GitHub:
1. **Settings → Secrets and variables → Actions**
2. **New repository secret**
3. **Nome**: `OPENAI_API_KEY`
4. **Value**: sua chave da OpenAI

## 🚨 Troubleshooting

### ❌ Deploy Falhou
1. **Actions tab** → ver erro
2. **Comum**: dependências desatualizadas
3. **Solução**: `yarn install` e push novamente

### ❌ Site não abre
1. **Aguardar 10 minutos** (primeira vez demora)
2. **Verificar** se Pages está ativo em Settings
3. **URL correta**: `https://USUARIO.github.io/REPO`

### ❌ Mudanças não aparecem
```bash
# Forçar rebuild
git commit --allow-empty -m "Force rebuild"
git push
```

## 🎉 Resultado Final

✅ **Repositório criado**
✅ **Deploy automático configurado**  
✅ **Site funcionando**: `https://seu-usuario.github.io/ai-linguo`
✅ **Fluxo**: `editar → yarn deploy → site atualizado`

**Parabéns! Seu projeto está no ar! 🚀**