// main.js - Sweet Calm | Scroll Animation com Stagger Effect
document.addEventListener('DOMContentLoaded', function() {
    // Configurações das seções animadas
    const animatedSections = [
        { 
            selector: '.target .card', 
            delayMultiplier: 0.1,
            yOffset: 30
        },
        { 
            selector: '.benefits .benefit', 
            delayMultiplier: 0.15,
            yOffset: 40
        },
        { 
            selector: '.products .product', 
            delayMultiplier: 0.2,
            yOffset: 35
        },
        { 
            selector: '.social-proof blockquote', 
            delayMultiplier: 0.12,
            yOffset: 25
        }
    ];

    // Prepara todos os elementos para animação
    function setupAnimations() {
        animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            
            elements.forEach((el, index) => {
                // Remove transições anteriores para evitar conflitos
                el.style.transition = '';
                
                // Força um reflow para resetar animações
                void el.offsetWidth;
                
                // Aplica estilos iniciais
                el.style.opacity = '0';
                el.style.transform = `translateY(${section.yOffset}px)`;
                el.style.transition = `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * section.delayMultiplier}s`;
                
                // Remove classe de animação anterior
                el.classList.remove('animated');
            });
        });
    }

    // Inicializa as animações
    setupAnimations();

    // Função para animar elementos visíveis
    function animateVisibleElements() {
        let allAnimated = true;
        
        animatedSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            
            elements.forEach(el => {
                // Se já está animado, pule
                if (el.classList.contains('animated')) return;
                
                allAnimated = false;
                
                // Verifica se o elemento está visível
                const rect = el.getBoundingClientRect();
                const triggerOffset = 100; // pixels da parte inferior da janela
                const isVisible = rect.top < window.innerHeight - triggerOffset;
                
                if (isVisible) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.classList.add('animated');
                }
            });
        });
        
        return allAnimated;
    }

    // Otimização: Throttle para melhor performance no scroll
    let scrollTimeout = null;
    let isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            
            // Executa a verificação de animação
            const allDone = animateVisibleElements();
            
            // Se todos os elementos já foram animados, remove o listener
            if (allDone) {
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleResize);
            }
            
            // Reseta o estado de scrolling
            setTimeout(() => {
                isScrolling = false;
            }, 50);
        }
    }

    // Handle resize para recalcular animações
    let resizeTimeout = null;
    
    function handleResize() {
        // Clear timeout anterior
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        // Aguarda o redimensionamento parar
        resizeTimeout = setTimeout(() => {
            // Re-anima elementos que já estavam visíveis
            animateVisibleElements();
        }, 250);
    }

    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Verifica elementos visíveis na carga inicial
    setTimeout(() => {
        animateVisibleElements();
    }, 300);

    // Verifica novamente após todas as imagens carregarem
    window.addEventListener('load', () => {
        setTimeout(() => {
            animateVisibleElements();
        }, 500);
    });

    // Função pública para reanimar elementos (útil para future updates)
    window.sweetCalmAnimations = {
        refresh: function() {
            setupAnimations();
            setTimeout(() => {
                animateVisibleElements();
            }, 100);
        },
        
        reset: function() {
            animatedSections.forEach(section => {
                const elements = document.querySelectorAll(section.selector);
                elements.forEach(el => {
                    el.classList.remove('animated');
                    el.style.opacity = '0';
                    el.style.transform = `translateY(${section.yOffset}px)`;
                });
            });
            
            // Reativa listeners
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);
            
            // Reanima
            setTimeout(() => {
                animateVisibleElements();
            }, 300);
        },
        
        // Debug: Mostra quantos elementos foram animados
        status: function() {
            let total = 0;
            let animated = 0;
            
            animatedSections.forEach(section => {
                const elements = document.querySelectorAll(section.selector);
                total += elements.length;
                
                elements.forEach(el => {
                    if (el.classList.contains('animated')) {
                        animated++;
                    }
                });
            });
            
            return {
                total: total,
                animated: animated,
                percentage: Math.round((animated / total) * 100)
            };
        }
    };
});

// Polyfill suave para requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { 
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
}());