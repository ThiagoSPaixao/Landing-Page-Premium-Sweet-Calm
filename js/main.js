// main.js - Sweet Calm | Versão Final

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
        this.videoContainer.classList.add('loading');
        this.setupVideoEvents();
        this.attemptAutoplay();
        this.setupVisibilityHandler();
    }
    
    setupVideoEvents() {
        this.video.addEventListener('playing', () => {
            this.videoContainer.classList.remove('loading');
            this.hasPlayed = true;
        });
        
        this.video.addEventListener('loadeddata', () => {
            console.log('🎥 Vídeo carregado');
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('❌ Erro ao carregar vídeo:', e);
            this.videoContainer.classList.remove('loading');
            this.showFallbackImage();
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
                    this.videoContainer.classList.remove('loading');
                    this.createPlayButton();
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
                            this.hasPlayed = true;
                            if (this.playButton) {
                                this.playButton.style.display = 'none';
                            }
                        })
                        .catch(e => console.log('⚠️ Ainda não pode autoplay'));
                }
            }
        };
        
        document.addEventListener('click', retryPlay, { once: true });
        document.addEventListener('scroll', retryPlay, { once: true });
        document.addEventListener('touchstart', retryPlay, { once: true });
    }
    
    setupVisibilityHandler() {
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
        this.setupAnimations();
        this.setupIntersectionObserver();
        
        if (!('IntersectionObserver' in window)) {
            this.setupScrollFallback();
        }
        
        setTimeout(() => this.animateVisibleElements(), 300);
    }
    
    setupAnimations() {
        this.animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            
            elements.forEach((el, index) => {
                el.style.transition = '';
                void el.offsetWidth;
                el.style.opacity = '0';
                el.style.transform = `translateY(${section.yOffset}px)`;
                el.style.transition = `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * section.delayMultiplier}s`;
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
                    
                    this.animatedSections.forEach(section => {
                        if (element.matches(section.selector)) {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                            element.classList.add(section.animatedClass, 'animated');
                            this.observer.unobserve(element);
                        }
                    });
                }
            });
            
            this.checkAllAnimated();
        }, options);
        
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
        }
    }
    
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
// 3. GERENCIAMENTO DE PRODUTOS
// ============================================

class ProductManager {
    constructor() {
        this.products = {
            bamboo: {
                title: 'Bamboo Calm',
                description: 'Frescor e equilíbrio para momentos de serenidade. Esta vela combina notas verdes de bambu com toques sutis de capim-limão, criando uma atmosfera revigorante e harmoniosa que conecta você com a natureza.',
                image: 'img/bamboo-calm.jpg',
                price: 'R$ 49,90',
                oldPrice: 'R$ 59,90',
                features: ['🌿 Notas verdes naturais', '✨ Aroma suave e refrescante', '🕯️ Cera vegetal sustentável', '💚 Ideal para meditação'],
                whatsappMessage: 'Olá! Tenho interesse na vela Bamboo Calm - R$ 49,90'
            },
            lavanda: {
                title: 'Lavanda Serenity',
                description: 'Relaxamento profundo para noites tranquilas. O clássico aroma de lavanda combinado com nuances florais suaves, perfeito para momentos de descanso, meditação e renovação das energias.',
                image: 'img/lavanda-serenity.jpg',
                price: 'R$ 49,90',
                oldPrice: 'R$ 59,90',
                features: ['💜 Acalma a mente e corpo', '✨ Aroma floral suave', '🌙 Ideal para dormir', '🌸 Promove relaxamento'],
                whatsappMessage: 'Olá! Tenho interesse na vela Lavanda Serenity - R$ 49,90'
            },
            cereja: {
                title: 'Cereja & Avelã',
                description: 'Doce e aconchegante para momentos especiais. A combinação perfeita entre a doçura da cereja e o toque cremoso da avelã, criando um ambiente acolhedor e memorável.',
                image: 'img/cereja-avela.jpg',
                price: 'R$ 49,90',
                oldPrice: 'R$ 59,90',
                features: ['🍒 Doce e suave', '✨ Aroma aconchegante', '🏠 Conforto do lar', '❤️ Ideal para presentear'],
                whatsappMessage: 'Olá! Tenho interesse na vela Cereja & Avelã - R$ 49,90'
            }
        };
        
        this.modal = null;
        this.init();
    }
    
    init() {
        this.setupModal();
        this.setupEventListeners();
        this.setupImageLoading();
        this.createWhatsAppFloat();
    }
    
