// main.js - Sweet Calm | Animações e Controle de Vídeo

// ============================================
// 1. CONTROLE DO VÍDEO DO HERO
// ============================================

class VideoController {
    constructor() {
        this.video = document.querySelector('.hero-video video');
        this.videoContainer = document.querySelector('.hero-video');
        this.playButton = null;
        this.hasPlayed = false;
        
        if (this.video) {
            this.init();
        }
    }
    
    init() {
        // Adiciona classe de loading
        this.videoContainer.classList.add('loading');
        
        // Event listeners do vídeo
        this.setupVideoEvents();
        
        // Tenta autoplay
        this.attemptAutoplay();
        
        // Verifica visibilidade da página
        this.setupVisibilityHandler();
    }
    
    setupVideoEvents() {
        // Quando o vídeo começar a tocar
        this.video.addEventListener('playing', () => {
            this.videoContainer.classList.remove('loading');
            this.hasPlayed = true;
            console.log('🎥 Vídeo iniciado com sucesso');
        });
        
        // Quando o vídeo terminar de carregar dados
        this.video.addEventListener('loadeddata', () => {
            console.log('🎥 Vídeo carregado');
        });
        
        // Fallback se o vídeo não carregar
        this.video.addEventListener('error', (e) => {
            console.error('❌ Erro ao carregar vídeo:', e);
            this.videoContainer.classList.remove('loading');
            this.showFallbackImage();
        });
        
        // Quando o vídeo é pausado (usuário scrollou)
        this.video.addEventListener('pause', () => {
            console.log('⏸️ Vídeo pausado');
        });
    }
    
    attemptAutoplay() {
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('▶️ Autoplay bem-sucedido');
                })
                .catch(error => {
                    console.log('⚠️ Autoplay bloqueado, criando botão de play');
                    this.videoContainer.classList.remove('loading');
                    this.createPlayButton();
                    
                    // Tenta novamente quando o usuário interagir com a página
                    this.setupUserInteractionRetry();
                });
        }
    }
    
    createPlayButton() {
        if (this.playButton) return;
        
        this.playButton = document.createElement('button');
        this.playButton.className = 'video-play-btn';
        this.playButton.innerHTML = '<span class="play-icon">▶</span> Acender a chama';
        this.playButton.setAttribute('aria-label', 'Reproduzir vídeo da vela');
        
        // Estilos via JavaScript (backup)
        this.playButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(200, 162, 77, 0.85);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 220px;
            justify-content: center;
        `;
        
        // Ícone do botão
        const iconStyle = document.createElement('style');
        iconStyle.textContent = `
            .play-icon {
                font-size: 1.2rem;
                transition: transform 0.3s ease;
            }
            
            .video-play-btn:hover .play-icon {
                transform: scale(1.2);
            }
        `;
        document.head.appendChild(iconStyle);
        
        this.playButton.addEventListener('click', () => this.playVideo());
        this.playButton.addEventListener('mouseenter', () => {
            this.playButton.style.transform = 'translate(-50%, -50%) scale(1.08)';
            this.playButton.style.background = 'rgba(184, 146, 64, 0.95)';
        });
        
        this.playButton.addEventListener('mouseleave', () => {
            this.playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            this.playButton.style.background = 'rgba(200, 162, 77, 0.85)';
        });
        
        this.videoContainer.appendChild(this.playButton);
        
        // Adiciona teclado accessibility
        this.playButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.playVideo();
            }
        });
    }
    
    playVideo() {
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('▶️ Vídeo iniciado pelo usuário');
                    if (this.playButton) {
                        this.playButton.style.opacity = '0';
                        this.playButton.style.visibility = 'hidden';
                        setTimeout(() => {
                            if (this.playButton && this.playButton.parentNode) {
                                this.playButton.parentNode.removeChild(this.playButton);
                                this.playButton = null;
                            }
                        }, 300);
                    }
                })
                .catch(error => {
                    console.error('❌ Erro ao tentar reproduzir:', error);
                });
        }
    }
    
    setupUserInteractionRetry() {
        const retryPlay = () => {
            if (!this.hasPlayed) {
                const playPromise = this.video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('▶️ Vídeo iniciado após interação do usuário');
                            this.hasPlayed = true;
                            if (this.playButton) {
                                this.playButton.style.display = 'none';
                            }
                        })
                        .catch(e => console.log('⚠️ Ainda não pode autoplay'));
                }
            }
        };
        
        // Tenta novamente em várias interações do usuário
        document.addEventListener('click', retryPlay, { once: true });
        document.addEventListener('scroll', retryPlay, { once: true });
        document.addEventListener('touchstart', retryPlay, { once: true });
    }
    
    setupVisibilityHandler() {
        // Pausa vídeo quando a página não está visível (otimização)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (!this.video.paused) {
                    this.video.pause();
                }
            } else if (this.hasPlayed) {
                this.video.play().catch(e => console.log('Não foi possível retomar vídeo'));
            }
        });
    }
    
    showFallbackImage() {
        // Cria um fallback com imagem
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), 
                        url('img/hero-desktop.jpg') center/cover;
            z-index: -1;
        `;
        this.videoContainer.appendChild(fallback);
    }
}

