// Custom JavaScript para documentação AI Linguo

document.addEventListener('DOMContentLoaded', function() {
    
    // Adiciona badges dinâmicos para diferentes tipos de código
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(function(block) {
        const parent = block.parentElement;
        const className = block.className;
        
        // Detecta linguagem e adiciona badge
        if (className.includes('language-javascript')) {
            addLanguageBadge(parent, 'JavaScript', '#f7df1e', '#000');
        } else if (className.includes('language-python')) {
            addLanguageBadge(parent, 'Python', '#3776ab', '#fff');
        } else if (className.includes('language-bash')) {
            addLanguageBadge(parent, 'Bash', '#4eaa25', '#fff');
        } else if (className.includes('language-json')) {
            addLanguageBadge(parent, 'JSON', '#000', '#fff');
        } else if (className.includes('language-yaml')) {
            addLanguageBadge(parent, 'YAML', '#cb171e', '#fff');
        } else if (className.includes('language-dockerfile')) {
            addLanguageBadge(parent, 'Docker', '#2496ed', '#fff');
        }
    });
    
    // Adiciona botão de cópia para blocos de código
    addCopyButtons();
    
    // Adiciona smooth scroll para links internos
    addSmoothScroll();
    
    // Adiciona contadores de leitura
    addReadingTime();
    
    // Adiciona easter eggs
    addEasterEggs();
    
    // Melhora a navegação mobile
    improveMobileNavigation();
});

// Função para adicionar badges de linguagem
function addLanguageBadge(parent, language, bgColor, textColor) {
    const badge = document.createElement('div');
    badge.className = 'language-badge';
    badge.textContent = language;
    badge.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: ${bgColor};
        color: ${textColor};
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        z-index: 1;
    `;
    
    parent.style.position = 'relative';
    parent.appendChild(badge);
}

// Função para adicionar botões de cópia
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(function(block) {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋';
        button.title = 'Copiar código';
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 40px;
            background: rgba(255,255,255,0.8);
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            z-index: 2;
        `;
        
        button.addEventListener('click', function() {
            const code = block.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(function() {
                    button.innerHTML = '✅';
                    button.title = 'Copiado!';
                    setTimeout(function() {
                        button.innerHTML = '📋';
                        button.title = 'Copiar código';
                    }, 2000);
                });
            }
        });
        
        block.style.position = 'relative';
        block.appendChild(button);
    });
}

// Função para adicionar smooth scroll
function addSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para calcular tempo de leitura
function addReadingTime() {
    const articles = document.querySelectorAll('article.md-content__inner');
    
    articles.forEach(function(article) {
        const text = article.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 200 palavras por minuto
        
        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `📖 Tempo de leitura: ${readingTime} min`;
        readingTimeElement.style.cssText = `
            color: #666;
            font-size: 14px;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background: #f5f5f5;
            border-radius: 4px;
            border-left: 3px solid #1976d2;
        `;
        
        const firstH1 = article.querySelector('h1');
        if (firstH1) {
            firstH1.parentNode.insertBefore(readingTimeElement, firstH1.nextSibling);
        }
    });
}

// Easter eggs para tornar a documentação mais divertida
function addEasterEggs() {
    // Konami Code easter egg
    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let userInput = [];
    
    document.addEventListener('keydown', function(e) {
        userInput.push(e.keyCode);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (userInput.length === konamiCode.length) {
            let match = true;
            for (let i = 0; i < konamiCode.length; i++) {
                if (userInput[i] !== konamiCode[i]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                showEasterEgg();
            }
        }
    });
    
    // Double click no logo
    const logo = document.querySelector('.md-header__title');
    if (logo) {
        let clickCount = 0;
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                showSecretMessage();
                clickCount = 0;
            }
            setTimeout(() => clickCount = 0, 2000);
        });
    }
}

// Função para mostrar easter egg
function showEasterEgg() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1976d2, #7b1fa2);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: bounceIn 0.6s ease;
        ">
            <h3>🎉 Easter Egg Encontrado!</h3>
            <p>Parabéns por explorar a documentação!</p>
            <p><strong>Projeto desenvolvido pelo estudante Arthur Carvalho Leite</strong></p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: white;
                color: #1976d2;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                margin-top: 1rem;
            ">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Função para mensagem secreta
function showSecretMessage() {
    const messages = [
        "🤖 O AI Linguo é mais do que um app, é uma paixão!",
        "🎓 Cada linha de código foi escrita com dedicação",
        "🚀 Arthur Carvalho Leite - Transformando educação com tecnologia",
        "💡 A IA é o presente, a educação é o futuro!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const notification = document.createElement('div');
    notification.textContent = randomMessage;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Melhoria na navegação mobile
function improveMobileNavigation() {
    // Adiciona swipe gestures para mobile
    let startX, startY;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Swipe horizontal mais forte que vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - página anterior
                const prevLink = document.querySelector('.md-footer__link--prev');
                if (prevLink) prevLink.click();
            } else {
                // Swipe left - próxima página
                const nextLink = document.querySelector('.md-footer__link--next');
                if (nextLink) nextLink.click();
            }
        }
        
        startX = startY = null;
    });
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.05); }
        70% { transform: translate(-50%, -50%) scale(0.9); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .copy-button:hover {
        background: rgba(255,255,255,1) !important;
        transform: scale(1.1);
    }
    
    .language-badge {
        animation: fadeIn 0.3s ease;
    }
    
    .reading-time {
        animation: slideInLeft 0.5s ease;
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;

document.head.appendChild(style);

// Console message para desenvolvedores curiosos
console.log(`
🤖 AI Linguo - Documentação
============================
Desenvolvido por: Arthur Carvalho Leite
Tecnologias: Next.js, MongoDB, OpenAI
Documentação: MkDocs Material

Easter eggs disponíveis:
- Konami Code (↑↑↓↓←→←→BA)
- 5 cliques no título
- Swipe navigation (mobile)

Obrigado por explorar! 🚀
`);