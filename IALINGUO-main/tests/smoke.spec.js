const { test, expect } = require('@playwright/test');

test.describe('AI Linguo Smoke Tests', () => {
  
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is present
    await expect(page.locator('h1')).toContainText('AI Linguo');
    
    // Check if the main CTA button is present
    await expect(page.locator('text="Começar Agora"')).toBeVisible();
    
    // Check if feature cards are present
    await expect(page.locator('text="Conversação Guiada"')).toBeVisible();
    await expect(page.locator('text="Correção de Escrita"')).toBeVisible();
    await expect(page.locator('text="Prática de Pronúncia"')).toBeVisible();
    await expect(page.locator('text="Vocabulário SRS"')).toBeVisible();
  });

  test('demo page works', async ({ page }) => {
    await page.goto('/');
    
    // Click demo button
    await page.click('text="Ver Demo"');
    
    // Should navigate to demo view
    await expect(page.locator('text="Demonstração Interativa"')).toBeVisible();
    
    // Check if demo content is present
    await expect(page.locator('text="I go to school yesterday"')).toBeVisible();
    await expect(page.locator('text="Correções:"')).toBeVisible();
    
    // Go back to landing
    await page.click('text="← Voltar"');
    await expect(page.locator('h1')).toContainText('AI Linguo');
  });

  test('registration dialog opens', async ({ page }) => {
    await page.goto('/');
    
    // Open registration dialog
    await page.click('text="Começar Agora"').first();
    
    // Dialog should be open
    await expect(page.locator('text="Criar conta no AI Linguo"')).toBeVisible();
    
    // Check form fields
    await expect(page.locator('input[placeholder="Seu nome"]')).toBeVisible();
    await expect(page.locator('input[placeholder="seu@email.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Mínimo 8 caracteres"]')).toBeVisible();
  });

  test('user can register and login', async ({ page }) => {
    await page.goto('/');
    
    // Open registration dialog
    await page.click('text="Começar Agora"').first();
    
    // Fill registration form
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[placeholder="Seu nome"]', 'João Teste');
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'senha12345');
    
    // Select CEFR level
    await page.click('[role="combobox"]');
    await page.click('text="B1 - Intermediário"');
    
    // Submit registration
    await page.click('text="Criar Conta Gratuita"');
    
    // Should redirect to dashboard
    await expect(page.locator('text="Olá, João Teste!"')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text="Continue sua jornada"')).toBeVisible();
  });

  test('chat functionality works', async ({ page }) => {
    // First register a user
    await page.goto('/');
    await page.click('text="Começar Agora"').first();
    
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[placeholder="Seu nome"]', 'Maria Silva');
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'senha12345');
    
    await page.click('[role="combobox"]');
    await page.click('text="A2 - Elementar"');
    await page.click('text="Criar Conta Gratuita"');
    
    // Wait for dashboard
    await expect(page.locator('text="Olá, Maria Silva!"')).toBeVisible({ timeout: 10000 });
    
    // Click on chat practice
    await page.click('text="Praticar Conversa"');
    
    // Should be on chat page
    await expect(page.locator('text="Tutor IA"')).toBeVisible();
    
    // Send a test message
    await page.fill('input[placeholder*="mensagem"]', 'Hello, I go to school yesterday');
    await page.click('button:has-text("Send"), button[aria-label*="Send"]').first();
    
    // Should receive AI response with corrections
    await expect(page.locator('text="Good effort!"')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text="Correções:"')).toBeVisible();
  });

  test('vocabulary practice works', async ({ page }) => {
    // Register and login
    await page.goto('/');
    await page.click('text="Começar Agora"').first();
    
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[placeholder="Seu nome"]', 'Pedro Santos');
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'senha12345');
    
    await page.click('[role="combobox"]');
    await page.click('text="B1 - Intermediário"');
    await page.click('text="Criar Conta Gratuita"');
    
    // Wait for dashboard
    await expect(page.locator('text="Olá, Pedro Santos!"')).toBeVisible({ timeout: 10000 });
    
    // Click on vocabulary practice
    await page.click('text="Vocabulário"');
    
    // Should show vocabulary cards
    await expect(page.locator('text="apple"')).toBeVisible();
    await expect(page.locator('text="maçã"')).toBeVisible();
    
    // Test card review
    await page.click('text="Fácil"');
    
    // Should show next card or completion message
    const hasNextCard = await page.locator('text="beautiful"').isVisible();
    const hasCompletion = await page.locator('text="Parabéns!"').isVisible();
    
    expect(hasNextCard || hasCompletion).toBeTruthy();
  });

  test('writing correction interface loads', async ({ page }) => {
    // Register and login first
    await page.goto('/');
    await page.click('text="Começar Agora"').first();
    
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[placeholder="Seu nome"]', 'Ana Costa');
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'senha12345');
    
    await page.click('[role="combobox"]');
    await page.click('text="C1 - Avançado"');
    await page.click('text="Criar Conta Gratuita"');
    
    // Wait for dashboard
    await expect(page.locator('text="Olá, Ana Costa!"')).toBeVisible({ timeout: 10000 });
    
    // Go to writing correction
    await page.click('text="Treinar Escrita"');
    
    // Should show writing interface
    await expect(page.locator('text="Correção de Escrita"')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    
    // Test text input
    await page.fill('textarea', 'I have a difficult with english grammar and writing');
    await page.click('text="Verificar Texto"');
    
    // Should process the text (even if mock)
    await expect(page.locator('text="Analisando..."')).toBeVisible();
  });

  test('pronunciation interface loads', async ({ page }) => {
    // Register and login first
    await page.goto('/');
    await page.click('text="Começar Agora"').first();
    
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[placeholder="Seu nome"]', 'Carlos Lima');
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'senha12345');
    
    await page.click('[role="combobox"]');
    await page.click('text="A1 - Iniciante (Básico)"');
    await page.click('text="Criar Conta Gratuita"');
    
    // Wait for dashboard
    await expect(page.locator('text="Olá, Carlos Lima!"')).toBeVisible({ timeout: 10000 });
    
    // Go to pronunciation practice
    await page.click('text="Pronúncia"');
    
    // Should show pronunciation interface
    await expect(page.locator('text="Prática de Pronúncia"')).toBeVisible();
    await expect(page.locator('text="The quick brown fox"')).toBeVisible();
    
    // Check buttons are present
    await expect(page.locator('text="Ouvir"')).toBeVisible();
    await expect(page.locator('text="Gravar"')).toBeVisible();
  });
});