// ============================================
// 2. ANIMAÇÕES COM STAGGER EFFECT
// ============================================

class ScrollAnimator {
    constructor() {
        this.animatedSections = [
            { 
                selector: '.target .card', 
                delayMultiplier: 0.1,
                yOffset: 30,
                animatedClass: 'target-animated'
            },
            { 
                selector: '.benefits .benefit', 
                delayMultiplier: 0.15,
                yOffset: 40,
                animatedClass: 'benefit-animated'
            },
            { 
                selector: '.products .product', 
                delayMultiplier: 0.2,
                yOffset: 35,
                animatedClass: 'product-animated'
            },
            { 
                selector: '.social-proof blockquote', 
                delayMultiplier: 0.12,
                yOffset: 25,
                animatedClass: 'quote-animated'
            }
        ];
        
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.allAnimated = false;
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // Configura animações iniciais
        this.setupAnimations();
        
        // Usa Intersection Observer para melhor performance
        this.setupIntersectionObserver();
        
        // Fallback para browsers antigos
        if (!('IntersectionObserver' in window)) {
            this.setupScrollFallback();
        }
        
        // Anima elementos visíveis na carga
        setTimeout(() => this.animateVisibleElements(), 300);
    }
    
    setupAnimations() {
        this.animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            
            elements.forEach((el, index) => {
                // Reset de transições
                el.style.transition = '';
                
                // Força reflow
                void el.offsetWidth;
                
                // Estado inicial
                el.style.opacity = '0';
                el.style.transform = `translateY(${section.yOffset}px)`;
                el.style.transition = `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * section.delayMultiplier}s`;
                
                // Remove classes anteriores
                el.classList.remove(section.animatedClass, 'animated');
            });
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Encontra qual seção pertence
                    this.animatedSections.forEach(section => {
                        if (element.matches(section.selector)) {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                            element.classList.add(section.animatedClass, 'animated');
                            
                            // Remove do observer após animar
                            this.observer.unobserve(element);
                        }
                    });
                }
            });
            
            // Verifica se todos foram animados
            this.checkAllAnimated();
        }, options);
        
        // Observa todos os elementos
        this.animatedSections.forEach(section => {
            document.querySelectorAll(section.selector).forEach(el => {
                this.observer.observe(el);
            });
        });
    }
    
    setupScrollFallback() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleScroll() {
        if (!this.isScrolling) {
            this.isScrolling = true;
            
            requestAnimationFrame(() => {
                this.animateVisibleElements();
                this.isScrolling = false;
            });
        }
    }
    
    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            this.animateVisibleElements();
        }, 250);
    }
    
    animateVisibleElements() {
        if (this.allAnimated) return;
        
        const windowHeight = window.innerHeight;
        const triggerOffset = 100;
        let allDone = true;
        
        this.animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            
            elements.forEach(el => {
                if (el.classList.contains('animated')) return;
                
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < windowHeight - triggerOffset;
                
                if (isVisible) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.classList.add(section.animatedClass, 'animated');
                } else {
                    allDone = false;
                }
            });
        });
        
        if (allDone) {
            this.allAnimated = true;
            console.log('🎉 Todas as animações foram concluídas!');
        }
    }
    
    checkAllAnimated() {
        let totalElements = 0;
        let animatedElements = 0;
        
        this.animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            totalElements += elements.length;
            
            elements.forEach(el => {
                if (el.classList.contains('animated')) {
                    animatedElements++;
                }
            });
        });
        
        if (animatedElements >= totalElements) {
            this.allAnimated = true;
            console.log('🎉 Todas as animações foram concluídas!');
        }
    }
    
    // Métodos públicos
    refresh() {
        this.allAnimated = false;
        this.setupAnimations();
        
        if (this.observer) {
            this.observer.disconnect();
            this.setupIntersectionObserver();
        }
        
        setTimeout(() => this.animateVisibleElements(), 100);
    }
    
    reset() {
        this.allAnimated = false;
        this.animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            elements.forEach(el => {
                el.classList.remove(section.animatedClass, 'animated');
                el.style.opacity = '0';
                el.style.transform = `translateY(${section.yOffset}px)`;
            });
        });
        
        if (this.observer) {
            this.observer.disconnect();
            this.setupIntersectionObserver();
        }
        
        setTimeout(() => this.animateVisibleElements(), 300);
    }
}