    setupModal() {
        if (!document.getElementById('productModal')) {
            const modalHTML = `
                <div class="product-modal" id="productModal">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <div class="modal-body">
                            <div class="modal-image">
                                <img id="modalProductImage" src="" alt="">
                            </div>
                            <div class="modal-info">
                                <h3 id="modalProductTitle"></h3>
                                <p id="modalProductDescription"></p>
                                <div class="modal-price">
                                    <span id="modalProductPrice"></span>
                                    <span id="modalProductOldPrice"></span>
                                </div>
                                <div class="modal-features" id="modalProductFeatures"></div>
                                <div class="modal-buttons">
                                    <a href="#" target="_blank" class="btn primary modal-whatsapp" id="modalWhatsAppLink">
                                        💬 Falar no WhatsApp
                                    </a>
                                    <button class="btn outline modal-close-btn">Voltar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        this.modal = document.getElementById('productModal');
        this.setupModalEvents();
    }
    
    setupModalEvents() {
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modal.querySelector('.modal-close-btn').addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    setupEventListeners() {
        document.querySelectorAll('.product-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.product;
                this.openProductModal(productId);
            });
        });
    }
    
    setupImageLoading() {
        const images = document.querySelectorAll('.product-image img');
        
        images.forEach(img => {
            const container = img.parentElement;
            container.classList.add('shimmer');
            
            img.addEventListener('load', () => {
                container.classList.remove('shimmer');
            });
            
            img.addEventListener('error', () => {
                container.classList.remove('shimmer');
                img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f7f5f2"/><text x="200" y="200" font-family="Arial" font-size="24" fill="%23666" text-anchor="middle" dominant-baseline="middle">🕯️ Vela Aromática</text></svg>';
            });
        });
    }
    
    createWhatsAppFloat() {
        const whatsappFloat = document.createElement('a');
        whatsappFloat.href = 'https://wa.me/5581994396360?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20as%20velas%20Sweet%20Calm%20por%20R$%2049,90';
        whatsappFloat.target = '_blank';
        whatsappFloat.className = 'whatsapp-float';
        whatsappFloat.innerHTML = '💬';
        whatsappFloat.setAttribute('aria-label', 'Falar no WhatsApp');
        
        document.body.appendChild(whatsappFloat);
        
        whatsappFloat.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'whatsapp-tooltip';
            tooltip.textContent = 'Falar no WhatsApp';
            tooltip.style.cssText = `
                position: absolute;
                right: 70px;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.9rem;
                white-space: nowrap;
            `;
            whatsappFloat.appendChild(tooltip);
            
            const arrow = document.createElement('div');
            arrow.style.cssText = `
                position: absolute;
                right: -6px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-left: 6px solid #333;
            `;
            tooltip.appendChild(arrow);
        });
        
        whatsappFloat.addEventListener('mouseleave', () => {
            const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    }
    
    openProductModal(productId) {
        const product = this.products[productId];
        if (!product) return;
        
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').alt = product.title;
        document.getElementById('modalProductTitle').textContent = product.title;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductPrice').textContent = product.price;
        document.getElementById('modalProductOldPrice').textContent = product.oldPrice;
        
        const featuresContainer = document.getElementById('modalProductFeatures');
        featuresContainer.innerHTML = '';
        product.features.forEach(feature => {
            const span = document.createElement('span');
            span.className = 'feature';
            span.textContent = feature;
            featuresContainer.appendChild(span);
        });
        
        const whatsappLink = document.getElementById('modalWhatsAppLink');
        const phone = '5581994396360';
        const message = encodeURIComponent(product.whatsappMessage);
        whatsappLink.href = `https://wa.me/${phone}?text=${message}`;
        
        this.currentProduct = product;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.modal.querySelector('.modal-close').focus();
        }, 100);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// 4. INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

class SweetCalmApp {
    constructor() {
        this.videoController = null;
        this.scrollAnimator = null;
        this.productManager = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🕯️ Sweet Calm - Inicializando...');
        
        this.videoController = new VideoController();
        this.scrollAnimator = new ScrollAnimator();
        this.productManager = new ProductManager();
        
        this.setupPublicAPI();
        document.body.classList.add('loaded');
        
        console.log('✅ Sweet Calm - Inicialização completa!');
    }
    
    setupPublicAPI() {
        window.sweetCalm = {
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
            
            video: {
                play: () => this.videoController.playVideo(),
                pause: () => this.videoController.video.pause()
            },
            
            products: {
                open: (productId) => this.productManager.openProductModal(productId),
                close: () => this.productManager.closeModal()
            },
            
            whatsapp: {
                open: (message = '') => {
                    const phone = '5581994396360';
                    const encodedMessage = encodeURIComponent(message || 'Olá! Gostaria de saber mais sobre as velas Sweet Calm por R$ 49,90');
                    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
                }
            },
            
            scrollTo: (selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };
    }
}

// ============================================
// 5. POLYFILLS E COMPATIBILIDADE
// ============================================

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

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// ============================================
// 6. INICIALIZAÇÃO FINAL
// ============================================

if (!window.sweetCalmApp) {
    window.sweetCalmApp = new SweetCalmApp();
}

document.body.classList.add('js-enabled');

const noJS = document.querySelector('.no-js');
if (noJS) {
    noJS.classList.remove('no-js');
}

console.log(`
╔══════════════════════════════════════╗
║           🕯️ Sweet Calm 🕯️          ║
║       Velas Aromáticas Artesanais    ║
╚══════════════════════════════════════╝
`);