// ============================================
// 3. OUTRAS INTERAÇÕES E ANIMAÇÕES
// ============================================

class UIInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        // Smooth scroll para links âncora
        this.setupSmoothScroll();
        
        // Efeito de digitação no hero (opcional)
        this.setupTypewriterEffect();
        
        // Contador de produtos (exemplo)
        this.setupProductCounter();
        
        // Hover effects avançados
        this.setupAdvancedHover();
        
        // Parallax sutil no hero
        this.setupParallax();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.hero').offsetHeight * 0.1;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Foco no elemento para acessibilidade
                    setTimeout(() => {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                        targetElement.removeAttribute('tabindex');
                    }, 1000);
                }
            });
        });
    }
    
    setupTypewriterEffect() {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;
        
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        // Só ativa em desktop para performance
        if (window.innerWidth > 768) {
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            // Espera o vídeo carregar
            setTimeout(typeWriter, 1000);
        } else {
            heroTitle.textContent = text;
        }
    }
    
    setupProductCounter() {
        const ctaSection = document.querySelector('.cta');
        if (!ctaSection) return;
        
        // Exemplo: "Apenas 12 unidades restantes"
        const counterText = document.createElement('div');
        counterText.className = 'product-counter';
        counterText.innerHTML = '✨ <span class="counter-number">12</span> unidades restantes neste lote';
        counterText.style.cssText = `
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.9;
            animation: pulse 2s infinite;
        `;
        
        ctaSection.querySelector('.container').appendChild(counterText);
        
        // Contador decrescente (exemplo)
        setTimeout(() => {
            const counterNumber = counterText.querySelector('.counter-number');
            if (counterNumber) {
                let count = 12;
                const interval = setInterval(() => {
                    if (count > 8) {
                        count--;
                        counterNumber.textContent = count;
                        counterNumber.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            counterNumber.style.transform = 'scale(1)';
                        }, 300);
                    } else {
                        clearInterval(interval);
                    }
                }, 30000); // A cada 30 segundos
            }
        }, 5000);
    }
    
    setupAdvancedHover() {
        // Efeito de brilho nos cards
        document.querySelectorAll('.card, .benefit, .product').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            
            // Adiciona estilo CSS dinâmico
            const style = document.createElement('style');
            style.textContent = `
                .card:hover::before, .benefit:hover::before, .product:hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(
                        600px circle at var(--mouse-x) var(--mouse-y),
                        rgba(200, 162, 77, 0.1),
                        transparent 40%
                    );
                    border-radius: inherit;
                    z-index: 0;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        });
    }
    
    setupParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero && rate < 0) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// ============================================
// 4. PERFORMANCE E OTIMIZAÇÕES
// ============================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Prefetch de recursos
        this.setupResourcePrefetch();
        
        // Lazy loading para imagens futuras
        this.setupLazyLoading();
        
        // Otimizações de scroll
        this.optimizeScroll();
        
        // Monitora performance
        this.setupPerformanceMonitoring();
    }
    
    setupResourcePrefetch() {
        // Prefetch das próximas imagens que podem ser usadas
        const links = [
            'img/hero-desktop.jpg',
            'img/hero-mobile.jpg'
        ];
        
        links.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    setupLazyLoading() {
        // Para futuras imagens que possam ser adicionadas
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    }
    
    optimizeScroll() {
        // Usa requestAnimationFrame para animações suaves
        let ticking = false;
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Atualizações que dependem do scroll
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    setupPerformanceMonitoring() {
        // Log de performance básico
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performance) {
                    const perfData = window.performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`🚀 Página carregada em ${loadTime}ms`);
                    
                    // Envia métricas se estiver muito lento
                    if (loadTime > 3000) {
                        console.warn('⚠️ Tempo de carregamento acima de 3 segundos');
                    }
                }
            }, 0);
        });
    }
}

// ============================================
// 5. INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

class SweetCalmApp {
    constructor() {
        this.videoController = null;
        this.scrollAnimator = null;
        this.uiInteractions = null;
        this.performanceOptimizer = null;
        
        this.init();
    }
    
    init() {
        // Espera o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🕯️ Sweet Calm - Inicializando...');
        
        // Inicializa módulos
        this.videoController = new VideoController();
        this.scrollAnimator = new ScrollAnimator();
        this.uiInteractions = new UIInteractions();
        this.performanceOptimizer = new PerformanceOptimizer();
        
        // Configura API pública
        this.setupPublicAPI();
        
        // Adiciona classe de carregamento completo
        document.body.classList.add('loaded');
        
        console.log('✅ Sweet Calm - Inicialização completa!');
    }
    
    setupPublicAPI() {
        window.sweetCalm = {
            // Controle de animações
            animations: {
                refresh: () => this.scrollAnimator.refresh(),
                reset: () => this.scrollAnimator.reset(),
                status: () => {
                    let total = 0;
                    let animated = 0;
                    
                    this.scrollAnimator.animatedSections.forEach(section => {
                        const elements = document.querySelectorAll(section.selector);
                        total += elements.length;
                        
                        elements.forEach(el => {
                            if (el.classList.contains('animated')) {
                                animated++;
                            }
                        });
                    });
                    
                    return {
                        total,
                        animated,
                        percentage: Math.round((animated / total) * 100)
                    };
                }
            },
            
            // Controle de vídeo
            video: {
                play: () => this.videoController.playVideo(),
                pause: () => this.videoController.video.pause(),
                restart: () => {
                    this.videoController.video.currentTime = 0;
                    this.videoController.video.play();
                }
            },
            
            // Utilitários
            scrollTo: (selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            },
            
            // Debug
            debug: () => {
                console.log('🔍 Sweet Calm Debug Info:');
                console.log('- Video playing:', !this.videoController.video.paused);
                console.log('- Animations:', window.sweetCalm.animations.status());
                console.log('- Viewport:', `${window.innerWidth}x${window.innerHeight}`);
            }
        };
    }
}

// ============================================
// 6. POLYFILLS E COMPATIBILIDADE
// ============================================

// Polyfill para requestAnimationFrame
(function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
            window[vendors[x] + 'CancelAnimationFrame'] || 
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(() => { 
                callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();

// Polyfill para forEach em NodeList (IE)
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// ============================================
// 7. INICIALIZAÇÃO FINAL
// ============================================

// Previne múltiplas inicializações
if (!window.sweetCalmApp) {
    window.sweetCalmApp = new SweetCalmApp();
}

// Exporta para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VideoController,
        ScrollAnimator,
        UIInteractions,
        PerformanceOptimizer,
        SweetCalmApp
    };
}

// Adiciona classe ao body quando o JS estiver carregado
document.body.classList.add('js-enabled');

// Remove estilo de no-js se existir
const noJS = document.querySelector('.no-js');
if (noJS) {
    noJS.classList.remove('no-js');
}

// Log de boas-vindas
console.log(`
╔══════════════════════════════════════╗
║        🕯️ Sweet Calm 🕯️         ║
║   Velas Aromáticas Artesanais    ║
╚══════════════════════════════════════╝
`);